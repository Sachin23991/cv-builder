"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
const TemplatePreview = dynamic(() => import("./TemplatePreview").then((mod) => mod.TemplatePreview), { ssr: false });
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings, selectTemplateSettings } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const [contentHeight, setContentHeight] = useState(1123);
  const previewRef = useRef<HTMLDivElement>(null);

  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const templateSettings = useAppSelector(selectTemplateSettings);
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  // Use HTML preview for modern-html and custom-html templates
  // Only legacy-default (if ever selected) falls back to PDF iframe
  const useHTMLPreview = templateSettings.activeTemplate !== "legacy-default";

  useEffect(() => {
    if (!previewRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(Math.max(1123, entry.contentRect.height));
      }
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <SuppressResumePDFErrorMessage />
      <div className="relative flex h-full min-h-0 w-full justify-center print:block print:h-auto print:overflow-visible">
        <div className="relative flex min-h-0 w-full min-w-0 flex-col print:block print:h-auto print:overflow-visible">
          <section className="h-full min-h-0 w-full overflow-auto p-4 pb-24 print:h-auto print:overflow-visible print:p-0">
            {useHTMLPreview ? (
              <div className="h-full w-full overflow-auto bg-gray-100 p-4 print:h-auto print:overflow-visible print:bg-transparent print:p-0">
                <div
                  style={{
                    width: `${794 * scale}px`,
                    height: `${contentHeight * scale}px`,
                  }}
                  className="mx-auto flex-shrink-0 transition-all duration-300 ease-in-out print:w-full print:h-auto"
                >
                  <div
                    style={{
                      width: '794px',
                      minHeight: '1123px',
                      transform: `scale(${scale})`,
                    }}
                    className="origin-top-left bg-white shadow-lg print:shadow-none print:transform-none"
                  >
                    <div ref={previewRef} className="h-full w-full">
                      <TemplatePreview />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ResumeIframeCSR
                documentSize={settings.documentSize}
                scale={scale}
                enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
              >
                <ResumePDF
                  resume={resume}
                  settings={settings}
                  isPDF={DEBUG_RESUME_PDF_FLAG}
                />
              </ResumeIframeCSR>
            )}
          </section>
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={document}
            fileName={resume.profile.name + " - Resume"}
          />
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};
