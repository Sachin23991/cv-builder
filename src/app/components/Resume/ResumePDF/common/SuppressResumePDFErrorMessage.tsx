"use client";

/**
 * Suppress ResumePDF development errors.
 * See ResumePDF doc string for context.
 */
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  const consoleError = console.error;
  const SUPPRESSED_WARNINGS = ["DOCUMENT", "PAGE", "TEXT", "VIEW"];
  console.error = function filterWarnings(msg, ...args) {
    const messageParts = [msg, ...args]
      .filter((part): part is string => typeof part === "string")
      .join(" ");
    if (!SUPPRESSED_WARNINGS.some((entry) => messageParts.includes(entry))) {
      consoleError(msg, ...args);
    }
  };
}

export const SuppressResumePDFErrorMessage = () => {
  return <></>;
};
