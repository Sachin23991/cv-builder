"use client";
import dynamic from "next/dynamic";
import { RevealOnScroll } from "components/RevealOnScroll";
import Link from "next/link";

const Hero = dynamic(() => import("components/Hero").then(m => m.Hero), { ssr: false });
const Steps = dynamic(() => import("home/Steps").then(m => m.Steps), { ssr: false });
const Features = dynamic(() => import("home/Features").then(m => m.Features), { ssr: false });
const Testimonials = dynamic(() => import("home/Testimonials").then(m => m.Testimonials), { ssr: false });
const QuestionsAndAnswers = dynamic(() => import("home/QuestionsAndAnswers").then(m => m.QuestionsAndAnswers), { ssr: false });
const HomeResumeDemo = dynamic(() => import("home/HomeResumeDemo").then(m => m.HomeResumeDemo), { ssr: false });

export default function Home() {
  return (
    <main className="bg-white text-slate-900">
      {/* ═══════════════  HERO  ═══════════════ */}
      <Hero />

      {/* ═══════════════  LIVE RESUME AUTO-TYPING DEMO  ═══════════════ */}
      <RevealOnScroll className="mx-auto max-w-screen-2xl px-8 lg:px-12" delay={0.05}>
        <section className="lg:flex lg:justify-center">
          <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-16 lg:text-left">
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
            <HomeResumeDemo />
          </div>
        </section>
      </RevealOnScroll>

      {/* ═══════════════  STEPS  ═══════════════ */}
      <RevealOnScroll className="mx-auto max-w-screen-2xl px-8 lg:px-12" delay={0.05}>
        <Steps />
      </RevealOnScroll>

      {/* ═══════════════  FEATURES  ═══════════════ */}
      <RevealOnScroll className="mx-auto max-w-screen-2xl px-8 lg:px-12" delay={0.05}>
        <Features />
      </RevealOnScroll>

      {/* ═══════════════  TESTIMONIALS  ═══════════════ */}
      <RevealOnScroll className="mx-auto max-w-screen-2xl px-8 lg:px-12" delay={0.05}>
        <Testimonials />
      </RevealOnScroll>

      {/* ═══════════════  Q&A  ═══════════════ */}
      <RevealOnScroll className="mx-auto max-w-screen-2xl px-8 pb-16 lg:px-12" delay={0.05}>
        <QuestionsAndAnswers />
      </RevealOnScroll>

      {/* ═══════════════  CTA BANNER  ═══════════════ */}
      <RevealOnScroll className="mx-auto max-w-screen-2xl px-8 pb-24 lg:px-12" delay={0}>
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
      </RevealOnScroll>

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
            href="https://github.com/Sachin23991/cv-builder"
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
