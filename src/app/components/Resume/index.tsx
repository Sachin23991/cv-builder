"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
const ResumePDF = dynamic(() => import("components/Resume/ResumePDF").then((mod) => mod.ResumePDF), { ssr: false });
const TemplatePreview = dynamic(() => import("./TemplatePreview").then((mod) => mod.TemplatePreview), { ssr: false });
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings, selectTemplateSettings } from "lib/redux/settingsSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";
import { getTemplateById } from "lib/templates";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const [contentHeight, setContentHeight] = useState(1123);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const templateSettings = useAppSelector(selectTemplateSettings);
  
  // Check if we should use HTML preview instead of PDF
  const activeTemplate = getTemplateById(templateSettings.activeTemplate);
  const useHTMLPreview = activeTemplate && activeTemplate.source !== "legacy";

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
      <div className="relative flex w-full justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative w-full min-w-0">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] w-full overflow-hidden md:p-[var(--resume-padding)]">
            {useHTMLPreview ? (
              // HTML-based preview for impact-cv and reactive-resume templates
              <div className="h-full w-full overflow-auto bg-gray-100 p-4">
                <div 
                  style={{
                    width: `${794 * scale}px`,
                    height: `${contentHeight * scale}px`,
                  }}
                  className="mx-auto flex-shrink-0 transition-all duration-300 ease-in-out"
                >
                  <div 
                    style={{
                      width: '794px',
                      minHeight: '1123px',
                      transform: `scale(${scale})`,
                    }}
                    className="origin-top-left bg-white shadow-lg"
                  >
                    <div ref={previewRef} className="h-full w-full">
                      <TemplatePreview />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Legacy PDF-based preview
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
            fileName={resume.profile.name + " - Resume"}
          />
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};
