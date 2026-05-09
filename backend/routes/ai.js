/**
 * routes/ai.js — AI-powered CV tailoring and section improvement
 * Fixes applied:
 *   #6 — HTTP-Referer and X-Title from env vars, not hardcoded
 *   #8 — cvData payload size checked before forwarding to OpenRouter
 */
import { Router } from 'express';
import fetch from 'node-fetch';
import AIMemory from '../models/AIMemory.js';

const router = Router();

const CV_DATA_MAX_BYTES = 50_000; // 50 KB
const RESUME_CONTEXT_MAX_BYTES = 80_000;
const SITE_CONTEXT_MAX_BYTES = 35_000;

const SITE_KNOWLEDGE = `
ResumeMaker is a resume builder and parser web app.
Core pages:
- /: landing page with live resume demo, feature sections, FAQs, testimonials, and links to builder/parser.
- /resume-import: lets users create from scratch, continue from saved local data, or import an existing resume PDF.
- /resume-builder: split-screen resume editor and live preview. Users edit profile, work experience, education, projects, skills, custom sections, template settings, colors, typography, layout, content, print, and custom HTML/CSS.
- /resume-parser: reads a PDF resume with pdf.js, groups text into lines/sections, extracts profile/education/work/projects/skills, and shows parser internals.
Frontend stack: Next.js app router, React, Redux Toolkit, Tailwind CSS, @react-pdf/renderer for legacy PDF preview/export, React Frame for iframe preview isolation.
Backend stack: Express, MongoDB/Mongoose, template APIs, resume APIs, OpenRouter AI routes, strict AI rate limiting.
Important UX: user resume data is edited in structured fields, preview updates live, and downloads are generated from the current resume document.
Answer only questions about ResumeMaker, its pages, UI, resume-building flow, parser, templates, preview/export, local setup, and troubleshooting this app.
`;

const SECTION_FIELD_HINTS = {
  summary: 'Return a single polished professional summary paragraph.',
  objective: 'Return a single polished professional objective paragraph.',
  workExperience: 'Return 3-6 concise achievement bullets for the selected work experience.',
  education: 'Return 1-4 concise education bullets, coursework, honors, or academic achievements.',
  project: 'Return 3-5 concise project bullets focusing on impact, stack, and measurable outcomes.',
  skills: 'Return a concise list of relevant ATS-friendly skills.',
  custom: 'Return concise resume-ready content for the custom section.',
};

// Shared OpenRouter request headers
function buildHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
    'X-Title': process.env.APP_NAME || 'ResumeMaker',
  };
}

function getClientId(req, explicitUserId) {
  return String(explicitUserId || req.user?.id || req.headers['x-client-id'] || req.ip || 'anonymous');
}

function getSiteApiKey() {
  return process.env.OPENROUTER_SITE_API_KEY || process.env.OPENAI_API_KEY;
}

function getResumeApiKey() {
  return process.env.OPENROUTER_RESUME_API_KEY || process.env.OPENAI_API_KEY_RECOMMEND || process.env.OPENAI_API_KEY;
}

function getSiteModel() {
  return process.env.OPENROUTER_SITE_MODEL || process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash-lite';
}

function getResumeModel() {
  return process.env.OPENROUTER_RESUME_MODEL || process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
}

function clampJson(value, maxBytes) {
  const serialized = JSON.stringify(value || {});
  if (serialized.length <= maxBytes) return value || {};
  return {
    truncated: true,
    note: `Original payload was ${serialized.length} bytes and was too large. Ask the user for a narrower section if needed.`,
  };
}

async function callOpenRouter({ apiKey, model, messages, temperature = 0.4, maxTokens = 1200 }) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: buildHeaders(apiKey),
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    const error = data.error?.message || `OpenRouter API error (${response.status})`;
    const err = new Error(error);
    err.status = 502;
    throw err;
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    const err = new Error('Empty response from AI');
    err.status = 502;
    throw err;
  }

  return content;
}

function parseJsonFromModel(content) {
  let jsonStr = content.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) jsonStr = fenceMatch[1];
  return JSON.parse(jsonStr.trim());
}

async function getMemory(userId) {
  try {
    return await AIMemory.findOne({ userId }).lean();
  } catch {
    return null;
  }
}

async function updateMemory(userId, updates) {
  try {
    await AIMemory.updateOne(
      { userId },
      { $set: updates },
      { upsert: true }
    );
  } catch {
    // Memory is helpful but should never block AI generation.
  }
}

// POST /api/ai/site-chat
// Body: { message, pageContext?, conversation?, userId? }
router.post('/site-chat', async (req, res, next) => {
  try {
    const { message, pageContext, conversation = [], userId } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'message is required' });
    }

    const apiKey = getSiteApiKey();
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Site AI OpenRouter key is not configured' });
    }

    const safePageContext = clampJson(pageContext, SITE_CONTEXT_MAX_BYTES);
    const safeConversation = Array.isArray(conversation)
      ? conversation.slice(-8).filter((msg) => msg && ['user', 'assistant'].includes(msg.role) && typeof msg.content === 'string')
      : [];

    const answer = await callOpenRouter({
      apiKey,
      model: getSiteModel(),
      temperature: 0.2,
      maxTokens: 900,
      messages: [
        {
          role: 'system',
          content: `You are ResumeMaker's website support assistant.
Use only the provided ResumeMaker knowledge and page context.
If the user asks something unrelated to ResumeMaker, politely say you can only help with ResumeMaker, resume building, parser, preview/export, templates, and app troubleshooting.
Do not claim to know private source code details that are not in context.
Be concise, practical, and step-by-step when troubleshooting.

ResumeMaker knowledge:
${SITE_KNOWLEDGE}`,
        },
        ...safeConversation,
        {
          role: 'user',
          content: `Current page/app context:\n${JSON.stringify(safePageContext, null, 2)}\n\nUser question:\n${message}`,
        },
      ],
    });

    if (userId) {
      await updateMemory(getClientId(req, userId), { 'facts.lastSiteQuestion': message.slice(0, 500) });
    }

    res.json({ success: true, data: answer });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/resume-section
// Body: { section, query, currentContent, resume, targetRole?, userId? }
router.post('/resume-section', async (req, res, next) => {
  try {
    const { section, query, currentContent = '', resume, targetRole = '', userId } = req.body;
    if (!section || !query || !resume) {
      return res.status(400).json({ success: false, error: 'section, query, and resume are required' });
    }

    const apiKey = getResumeApiKey();
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Resume AI OpenRouter key is not configured' });
    }

    const clientId = getClientId(req, userId);
    const memory = await getMemory(clientId);
    const safeResume = clampJson(resume, RESUME_CONTEXT_MAX_BYTES);
    const fieldHint = SECTION_FIELD_HINTS[section] || 'Return resume-ready content for the selected section.';

    const resultText = await callOpenRouter({
      apiKey,
      model: getResumeModel(),
      temperature: 0.55,
      maxTokens: 1400,
      messages: [
        {
          role: 'system',
          content: `You are ResumeMaker's resume section writer.
You help users write or improve exactly one selected resume section.
You must use the full resume context, the selected section, and the user's instruction.
Do not invent employers, degrees, dates, credentials, metrics, or tools that are not supported by the user's resume or instruction.
If the target role or user intent is too unclear, return a clarification response instead of guessing.
Keep text ATS-friendly, specific, concise, and editable.

Return ONLY valid JSON with this shape:
{
  "status": "ready" | "clarify",
  "message": "short explanation or clarification question",
  "content": "string or array of strings",
  "contentType": "text" | "bullets",
  "memory": { "lastTargetRole": "optional role", "preferences": {} }
}

Selected section rule: ${fieldHint}`,
        },
        {
          role: 'user',
          content: `Known user memory:\n${JSON.stringify(memory || {}, null, 2)}

Target role or goal:\n${targetRole || memory?.lastTargetRole || 'Not specified'}

Selected section:\n${section}

Current section content:\n${JSON.stringify(currentContent, null, 2)}

Full resume context:\n${JSON.stringify(safeResume, null, 2)}

User request:\n${query}`,
        },
      ],
    });

    const result = parseJsonFromModel(resultText);
    if (!['ready', 'clarify'].includes(result.status)) {
      throw new Error('AI returned invalid status');
    }

    if (result.memory && result.status === 'ready') {
      await updateMemory(clientId, {
        ...(result.memory.lastTargetRole ? { lastTargetRole: result.memory.lastTargetRole } : {}),
        ...(result.memory.preferences ? { preferences: result.memory.preferences } : {}),
      });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// POST /api/ai/tailor
// Body: { jobTitle, jobDescription, cvData }
// ──────────────────────────────────────────────
router.post('/tailor', async (req, res, next) => {
  try {
    const { jobTitle, jobDescription, cvData } = req.body;

    if (!jobTitle || !jobDescription || !cvData) {
      return res.status(400).json({
        success: false,
        error: 'jobTitle, jobDescription, and cvData are all required',
      });
    }

    // Fix #8 — reject oversized payloads before they hit the AI API
    const payloadSize = JSON.stringify(cvData).length;
    if (payloadSize > CV_DATA_MAX_BYTES) {
      return res.status(400).json({
        success: false,
        error: `cvData payload too large (${payloadSize} bytes). Maximum is ${CV_DATA_MAX_BYTES} bytes.`,
      });
    }

    const apiKey = getResumeApiKey();
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Resume AI OpenRouter key is not configured on the server',
      });
    }

    // Strip photo from payload to save tokens
    const payload = { ...cvData };
    const savedPhoto = payload.basicInfo?.photo;
    if (payload.basicInfo?.photo) delete payload.basicInfo.photo;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: buildHeaders(apiKey),
      body: JSON.stringify({
        model: getResumeModel(),
        messages: [
          {
            role: 'system',
            content: `You are a professional CV tailor who specializes in optimizing CVs for specific job applications.
Your task is to analyze the provided CV and the target job description, then return a JSON object with an optimized version of the CV.
Focus on:
1. Highlighting relevant skills and experiences that match the job description
2. Using industry-specific keywords from the job description
3. Quantifying achievements where possible
4. Ensuring ATS compatibility by using standard section headings
5. Maintaining a professional, concise tone

Do not invent new experiences or qualifications. Only enhance existing content to better match the job description.
Return ONLY a valid JSON object matching the exact structure of the input CV.`,
          },
          {
            role: 'user',
            content: `I'm applying for a "${jobTitle}" position. Here's the job description:\n\n${jobDescription}\n\nHere's my current CV data in JSON format:\n\n${JSON.stringify(payload, null, 2)}\n\nPlease tailor my CV for this specific job. Return the result as a valid JSON object with the same structure as my input CV.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(502).json({
        success: false,
        error: data.error.message || 'OpenRouter API error',
      });
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(502).json({ success: false, error: 'Empty response from AI' });
    }

    // Extract JSON from possible markdown fences
    let jsonStr = content;
    const fenceMatch = content.match(/```json\n([\s\S]*)\n```/);
    if (fenceMatch) jsonStr = fenceMatch[1];
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```'))   jsonStr = jsonStr.slice(0, -3);

    const tailored = JSON.parse(jsonStr.trim());

    // Restore photo
    if (savedPhoto && tailored.basicInfo) {
      tailored.basicInfo.photo = savedPhoto;
    }

    res.json({ success: true, data: tailored });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// POST /api/ai/improve
// Body: { section, content }
// ──────────────────────────────────────────────
router.post('/improve', async (req, res, next) => {
  try {
    const { section, content } = req.body;
    if (!section || !content) {
      return res.status(400).json({ success: false, error: 'section and content are required' });
    }

    if (typeof content !== 'string' || content.length > 5000) {
      return res.status(400).json({ success: false, error: 'content must be a string under 5000 characters' });
    }

    const apiKey = getResumeApiKey();
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Resume AI OpenRouter key is not configured' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: buildHeaders(apiKey),
      body: JSON.stringify({
        model: getResumeModel(),
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Improve the given resume section text to be more impactful, concise, and ATS-friendly. Use strong action verbs and quantify results where possible. Return only the improved text, nothing else.',
          },
          {
            role: 'user',
            content: `Improve this "${section}" section:\n\n${content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(502).json({ success: false, error: data.error.message });
    }

    const improved = data.choices?.[0]?.message?.content?.trim();
    res.json({ success: true, data: improved });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// POST /api/ai/parse
// Body: { text }
// ──────────────────────────────────────────────
router.post('/parse', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'text is required' });
    }

    if (text.length > 30000) {
      return res.status(400).json({ success: false, error: 'text is too long' });
    }

    const apiKey = getResumeApiKey();
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Resume AI OpenRouter key is not configured' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: buildHeaders(apiKey),
      body: JSON.stringify({
        model: getResumeModel(),
        messages: [
          {
            role: 'system',
            content: `You are an expert ATS (Applicant Tracking System) parser and resume reviewer. 
Your job is to read raw text extracted from a resume PDF and intelligently parse it into a structured JSON format. 
You must completely separate 'Projects' from 'Work Experience'. 
You must accurately extract 'School' names without stray punctuation like '.' or ','. 
You must separate 'GPA' from 'Degree'. 
You will also analyze the resume to provide an ATS score (0-100) and an array of specific reasoning/deductions that led to the score.

Return ONLY a valid JSON object matching exactly this structure:
{
  "resume": {
    "profile": { "name": "", "email": "", "phone": "", "location": "", "url": "", "summary": "" },
    "workExperiences": [{ "company": "", "jobTitle": "", "date": "", "descriptions": ["", ""] }],
    "educations": [{ "school": "", "degree": "", "date": "", "gpa": "", "descriptions": [] }],
    "projects": [{ "project": "", "date": "", "descriptions": ["", ""] }],
    "skills": { "featuredSkills": [{ "skill": "", "rating": 4 }], "descriptions": [""] },
    "custom": { "descriptions": [] }
  },
  "atsScore": 85,
  "atsAnalysis": [
    "Deducted 5 points because ...",
    "Added 10 points because ..."
  ]
}
Do not return markdown fences or any other text outside the JSON object.`,
          },
          {
            role: 'user',
            content: `Please parse this resume text:\n\n${text}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 3500,
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(502).json({ success: false, error: data.error.message });
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res.status(502).json({ success: false, error: 'Empty response from AI' });
    }

    let parsedData;
    try {
      parsedData = parseJsonFromModel(content);
    } catch (e) {
      return res.status(502).json({ success: false, error: 'Failed to parse AI JSON response' });
    }

    res.json({ success: true, data: parsedData });
  } catch (err) {
    next(err);
  }
});

export default router;
