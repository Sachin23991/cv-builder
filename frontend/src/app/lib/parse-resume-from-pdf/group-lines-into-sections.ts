import type { ResumeKey } from "lib/redux/types";
import type {
  Line,
  Lines,
  ResumeSectionToLines,
} from "lib/parse-resume-from-pdf/types";
import {
  hasLetterAndIsAllUpperCase,
  hasOnlyLettersSpacesAmpersands,
  isBold,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";

export const PROFILE_SECTION: ResumeKey = "profile";

/**
 * Step 3. Group lines into sections
 *
 * Every section (except the profile section) starts with a section title that
 * takes up the entire line. This is a common pattern not just in resumes but
 * also in books and blogs. The resume parser uses this pattern to group lines
 * into the closest section title above these lines.
 *
 * Detection uses a multi-layer heuristic:
 *   1. Bold + ALL CAPS (strongest signal — well-formatted resumes)
 *   2. Bold + keyword match (common in Google Docs / Canva resumes)
 *   3. ALL CAPS + keyword match (common in many templates)
 *   4. Keyword-only with structural signals (font size, short text)
 */
export const groupLinesIntoSections = (lines: Lines) => {
  // Pre-compute the most common text height to detect section headers by size
  const bodyHeight = getMostCommonTextHeight(lines);

  let sections: ResumeSectionToLines = {};
  let sectionName: string = PROFILE_SECTION;
  let sectionLines: Lines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.length === 0) continue;
    const firstItem = line[0];
    const text = firstItem ? firstItem.text.trim() : "";
    if (isSectionTitle(line, i, bodyHeight)) {
      sections[sectionName] = [...sectionLines];
      sectionName = text || PROFILE_SECTION;
      sectionLines = [];
    } else {
      sectionLines.push(line);
    }
  }
  if (sectionLines.length > 0) {
    sections[sectionName] = [...sectionLines];
  }
  return sections;
};

// ─── Section Title Keywords ──────────────────────────────────────
const SECTION_TITLE_PRIMARY_KEYWORDS = [
  "experience",
  "education",
  "project",
  "skill",
];
const SECTION_TITLE_SECONDARY_KEYWORDS = [
  "job",
  "course",
  "extracurricular",
  "objective",
  "summary",
  "award",
  "honor",
  "project",
  "certification",
  "certificate",
  "license",
  "volunteer",
  "volunteering",
  "language",
  "publication",
  "reference",
  "interest",
  "hobby",
  "achievement",
  "accomplishment",
  "involvement",
  "activity",
  "activities",
  "training",
  "professional development",
  "affiliation",
  "membership",
  "organization",
  "leadership",
  "technical",
  "competenc",
  "qualification",
  "profile",
  "about me",
  "career",
  "highlight",
  "strength",
];
const SECTION_TITLE_KEYWORDS = [
  ...SECTION_TITLE_PRIMARY_KEYWORDS,
  ...SECTION_TITLE_SECONDARY_KEYWORDS,
];

/**
 * Get the most common text height (body text size) to detect section headers
 * that are larger than normal text.
 */
const getMostCommonTextHeight = (lines: Lines): number => {
  const heightCount: Record<number, number> = {};
  let maxCount = 0;
  let commonHeight = 0;
  for (const line of lines) {
    for (const item of line) {
      const h = Math.round(item.height * 10) / 10; // round to 1 decimal
      heightCount[h] = (heightCount[h] || 0) + 1;
      if (heightCount[h] > maxCount) {
        maxCount = heightCount[h];
        commonHeight = h;
      }
    }
  }
  return commonHeight;
};

/**
 * Detect whether a line is a section title using multiple heuristic layers.
 */
const isSectionTitle = (line: Line, lineNumber: number, bodyHeight: number) => {
  const isFirstTwoLines = lineNumber < 2;
  const hasMoreThanOneItemInLine = line.length > 1;
  const hasNoItemInLine = line.length === 0;
  if (isFirstTwoLines || hasMoreThanOneItemInLine || hasNoItemInLine) {
    return false;
  }

  const textItem = line[0];
  if (!textItem) return false;
  const text = textItem.text.trim();

  // ── Layer 1: Bold + ALL CAPS (strongest signal) ──
  if (isBold(textItem) && hasLetterAndIsAllUpperCase(textItem)) {
    return true;
  }

  // Reject if too many words (section titles are short)
  const wordCount = text.split(" ").filter((s) => s !== "&").length;
  const startsWithCapitalLetter = /[A-Z]/.test(text.slice(0, 1));
  const textMatchesKeyword = SECTION_TITLE_KEYWORDS.some((keyword) =>
    text.toLowerCase().includes(keyword)
  );

  // ── Layer 2: Bold + keyword match (Google Docs / Canva style) ──
  if (
    isBold(textItem) &&
    wordCount <= 4 &&
    startsWithCapitalLetter &&
    textMatchesKeyword
  ) {
    return true;
  }

  // ── Layer 3: ALL CAPS + keyword match ──
  if (
    hasLetterAndIsAllUpperCase(textItem) &&
    wordCount <= 4 &&
    textMatchesKeyword
  ) {
    return true;
  }

  // ── Layer 4: Larger font size + keyword match (template-generated PDFs) ──
  const isLargerThanBody = textItem.height > bodyHeight * 1.15;
  if (
    isLargerThanBody &&
    wordCount <= 4 &&
    startsWithCapitalLetter &&
    hasOnlyLettersSpacesAmpersands(textItem) &&
    textMatchesKeyword
  ) {
    return true;
  }

  // ── Layer 5: Pure keyword match with structural constraints ──
  // Only if the text has at most 2 words and contains only letters/spaces/&
  if (
    wordCount <= 2 &&
    hasOnlyLettersSpacesAmpersands(textItem) &&
    startsWithCapitalLetter &&
    textMatchesKeyword
  ) {
    return true;
  }

  return false;
};
