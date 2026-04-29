/**
 * routes/ai.js — AI-powered CV tailoring
 * Ported from Impact CV's TailorCVDialog.tsx to a server-side endpoint
 * so the OpenAI key stays on the backend (not exposed to the browser).
 */
import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'OPENAI_API_KEY is not configured on the server',
      });
    }

    // Strip photo from payload to save tokens
    const payload = { ...cvData };
    const savedPhoto = payload.basicInfo?.photo;
    if (payload.basicInfo?.photo) delete payload.basicInfo.photo;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'OpenResume',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3-8b-instruct:free',
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
        error: data.error.message || 'OpenAI API error',
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
// Improves a single section's text (summary, achievements, etc.)
// ──────────────────────────────────────────────
router.post('/improve', async (req, res, next) => {
  try {
    const { section, content } = req.body;
    if (!section || !content) {
      return res.status(400).json({ success: false, error: 'section and content required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'OPENAI_API_KEY not configured' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'OpenResume',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3-8b-instruct:free',
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

export default router;
