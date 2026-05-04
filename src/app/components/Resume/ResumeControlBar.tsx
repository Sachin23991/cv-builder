"use client";
import { useEffect } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

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

  // Hook to update pdf when document changes
  useEffect(() => {
    update(document);
  }, [update, document]);

  return (
    <div className="resume-control-pill" role="region" aria-label="Resume Controls">
      <div className="flex items-center gap-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-white/80" aria-hidden="true" />
        <input
          aria-label="Zoom"
          className="zoom-slider"
          type="range"
          min={0.5}
          max={1.5}
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
      <a
        className="download-btn pulse"
        href={instance.url!}
        download={fileName}
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        <span className="whitespace-nowrap text-sm font-semibold">Download</span>
      </a>
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
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
