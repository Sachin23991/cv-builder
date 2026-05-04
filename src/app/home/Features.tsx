"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Link } from "components/documentation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    src: featureFreeSrc,
    title: "Free Forever",
    text: "ResumeMaker is created with the belief that everyone should have free and easy access to a modern professional resume design",
  },
  {
    src: featureUSSrc,
    title: "Works Everywhere",
    text: "ResumeMaker uses clean, recruiter-friendly layouts that work across roles, industries, and modern ATS platforms.",
  },
  {
    src: featurePrivacySrc,
    title: "Privacy Focus",
    text: "ResumeMaker stores data locally in your browser so only you have access to your data and with complete control",
  },
  {
    src: featureOpenSourceSrc,
    title: "Open-Source",
    text: (
      <>
        ResumeMaker is an open-source project, and its source code can be viewed
        by anyone on its{" "}
        <Link href="https://github.com/Sachin23991/Careerflow-resume-maker">
          GitHub repository
        </Link>
      </>
    ),
  },
];

export const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: { amount: 0.6, grid: "auto", from: "start" },
          scrollTrigger: { trigger: gridRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );

      gsap.to(".feature-icon", { y: -8, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.3 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // mouse spotlight for each card
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".feature-card")) as HTMLElement[];
    const handleMove = (card: HTMLElement, e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--fx", `${x}%`);
      card.style.setProperty("--fy", `${y}%`);
    };
    const handleLeave = (card: HTMLElement) => {
      card.style.setProperty("--fx", `50%`);
      card.style.setProperty("--fy", `50%`);
    };
    cards.forEach((card) => {
      const move = (e: MouseEvent) => handleMove(card, e);
      const leave = () => handleLeave(card);
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      // init
      handleLeave(card);
    });
    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", () => {});
        card.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 lg:py-20">
      <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">Why choose ResumeMaker</h2>
      <div ref={gridRef} className="mx-auto lg:max-w-6xl">
        <div className="features-bento">
          {FEATURES.map(({ src, title, text }, i) => {
            const size = i === 0 ? "bento-large" : i <= 2 ? "bento-medium" : "bento-small";
            return (
              <div className={`feature-card ${size} px-5 py-6`} key={title}>
                <div className="feature-spot" />
                <div className="flex items-start gap-4">
                  <Image src={src} alt="Feature icon" className="feature-icon" />
                  <div>
                    <dt className="mb-1 text-2xl font-bold text-slate-900">{title}</dt>
                    <dd className="text-sm leading-6 text-slate-500">{text}</dd>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
