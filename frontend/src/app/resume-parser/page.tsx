"use client";
import { useState, useEffect, useCallback } from "react";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { fetchAPI } from "lib/api";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { saveStateToLocalStorage, getHasUsedAppBefore } from "lib/redux/local-storage";
import { initialSettings } from "lib/redux/settingsSlice";
import type { ShowForm } from "lib/redux/settingsSlice";
import { deepClone } from "lib/deep-clone";
import { useRouter } from "next/navigation";
import { ResumeTable } from "resume-parser/ResumeTable";
import dynamic from "next/dynamic";
import "./parser.css";

const ResumeParserAlgorithmArticle = dynamic(
  () =>
    import("resume-parser/ResumeParserAlgorithmArticle").then(
      (mod) => mod.ResumeParserAlgorithmArticle
    ),
  { ssr: false }
);

const RESUME_EXAMPLES = [
  {
    fileUrl: "resume-example/laverne-resume.pdf",
    label: "University Sample",
    source: "University of La Verne Career Center",
  },
  {
    fileUrl: "resume-example/openresume-resume.pdf",
    label: "ResumeMaker Sample",
    source: "Built with ResumeMaker builder",
  },
];

export default function ResumeParser() {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState(RESUME_EXAMPLES[0]!.fileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const [aiParsing, setAiParsing] = useState(false);
  const [aiResult, setAiResult] = useState<{ resume: any; atsScore: number; atsAnalysis: string[] } | null>(null);

  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const heuristicResume = extractResumeFromSections(sections);
  const resume = aiResult ? aiResult.resume : heuristicResume;

  useEffect(() => {
    async function loadPdf() {
      setIsLoading(true);
      try {
        const { readPdf } = await import("lib/parse-resume-from-pdf/read-pdf");
        const items = await readPdf(fileUrl);
        setTextItems(items);
        
        if (items && items.length > 0) {
          setAiParsing(true);
          const rawText = items.map((item: any) => item.text).join(" ");
          try {
            const result: any = await fetchAPI('/api/ai/parse', {
              method: 'POST',
              body: JSON.stringify({ text: rawText }),
            });
            if (result.success && result.data) {
              setAiResult(result.data);
            }
          } catch (err) {
            console.error("AI parsing failed:", err);
          }
          setAiParsing(false);
        }
      } catch (e) {
        console.error("PDF parse error:", e);
        setTextItems([]);
      }
      setIsLoading(false);
    }
    loadPdf();
  }, [fileUrl]);

  /* ── File handling ─────────────────────────────── */
  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".pdf")) return;
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setUploadedFileName(file.name);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  /* ── Use in Builder ────────────────────────────── */
  const handleUseInBuilder = useCallback(() => {
    const parsedResume = resume;
    const settings = deepClone(initialSettings);
    if (getHasUsedAppBefore()) {
      const sections = Object.keys(settings.formToShow) as ShowForm[];
      const sectionMap: Partial<Record<ShowForm, boolean>> = {
        workExperiences: parsedResume.workExperiences.length > 0,
        educations: parsedResume.educations.length > 0,
        projects: parsedResume.projects.length > 0,
        skills: parsedResume.skills.descriptions.length > 0,
        custom: parsedResume.custom.descriptions.length > 0,
      };
      for (const sec of sections) {
        if (sec in sectionMap) settings.formToShow[sec] = sectionMap[sec]!;
      }
    }
    saveStateToLocalStorage({ resume: parsedResume, settings });
    router.push("/resume-builder");
  }, [resume, router]);

  return (
    <div className="parser-page">
      {/* Ambient orbs */}
      <div className="parser-orb parser-orb-1" />
      <div className="parser-orb parser-orb-2" />

      {/* Hero */}
      <header className="parser-hero parser-fade-in">
        <span className="parser-hero-badge">
          <span className="pulse" />
          AI-Powered Parser
        </span>
        <h1>
          Resume <span className="gradient-text">Parser</span> Playground
        </h1>
        <p>
          Upload any resume PDF and watch our parser extract structured data in real-time.
          See exactly what an ATS sees — then import directly into the builder.
        </p>
      </header>

      {/* Main Content */}
      <div className="relative z-[1] mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">

          {/* ── Left: PDF Preview + Upload ─────────────── */}
          <div className="flex flex-col gap-5 parser-fade-in parser-fade-in-delay-1">

            {/* Example selector */}
            <div className="flex gap-3">
              {RESUME_EXAMPLES.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setFileUrl(example.fileUrl); setUploadedFileName(""); }}
                  className={`parser-example-card flex-1 ${example.fileUrl === fileUrl && !uploadedFileName ? "active" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="card-num">{idx + 1}</span>
                    <div className="text-left">
                      <h3>{example.label}</h3>
                      <p>{example.source}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* PDF Preview */}
            <div className="parser-glass overflow-hidden" style={{ height: "600px" }}>
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-200 border-t-indigo-600" />
                    <p className="text-sm font-medium text-gray-500">Parsing PDF…</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={`${fileUrl}#navpanes=0&toolbar=0`}
                  className="parser-pdf-frame"
                  title="Resume PDF Preview"
                />
              )}
            </div>

            {/* Upload Area */}
            <div
              className={`parser-upload-area ${isDragOver ? "dragover" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
            >
              <div className="upload-icon">📄</div>
              {uploadedFileName ? (
                <div>
                  <p className="text-sm font-bold text-gray-800">{uploadedFileName}</p>
                  <p className="mt-1 text-xs text-gray-500">File loaded successfully</p>
                  <button
                    type="button"
                    onClick={() => { setUploadedFileName(""); setFileUrl(RESUME_EXAMPLES[0]!.fileUrl); }}
                    className="mt-2 text-xs font-semibold text-red-500 hover:text-red-600"
                  >
                    ✕ Remove & Reset
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Drop your resume PDF here, or
                  </p>
                  <label className="browse-btn">
                    📂 Browse File
                    <input type="file" accept=".pdf" className="sr-only" onChange={onInputChange} />
                  </label>
                  <p className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-400">
                    🔒 Your file never leaves your browser
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────── */}
          <div className="flex flex-col gap-5 parser-fade-in parser-fade-in-delay-2">

            {/* Results Header */}
            <div className="parser-results-header">
              <div className="icon-box">📊</div>
              <div className="flex-1">
                <h2>Parsing Results</h2>
              </div>
              <span className="count-badge">
                {textItems.length} text items · {lines.length} lines
              </span>
            </div>

            {/* Results */}
            <div className="parser-glass p-5" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
              {aiParsing && (
                <div className="mb-4 rounded-xl bg-indigo-50 p-4 text-center">
                  <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
                  <p className="text-sm font-semibold text-indigo-800">AI is intelligently structuring your resume...</p>
                </div>
              )}
              
              <ResumeTable resume={resume} aiScore={aiResult ? aiResult.atsScore : undefined} />
              
              {aiResult && !aiParsing && (
                <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-emerald-900">ATS Score Analysis</h3>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-xl font-black text-white shadow-lg">
                      {aiResult.atsScore}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-emerald-800">Score Breakdown & Feedback:</p>
                    <ul className="list-inside list-disc space-y-1 text-xs text-emerald-700">
                      {aiResult.atsAnalysis.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Use in Builder CTA */}
              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 p-6 text-center">
                <p className="text-sm font-bold text-gray-800">Happy with the results?</p>
                <p className="text-xs text-gray-500">Import this parsed data directly into the Resume Builder</p>
                <button type="button" onClick={handleUseInBuilder} className="parser-cta-btn">
                  🚀 Use in Builder
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Algorithm Deep Dive Toggle */}
            <button
              type="button"
              onClick={() => setShowAlgorithm(!showAlgorithm)}
              className="parser-algo-toggle"
            >
              <span className="flex items-center gap-2">
                <span>🧠</span>
                Algorithm Deep Dive
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  4 Steps
                </span>
              </span>
              <span className={`chevron ${showAlgorithm ? "open" : ""}`}>▼</span>
            </button>

            {showAlgorithm && (
              <div className="parser-glass p-6 parser-fade-in">
                <ResumeParserAlgorithmArticle
                  textItems={textItems}
                  lines={lines}
                  sections={sections}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
