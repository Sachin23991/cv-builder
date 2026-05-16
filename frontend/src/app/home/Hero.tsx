import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { AutoTypingResume } from "home/AutoTypingResume";
import { useEffect, useRef } from "react";
import { gsap } from "lib/gsap";

export const Hero = () => {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    const headline = headlineRef.current;
    if (headline) {
      const words = headline.innerText.split(/\s+/).filter(Boolean);
      const wrapped = words.map((w) => `<span class=\"hero-word\">${w}</span>`).join(" ");
      headline.innerHTML = wrapped;
      gsap.fromTo(
        headline.querySelectorAll(".hero-word"),
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: "power3.out" }
      );
    }

    const preview = previewRef.current;
    if (preview) {
      const handleMove = (e: MouseEvent) => {
        const rect = preview.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotY = x * 10; // rotateY
        const rotX = -y * 8; // rotateX
        gsap.to(preview, { rotationY: rotY, rotationX: rotX, transformPerspective: 800, ease: "power3.out", duration: 0.5 });
      };
      const handleLeave = () => gsap.to(preview, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power3.out" });
      preview.addEventListener("mousemove", handleMove);
      preview.addEventListener("mouseleave", handleLeave);
      return () => {
        preview.removeEventListener("mousemove", handleMove);
        preview.removeEventListener("mouseleave", handleLeave);
      };
    }
    return undefined;
  }, []);

  return (
    <section className="lg:flex lg:h-[825px] lg:justify-center">
      <FlexboxSpacer maxWidth={75} minWidth={0} className="hidden lg:block" />
      <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
        <h1 ref={headlineRef} className="text-primary pb-2 text-4xl font-bold lg:text-5xl">
          Build the Resume
          <br />
          That Gets the
          <br />
          <span className="text-accent inline-block">Dream Job</span>
        </h1>
        <p className="mt-3 text-lg lg:mt-5 lg:text-xl text-secondary">
          A resume so well-crafted it becomes part of your personal brand.
        </p>
        <Link href="/resume-import" className="btn-primary mt-6 lg:mt-14">
          Create Resume <span aria-hidden="true">→</span>
        </Link>
        <p className="ml-6 mt-3 text-sm text-gray-400">No sign up required</p>
        <p className="mt-3 text-sm text-gray-400 lg:mt-36">
          Already have a resume? Test its ATS readability with the {" "}
          <Link href="/resume-parser" className="underline underline-offset-2">
            resume parser
          </Link>
        </p>
      </div>
      <FlexboxSpacer maxWidth={100} minWidth={50} className="hidden lg:block" />
      <div className="mt-6 flex justify-center lg:mt-4 lg:block lg:grow">
        <div ref={previewRef} className="transform-gpu will-change-transform rounded-2xl p-6" style={{ perspective: 800 }}>
          <AutoTypingResume />
        </div>
      </div>
    </section>
  );
};
