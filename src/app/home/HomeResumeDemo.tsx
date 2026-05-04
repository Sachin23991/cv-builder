"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const AutoTypingResume = dynamic(
  () => import("home/AutoTypingResume").then((mod) => mod.AutoTypingResume),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-[420px] animate-shimmer rounded-lg bg-slate-50" />
    ),
  }
);

export function HomeResumeDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      {shouldLoad ? (
        <AutoTypingResume />
      ) : (
        <div className="h-[600px] w-[420px] animate-shimmer rounded-lg bg-slate-50" />
      )}
    </div>
  );
}
