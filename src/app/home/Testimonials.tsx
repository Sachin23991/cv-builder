"use client";
import heartSrc from "public/assets/heart.svg";
import testimonialSpiegelSrc from "public/assets/testimonial-spiegel.jpg";
import testimonialSantiSrc from "public/assets/testimonial-santi.jpg";
import testimonialVivianSrc from "public/assets/testimonial-vivian.jpg";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    src: testimonialSpiegelSrc,
    quote:
      "Students often make silly mistakes on their resume by using inconsistent bullet points or font sizes. ResumeMaker's auto format feature is a great help to ensure consistent format.",
    name: "Ms. Spiegel",
    title: "Educator",
  },
  {
    src: testimonialSantiSrc,
    quote:
      "I used ResumeMaker during my last job search and was invited to interview at top tech companies such as Google and Amazon thanks to its slick yet professional resume design.",
    name: "Santi",
    title: "Software Engineer",
  },
  {
    src: testimonialVivianSrc,
    quote:
      "Creating a professional resume on ResumeMaker is so smooth and easy! It saves me so much time and headache to not deal with google doc template.",
    name: "Vivian",
    title: "College Student",
  },
];

const ROTATION_INTERVAL_MS = 8 * 1000;

export const Testimonials = ({ children }: { children?: React.ReactNode }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power4.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    // duplicate content for seamless loop
    const content = track.innerHTML;
    track.innerHTML = content + content;
    const width = track.scrollWidth / 2;

    tlRef.current = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
    tlRef.current.to(track, { x: -width, duration: 18 });

    const handleEnter = () => tlRef.current?.pause();
    const handleLeave = () => tlRef.current?.play();
    wrap.addEventListener("mouseenter", handleEnter);
    wrap.addEventListener("mouseleave", handleLeave);

    return () => {
      tlRef.current?.kill();
      wrap.removeEventListener("mouseenter", handleEnter);
      wrap.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto -mt-2 px-8 pb-20">
      <h2 className="testimonial-title mb-8 text-center text-3xl font-bold text-slate-900">
        People <Image src={heartSrc} alt="love" className="-mt-1 inline-block w-7" /> ResumeMaker
      </h2>
      <div className="mx-auto mt-10 max-w-full">
        <div ref={wrapRef} className="testimonial-wrap overflow-hidden">
          <div ref={trackRef} className="testimonial-track flex gap-6 items-stretch">
            {TESTIMONIALS.map(({ src, quote, name, title }, idx) => (
              <blockquote
                key={idx}
                className="testimonial-card min-w-[280px] max-w-[360px] rounded-2xl bg-white p-6 text-slate-900 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-white/5">
                    <Image src={src} alt={name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{name}</div>
                    <div className="text-xs text-slate-500">{title}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-700">{quote}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
};
