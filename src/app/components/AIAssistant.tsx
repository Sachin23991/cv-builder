"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeCustom,
  changeEducations,
  changeProfile,
  changeProjects,
  changeSkills,
  changeWorkExperiences,
  selectResume,
} from "lib/redux/resumeSlice";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

type AssistantMode = "resume" | "site";
type ResumeAISection =
  | "summary"
  | "workExperience"
  | "education"
  | "project"
  | "skills"
  | "custom";

interface ResumeAIResult {
  status: "ready" | "clarify";
  message?: string;
  content?: string | string[];
  contentType?: "text" | "bullets";
}

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const ATTRIBUTE_LABELS: Record<string, string> = {
  company: "Company Name",
  jobTitle: "Job Title",
  date: "Date Range",
  descriptions: "Description / Bullets",
  school: "School Name",
  degree: "Degree",
  gpa: "GPA",
  project: "Project Name",
  summary: "Summary / Objective",
};

/* ── Resume mode suggestions ── */
const RESUME_SUGGESTIONS = [
  "✦ Write 3 impact bullet points",
  "✦ Improve my summary",
  "✦ Make it more professional",
  "✦ Quantify achievements",
];

/* ── Site mode suggestions ── */
const SITE_SUGGESTIONS = [
  "✦ How do I add work experience?",
  "✦ Can I export to PDF?",
  "✦ How do I change the template?",
  "✦ Tips for a great resume?",
];

/* ── Resume AI: deep context sent with every request ── */
const RESUME_AI_SYSTEM_CONTEXT = `You are an expert resume writer and career coach embedded in ResumeMaker.
Your ONLY job is to help users write, improve, and optimize their resume content.
You have full knowledge of: ATS optimization, industry keywords, STAR-method bullet writing,
quantified impact statements, executive summaries, LinkedIn-profile alignment, and
tailoring resumes to specific job descriptions.
NEVER discuss website features, navigation, or anything unrelated to resume content.
When writing bullets, always use strong action verbs and quantify impact wherever possible.`;

/* ── Site AI: website-help context ── */
const SITE_AI_SYSTEM_CONTEXT = `You are a friendly product expert for ResumeMaker — a web app that lets users
build, edit, and export professional resumes.
You help users navigate the app, understand its features, troubleshoot issues,
and get the most out of every section. You know every feature of the app deeply.
Features include: live resume editor, multiple templates, PDF export, AI writing assistant,
section reordering, custom sections, import from LinkedIn, and real-time preview.
NEVER write resume content or give career advice — always redirect those questions
to the Resume Writer tab. Be concise, warm, and step-by-step when explaining UI flows.`;

const RESUME_INITIAL_MSG: Message = {
  role: "assistant",
  content:
    `✦ Resume Writer ready.\n\nSelect a section, tell me what to write — I'll update your resume directly.\n\nTry: "Write 3 bullet points about my React work" or "Write a professional summary for a software engineer."`,
};

const SITE_INITIAL_MSG: Message = {
  role: "assistant",
  content:
    "👋 Hi! I'm your ResumeMaker guide.\n\nAsk me anything — how to use features, how to navigate the editor, export options, or tips for formatting sections.\n\nFor writing help, switch to the Resume Writer tab.",
};

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
const SiteLogoMark = ({ size = 20 }: { size?: number }) => (
  <span
    style={{
      width: size,
      height: size,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "white",
      flexShrink: 0,
    }}
  >
    <img
      src="/favicon.ico"
      alt=""
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  </span>
);

import { fetchAPI } from "lib/api";

async function postAI<T>(path: string, body: unknown): Promise<T> {
  try {
    const data = await fetchAPI<{ success: boolean; data?: T; error?: string }>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    
    if (!data.success || data.data === undefined) {
      throw new Error(data.error || "Empty AI response");
    }
    return data.data;
  } catch (err: any) {
    throw new Error(err.message || "Server error");
  }
}


const toBulletArray = (content: string | string[] | undefined) => {
  if (Array.isArray(content)) return content.filter(Boolean);
  if (!content) return [];
  return content
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*\u2022]\s*/, "").trim())
    .filter(Boolean);
};

const toText = (content: string | string[] | undefined) =>
  Array.isArray(content) ? content.join("\n") : content || "";

/* ─────────────────────────────────────────────────────────────
   Embedded CSS — two-mode premium design
───────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Figtree:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  /* ── Design Tokens ── */
  :root {
    /* Base */
    --ai-bg:          #07080f;
    --ai-surface:     rgba(10, 11, 20, 0.96);
    --ai-surface-hi:  rgba(255,255,255,0.03);
    --ai-border:      rgba(255,255,255,0.06);
    --ai-border-hi:   rgba(255,255,255,0.11);
    --ai-text:        #eeeef5;
    --ai-muted:       rgba(238,238,245,0.38);
    --ai-dimmed:      rgba(238,238,245,0.18);

    /* Typography */
    --ai-font:        'Figtree', system-ui, sans-serif;
    --ai-font-head:   'Outfit', system-ui, sans-serif;
    --ai-font-mono:   'JetBrains Mono', monospace;

    /* Radius */
    --ai-radius:      22px;
    --ai-radius-sm:   12px;
    --ai-radius-xs:   8px;

    /* Resume mode palette */
    --rm-accent1:     #818cf8;
    --rm-accent2:     #c084fc;
    --rm-grad:        linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    --rm-grad-soft:   linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.18) 100%);
    --rm-glow:        rgba(99,102,241,0.35);
    --rm-user-bg:     linear-gradient(135deg, #4338ca 0%, #7c3aed 100%);
    --rm-border-act:  rgba(129,140,248,0.45);

    /* Site mode palette */
    --sm-accent1:     #34d399;
    --sm-accent2:     #22d3ee;
    --sm-grad:        linear-gradient(135deg, #059669 0%, #0891b2 100%);
    --sm-grad-soft:   linear-gradient(135deg, rgba(5,150,105,0.18) 0%, rgba(8,145,178,0.18) 100%);
    --sm-glow:        rgba(52,211,153,0.3);
    --sm-user-bg:     linear-gradient(135deg, #065f46 0%, #164e63 100%);
    --sm-border-act:  rgba(52,211,153,0.4);
  }

  /* ── Grain texture overlay ── */
  @keyframes xai-grain {
    0%, 100% { transform: translate(0,0); }
    10%       { transform: translate(-1%,-1%); }
    30%       { transform: translate(2%,1%); }
    50%       { transform: translate(-1%,2%); }
    70%       { transform: translate(1%,-2%); }
    90%       { transform: translate(-2%,1%); }
  }

  /* ── FAB ── */
  .xai-fab {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    padding: 0;
    background: transparent;
    outline: none;
  }
  .xai-fab-shell {
    position: relative;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--rm-grad);
    box-shadow:
      0 8px 32px rgba(99,102,241,0.5),
      0 2px 8px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.2);
    transition: box-shadow 0.25s;
  }
  .xai-fab-shell::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .xai-fab:hover .xai-fab-shell::before { opacity: 1; }
  .xai-fab:hover .xai-fab-shell {
    box-shadow:
      0 14px 48px rgba(99,102,241,0.7),
      0 2px 8px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .xai-fab-ring {
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 1px solid rgba(129,140,248,0.3);
    animation: xai-ring-pulse 3s ease-in-out infinite;
    pointer-events: none;
  }
  .xai-fab-glow {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: var(--rm-grad);
    opacity: 0.3;
    filter: blur(12px);
    animation: xai-pulse 3s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes xai-pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50%       { transform: scale(1.22); opacity: 0.12; }
  }
  @keyframes xai-ring-pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50%       { transform: scale(1.3); opacity: 0; }
  }

  /* ── Backdrop ── */
  .xai-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9998;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  /* ── Panel ── */
  .xai-panel {
    position: fixed;
    bottom: 100px;
    right: 28px;
    z-index: 9999;
    width: 420px;
    max-width: calc(100vw - 40px);
    max-height: 82vh;
    display: flex;
    flex-direction: column;
    border-radius: var(--ai-radius);
    background: var(--ai-surface);
    border: 1px solid var(--ai-border-hi);
    box-shadow:
      0 40px 100px rgba(0,0,0,0.75),
      0 0 0 1px rgba(255,255,255,0.04),
      inset 0 1px 0 rgba(255,255,255,0.07);
    overflow: hidden;
    font-family: var(--ai-font);
    color: var(--ai-text);
    transform-origin: bottom right;
  }

  /* Subtle grain inside panel */
  .xai-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.018;
    pointer-events: none;
    border-radius: var(--ai-radius);
    z-index: 0;
  }
  .xai-panel > * { position: relative; z-index: 1; }

  /* ── Mode accent bar (top edge) ── */
  .xai-accent-bar {
    height: 3px;
    flex-shrink: 0;
    border-radius: 0;
    transition: background 0.4s ease;
  }

  /* ── Header ── */
  .xai-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 12px;
    border-bottom: 1px solid var(--ai-border);
    flex-shrink: 0;
    background: rgba(255,255,255,0.015);
  }
  .xai-header-left {
    display: flex;
    align-items: center;
    gap: 11px;
  }
  .xai-avatar {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.4s ease, box-shadow 0.4s ease;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .xai-avatar-resume {
    background: var(--rm-grad-soft);
    box-shadow: 0 0 20px var(--rm-glow);
  }
  .xai-avatar-site {
    background: var(--sm-grad-soft);
    box-shadow: 0 0 20px var(--sm-glow);
  }
  .xai-header-title {
    font-family: var(--ai-font-head);
    font-size: 14.5px;
    font-weight: 700;
    color: var(--ai-text);
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  .xai-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 2px 7px;
    border-radius: 20px;
    border: 1px solid;
    transition: all 0.4s ease;
  }
  .xai-badge-resume {
    color: var(--rm-accent1);
    border-color: rgba(129,140,248,0.3);
    background: rgba(99,102,241,0.1);
  }
  .xai-badge-site {
    color: var(--sm-accent1);
    border-color: rgba(52,211,153,0.3);
    background: rgba(5,150,105,0.1);
  }
  .xai-close {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    border: 1px solid var(--ai-border);
    background: rgba(255,255,255,0.04);
    color: var(--ai-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .xai-close:hover {
    background: rgba(255,255,255,0.09);
    color: var(--ai-text);
    border-color: var(--ai-border-hi);
  }

  /* ── Mode Tabs ── */
  .xai-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    padding: 12px 14px 10px;
    flex-shrink: 0;
    background: rgba(255,255,255,0.01);
    border-bottom: 1px solid var(--ai-border);
  }
  .xai-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 9px 12px;
    border-radius: var(--ai-radius-sm);
    border: 1px solid var(--ai-border);
    background: rgba(255,255,255,0.03);
    color: var(--ai-muted);
    font-family: var(--ai-font);
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
    letter-spacing: -0.01em;
  }
  .xai-tab:hover:not(.xai-tab-resume-active):not(.xai-tab-site-active) {
    background: rgba(255,255,255,0.06);
    color: var(--ai-text);
    border-color: var(--ai-border-hi);
  }
  .xai-tab-resume-active {
    background: rgba(99,102,241,0.15);
    border-color: var(--rm-border-act);
    color: var(--rm-accent1);
    box-shadow: 0 0 16px rgba(99,102,241,0.12);
    font-weight: 600;
  }
  .xai-tab-site-active {
    background: rgba(5,150,105,0.15);
    border-color: var(--sm-border-act);
    color: var(--sm-accent1);
    box-shadow: 0 0 16px rgba(52,211,153,0.1);
    font-weight: 600;
  }
  .xai-tab-icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 13px;
    line-height: 1;
  }

  /* ── Resume Controls Panel ── */
  .xai-resume-controls {
    padding: 12px 14px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
    background: rgba(99,102,241,0.025);
    border-bottom: 1px solid rgba(99,102,241,0.1);
  }
  .xai-controls-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--rm-accent1);
    opacity: 0.7;
    margin-bottom: -2px;
  }
  .xai-role-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius-xs);
    padding: 8px 12px;
    font-family: var(--ai-font);
    font-size: 12.5px;
    color: var(--ai-text);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .xai-role-input::placeholder { color: var(--ai-dimmed); }
  .xai-role-input:focus {
    border-color: var(--rm-border-act);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .xai-selects-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  .xai-select {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius-xs);
    padding: 8px 28px 8px 10px;
    font-family: var(--ai-font);
    font-size: 12px;
    color: var(--ai-text);
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23818cf8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    letter-spacing: -0.01em;
  }
  .xai-select:focus {
    border-color: var(--rm-border-act);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .xai-select option { background: #0e0f1e; color: var(--ai-text); }

  .xai-select-placeholder {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--ai-border);
    border-radius: var(--ai-radius-xs);
    padding: 8px 10px;
    font-size: 12px;
    color: var(--ai-dimmed);
    display: flex;
    align-items: center;
    font-style: italic;
  }

  .xai-attr-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px 5px 8px;
    border-radius: var(--ai-radius-xs);
    background: rgba(129,140,248,0.08);
    border: 1px solid rgba(129,140,248,0.2);
    font-size: 11px;
    color: var(--rm-accent1);
    font-weight: 500;
    align-self: flex-start;
    margin-bottom: 4px;
  }
  .xai-attr-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--rm-accent1);
    flex-shrink: 0;
    animation: xai-dot-pulse 2s ease-in-out infinite;
  }
  @keyframes xai-dot-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }

  /* ── Divider ── */
  .xai-divider {
    height: 1px;
    background: var(--ai-border);
    flex-shrink: 0;
  }

  /* ── Messages ── */
  .xai-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scroll-behavior: smooth;
  }
  .xai-messages::-webkit-scrollbar { width: 3px; }
  .xai-messages::-webkit-scrollbar-track { background: transparent; }
  .xai-messages::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.08);
    border-radius: 4px;
  }
  .xai-msg-row { display: flex; }
  .xai-msg-row-user  { justify-content: flex-end; }
  .xai-msg-row-asst  { justify-content: flex-start; gap: 8px; align-items: flex-end; }

  /* Assistant avatar bubble */
  .xai-asst-icon {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin-bottom: 2px;
  }
  .xai-asst-icon-resume {
    background: rgba(99,102,241,0.2);
    border: 1px solid rgba(129,140,248,0.25);
  }
  .xai-asst-icon-site {
    background: rgba(5,150,105,0.2);
    border: 1px solid rgba(52,211,153,0.25);
  }

  .xai-bubble {
    max-width: 84%;
    padding: 10px 13px;
    border-radius: 16px;
    font-size: 13px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: var(--ai-font);
  }
  .xai-bubble-user-resume {
    background: var(--rm-user-bg);
    border-bottom-right-radius: 5px;
    color: #fff;
    font-weight: 400;
    box-shadow: 0 4px 20px rgba(67,56,202,0.4);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .xai-bubble-user-site {
    background: var(--sm-user-bg);
    border-bottom-right-radius: 5px;
    color: #fff;
    font-weight: 400;
    box-shadow: 0 4px 20px rgba(6,78,59,0.5);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .xai-bubble-asst {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--ai-border-hi);
    border-bottom-left-radius: 5px;
    color: var(--ai-text);
    box-shadow: 0 2px 10px rgba(0,0,0,0.25);
    backdrop-filter: blur(4px);
  }

  /* ── Typing indicator ── */
  .xai-typing-wrap {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 11px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--ai-border-hi);
    border-radius: 16px;
    border-bottom-left-radius: 5px;
    width: fit-content;
  }
  .xai-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: xai-bounce 1.3s ease-in-out infinite;
  }
  .xai-dot-resume { background: var(--rm-accent1); }
  .xai-dot-site   { background: var(--sm-accent1); }
  @keyframes xai-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40%           { transform: translateY(-5px); opacity: 1; }
  }

  /* ── Suggestion chips ── */
  .xai-suggestions {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 4px 0 8px;
  }
  .xai-chip {
    padding: 7px 12px;
    border-radius: var(--ai-radius-xs);
    border: 1px solid var(--ai-border);
    background: rgba(255,255,255,0.03);
    color: var(--ai-muted);
    font-family: var(--ai-font);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.18s;
    outline: none;
    text-align: left;
    letter-spacing: -0.01em;
  }
  .xai-chip-resume:hover {
    background: rgba(99,102,241,0.1);
    border-color: rgba(129,140,248,0.35);
    color: var(--rm-accent1);
    transform: translateX(3px);
  }
  .xai-chip-site:hover {
    background: rgba(5,150,105,0.1);
    border-color: rgba(52,211,153,0.35);
    color: var(--sm-accent1);
    transform: translateX(3px);
  }

  /* ── Empty state ── */
  .xai-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px;
    text-align: center;
  }
  .xai-empty-icon {
    font-size: 28px;
    margin-bottom: 4px;
    opacity: 0.6;
  }
  .xai-empty-title {
    font-family: var(--ai-font-head);
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ai-text);
    margin: 0;
  }
  .xai-empty-sub {
    font-size: 12px;
    color: var(--ai-muted);
    margin: 0;
    line-height: 1.5;
    max-width: 240px;
  }

  /* ── Input area ── */
  .xai-input-area {
    padding: 10px 12px 14px;
    flex-shrink: 0;
    border-top: 1px solid var(--ai-border);
    background: rgba(255,255,255,0.01);
  }
  .xai-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--ai-border-hi);
    border-radius: 13px;
    padding: 4px 4px 4px 12px;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .xai-input-row-resume:focus-within {
    border-color: var(--rm-border-act);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .xai-input-row-site:focus-within {
    border-color: var(--sm-border-act);
    box-shadow: 0 0 0 3px rgba(52,211,153,0.08);
  }
  .xai-text-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: var(--ai-font);
    font-size: 13px;
    color: var(--ai-text);
    padding: 7px 0;
    min-width: 0;
    letter-spacing: -0.01em;
  }
  .xai-text-input::placeholder { color: var(--ai-dimmed); }
  .xai-send {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .xai-send-resume { background: var(--rm-grad); }
  .xai-send-site   { background: var(--sm-grad); }
  .xai-send:disabled { opacity: 0.3; cursor: not-allowed; }
  .xai-send:not(:disabled):hover { transform: scale(1.08); }
  .xai-send-resume:not(:disabled):hover {
    box-shadow: 0 4px 20px rgba(99,102,241,0.55);
  }
  .xai-send-site:not(:disabled):hover {
    box-shadow: 0 4px 20px rgba(52,211,153,0.45);
  }

  /* ── Input footer hint ── */
  .xai-input-hint {
    margin-top: 6px;
    font-size: 10px;
    color: var(--ai-dimmed);
    text-align: center;
    letter-spacing: 0.01em;
  }

  /* ── Scrollbar for controls ── */
  .xai-controls-scroll { overflow: hidden; }

  /* ── Mode transition indicator ── */
  .xai-mode-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 20px;
  }
  .xai-mode-tag-resume {
    color: var(--rm-accent1);
    background: rgba(99,102,241,0.12);
  }
  .xai-mode-tag-site {
    color: var(--sm-accent1);
    background: rgba(5,150,105,0.12);
  }
`;

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export function AIAssistant() {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(selectResume);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("resume");

  /* ── Separate message histories — never mixed ── */
  const [resumeMessages, setResumeMessages] = useState<Message[]>([
    RESUME_INITIAL_MSG,
  ]);
  const [siteMessages, setSiteMessages] = useState<Message[]>([
    SITE_INITIAL_MSG,
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  /* Resume-specific controls */
  const [section, setSection] = useState<ResumeAISection>("summary");
  const [itemIndex, setItemIndex] = useState(0);
  const [attribute, setAttribute] = useState("descriptions");
  const [targetRole, setTargetRole] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* Active messages & setter based on mode */
  const messages = mode === "resume" ? resumeMessages : siteMessages;
  const setMessages = mode === "resume" ? setResumeMessages : setSiteMessages;

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [resumeMessages, siteMessages, isOpen, mode]);

  /* Listen for external "Ask AI" events */
  useEffect(() => {
    const handleOpenAI = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      const detail = (
        event as CustomEvent<{
          mode?: AssistantMode;
          section?: ResumeAISection;
          itemIndex?: number;
          attribute?: string;
        }>
      ).detail;

      if (detail?.mode) setMode(detail.mode);
      if (detail?.section) setSection(detail.section);
      if (typeof detail?.itemIndex === "number") setItemIndex(detail.itemIndex);
      if (detail?.attribute) setAttribute(detail.attribute);

      const sectionLabel =
        {
          workExperience: "Work Experience",
          education: "Education",
          project: "Project",
          skills: "Skills",
          custom: "Custom Section",
          summary: "Summary",
        }[detail?.section || "summary"] || "Summary";

      const attrLbl =
        ATTRIBUTE_LABELS[detail?.attribute || "descriptions"] ||
        detail?.attribute ||
        "descriptions";

      const greeting: Message = {
        role: "assistant",
        content: `✦ Ready to write the **${attrLbl}** for your **${sectionLabel}** section.\n\nDescribe what you'd like and I'll write it directly into your resume.`,
      };

      setResumeMessages([greeting]);
      setIsOpen(true);
      setLastActivity(Date.now());
    };

    window.addEventListener("resumemaker:open-ai", handleOpenAI);
    return () =>
      window.removeEventListener("resumemaker:open-ai", handleOpenAI);
  }, []);

  /* ── Data helpers ── */
  const getSectionLabel = () =>
    ({
      summary: "Summary / Objective",
      workExperience: "Work Experience",
      education: "Education",
      project: "Project",
      skills: "Skills",
      custom: "Custom Section",
    }[section]);

  const getSectionItems = (): string[] => {
    if (section === "workExperience")
      return resume.workExperiences.map(
        (item, idx) => item.company || item.jobTitle || `Experience ${idx + 1}`
      );
    if (section === "education")
      return resume.educations.map(
        (item, idx) => item.school || item.degree || `Education ${idx + 1}`
      );
    if (section === "project")
      return resume.projects.map(
        (item, idx) => item.project || `Project ${idx + 1}`
      );
    return [];
  };

  const getCurrentSectionContent = () => {
    if (section === "summary") return resume.profile.summary;
    if (section === "workExperience") {
      const item = resume.workExperiences[itemIndex];
      if (!item) return "";
      if (attribute === "descriptions") return item.descriptions || [];
      return (item as any)[attribute] || "";
    }
    if (section === "education") {
      const item = resume.educations[itemIndex];
      if (!item) return "";
      if (attribute === "descriptions") return item.descriptions || [];
      return (item as any)[attribute] || "";
    }
    if (section === "project") {
      const item = resume.projects[itemIndex];
      if (!item) return "";
      if (attribute === "descriptions") return item.descriptions || [];
      return (item as any)[attribute] || "";
    }
    if (section === "skills") return resume.skills.descriptions;
    return resume.custom.descriptions;
  };

  const applyResumeAIResult = (result: ResumeAIResult) => {
    if (result.status !== "ready") return;
    const isBulletField = attribute === "descriptions";
    const textValue = toText(result.content);
    const bulletValue = toBulletArray(result.content);

    if (section === "summary") {
      dispatch(changeProfile({ field: "summary", value: textValue }));
      return;
    }
    if (section === "workExperience") {
      dispatch(
        changeWorkExperiences({
          idx: itemIndex,
          field: attribute,
          value: isBulletField ? bulletValue : textValue,
        } as any)
      );
    } else if (section === "education") {
      dispatch(
        changeEducations({
          idx: itemIndex,
          field: attribute,
          value: isBulletField ? bulletValue : textValue,
        } as any)
      );
    } else if (section === "project") {
      dispatch(
        changeProjects({
          idx: itemIndex,
          field: attribute,
          value: isBulletField ? bulletValue : textValue,
        } as any)
      );
    } else if (section === "skills") {
      dispatch(changeSkills({ field: "descriptions", value: bulletValue }));
    } else {
      dispatch(changeCustom({ field: "descriptions", value: bulletValue }));
    }
  };

  /* ── Send — routes to correct endpoint with mode-specific context ── */
  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || isTyping) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setLastActivity(Date.now());

    try {
      if (mode === "site") {
        /* ── Site help: sends website-navigation context ── */
        const response = await postAI<string>("/api/ai/site-chat", {
          message: userMessage.content,
          systemContext: SITE_AI_SYSTEM_CONTEXT,
          context: "website-help",
          pageContext: {
            path: window.location.pathname,
            title: document.title,
          },
          conversation: siteMessages.slice(-8),
        });
        setSiteMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
        return;
      }

      /* ── Resume writer: sends full resume data + section context ── */
      const result = await postAI<ResumeAIResult>("/api/ai/resume-section", {
        systemContext: RESUME_AI_SYSTEM_CONTEXT,
        context: "resume-writer",
        section,
        attribute,
        query: userMessage.content,
        currentContent: getCurrentSectionContent(),
        resume,
        targetRole,
        conversation: resumeMessages.slice(-6),
      });

      if (result.status === "ready") applyResumeAIResult(result);

      const response =
        result.status === "clarify"
          ? result.message || "Can you give me a bit more detail?"
          : `${result.message || "✅ Done — your resume has been updated."}\n\n${toText(result.content)}`;

      setResumeMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${msg}\n\nMake sure the backend is running at ${BACKEND_URL}.`,
        },
      ]);
    } finally {
      setIsTyping(false);
      setLastActivity(Date.now());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggle = () => {
    const now = Date.now();
    if (!isOpen) {
      if (now - lastActivity > 3 * 60 * 1000) {
        setResumeMessages([RESUME_INITIAL_MSG]);
        setSiteMessages([SITE_INITIAL_MSG]);
      }
      setLastActivity(now);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const sectionItems = getSectionItems();
  const attrLabel = ATTRIBUTE_LABELS[attribute] || attribute;
  const suggestions = mode === "resume" ? RESUME_SUGGESTIONS : SITE_SUGGESTIONS;
  const isResume = mode === "resume";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── FAB ── */}
      <motion.button
        id="ai-assistant-toggle"
        aria-label="Toggle AI assistant"
        className="xai-fab"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleToggle();
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, y: 32, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <div className="xai-fab-shell">
          <span className="xai-fab-glow" />
          <span className="xai-fab-ring" />
          {isOpen ? (
            <XMarkIcon style={{ width: 22, height: 22, color: "white" }} aria-hidden />
          ) : (
            <SiteLogoMark size={22} />
          )}
        </div>
      </motion.button>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="xai-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="AI Assistant"
            className="xai-panel"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", stiffness: 420, damping: 28, mass: 0.7 },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
              transition: { duration: 0.16, ease: "easeIn" },
            }}
          >
            {/* ── Accent bar — shifts with mode ── */}
            <motion.div
              className="xai-accent-bar"
              animate={{
                background: isResume
                  ? "linear-gradient(90deg, #6366f1, #a855f7)"
                  : "linear-gradient(90deg, #059669, #0891b2)",
              }}
              transition={{ duration: 0.5 }}
            />

            {/* ── Header ── */}
            <div className="xai-header">
              <div className="xai-header-left">
                <div className={`xai-avatar ${isResume ? "xai-avatar-resume" : "xai-avatar-site"}`}>
                  <SiteLogoMark size={18} />
                </div>
                <div>
                  <h3 className="xai-header-title">AI Assistant</h3>
                  <div className={`xai-header-badge ${isResume ? "xai-badge-resume" : "xai-badge-site"}`}>
                    <span>{isResume ? "📝" : "💬"}</span>
                    {isResume ? `Resume · ${getSectionLabel()}` : "Website Help"}
                  </div>
                </div>
              </div>
              <button
                id="ai-assistant-close"
                aria-label="Close AI assistant"
                className="xai-close"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <XMarkIcon style={{ width: 15, height: 15 }} aria-hidden />
              </button>
            </div>

            {/* ── Mode Tabs ── */}
            <div className="xai-tabs">
              <button
                type="button"
                className={`xai-tab ${isResume ? "xai-tab-resume-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMode("resume");
                }}
              >
                <span className="xai-tab-icon">📝</span>
                Resume Writer
              </button>
              <button
                type="button"
                className={`xai-tab ${!isResume ? "xai-tab-site-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMode("site");
                }}
              >
                <span className="xai-tab-icon">💬</span>
                Website Help
              </button>
            </div>

            {/* ── Resume controls (only in resume mode) ── */}
            <AnimatePresence initial={false}>
              {isResume && (
                <motion.div
                  className="xai-resume-controls xai-controls-scroll"
                  key="resume-controls"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                >
                  <p className="xai-controls-label">Resume Context</p>

                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Target role, e.g. Full Stack Developer"
                    className="xai-role-input"
                  />

                  <div className="xai-selects-row">
                    <select
                      value={section}
                      onChange={(e) => {
                        setSection(e.target.value as ResumeAISection);
                        setItemIndex(0);
                      }}
                      className="xai-select"
                    >
                      <option value="summary">Summary / Objective</option>
                      <option value="workExperience">Work Experience</option>
                      <option value="education">Education</option>
                      <option value="project">Project</option>
                      <option value="skills">Skills</option>
                      <option value="custom">Custom Section</option>
                    </select>

                    {sectionItems.length > 0 ? (
                      <select
                        value={itemIndex}
                        onChange={(e) => setItemIndex(Number(e.target.value))}
                        className="xai-select"
                      >
                        {sectionItems.map((label, idx) => (
                          <option key={idx} value={idx}>
                            {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="xai-select-placeholder">
                        {getSectionLabel()}
                      </div>
                    )}
                  </div>

                  <div className="xai-attr-badge" style={{ marginBottom: 12 }}>
                    <span className="xai-attr-dot" />
                    Writing: <strong style={{ marginLeft: 3 }}>{attrLabel}</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Messages ── */}
            <div className="xai-messages">
              {/* Suggestion chips — shown only with initial message */}
              {messages.length <= 1 && (
                <motion.div
                  className="xai-suggestions"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`xai-chip ${isResume ? "xai-chip-resume" : "xai-chip-site"}`}
                      onClick={() => handleSend(s.replace(/^✦\s*/, ""))}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={`${mode}-${index}`}
                  className={`xai-msg-row ${
                    message.role === "user"
                      ? "xai-msg-row-user"
                      : "xai-msg-row-asst"
                  }`}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: index === messages.length - 1 ? 0.04 : 0,
                  }}
                >
                  {/* Assistant icon */}
                  {message.role === "assistant" && (
                    <div
                      className={`xai-asst-icon ${
                        isResume ? "xai-asst-icon-resume" : "xai-asst-icon-site"
                      }`}
                    >
                      {isResume ? "✦" : "?"}
                    </div>
                  )}
                  <div
                    className={`xai-bubble ${
                      message.role === "user"
                        ? isResume
                          ? "xai-bubble-user-resume"
                          : "xai-bubble-user-site"
                        : "xai-bubble-asst"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  className="xai-msg-row xai-msg-row-asst"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`xai-asst-icon ${
                      isResume ? "xai-asst-icon-resume" : "xai-asst-icon-site"
                    }`}
                  >
                    {isResume ? "✦" : "?"}
                  </div>
                  <div className="xai-typing-wrap">
                    {[0, 140, 280].map((delay) => (
                      <span
                        key={delay}
                        className={`xai-dot ${
                          isResume ? "xai-dot-resume" : "xai-dot-site"
                        }`}
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div className="xai-input-area">
              <div
                className={`xai-input-row ${
                  isResume ? "xai-input-row-resume" : "xai-input-row-site"
                }`}
              >
                <label htmlFor="xai-input" className="sr-only">
                  Message AI assistant
                </label>
                <input
                  id="xai-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isResume
                      ? `Describe what to write for ${attrLabel.toLowerCase()}…`
                      : "Ask anything about ResumeMaker…"
                  }
                  className="xai-text-input"
                  disabled={isTyping}
                  autoComplete="off"
                />
                <button
                  id="ai-send-button"
                  type="button"
                  aria-label="Send message"
                  className={`xai-send ${isResume ? "xai-send-resume" : "xai-send-site"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSend();
                  }}
                  disabled={!input.trim() || isTyping}
                >
                  <PaperAirplaneIcon style={{ width: 15, height: 15 }} aria-hidden />
                </button>
              </div>
              <p className="xai-input-hint">
                {isResume
                  ? "Changes apply directly to your resume"
                  : "Powered by ResumeMaker AI · Ask anything"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}