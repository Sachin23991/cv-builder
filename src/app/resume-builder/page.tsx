"use client";
// Optimized lazy-loaded builder page
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ResumeForm = dynamic(() =>
  import("components/ResumeForm").then((mod) => ({
    default: mod.ResumeForm,
  })),
  { ssr: false }
);

const Resume = dynamic(() =>
  import("components/Resume").then((mod) => ({
    default: mod.Resume,
  })),
  { ssr: false }
);

export default function Create() {
  return (
    <main className="builder-shell relative min-h-[calc(100vh-var(--top-nav-bar-height))] w-full overflow-hidden bg-[#07090f] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-[-100px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.28),rgba(220,38,38,0))] blur-3xl" />
        <div className="absolute right-[-100px] top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22),rgba(56,189,248,0))] blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-[420px] w-[720px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(245,158,11,0.18),rgba(245,158,11,0))] blur-3xl" />
      </div>

      <div className="relative z-10 grid grid-cols-3 md:grid-cols-6">
        {/* Left panel — Form (slides in from left) */}
        <Suspense fallback={<div className="col-span-3 bg-white/90" />}>
          <div className="col-span-3 border-r border-white/10 bg-white/90 text-slate-900 backdrop-blur-xl">
            <ResumeForm />
          </div>
        </Suspense>
        
        {/* Right panel — Preview (slides in from right) */}
        <Suspense fallback={<div className="col-span-3 bg-gradient-to-b from-slate-900/90 via-slate-900/75 to-slate-950/90" />}>
          <div className="col-span-3 bg-gradient-to-b from-slate-900/90 via-slate-900/75 to-slate-950/90 backdrop-blur-xl">
            <Resume />
          </div>
        </Suspense>
      </div>
    </main>
  );
}
