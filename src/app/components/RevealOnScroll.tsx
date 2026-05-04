"use client";
import { useRef, useEffect } from "react";

/* ─── Reusable scroll-reveal wrapper with lazy-loaded GSAP ─── */
export function RevealOnScroll({
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // Lazy load GSAP only when component mounts
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        
        const ctx = gsap.context(() => {
          const animations = {
            up: { y: 60, x: 0 },
            left: { y: 0, x: -60 },
            right: { y: 0, x: 60 },
            scale: { y: 0, x: 0, scale: 0.9 },
          };

          gsap.fromTo(
            ref.current,
            { opacity: 0, ...animations[direction] },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay,
            }
          );
        }, ref);

        return () => ctx.revert();
      });
    });
  }, [direction, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
