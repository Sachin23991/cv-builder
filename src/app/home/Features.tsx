"use client";
import { useEffect, useRef } from "react";
import { Link } from "components/documentation";
import { gsap, ScrollTrigger } from "lib/gsap";

/* ══════════════════════════════════════════════════════════════
   CUSTOM INLINE SVG ICONS — zero image imports, fully controlled
   ══════════════════════════════════════════════════════════════ */

const IconFree = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <circle cx="24" cy="24" r="18" fill="url(#fi-bg)" opacity="0.12"/>
    <path d="M24 10c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14S31.732 10 24 10Z"
      stroke="url(#fi-s)" strokeWidth="1.4" fill="none"/>
    <path d="M20 20.5C20 18.567 21.79 17 24 17s4 1.567 4 3.5-1.79 3.5-4 3.5-4 1.567-4 3.5S22.21 31 24 31s4-1.567 4-3.5"
      stroke="url(#fi-s)" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M24 15v18" stroke="url(#fi-s)" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="fi-bg" x1="6" y1="6" x2="42" y2="42"><stop stopColor="#14b8a6"/><stop offset="1" stopColor="#0ea5e9"/></linearGradient>
      <linearGradient id="fi-s"  x1="6" y1="6" x2="42" y2="42"><stop stopColor="#14b8a6"/><stop offset="1" stopColor="#38bdf8"/></linearGradient>
    </defs>
  </svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <circle cx="24" cy="24" r="14" stroke="url(#gi-s)" strokeWidth="1.5"/>
    <ellipse cx="24" cy="24" rx="6" ry="14" stroke="url(#gi-s)" strokeWidth="1.4"/>
    <path d="M10 24h28" stroke="url(#gi-s)" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M11.5 18h25M11.5 30h25" stroke="url(#gi-s)" strokeWidth="1" strokeLinecap="round" strokeDasharray="2.5 2.5"/>
    {/* checkmark badge — top right, unambiguous "global success" */}
    <circle cx="35" cy="13" r="6.5" fill="url(#gi-check)"/>
    <path d="M32.5 13l2 2 3-3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="gi-s"     x1="10" y1="10" x2="38" y2="38"><stop stopColor="#0ea5e9"/><stop offset="1" stopColor="#818cf8"/></linearGradient>
      <linearGradient id="gi-check" x1="28" y1="6"  x2="42" y2="20"><stop stopColor="#14b8a6"/><stop offset="1" stopColor="#0ea5e9"/></linearGradient>
    </defs>
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <path d="M24 5L9 11v11c0 10.1 6.5 19.5 15 22 8.5-2.5 15-11.9 15-22V11L24 5Z"
      fill="url(#sh-fill)" stroke="url(#sh-s)" strokeWidth="1.4"/>
    <rect x="20" y="21" width="8" height="6" rx="1.5" stroke="white" strokeWidth="1.8" fill="none"/>
    <path d="M22 21v-2a2 2 0 014 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="24" cy="25" r="1" fill="white"/>
    <defs>
      <linearGradient id="sh-fill" x1="9" y1="5"  x2="39" y2="43"><stop stopColor="#8b5cf6" stopOpacity=".18"/><stop offset="1" stopColor="#6366f1" stopOpacity=".06"/></linearGradient>
      <linearGradient id="sh-s"    x1="9" y1="5"  x2="39" y2="43"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#6366f1"/></linearGradient>
    </defs>
  </svg>
);

const IconOSS = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <rect x="5" y="9" width="38" height="30" rx="5" fill="url(#oss-fill)" stroke="url(#oss-s)" strokeWidth="1.4"/>
    <path d="M5 15h38" stroke="url(#oss-s)" strokeWidth="1.2"/>
    <circle cx="11" cy="12" r="1.5" fill="#f87171"/>
    <circle cx="16" cy="12" r="1.5" fill="#fbbf24"/>
    <circle cx="21" cy="12" r="1.5" fill="#34d399"/>
    {/* < > brackets */}
    <path d="M16 27l-5 3 5 3" stroke="url(#oss-s)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 27l5 3-5 3" stroke="url(#oss-s)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* slash */}
    <path d="M26 23l-4 14" stroke="url(#oss-acc)" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="oss-fill" x1="5" y1="9"  x2="43" y2="39"><stop stopColor="#f59e0b" stopOpacity=".1"/><stop offset="1" stopColor="#ef4444" stopOpacity=".04"/></linearGradient>
      <linearGradient id="oss-s"    x1="5" y1="9"  x2="43" y2="39"><stop stopColor="#fbbf24"/><stop offset="1" stopColor="#f87171"/></linearGradient>
      <linearGradient id="oss-acc"  x1="22" y1="23" x2="26" y2="37"><stop stopColor="#fbbf24"/><stop offset="1" stopColor="#fb923c"/></linearGradient>
    </defs>
  </svg>
);

/* ══════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════ */
const FEATURES = [
  {
    id: "free",
    Icon: IconFree,
    title: "Free Forever",
    tag: "No cost. Ever.",
    text: "Built on the belief that world-class resume tooling should be accessible to everyone — no paywalls, no subscriptions, no catches. Ever.",
    c1: "#14b8a6", c2: "#0ea5e9",
    glow: "rgba(20,184,166,0.22)",
    stats: [{ label: "Price", value: "$0" }, { label: "Plan", value: "∞ Free" }],
    extra: { label: "ATS Pass Rate", value: 98 },
    size: "large",
  },
  {
    id: "globe",
    Icon: IconGlobe,
    title: "Works Everywhere",
    tag: "ATS-friendly",
    text: "Clean, recruiter-tested layouts that pass every modern ATS scan — built for any role, industry, or country.",
    c1: "#0ea5e9", c2: "#818cf8",
    glow: "rgba(14,165,233,0.2)",
    stats: [{ label: "ATS Score", value: "98%" }, { label: "Countries", value: "120+" }],
    size: "medium",
  },
  {
    id: "privacy",
    Icon: IconShield,
    title: "Privacy First",
    tag: "Zero data leaks",
    text: "Your resume never leaves your browser. No accounts, no servers, no tracking — complete ownership, always.",
    c1: "#a78bfa", c2: "#6366f1",
    glow: "rgba(167,139,250,0.2)",
    stats: [{ label: "Data sent", value: "0 bytes" }, { label: "Sign-ups", value: "None" }],
    size: "medium",
  },
  {
    id: "oss",
    Icon: IconOSS,
    title: "Open Source",
    tag: "MIT licensed",
    text: (
      <>
        Every line of code is public. Audit, fork, or contribute on{" "}
        <Link href="https://github.com/Sachin23991/Careerflow-resume-maker">GitHub</Link>.
      </>
    ),
    c1: "#fbbf24", c2: "#f87171",
    glow: "rgba(251,191,36,0.18)",
    stats: [{ label: "License", value: "MIT" }, { label: "Stars", value: "1.2K+" }],
    size: "medium",
  },
] as const;

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  /* — GSAP animations — */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%" } }
      );

      gsap.fromTo(".fc-card",
        { opacity: 0, y: 65, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: gridRef.current, start: "top 82%" } }
      );

      gsap.to(".fc-icon-wrap", {
        y: -8, duration: 2.5, ease: "sine.inOut",
        yoyo: true, repeat: -1, stagger: 0.38,
      });

      // shimmer sweep on each card
      gsap.fromTo(".fc-shimmer",
        { x: "-100%" },
        { x: "300%", duration: 2.4, ease: "none",
          repeat: -1, stagger: 0.6, delay: 0.8 }
      );

      // progress bar fill animation
      gsap.fromTo(".fc-bar-fill",
        { width: "0%" },
        { width: "98%", duration: 1.8, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* — Mouse spotlight — */
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".fc-card");
    if (!cards) return;
    const fns: (() => void)[] = [];

    cards.forEach((card) => {
      const move  = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
        card.style.setProperty("--op", "1");
      };
      const leave = () => card.style.setProperty("--op", "0");
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      card.style.setProperty("--op", "0");
      fns.push(() => { card.removeEventListener("mousemove", move); card.removeEventListener("mouseleave", leave); });
    });
    return () => fns.forEach((f) => f());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      {/* ── Ambient backdrop ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-teal-900/20 blur-[130px]"/>
        <div className="absolute -bottom-10 right-[-8%] h-[450px] w-[550px] rounded-full bg-indigo-900/15 blur-[110px]"/>
        <div className="absolute bottom-1/3 left-[-6%] h-[350px] w-[450px] rounded-full bg-violet-900/12 blur-[100px]"/>
        {/* dot matrix */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage:"radial-gradient(circle,#14b8a6 1px,transparent 1px)", backgroundSize:"40px 40px" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-14 xl:px-20">

        {/* ── Section heading ── */}
        <div ref={headRef} className="mb-16 text-center">
          <span className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-teal-500/25 bg-teal-500/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-600"
            style={{ background:"rgba(20,184,166,0.07)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60"/>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400"/>
            </span>
            Why ResumeMaker
          </span>
          <h2 className="mt-5 text-[clamp(2.2rem,5.5vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-slate-900">
            Everything you need.{" "}
            <br className="hidden sm:block"/>
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage:"linear-gradient(130deg,#14b8a6 0%,#38bdf8 50%,#a78bfa 100%)" }}>
              Nothing holding you back.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[36rem] text-[1rem] leading-relaxed text-slate-600">
            Designed for every job seeker — first internship to C-suite.
            Zero compromise. Zero cost.
          </p>
        </div>

        {/* ── Bento grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-auto"
        >
          {/* LARGE — Free Forever: 5 cols × 2 rows */}
          <Card f={FEATURES[0]} className="lg:col-span-5 lg:row-span-2" />

          {/* Works Everywhere — 7 cols */}
          <Card f={FEATURES[1]} className="lg:col-span-7" />

          {/* Privacy — 4 cols */}
          <Card f={FEATURES[2]} className="lg:col-span-4" />

          {/* OSS — 3 cols */}
          <Card f={FEATURES[3]} className="lg:col-span-3" />
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.05] sm:grid-cols-4">
          {[
            { n:"50K+",  label:"Resumes created",  color:"#14b8a6" },
            { n:"98%",   label:"Avg ATS score",    color:"#38bdf8" },
            { n:"120+",  label:"Countries",         color:"#a78bfa" },
            { n:"0",     label:"Sign‑ups needed",  color:"#fb923c" },
          ].map(({ n, label, color }) => (
            <div key={label}
              className="flex flex-col items-center gap-1.5 bg-white/[0.025] py-6 px-4 backdrop-blur-sm transition-colors hover:bg-white/[0.04]">
              <span className="text-[2.1rem] font-extrabold leading-none tracking-tight" style={{ color }}>
                {n}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Global card styles ── */}
      <style>{`
        .fc-card {
          --mx:50%; --my:50%; --op:0;
          position: relative;
          background: linear-gradient(145deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 1.5rem;
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: border-color .3s, box-shadow .3s, transform .3s;
        }
        .fc-card::before {
          content: "";
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(300px circle at var(--mx) var(--my), rgba(20,184,166,0.1), transparent 70%);
          opacity: var(--op);
          transition: opacity .45s;
          pointer-events: none; z-index: 0;
        }
        .fc-card:hover {
          border-color: rgba(20,184,166,0.28);
          box-shadow: 0 20px 60px -12px rgba(20,184,166,0.18), 0 0 0 1px rgba(20,184,166,0.1) inset;
          transform: translateY(-5px);
        }
        .fc-card > * { position: relative; z-index: 1; }
        .fc-shimmer {
          position: absolute; top: 0; left: 0;
          height: 100%; width: 35%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transform: skewX(-15deg) translateX(-100%);
          pointer-events: none; z-index: 0;
        }
      `}</style>
    </section>
  );
};

/* ══════════════════════════════════════════════════════
   CARD SUB-COMPONENT
   ══════════════════════════════════════════════════════ */
function Card({ f, className = "" }: { f: (typeof FEATURES)[number]; className?: string }) {
  const isLarge = f.size === "large";
  const { c1, c2 } = f;

  return (
    <div className={`fc-card ${className} ${isLarge ? "p-8 lg:p-10" : "p-6 lg:p-7"}`}>
      {/* top color strip */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-[1.5rem]"
        style={{ background:`linear-gradient(90deg,${c1},${c2})` }}/>
      {/* shimmer */}
      <div className="fc-shimmer"/>
      {/* corner glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full blur-3xl"
        style={{ background: f.glow }}/>

      <div className={`flex h-full flex-col ${isLarge ? "gap-7" : "gap-5"}`}>

        {/* — Icon row — */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="fc-icon-wrap relative flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-2xl"
            style={{ background:`linear-gradient(135deg,${c1}1a,${c2}0d)`, border:`1px solid ${c1}28` }}
          >
            <div className="h-9 w-9"><f.Icon/></div>
          </div>
          <span className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ background:`${c1}12`, border:`1px solid ${c1}25`, color:c1 }}>
            {f.tag}
          </span>
        </div>

        {/* — Text — */}
        <div className={isLarge ? "flex-1" : ""}>
          <h3 className={`font-extrabold tracking-tight text-slate-900 ${isLarge ? "text-[1.9rem] leading-[1.08]" : "text-[1.25rem] leading-snug"}`}>
            {f.title}
          </h3>
          <p className={`mt-3 leading-relaxed text-slate-600 ${isLarge ? "max-w-[24rem] text-[0.97rem]" : "text-[0.875rem]"}`}>
            {f.text}
          </p>
        </div>

        {/* — Stat pills — */}
        <div className="flex flex-wrap gap-2.5">
          {"stats" in f && f.stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col rounded-xl px-4 py-3"
              style={{ background:`${c1}0e`, border:`1px solid ${c1}1e` }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</span>
              <span className="mt-0.5 text-[1.5rem] font-extrabold leading-none tracking-tight" style={{ color:c1 }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* — Large-only progress bar — */}
        {isLarge && "extra" in f && f.extra && (
          <div className="mt-auto">
            <div className="mb-2 flex justify-between text-[11px]">
              <span className="font-bold uppercase tracking-[0.18em] text-slate-500">{f.extra.label}</span>
              <span className="font-extrabold" style={{ color:c1 }}>{f.extra.value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background:"rgba(255,255,255,0.05)" }}>
              <div className="fc-bar-fill h-full rounded-full"
                style={{ background:`linear-gradient(90deg,${c1},${c2})`, boxShadow:`0 0 10px ${c1}70` }}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}