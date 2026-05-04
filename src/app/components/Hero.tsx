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
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Headline animates in with clip-path reveal (Apple-style)
      tl.from(headlineRef.current, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        delay: 0.3,
      })
        .from(
          subheadlineRef.current,
          { opacity: 0, y: 40, duration: 1 },
          "-=0.6"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 30, duration: 0.8 },
          "-=0.5"
        )
        .from(
          scrollIndicatorRef.current,
          { opacity: 0, duration: 0.6 },
          "-=0.2"
        );

      // Parallax effect on scroll - illustration moves at different rate
      if (illustrationRef.current && heroRef.current) {
        gsap.to(illustrationRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        // Scale effect on scroll
        gsap.to(illustrationRef.current, {
          scale: 0.9,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      {/* Ambient gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-teal-100/50 via-sky-50/40 to-transparent blur-3xl" />
        <div className="absolute top-20 right-0 h-[300px] w-[400px] rounded-full bg-gradient-to-l from-sky-100/40 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col-reverse items-center gap-8 px-6 pb-10 pt-10 lg:min-h-[calc(100vh-var(--top-nav-bar-height)-3rem)] lg:flex-row lg:gap-10 lg:px-12 lg:pb-12 lg:pt-12">
        {/* Left copy */}
        <div className="flex flex-col items-center text-center lg:w-[48%] lg:items-start lg:text-left">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
            Open Source & Free Forever
          </span>

          <h1
            ref={headlineRef}
            className="text-4xl font-extrabold leading-[1.04] sm:text-5xl lg:text-[4.5rem]"
          >
            Build your resume.{" "}
            <span className="bg-gradient-to-r from-teal-600 to-sky-500 bg-clip-text text-transparent">
              Shape your future.
            </span>
          </h1>

          <p
            ref={subheadlineRef}
            className="mt-6 max-w-md text-lg leading-relaxed text-slate-500"
          >
            Design, preview, and download a professional resume in minutes — or
            test your existing one against our ATS parser. Fully customizable. No
            sign-up required.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/resume-import" className="btn-primary group text-base">
              <span>Create Resume</span>
              <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link href="/resume-parser" className="btn-secondary text-base">
              Parse Existing
            </Link>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            Your data stays in your browser · 100% private
          </p>
        </div>

        {/* Right illustration with parallax */}
        <div
          ref={illustrationRef}
          className="relative w-full max-w-md lg:w-[54%] lg:max-w-2xl"
        >
          <div className="relative">
            {/* Soft glow behind illustration */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-teal-200/30 via-sky-100/20 to-transparent blur-3xl" />
            <Image
              src={homeSvg}
              alt="ResumeMaker — build professional resumes easily"
              className="animate-float relative z-10 w-full scale-110 drop-shadow-2xl lg:scale-125"
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 lg:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
          Scroll
        </span>
        <div className="h-8 w-[1.5px] bg-gradient-to-b from-slate-300 to-transparent" />
      </div>
    </section>
  );
}
