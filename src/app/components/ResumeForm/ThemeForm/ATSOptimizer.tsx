"use client";
import { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectResume, changeProfile, changeWorkExperiences, changeProjects } from "lib/redux/resumeSlice";
import { selectTemplateSettings, updatePrint, updateDesign, updateTypography, updateLayout, updateContent } from "lib/redux/settingsSlice";
import { fetchAPI } from "lib/api";

// ─── ATS Issue Types ────────────────────────────────────────
interface ATSIssue {
  id: string;
  category: "critical" | "warning" | "suggestion";
  area: string;
  title: string;
  description: string;
  currentValue?: string;
  suggestedFix?: string;
  aiRewriteAvailable: boolean;
  autoFixAvailable: boolean;
  fixed?: boolean;
  aiRewrite?: string;
  loadingAI?: boolean;
}

// ─── ATS Score Calculation ──────────────────────────────────
function runATSScan(resume: any, ts: any): { score: number; issues: ATSIssue[] } {
  const issues: ATSIssue[] = [];
  let deductions = 0;

  // ── 1. Layout checks ──
  if ((ts.layout?.columns || 1) > 1) {
    issues.push({
      id: "layout-columns",
      category: "critical",
      area: "Layout",
      title: "Multi-column layout detected",
      description: "ATS parsers read left-to-right, top-to-bottom. Multi-column layouts cause text scrambling.",
      suggestedFix: "Switch to single-column layout",
      aiRewriteAvailable: false,
      autoFixAvailable: true,
    });
    deductions += 15;
  }

  // ── 2. Font checks ──
  const safefonts = ["inter", "roboto", "arial", "helvetica", "calibri", "times new roman", "georgia", "verdana", "tahoma", "open sans", "lato", "source sans pro", "noto sans"];
  const bodyFont = (ts.typography?.body?.fontFamily || "").toLowerCase();
  if (bodyFont && !safefonts.some(f => bodyFont.includes(f))) {
    issues.push({
      id: "font-unusual",
      category: "warning",
      area: "Typography",
      title: `Unusual font: "${ts.typography?.body?.fontFamily}"`,
      description: "Some ATS systems can't parse custom/decorative fonts. Stick to standard fonts.",
      suggestedFix: "Switch to Calibri, Arial, or Inter",
      aiRewriteAvailable: false,
      autoFixAvailable: true,
    });
    deductions += 8;
  }

  const fontSize = ts.typography?.body?.fontSize || 11;
  if (fontSize < 10) {
    issues.push({
      id: "font-size-small",
      category: "warning",
      area: "Typography",
      title: "Font size too small",
      description: `Body text is ${fontSize}pt. Most ATS require at least 10pt for reliable parsing.`,
      suggestedFix: "Increase to 10-11pt",
      aiRewriteAvailable: false,
      autoFixAvailable: true,
    });
    deductions += 5;
  }

  // ── 3. Content checks ──
  if (!resume.profile.summary || resume.profile.summary.length < 30) {
    issues.push({
      id: "no-summary",
      category: "critical",
      area: "Content",
      title: "Missing or short professional summary",
      description: "A 2-4 sentence summary with keywords is critical for ATS keyword matching.",
      currentValue: resume.profile.summary || "(empty)",
      aiRewriteAvailable: true,
      autoFixAvailable: false,
    });
    deductions += 12;
  } else if (resume.profile.summary.length < 100) {
    issues.push({
      id: "short-summary",
      category: "suggestion",
      area: "Content",
      title: "Summary could be more detailed",
      description: "A 2-4 sentence summary helps ATS match more keywords. Currently too brief.",
      currentValue: resume.profile.summary,
      aiRewriteAvailable: true,
      autoFixAvailable: false,
    });
    deductions += 5;
  }

  // ── 4. Contact info checks ──
  if (!resume.profile.email) {
    issues.push({
      id: "no-email",
      category: "critical",
      area: "Contact",
      title: "Missing email address",
      description: "Email is required for ATS to register your application.",
      aiRewriteAvailable: false,
      autoFixAvailable: false,
    });
    deductions += 10;
  }

  if (!resume.profile.phone) {
    issues.push({
      id: "no-phone",
      category: "warning",
      area: "Contact",
      title: "Missing phone number",
      description: "Most ATS require a phone number for a complete application.",
      aiRewriteAvailable: false,
      autoFixAvailable: false,
    });
    deductions += 5;
  }

  // ── 5. Work experience checks ──
  const workExps = resume.workExperiences || [];
  const hasWork = workExps.length > 0 && workExps[0]?.company;
  if (!hasWork) {
    issues.push({
      id: "no-experience",
      category: "critical",
      area: "Content",
      title: "No work experience listed",
      description: "ATS heavily weight work experience sections.",
      aiRewriteAvailable: false,
      autoFixAvailable: false,
    });
    deductions += 15;
  } else {
    // Check for weak bullets
    workExps.forEach((exp: any, i: number) => {
      if (!exp.company) return;
      const descs = exp.descriptions || [];

      if (descs.length === 0) {
        issues.push({
          id: `work-no-bullets-${i}`,
          category: "warning",
          area: "Content",
          title: `"${exp.jobTitle || exp.company}" has no bullet points`,
          description: "ATS and recruiters expect 3-5 achievement bullets per role.",
          aiRewriteAvailable: true,
          autoFixAvailable: false,
        });
        deductions += 8;
      } else if (descs.length < 3) {
        issues.push({
          id: `work-few-bullets-${i}`,
          category: "suggestion",
          area: "Content",
          title: `"${exp.jobTitle}" has only ${descs.length} bullet(s)`,
          description: "Aim for 3-5 bullets with action verbs and quantified results.",
          currentValue: descs.join("\n"),
          aiRewriteAvailable: true,
          autoFixAvailable: false,
        });
        deductions += 3;
      }

      // Check for action verbs
      const weakStarters = ["responsible for", "duties include", "helped", "worked on", "assisted"];
      descs.forEach((d: string, di: number) => {
        if (weakStarters.some(ws => d.toLowerCase().startsWith(ws))) {
          issues.push({
            id: `work-weak-verb-${i}-${di}`,
            category: "suggestion",
            area: "Content",
            title: `Weak action verb in "${exp.jobTitle}"`,
            description: `"${d.slice(0, 60)}..." — Use strong action verbs: Led, Developed, Implemented, Optimized, etc.`,
            currentValue: d,
            aiRewriteAvailable: true,
            autoFixAvailable: false,
          });
          deductions += 3;
        }
      });

      // Check for metrics
      const hasMetrics = descs.some((d: string) => /\d+%|\$\d|increased|reduced|improved|saved/i.test(d));
      if (descs.length > 0 && !hasMetrics) {
        issues.push({
          id: `work-no-metrics-${i}`,
          category: "suggestion",
          area: "Content",
          title: `No quantified results in "${exp.jobTitle}"`,
          description: "Add numbers: %, $, team size, time saved. Metrics boost ATS scoring by 20-40%.",
          currentValue: descs.join("\n"),
          aiRewriteAvailable: true,
          autoFixAvailable: false,
        });
        deductions += 5;
      }
    });
  }

  // ── 6. Skills check ──
  const skills = (resume.skills?.featuredSkills || []).filter((s: any) => s.skill);
  if (skills.length < 3) {
    issues.push({
      id: "few-skills",
      category: "warning",
      area: "Content",
      title: `Only ${skills.length} skill(s) listed`,
      description: "ATS keyword matching relies on a robust skills section. Aim for 6-12 skills.",
      aiRewriteAvailable: false,
      autoFixAvailable: false,
    });
    deductions += 8;
  }

  // ── 7. Design checks ──
  if (ts.design?.shadowLevel && ts.design.shadowLevel !== "none") {
    issues.push({
      id: "design-shadows",
      category: "suggestion",
      area: "Design",
      title: "Box shadows detected",
      description: "Shadows don't render in ATS and can cause parsing artifacts.",
      suggestedFix: "Remove shadows for ATS",
      aiRewriteAvailable: false,
      autoFixAvailable: true,
    });
    deductions += 3;
  }

  if (ts.content?.showPhoto) {
    issues.push({
      id: "design-photo",
      category: "warning",
      area: "Design",
      title: "Photo/headshot included",
      description: "Most ATS cannot parse images, and photos are discouraged in US/UK markets.",
      suggestedFix: "Remove photo",
      aiRewriteAvailable: false,
      autoFixAvailable: true,
    });
    deductions += 5;
  }

  if (ts.design?.background?.type === "gradient") {
    issues.push({
      id: "design-gradient",
      category: "suggestion",
      area: "Design",
      title: "Gradient background",
      description: "Gradients don't render in ATS and waste ink on prints.",
      suggestedFix: "Switch to solid white background",
      aiRewriteAvailable: false,
      autoFixAvailable: true,
    });
    deductions += 3;
  }

  // ── 8. Section heading checks ──
  const accentTreatment = ts.design?.accentTreatment || "none";
  if (accentTreatment === "corner-badge" || accentTreatment === "sidebar-bar") {
    issues.push({
      id: "heading-style",
      category: "suggestion",
      area: "Design",
      title: "Decorative section headings",
      description: "Fancy heading styles can confuse ATS parsers. Simple underline or plain text is safest.",
      suggestedFix: "Switch to simple underline",
      aiRewriteAvailable: false,
      autoFixAvailable: true,
    });
    deductions += 3;
  }

  const score = Math.max(0, Math.min(100, 100 - deductions));

  return { score, issues };
}

// ─── Score Badge Component ──────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "emerald" : score >= 60 ? "amber" : "red";
  const label = score >= 80 ? "Good" : score >= 60 ? "Needs Work" : "Poor";
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={radius} fill="none"
            stroke={color === "emerald" ? "#10b981" : color === "amber" ? "#f59e0b" : "#ef4444"}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-gray-900">{score}</span>
          <span className="text-[9px] font-medium text-gray-500">/ 100</span>
        </div>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
        color === "emerald" ? "bg-emerald-100 text-emerald-700"
        : color === "amber" ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"
      }`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main ATS Optimizer Component ───────────────────────────
export const ATSOptimizer = () => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(selectResume);
  const ts = useAppSelector(selectTemplateSettings);
  const [scanResult, setScanResult] = useState<{ score: number; issues: ATSIssue[] } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [appliedAll, setAppliedAll] = useState(false);

  // ── Run scan ──
  const runScan = useCallback(() => {
    setIsScanning(true);
    setAppliedAll(false);
    setTimeout(() => {
      const result = runATSScan(resume, ts);
      setScanResult(result);
      setIsScanning(false);
    }, 800); // Brief delay for animation
  }, [resume, ts]);

  // ── Apply all auto-fixes ──
  const applyAllAutoFixes = useCallback(() => {
    // Layout: single column
    dispatch(updateLayout({ columns: 1, fullWidth: false }));
    // Typography: safe font, good size
    dispatch(updateTypography({
      body: { fontFamily: "Calibri", fontSize: 11, lineHeight: 1.5 },
      heading: { fontFamily: "Calibri", fontSize: 13, lineHeight: 1.3 },
      name: { fontFamily: "Calibri", fontSize: 26, fontWeight: 700, textTransform: "uppercase" },
      letterSpacing: 0,
    }));
    // Design: clean, no frills
    dispatch(updateDesign({
      shadowLevel: "none",
      cardStyle: "none",
      borderStyle: "hairline",
      accentTreatment: "underline",
      sectionDivider: "line",
      background: { type: "solid" },
      colors: {
        primary: "#1a1a1a",
        text: "#1a1a1a",
        background: "#ffffff",
        secondary: "#333333",
        accent: "#1a1a1a",
        muted: "#666666",
        link: "#0066cc",
        sidebarBg: "#f5f5f5",
        sidebarText: "#1a1a1a",
        headerBg: "#ffffff",
        headerText: "#1a1a1a",
      },
    }));
    // Content: no photo, simple bullets
    dispatch(updateContent({
      showPhoto: false,
      bulletStyle: "circle",
      skillBarStyle: "chips",
      iconStyle: "none" as any,
      dateFormat: "month-year",
      datePlacement: "right",
    }));
    // Print
    dispatch(updatePrint({ optimized: true, removeShadows: true, removeAnimations: true, embedFonts: true }));

    setAppliedAll(true);

    // Re-scan
    setTimeout(() => {
      const result = runATSScan(resume, ts);
      setScanResult(result);
    }, 300);
  }, [dispatch, resume, ts]);

  // ── Auto-fix single issue ──
  const autoFix = useCallback((issue: ATSIssue) => {
    switch (issue.id) {
      case "layout-columns":
        dispatch(updateLayout({ columns: 1 }));
        break;
      case "font-unusual":
        dispatch(updateTypography({ body: { fontFamily: "Calibri", fontSize: 11, lineHeight: 1.5 } }));
        break;
      case "font-size-small":
        dispatch(updateTypography({ body: { fontFamily: ts.typography?.body?.fontFamily || "Calibri", fontSize: 11, lineHeight: 1.5 } }));
        break;
      case "design-shadows":
        dispatch(updateDesign({ shadowLevel: "none" }));
        break;
      case "design-photo":
        dispatch(updateContent({ showPhoto: false }));
        break;
      case "design-gradient":
        dispatch(updateDesign({ background: { type: "solid" } }));
        break;
      case "heading-style":
        dispatch(updateDesign({ accentTreatment: "underline" }));
        break;
    }
    // Mark fixed in scan results
    if (scanResult) {
      setScanResult({
        ...scanResult,
        issues: scanResult.issues.map(i => i.id === issue.id ? { ...i, fixed: true } : i),
      });
    }
  }, [dispatch, ts, scanResult]);

  // ── AI rewrite ──
  const requestAIRewrite = useCallback(async (issue: ATSIssue) => {
    if (!scanResult) return;

    // Mark loading
    setScanResult({
      ...scanResult,
      issues: scanResult.issues.map(i => i.id === issue.id ? { ...i, loadingAI: true } : i),
    });

    try {
      const data = await fetchAPI<{ success: boolean; data?: string; error?: string }>("/api/ai/improve", {
        method: "POST",
        body: JSON.stringify({
          section: issue.area.toLowerCase(),
          content: issue.currentValue || "",
        }),
      });

      if (data.success && data.data) {
        setScanResult(prev => prev ? {
          ...prev,
          issues: prev.issues.map(i => i.id === issue.id ? { ...i, aiRewrite: data.data, loadingAI: false } : i),
        } : null);
      } else {
        throw new Error(data.error || "AI rewrite failed");
      }
    } catch (err) {
      console.error("AI rewrite error:", err);
      setScanResult(prev => prev ? {
        ...prev,
        issues: prev.issues.map(i => i.id === issue.id ? { ...i, loadingAI: false } : i),
      } : null);
    }
  }, [scanResult]);

  // ── Accept AI rewrite ──
  const acceptAIRewrite = useCallback((issue: ATSIssue) => {
    if (!issue.aiRewrite) return;

    if (issue.id === "no-summary" || issue.id === "short-summary") {
      dispatch(changeProfile({ field: "summary", value: issue.aiRewrite }));
    } else if (issue.id.startsWith("work-")) {
      // Extract index from issue id
      const match = issue.id.match(/\d+/);
      if (match) {
        const idx = parseInt(match[0]);
        const bullets = issue.aiRewrite.split("\n").filter(Boolean).map(b => b.replace(/^[•\-–]\s*/, "").trim());
        dispatch(changeWorkExperiences({ idx, field: "descriptions", value: bullets }));
      }
    }

    // Mark fixed
    if (scanResult) {
      setScanResult({
        ...scanResult,
        issues: scanResult.issues.map(i => i.id === issue.id ? { ...i, fixed: true } : i),
      });
    }
  }, [dispatch, scanResult]);

  const categoryIcon = (cat: string) => cat === "critical" ? "🔴" : cat === "warning" ? "🟡" : "🔵";
  const categoryBg = (cat: string) => cat === "critical" ? "border-red-200 bg-red-50/50" : cat === "warning" ? "border-amber-200 bg-amber-50/50" : "border-blue-200 bg-blue-50/50";

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-sm font-bold text-gray-900">🎯 ATS Score Optimizer</h3>
        <p className="mt-1 text-[11px] text-gray-500">
          Scan your resume for ATS compatibility issues and fix them instantly.
        </p>
      </div>

      {/* Scan / Apply All Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={runScan}
          disabled={isScanning}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 transition-all hover:bg-blue-100 disabled:opacity-50"
        >
          {isScanning ? (
            <><span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" /> Scanning...</>
          ) : (
            <>🔍 Scan Resume</>
          )}
        </button>
        <button
          type="button"
          onClick={applyAllAutoFixes}
          className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all ${
            appliedAll
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          {appliedAll ? "✅ Applied!" : "⚡ Apply All ATS Fixes"}
        </button>
      </div>

      {/* Results */}
      {scanResult && (
        <div className="flex flex-col gap-4">
          {/* Score */}
          <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4">
            <ScoreBadge score={scanResult.score} />
            <div className="ml-5">
              <p className="text-xs font-semibold text-gray-900">ATS Compatibility Score</p>
              <p className="mt-1 text-[10px] text-gray-500">
                {scanResult.issues.filter(i => !i.fixed).length} issue(s) found · {scanResult.issues.filter(i => i.fixed).length} fixed
              </p>
              <div className="mt-2 flex gap-3 text-[10px]">
                <span className="text-red-600 font-medium">🔴 {scanResult.issues.filter(i => i.category === "critical" && !i.fixed).length} Critical</span>
                <span className="text-amber-600 font-medium">🟡 {scanResult.issues.filter(i => i.category === "warning" && !i.fixed).length} Warnings</span>
                <span className="text-blue-600 font-medium">🔵 {scanResult.issues.filter(i => i.category === "suggestion" && !i.fixed).length} Tips</span>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="flex flex-col gap-2">
            {scanResult.issues.map((issue) => (
              <div
                key={issue.id}
                className={`rounded-lg border p-3 transition-all ${
                  issue.fixed ? "border-emerald-200 bg-emerald-50/50 opacity-60" : categoryBg(issue.category)
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{issue.fixed ? "✅" : categoryIcon(issue.category)}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{issue.area}</span>
                    </div>
                    <p className={`mt-0.5 text-xs font-semibold ${issue.fixed ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {issue.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-500">{issue.description}</p>
                  </div>

                  {/* Action buttons */}
                  {!issue.fixed && (
                    <div className="flex flex-col gap-1 shrink-0">
                      {issue.autoFixAvailable && (
                        <button
                          type="button"
                          onClick={() => autoFix(issue)}
                          className="rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-600 transition-colors"
                        >
                          Auto Fix
                        </button>
                      )}
                      {issue.aiRewriteAvailable && !issue.aiRewrite && (
                        <button
                          type="button"
                          onClick={() => requestAIRewrite(issue)}
                          disabled={issue.loadingAI}
                          className="rounded-md bg-violet-500 px-2 py-1 text-[10px] font-bold text-white hover:bg-violet-600 transition-colors disabled:opacity-50"
                        >
                          {issue.loadingAI ? "Writing..." : "🤖 AI Rewrite"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* AI Rewrite Preview */}
                {issue.aiRewrite && !issue.fixed && (
                  <div className="mt-2 rounded-md border border-violet-200 bg-violet-50 p-2">
                    <p className="text-[10px] font-bold text-violet-700 mb-1">✨ AI Suggestion:</p>
                    <p className="text-[10px] text-violet-900 whitespace-pre-line">{issue.aiRewrite}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => acceptAIRewrite(issue)}
                        className="rounded-md bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white hover:bg-emerald-600"
                      >
                        ✓ Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setScanResult(prev => prev ? {
                            ...prev,
                            issues: prev.issues.map(i => i.id === issue.id ? { ...i, aiRewrite: undefined } : i),
                          } : null);
                        }}
                        className="rounded-md bg-gray-200 px-3 py-1 text-[10px] font-bold text-gray-600 hover:bg-gray-300"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* All clear message */}
          {scanResult.issues.every(i => i.fixed) && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-lg">🎉</p>
              <p className="text-xs font-bold text-emerald-700">All issues resolved!</p>
              <p className="mt-1 text-[10px] text-emerald-600">Your resume is ATS-optimized and ready to submit.</p>
            </div>
          )}
        </div>
      )}

      {/* Info box */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="text-[10px] font-semibold text-gray-700">What ATS checks include:</p>
        <ul className="mt-1.5 space-y-0.5 text-[10px] text-gray-500">
          <li>• Single-column layout compatibility</li>
          <li>• Standard ATS-safe font families</li>
          <li>• Proper font sizing (10-12pt)</li>
          <li>• Professional summary presence & length</li>
          <li>• Contact information completeness</li>
          <li>• Action verbs & quantified achievements</li>
          <li>• Skills section keyword density</li>
          <li>• No photos/images (US/UK standard)</li>
          <li>• Clean design without parsing artifacts</li>
        </ul>
      </div>
    </div>
  );
};
