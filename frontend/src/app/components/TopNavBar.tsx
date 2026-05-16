"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef } from "react";

export const TopNavBar = () => {
  const pathName = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const header = headerRef.current;
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle("scrolled", window.scrollY > 80);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      aria-label="Site Header"
      className="flex h-[var(--top-nav-bar-height)] items-center px-3 lg:px-12 print:hidden"
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon.ico" alt="ResumeMaker Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-sky-500">ResumeMaker</span>
        </Link>
        <nav aria-label="Site Nav Bar" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {[["/resume-builder", "Builder"], ["/resume-parser", "Parser"]].map(([href, text]) => (
            <Link
              key={text}
              className="rounded-md px-1.5 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 focus-visible:bg-sky-50 lg:px-4"
              href={href as string}
            >
              {text}
            </Link>
          ))}
          <div className="ml-1 mt-1">
            <iframe
              src="https://ghbtns.com/github-btn.html?user=Sachin23991&repo=cv-builder&type=star&count=true"
              width="100"
              height="20"
              className="overflow-hidden border-none"
              title="GitHub"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};
