"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import homeSvg from "public/home.svg";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const atsTagRef = useRef<HTMLDivElement>(null);
  const scoreTagRef = useRef<HTMLDivElement>(null);
  const privacyRef = useRef<HTMLParagraphElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Entrance timeline ──────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.9,
        duration: 0.7,
        delay: 0.2,
      })
        .from(
          headlineRef.current,
          { opacity: 0, y: 70, duration: 1.2 },
          "-=0.3"
        )
        .from(
          subheadlineRef.current,
          { opacity: 0, y: 40, duration: 1 },
          "-=0.7"
        )
        .from(ctaRef.current, { opacity: 0, y: 30, duration: 0.8 }, "-=0.6")
        .from(privacyRef.current, { opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          illustrationRef.current,
          { opacity: 0, x: 60, scale: 0.94, duration: 1.3, ease: "power3.out" },
          "-=1.2"
        )
        .from(
          [atsTagRef.current, scoreTagRef.current],
          {
            opacity: 0,
            scale: 0.75,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        .from(
          scrollIndicatorRef.current,
          { opacity: 0, duration: 0.6 },
          "-=0.2"
        );

      // ── Ambient orb drift ──────────────────────────────────────────────
      gsap.to(orb1Ref.current, {
        x: 30,
        y: -20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orb2Ref.current, {
        x: -20,
        y: 25,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });

      // ── Floating badges ────────────────────────────────────────────────
      gsap.to(atsTagRef.current, {
        y: -7,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
      gsap.to(scoreTagRef.current, {
        y: 7,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // ── Scroll parallax ────────────────────────────────────────────────
      if (illustrationRef.current && heroRef.current) {
        gsap.to(illustrationRef.current, {
          yPercent: 18,
          scale: 0.93,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.8,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* ── Ambient background ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-center large orb */}
        <div
          ref={orb1Ref}
          className="absolute -top-32 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-teal-100/60 via-sky-50/50 to-transparent blur-[100px]"
        />
        {/* Right edge orb */}
        <div
          ref={orb2Ref}
          className="absolute right-[-6%] top-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-l from-sky-200/40 via-teal-100/30 to-transparent blur-[80px]"
        />
        {/* Bottom-left accent */}
        <div className="absolute -bottom-20 left-[-4%] h-[350px] w-[450px] rounded-full bg-gradient-to-tr from-teal-100/30 to-transparent blur-[70px]" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0f766e 1px, transparent 1px), linear-gradient(90deg, #0f766e 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[96rem] grid-cols-1 items-center gap-0 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:px-14 lg:py-0 xl:px-20">
        {/* ── LEFT: Copy ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Pill badge */}
          <span
            ref={badgeRef}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-gradient-to-r from-teal-50 to-sky-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700 shadow-sm shadow-teal-100"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
            </span>
            Open Source &amp; Free Forever
          </span>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-[clamp(3rem,7.5vw,5rem)] font-extrabold leading-[0.93] tracking-[-0.045em] text-slate-900"
          >
            Build your
            <br />
            resume.{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">
                Shape your
                <br />
                future.
              </span>
              {/* Underline decoration */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 9C50 3 150 1 298 9"
                  stroke="url(#underline-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop stopColor="#0d9488" />
                    <stop offset="1" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            ref={subheadlineRef}
            className="mt-8 max-w-[26rem] text-[1.05rem] leading-[1.75] text-slate-500"
          >
            Design, preview, and download a professional resume in minutes — or
            test your existing one against our ATS parser.{" "}
            <span className="font-semibold text-slate-700">
              Fully customizable. No sign-up required.
            </span>
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/resume-import"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Shimmer */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative">Create Resume</span>
              <span className="relative ml-0.5 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/resume-parser"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-7 py-3.5 text-[0.95rem] font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-teal-200 hover:bg-teal-50/60 hover:text-teal-700 hover:-translate-y-0.5"
            >
              Parse Existing
            </Link>
          </div>

          {/* Trust line */}
          <p
            ref={privacyRef}
            className="mt-5 flex items-center gap-2 text-[0.8rem] text-slate-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-teal-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Your data stays in your browser · 100% private
          </p>
        </div>

        {/* ── RIGHT: Illustration ─────────────────────────────────────── */}
        <div
          ref={illustrationRef}
          className="relative flex w-full items-center justify-center lg:h-full lg:justify-end"
        >
          {/* Glow behind image */}
          <div className="absolute left-1/2 top-1/2 h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-teal-200/50 via-sky-100/40 to-transparent blur-[70px]" />

          {/* Illustration wrapper — controls actual size */}
          <div className="relative w-full max-w-[30rem] sm:max-w-[38rem] md:max-w-[44rem] lg:max-w-none lg:w-[115%] xl:w-[120%] 2xl:w-[125%]">
            {/* ATS Ready badge */}
            <div
              ref={atsTagRef}
              className="absolute right-[4%] top-[8%] z-20 flex items-center gap-2 rounded-2xl border border-sky-200/80 bg-white/90 px-4 py-2.5 shadow-xl shadow-sky-100/60 backdrop-blur-md sm:right-[6%]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-sky-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
                ATS Ready
              </span>
            </div>

            {/* Score badge */}
            <div
              ref={scoreTagRef}
              className="absolute bottom-[10%] left-[2%] z-20 rounded-2xl border border-teal-100/80 bg-white/90 px-5 py-3.5 shadow-2xl shadow-teal-100/50 backdrop-blur-md sm:left-[4%]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                ATS Score
              </p>
              <div className="mt-1 flex items-end gap-1">
                <p className="text-3xl font-extrabold leading-none text-slate-900">
                  98
                </p>
                <span className="mb-0.5 text-lg font-bold text-teal-500">%</span>
              </div>
              {/* Mini bar */}
              <div className="mt-2 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-teal-500 to-sky-400" />
              </div>
            </div>

            {/* The SVG illustration */}
            <Image
              src={homeSvg}
              alt="ResumeMaker — build professional resumes easily"
              className="relative z-10 mx-auto w-full drop-shadow-2xl"
              style={{ animation: "heroFloat 4s ease-in-out infinite" }}
              sizes="(min-width: 1536px) 56rem, (min-width: 1280px) 52rem, (min-width: 1024px) 48rem, (min-width: 768px) 44rem, 95vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 lg:flex"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.25em]">
          Scroll
        </span>
        <div className="relative h-10 w-[1.5px] overflow-hidden bg-slate-200">
          <div
            className="absolute top-0 h-1/2 w-full bg-gradient-to-b from-teal-400 to-transparent"
            style={{ animation: "scrollBar 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(0.4deg); }
          66%       { transform: translateY(-5px) rotate(-0.3deg); }
        }
        @keyframes scrollBar {
          0%   { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(200%);  opacity: 0; }
        }
      `}</style>
    </section>
  );
}