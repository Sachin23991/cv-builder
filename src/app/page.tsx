"use client";
import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";
import { Testimonials } from "home/Testimonials";
import { QuestionsAndAnswers } from "home/QuestionsAndAnswers";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import homeSvg from "public/home.svg";
import logoSrc from "public/logo.svg";

/* ─── Reusable scroll-reveal wrapper ─── */
function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const variants = {
    up:    { hidden: { opacity: 0, y: 50 },  visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 },  visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],  // Apple ease-out-expo
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /* Parallax — illustration floats slower than content */
  const illustrationY = useTransform(heroScroll, [0, 1], [0, 100]);
  const illustrationScale = useTransform(heroScroll, [0, 0.5], [1, 0.95]);

  /* Navbar shadow on scroll */
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 30));

  return (
    <main className="bg-white text-slate-900">

      {/* ═══════════════  HERO  ═══════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
      >
        {/* Ambient gradient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-teal-100/50 via-sky-50/40 to-transparent blur-3xl" />
          <div className="absolute top-20 right-0 h-[300px] w-[400px] rounded-full bg-gradient-to-l from-sky-100/40 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col-reverse items-center gap-8 px-6 pb-12 pt-8 lg:flex-row lg:gap-12 lg:px-12 lg:pb-24 lg:pt-20">

          {/* ── Left copy ── */}
          <div className="flex flex-col items-center text-center lg:w-[48%] lg:items-start lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
              Open Source &amp; Free Forever
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]"
            >
              Build your resume.{" "}
              <span className="bg-gradient-to-r from-teal-600 to-sky-500 bg-clip-text text-transparent">
                Shape your future.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-6 max-w-md text-lg leading-relaxed text-slate-500"
            >
              Design, preview, and download a professional resume in minutes — 
              or test your existing one against our ATS parser. Fully customizable. 
              No sign-up required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href="/resume-import" className="btn-primary group text-base">
                <span>Create Resume</span>
                <span
                  aria-hidden="true"
                  className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link href="/resume-parser" className="btn-secondary text-base">
                Parse Existing
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-5 text-sm text-slate-400"
            >
              Your data stays in your browser · 100% private
            </motion.p>
          </div>

          {/* ── Right illustration ── */}
          <motion.div
            style={{ y: illustrationY, scale: illustrationScale }}
            className="relative w-full max-w-md lg:w-[52%] lg:max-w-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="relative"
            >
              {/* Soft glow behind illustration */}
              <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-teal-200/30 via-sky-100/20 to-transparent blur-3xl" />
              <Image
                src={homeSvg}
                alt="ResumeMaker — build professional resumes easily"
                className="animate-float relative z-10 w-full drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-[1.5px] bg-gradient-to-b from-slate-300 to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════  LIVE RESUME AUTO-TYPING DEMO  ═══════════════ */}
      <Reveal className="mx-auto max-w-screen-2xl px-8 lg:px-12" delay={0.05}>
        <section className="lg:flex lg:h-[825px] lg:justify-center">
          <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
            <h2 className="text-primary pb-2 text-3xl font-bold lg:text-4xl">
              Watch it build
              <br />
              in real time
            </h2>
            <p className="mt-3 text-lg text-slate-500 lg:mt-5 lg:text-xl">
              See how your resume comes to life as you type
            </p>
            <Link href="/resume-import" className="btn-primary mt-6 lg:mt-14 group">
              <span>Get Started</span>
              <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1"> →</span>
            </Link>
            <p className="ml-6 mt-3 text-sm text-slate-400">No sign up required</p>
            <p className="mt-3 text-sm text-slate-500 lg:mt-36">
              Already have a resume? Test its ATS readability with the{" "}
              <Link href="/resume-parser" className="font-medium text-teal-600 underline underline-offset-2 hover:text-teal-500 transition-colors">
                resume parser
              </Link>
            </p>
          </div>
          <div className="mt-6 flex justify-center lg:mt-4 lg:block lg:grow">
            {/* The live auto-typing resume preview */}
            <AutoTypingResumeWrapper />
          </div>
        </section>
      </Reveal>

      {/* ═══════════════  STEPS  ═══════════════ */}
      <Reveal className="mx-auto max-w-screen-2xl px-8 lg:px-12" delay={0.05}>
        <Steps />
      </Reveal>

      {/* ═══════════════  FEATURES  ═══════════════ */}
      <Reveal className="mx-auto max-w-screen-2xl px-8 lg:px-12" delay={0.05}>
        <Features />
      </Reveal>

      {/* ═══════════════  TESTIMONIALS  ═══════════════ */}
      <Reveal className="mx-auto max-w-screen-2xl px-8 lg:px-12" delay={0.05}>
        <Testimonials />
      </Reveal>

      {/* ═══════════════  Q&A  ═══════════════ */}
      <Reveal className="mx-auto max-w-screen-2xl px-8 pb-16 lg:px-12" delay={0.05}>
        <QuestionsAndAnswers />
      </Reveal>

      {/* ═══════════════  CTA BANNER  ═══════════════ */}
      <Reveal className="mx-auto max-w-screen-2xl px-8 pb-24 lg:px-12" direction="scale">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-20 text-center text-white shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(13,148,136,0.15),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(14,165,233,0.1),transparent_50%)]" />
          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to build something{" "}
              <span className="bg-gradient-to-r from-teal-300 to-sky-300 bg-clip-text text-transparent">
                extraordinary
              </span>
              ?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
              Join thousands of professionals crafting polished resumes with ResumeMaker.
            </p>
            <div className="mt-10">
              <Link
                href="/resume-import"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-[0.98]"
              >
                Get Started — It&apos;s Free
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══════════════  FOOTER  ═══════════════ */}
      <footer className="border-t border-slate-100 bg-slate-50/60 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.ico" alt="ResumeMaker Logo" className="h-7 w-7" />
            <span className="text-lg font-bold tracking-tight text-slate-800">ResumeMaker</span>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} ResumeMaker. All rights reserved.
          </p>
          <a
            href="https://github.com/Sachin23991/Careerflow-resume-maker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-300 hover:text-slate-800"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Star on GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}

/* ─── Lazy-loaded AutoTypingResume to avoid hydration issues ─── */
import dynamic from "next/dynamic";
const AutoTypingResumeWrapper = dynamic(
  () => import("home/AutoTypingResume").then((mod) => ({ default: mod.AutoTypingResume })),
  { ssr: false, loading: () => <div className="h-[600px] w-[420px] animate-shimmer rounded-lg bg-slate-50" /> }
);
