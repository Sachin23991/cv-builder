"use client";
import { useEffect, useState, useRef } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { generateDocx } from "lib/docx-export";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });
  const resume = useAppSelector(selectResume);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hook to update pdf when document changes
  useEffect(() => {
    update(document);
  }, [update, document]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDocxDownload = async () => {
    try {
      const blob = await generateDocx(resume);
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = fileName.replace(".pdf", ".docx");
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("DOCX generation failed:", e);
    }
    setShowDropdown(false);
  };

  return (
    <div className="resume-control-pill print:hidden" role="region" aria-label="Resume Controls">
      <div className="flex items-center gap-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-white/80" aria-hidden="true" />
        <input
          aria-label="Zoom"
          className="zoom-slider"
          type="range"
          min={0.4}
          max={1.8}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-12 text-sm text-white/80">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex text-white/70">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          className="download-btn pulse"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap text-sm font-semibold">Download</span>
        </button>

        {showDropdown && (
          <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-white p-2 shadow-xl ring-1 ring-black/5">
            <a
              href={instance.url!}
              download={fileName}
              onClick={() => setShowDropdown(false)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <DocumentIcon className="h-5 w-5" />
              Download PDF
            </a>
            <button
              onClick={handleDocxDownload}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5" />
              Download DOCX
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50 print:hidden" />
);
