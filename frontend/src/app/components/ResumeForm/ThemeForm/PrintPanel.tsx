"use client";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectTemplateSettings, updatePrint, updateAccessibility } from "lib/redux/settingsSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { useCallback } from "react";
import { ATSOptimizer } from "./ATSOptimizer";

// ─── Export Helpers ─────────────────────────────────────────

/** Export as HTML — packages the current preview into a standalone HTML file */
function exportAsHTML(resume: any, ts: any) {
  const previewEl = document.querySelector(".builder-preview-glass .min-h-0");
  const htmlContent = previewEl?.innerHTML || "<p>No preview available</p>";
  
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.profile.name || "Resume"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${ts.typography?.body?.fontFamily || "Inter"}, system-ui, sans-serif; color: #1e293b; background: #fff; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: "text/html" });
  downloadBlob(blob, `${resume.profile.name || "resume"}.html`);
}

/** Export as JSON Resume (standard schema) */
function exportAsJSON(resume: any) {
  const jsonResume = {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: resume.profile.name || "",
      label: resume.profile.headline || "",
      email: resume.profile.email || "",
      phone: resume.profile.phone || "",
      url: resume.profile.url || "",
      summary: resume.profile.summary || "",
      location: { address: resume.profile.location || "" },
      profiles: resume.profiles || [],
    },
    work: (resume.workExperiences || []).map((w: any) => ({
      name: w.company || "",
      position: w.jobTitle || "",
      startDate: w.date || "",
      summary: (w.descriptions || []).join("\n"),
    })),
    education: (resume.educations || []).map((e: any) => ({
      institution: e.school || "",
      area: e.degree || "",
      startDate: e.date || "",
      score: e.gpa || "",
    })),
    skills: (resume.skills?.featuredSkills || [])
      .filter((s: any) => s.skill)
      .map((s: any) => ({ name: s.skill, level: `${s.rating}/5` })),
    projects: (resume.projects || []).map((p: any) => ({
      name: p.project || "",
      description: (p.descriptions || []).join("\n"),
      startDate: p.date || "",
    })),
  };
  
  const blob = new Blob([JSON.stringify(jsonResume, null, 2)], { type: "application/json" });
  downloadBlob(blob, `${resume.profile.name || "resume"}.json`);
}

/** Export as Plain Text (ATS-friendly) */
function exportAsPlainText(resume: any) {
  const lines: string[] = [];
  const hr = "═".repeat(50);
  
  // Header
  lines.push(resume.profile.name?.toUpperCase() || "YOUR NAME");
  if (resume.profile.headline) lines.push(resume.profile.headline);
  const contact = [resume.profile.email, resume.profile.phone, resume.profile.location].filter(Boolean).join(" | ");
  if (contact) lines.push(contact);
  if (resume.profile.url) lines.push(resume.profile.url);
  lines.push("");

  // Summary
  if (resume.profile.summary) {
    lines.push(hr);
    lines.push("SUMMARY");
    lines.push(hr);
    lines.push(resume.profile.summary);
    lines.push("");
  }

  // Experience
  if (resume.workExperiences?.length && resume.workExperiences[0]?.company) {
    lines.push(hr);
    lines.push("EXPERIENCE");
    lines.push(hr);
    for (const exp of resume.workExperiences) {
      lines.push(`${exp.jobTitle || ""} — ${exp.company || ""}`);
      if (exp.date) lines.push(exp.date);
      for (const d of (exp.descriptions || [])) {
        lines.push(`  • ${d}`);
      }
      lines.push("");
    }
  }

  // Education
  if (resume.educations?.length && resume.educations[0]?.school) {
    lines.push(hr);
    lines.push("EDUCATION");
    lines.push(hr);
    for (const edu of resume.educations) {
      lines.push(`${edu.degree || ""} — ${edu.school || ""}`);
      if (edu.date) lines.push(edu.date);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
      lines.push("");
    }
  }

  // Projects
  if (resume.projects?.length && resume.projects[0]?.project) {
    lines.push(hr);
    lines.push("PROJECTS");
    lines.push(hr);
    for (const proj of resume.projects) {
      lines.push(proj.project || "");
      if (proj.date) lines.push(proj.date);
      for (const d of (proj.descriptions || [])) {
        lines.push(`  • ${d}`);
      }
      lines.push("");
    }
  }

  // Skills
  const skills = (resume.skills?.featuredSkills || []).filter((s: any) => s.skill).map((s: any) => s.skill);
  if (skills.length > 0) {
    lines.push(hr);
    lines.push("SKILLS");
    lines.push(hr);
    lines.push(skills.join(" | "));
    lines.push("");
  }

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  downloadBlob(blob, `${resume.profile.name || "resume"}.txt`);
}

/** Export as DOCX (using XML-based DOCX format) */
function exportAsDOCX(resume: any) {
  // Build simple WordprocessingML
  const escXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  const para = (text: string, bold = false, size = 22) => `
    <w:p><w:pPr><w:rPr>${bold ? "<w:b/>" : ""}<w:sz w:val="${size}"/></w:rPr></w:pPr>
    <w:r><w:rPr>${bold ? "<w:b/>" : ""}<w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve">${escXml(text)}</w:t></w:r></w:p>`;

  const bullet = (text: string) => `
    <w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>
    <w:r><w:rPr><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">${escXml(text)}</w:t></w:r></w:p>`;

  const hr = `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="999999"/></w:pBdr></w:pPr></w:p>`;

  let body = "";
  
  // Name
  body += para(resume.profile.name?.toUpperCase() || "YOUR NAME", true, 36);
  if (resume.profile.headline) body += para(resume.profile.headline, false, 24);
  const contact = [resume.profile.email, resume.profile.phone, resume.profile.location].filter(Boolean).join(" | ");
  if (contact) body += para(contact, false, 20);
  body += hr;

  // Summary
  if (resume.profile.summary) {
    body += para("SUMMARY", true, 26);
    body += para(resume.profile.summary);
    body += hr;
  }

  // Experience
  if (resume.workExperiences?.length && resume.workExperiences[0]?.company) {
    body += para("EXPERIENCE", true, 26);
    for (const exp of resume.workExperiences) {
      body += para(`${exp.jobTitle || ""} — ${exp.company || ""}`, true, 22);
      if (exp.date) body += para(exp.date, false, 20);
      for (const d of (exp.descriptions || [])) {
        body += bullet(d);
      }
    }
    body += hr;
  }

  // Education
  if (resume.educations?.length && resume.educations[0]?.school) {
    body += para("EDUCATION", true, 26);
    for (const edu of resume.educations) {
      body += para(`${edu.degree || ""} — ${edu.school || ""}`, true, 22);
      if (edu.date) body += para(edu.date, false, 20);
      if (edu.gpa) body += para(`GPA: ${edu.gpa}`, false, 20);
    }
    body += hr;
  }

  // Skills
  const skills = (resume.skills?.featuredSkills || []).filter((s: any) => s.skill).map((s: any) => s.skill);
  if (skills.length > 0) {
    body += para("SKILLS", true, 26);
    body += para(skills.join(" • "));
  }

  // Wrap in minimal DOCX XML
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}</w:body>
</w:document>`;

  // Use JSZip-like manual construction — simpler: just create the DOCX as a flat XML (Word accepts it)
  const flatOpcXml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml"
  xmlns:wx="http://schemas.microsoft.com/office/word/2003/auxHint">
  <w:body>${body}</w:body>
</w:wordDocument>`;

  const blob = new Blob([flatOpcXml], { type: "application/vnd.ms-word" });
  downloadBlob(blob, `${resume.profile.name || "resume"}.doc`);
}

/** Export as PNG — captures the preview panel */
async function exportAsPNG(resume: any) {
  const previewEl = document.querySelector(".builder-preview-glass") as HTMLElement;
  if (!previewEl) {
    alert("Preview not available for capture");
    return;
  }

  try {
    // Use html2canvas-style approach via canvas API
    const canvas = document.createElement("canvas");
    const rect = previewEl.getBoundingClientRect();
    const scale = 2; // 2x for retina
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Convert HTML to SVG foreignObject, then render to canvas
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${previewEl.outerHTML}
          </div>
        </foreignObject>
      </svg>`;

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    // Also provide SVG download directly (more reliable)
    downloadBlob(svgBlob, `${resume.profile.name || "resume"}.svg`);
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: export as SVG only
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${previewEl.innerHTML}
        </div>
      </foreignObject>
    </svg>`;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    downloadBlob(blob, `${resume.profile.name || "resume"}.svg`);
  }
}

/** Download helper */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Component ──────────────────────────────────────────────

export const PrintPanel = () => {
  const dispatch = useAppDispatch();
  const ts = useAppSelector(selectTemplateSettings);
  const resume = useAppSelector(selectResume);
  const print = ts.print || {};
  const a11y = ts.accessibility || {};

  /** Print only the resume preview in a clean window */
  const printResume = useCallback(() => {
    // Try to get the HTML template preview content
    const previewEl =
      document.querySelector("#panel-preview .bg-white.shadow-lg") ||
      document.querySelector("#panel-preview .bg-white") ||
      document.querySelector(".builder-preview-glass .min-h-0");

    if (!previewEl) {
      // Fallback: use the browser's native print with @media print CSS
      window.print();
      return;
    }

    // Collect all stylesheets from the current page
    const stylesheets = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules || [])
            .map((rule) => rule.cssText)
            .join("\n");
        } catch {
          // Cross-origin stylesheets can't be read
          return sheet.href
            ? `@import url("${sheet.href}");`
            : "";
        }
      })
      .join("\n");

    // Get the font family from template settings
    const fontFamily = ts.typography?.body?.fontFamily || "Inter";

    // Build a clean HTML document for printing
    const printHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.profile.name || "Resume"} - Print</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: Letter;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 8.5in;
      background: #ffffff;
      color: #171717;
      font-family: "${fontFamily}", system-ui, -apple-system, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      overflow: visible;
    }
    body {
      margin: 0 auto;
      padding: 0;
    }
    /* Inject resume-specific styles */
    ${stylesheets}
    /* Print overrides */
    @media print {
      html, body {
        width: 100%;
        background: #ffffff !important;
      }
      * {
        animation: none !important;
        transition: none !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  ${previewEl.innerHTML}
  <script>
    // Auto-print and close after printing
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.onafterprint = function() { window.close(); };
      }, 400);
    };
  <\/script>
</body>
</html>`;

    const printWindow = window.open("", "_blank", "width=850,height=1100");
    if (printWindow) {
      printWindow.document.write(printHTML);
      printWindow.document.close();
    } else {
      // Popup blocked — fallback to native print with @media print CSS
      window.print();
    }
  }, [resume, ts]);

  const handleExport = useCallback((format: string) => {
    switch (format) {
      case "PDF":
        printResume();
        break;
      case "HTML":
        exportAsHTML(resume, ts);
        break;
      case "JSON Resume":
        exportAsJSON(resume);
        break;
      case "Plain Text":
        exportAsPlainText(resume);
        break;
      case "DOCX":
        exportAsDOCX(resume);
        break;
      case "PNG / SVG":
        exportAsPNG(resume);
        break;
    }
  }, [resume, ts, printResume]);

  return (
    <div className="flex flex-col gap-5">
      {/* ─── Print Optimization ──────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Print Optimization" />
        <div className="mt-2 flex flex-col gap-2.5">
          {[
            { key: "optimized" as const, label: "Print-optimized mode", desc: "Apply all print-friendly rules at once" },
            { key: "grayscale" as const, label: "Grayscale mode", desc: "Convert to grayscale for B&W printing" },
            { key: "removeShadows" as const, label: "Remove shadows", desc: "Strip box-shadows for cleaner print" },
            { key: "removeAnimations" as const, label: "Remove animations", desc: "Disable all CSS animations" },
            { key: "embedFonts" as const, label: "Embed fonts", desc: "Include fonts for consistent look" },
          ].map(({ key, label, desc }) => (
            <label key={key} className="group flex items-start gap-2.5 rounded-md px-1 py-0.5 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={print[key] ?? (key === "removeShadows" || key === "removeAnimations" || key === "embedFonts")}
                onChange={(e) => dispatch(updatePrint({ [key]: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-500"
              />
              <div>
                <span className="text-xs font-medium text-gray-800">{label}</span>
                <p className="text-[10px] text-gray-500">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ─── Quick Print ─────────────────── */}
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <InputGroupWrapper label="Quick Actions" />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => printResume()}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:border-gray-400 hover:shadow-md"
          >
            🖨️ Print Resume
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(updatePrint({ optimized: true, grayscale: false, removeShadows: true, removeAnimations: true, embedFonts: true }));
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100"
          >
            ⚡ Apply All Print Rules
          </button>
        </div>
      </div>

      {/* ─── Export Formats ──────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Export Formats" />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { label: "PDF", desc: "Print-ready document", icon: "📄" },
            { label: "HTML", desc: "Single-file web page", icon: "🌐" },
            { label: "JSON Resume", desc: "Machine-readable data", icon: "📋" },
            { label: "Plain Text", desc: "ATS copy-paste friendly", icon: "📝" },
            { label: "DOCX", desc: "Word format for ATS", icon: "📃" },
            { label: "PNG / SVG", desc: "Image export", icon: "🖼️" },
          ].map((fmt) => (
            <button
              key={fmt.label}
              type="button"
              onClick={() => handleExport(fmt.label)}
              className="group flex items-start gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-2 text-left transition-all hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50 active:scale-[0.98]"
            >
              <span className="text-lg transition-transform group-hover:scale-110">{fmt.icon}</span>
              <div>
                <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-700">{fmt.label}</span>
                <p className="text-[10px] text-gray-500">{fmt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Accessibility ───────────────── */}
      <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3">
        <InputGroupWrapper label="Accessibility (a11y)" />
        <div className="mt-2 flex flex-col gap-2.5">
          {[
            { key: "highContrast" as const, label: "High contrast mode", desc: "Increase text contrast for readability" },
            { key: "largeText" as const, label: "Large text mode", desc: "Bump font sizes by ~20% globally" },
            { key: "reduceMotion" as const, label: "Reduce motion", desc: "Disable transitions and animations" },
          ].map(({ key, label, desc }) => (
            <label key={key} className="group flex items-start gap-2.5 rounded-md px-1 py-0.5 hover:bg-purple-100/50">
              <input
                type="checkbox"
                checked={a11y[key] ?? false}
                onChange={(e) => dispatch(updateAccessibility({ [key]: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-purple-500"
              />
              <div>
                <span className="text-xs font-medium text-gray-800">{label}</span>
                <p className="text-[10px] text-gray-500">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ─── ATS Optimizer (Full Scanner + AI) ─── */}
      <ATSOptimizer />

      {/* ─── Print CSS Info ──────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Print CSS Rules" />
        <pre className="mt-2 overflow-x-auto rounded-md bg-gray-900 p-2.5 text-[10px] leading-relaxed text-gray-300">
{`@media print {
  /* Hide interactive elements */
  button, nav, .no-print { display: none !important; }

  /* Set page size */
  @page { size: ${ts.page.format === "a4" ? "A4" : "Letter"}; margin: ${ts.page.marginX}mm ${ts.page.marginY}mm; }

  /* Ensure accurate colors */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

  /* Remove shadows */
  ${print.removeShadows ? "* { box-shadow: none !important; }" : ""}

  /* Page breaks */
  section { page-break-inside: avoid; }
  h2, h3 { page-break-after: avoid; }
}`}
        </pre>
      </div>
    </div>
  );
};
