import type { ResumeSectionToLines, Lines } from "lib/parse-resume-from-pdf/types";

/**
 * Return section lines that contain any of the keywords.
 *
 * If multiple section names match (e.g. "EDUCATION" and "Education"),
 * their lines are merged in order of appearance.
 */
export const getSectionLinesByKeywords = (
  sections: ResumeSectionToLines,
  keywords: string[]
): Lines => {
  const allMatchingLines: Lines = [];

  for (const sectionName in sections) {
    const hasKeyWord = keywords.some((keyword) =>
      sectionName.toLowerCase().includes(keyword)
    );
    if (hasKeyWord) {
      const sectionLines = sections[sectionName];
      if (sectionLines) {
        allMatchingLines.push(...sectionLines);
      }
    }
  }

  return allMatchingLines;
};
