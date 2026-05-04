"use client";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const ResumeDropzone = dynamic(() =>
  import("components/ResumeDropzone").then((mod) => ({
    default: mod.ResumeDropzone,
  })),
  { ssr: false }
);

export default function ImportResume() {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const [mounted, setMounted] = useState(false);

  const onFileUrlChange = (fileUrl: string) => {
    setHasAddedResume(Boolean(fileUrl));
  };

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
    setMounted(true);
  }, []);

  return (
    <main className="min-h-[calc(100vh-var(--top-nav-bar-height))] bg-gradient-to-b from-white to-slate-50/50 flex items-start justify-center px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200/80 bg-white px-10 py-10 text-center"
        style={{
          boxShadow: "0 8px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <AnimatePresence mode="wait">
          {mounted && !hasUsedAppBefore ? (
            <motion.div
              key="new-user"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Import data from an existing resume
              </h1>
              <ResumeDropzone
                onFileUrlChange={onFileUrlChange}
                className="mt-5"
              />
              {!hasAddedResume && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <OrDivider />
                  <SectionWithHeadingAndCreateButton
                    heading="Don't have a resume yet?"
                    buttonText="Create from scratch"
                  />
                </motion.div>
              )}
            </motion.div>
          ) : mounted ? (
            <motion.div
              key="returning-user"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {!hasAddedResume && (
                <>
                  <SectionWithHeadingAndCreateButton
                    heading="You have data saved in browser from prior session"
                    buttonText="Continue where I left off"
                  />
                  <OrDivider />
                </>
              )}
              <h1 className="font-bold text-slate-900 tracking-tight">
                Override data with a new resume
              </h1>
              <ResumeDropzone
                onFileUrlChange={onFileUrlChange}
                className="mt-5"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

const OrDivider = () => (
  <div className="mx-[-2.5rem] flex items-center pb-6 pt-8" aria-hidden="true">
    <div className="flex-grow border-t border-slate-200" />
    <span className="mx-3 mt-[-2px] flex-shrink text-sm font-medium uppercase tracking-widest text-slate-300">
      or
    </span>
    <div className="flex-grow border-t border-slate-200" />
  </div>
);

const SectionWithHeadingAndCreateButton = ({
  heading,
  buttonText,
}: {
  heading: string;
  buttonText: string;
}) => {
  return (
    <>
      <p className="font-semibold text-slate-800">{heading}</p>
      <div className="mt-5">
        <Link
          href="/resume-builder"
          className="btn-primary text-base"
        >
          {buttonText}
        </Link>
      </div>
    </>
  );
};
