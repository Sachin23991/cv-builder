"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "lib/gsap";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { title: "Add a resume PDF", text: "Upload or create from scratch" },
  { title: "Preview & edit", text: "Tune visuals and content" },
  { title: "Download & apply", text: "Export PDF and apply with confidence" },
];

export const Steps = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // stagger reveal with clip-path wipe
      gsap.utils.toArray(".step-card").forEach((el: any, i: number) => {
        gsap.fromTo(
          el.querySelector(".step-content"),
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.08,
          }
        );
      });

      // vertical progress line fill controlled by scroll
      if (lineRef.current && containerRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top center",
              end: "bottom bottom",
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto my-10 max-w-5xl px-6 lg:my-16">
      <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">How it works</h2>
      <div ref={containerRef} className="relative lg:flex lg:justify-center">
        {/* vertical line */}
        <div className="timeline-wrap hidden lg:block">
          <div className="timeline-line" />
          <div ref={lineRef} className="timeline-line-fill" />
        </div>

        <dl className="timeline-list mt-6 flex flex-col gap-12 lg:w-3/4">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className={`step-card relative flex flex-col lg:flex-row lg:items-start ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            >
              <div className="step-number-hero absolute left-0 top-0 hidden text-[8rem] font-bold text-slate-900 lg:block">
                {idx + 1}
              </div>
              <div className="step-marker lg:mx-8 lg:order-1">
                <div className="step-dot" />
              </div>
              <div className="step-content p-6 rounded-2xl bg-[rgba(17,17,19,0.8)] border border-[rgba(255,255,255,0.04)] lg:order-2">
                <dt className="text-xl font-semibold text-white">{s.title}</dt>
                <dd className="mt-2 text-[var(--text-secondary)]">{s.text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
