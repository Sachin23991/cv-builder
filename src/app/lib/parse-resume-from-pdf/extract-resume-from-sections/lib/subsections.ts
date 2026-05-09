import { BULLET_POINTS } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";
import { isBold } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import type { Lines, Line, Subsections, TextItem } from "lib/parse-resume-from-pdf/types";

/**
 * Divide lines into subsections based on multiple heuristics:
 *
 * 1. Vertical line gap (primary) — larger gap = new subsection
 * 2. Bold text transition (fallback) — non-bold → bold = new subsection
 * 3. Institution/School keyword (fallback) — line containing school/univ keyword starts new subsection
 * 4. Bold reappearance with structural cues (fallback)
 *
 * Supports international resume formats: US, Indian, European, East Asian, etc.
 */
export const divideSectionIntoSubsections = (lines: Lines): Subsections => {
  if (lines.length === 0) return [];

  // The main heuristic: check if vertical line gap is larger than typical * 1.4
  const isLineNewSubsectionByLineGap =
    createIsLineNewSubsectionByLineGap(lines);

  let subsections = createSubsections(lines, isLineNewSubsectionByLineGap);

  // Fallback 1: Bold text transition (non-bold → bold = new entry)
  if (subsections.length <= 1) {
    const isLineNewSubsectionByBold = (line: Line, prevLine: Line) => {
      const prevFirst = getFirstItem(prevLine);
      const currFirst = getFirstItem(line);
      if (!prevFirst || !currFirst) return false;

      if (
        !isBold(prevFirst) &&
        isBold(currFirst) &&
        !BULLET_POINTS.includes(currFirst.text)
      ) {
        return true;
      }
      return false;
    };

    subsections = createSubsections(lines, isLineNewSubsectionByBold);
  }

  // Fallback 2: Institution/School keyword detection
  // Handles resumes where all entries have consistent spacing
  if (subsections.length <= 1) {
    const isLineNewSubsectionByInstitution = (
      line: Line,
      _prevLine: Line
    ) => {
      const first = getFirstItem(line);
      if (!first) return false;
      return hasInstitutionKeyword(first.text) && line.length <= 2;
    };

    const result = createSubsections(lines, isLineNewSubsectionByInstitution);
    if (result.length > 1) {
      subsections = result;
    }
  }

  // Fallback 3: Bold reappearance with degree/institution cues
  if (subsections.length <= 1 && lines.length > 2) {
    const boldLineIndices: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const first = getFirstItem(line);
      if (
        first &&
        isBold(first) &&
        !BULLET_POINTS.includes(first.text) &&
        first.text.split(/\s+/).length <= 8 &&
        !first.text.startsWith("•")
      ) {
        boldLineIndices.push(i);
      }
    }

    if (boldLineIndices.length > 1) {
      const isNewSubByBoldReappearance = (line: Line, prevLine: Line) => {
        const currFirst = getFirstItem(line);
        const prevFirst = getFirstItem(prevLine);
        if (!currFirst || !prevFirst) return false;

        if (isBold(currFirst) && !BULLET_POINTS.includes(currFirst.text)) {
          const text = currFirst.text;
          if (
            !isBold(prevFirst) ||
            hasInstitutionKeyword(text) ||
            hasDegreeKeyword(text)
          ) {
            return true;
          }
        }
        return false;
      };

      const result = createSubsections(lines, isNewSubByBoldReappearance);
      if (result.length > 1) {
        subsections = result;
      }
    }
  }

  return subsections;
};

// ─── Safe accessor ───────────────────────────────────────────────
/** Safely get the first TextItem from a line, returning undefined if empty */
const getFirstItem = (line: Line): TextItem | undefined => {
  return line && line.length > 0 ? line[0] : undefined;
};

// ─── Institution keywords (global) ──────────────────────────────
// prettier-ignore
const INSTITUTION_KEYWORDS = [
  // Universal
  'university', 'college', 'institute', 'school', 'academy', 'polytechnic',
  'campus', 'faculty', 'department',
  // Indian
  'vidyalaya', 'vidya', 'vihar', 'vidyapeeth', 'vishwavidyalaya',
  'mahavidyalaya', 'convent', 'gurukul', 'kendriya',
  // European
  'lycée', 'gymnasium', 'hochschule', 'universität', 'fachhochschule',
  'universidad', 'università', 'universidade', 'universiteit',
  'école', 'escuela', 'scuola', 'skola',
  // East Asian
  '大学', '大學', '学院', '學院',
  // Middle Eastern
  'جامعة', 'دانشگاه',
  // African
  'chuo kikuu',
  // Other
  'seminary', 'conservatory', 'foundation',
];
const hasInstitutionKeyword = (text: string): boolean => {
  const lower = text.toLowerCase();
  return INSTITUTION_KEYWORDS.some((kw) => lower.includes(kw));
};

// ─── Degree keywords (global) ───────────────────────────────────
// prettier-ignore
const DEGREE_KEYWORDS = [
  // US / International
  'bachelor', 'master', 'phd', 'ph.d', 'associate', 'diploma', 'doctorate',
  // Common abbreviations
  'b.tech', 'btech', 'm.tech', 'mtech', 'b.sc', 'm.sc', 'bca', 'mca',
  'b.e.', 'm.e.', 'mba', 'bba', 'b.com', 'm.com', 'mbbs', 'b.a.', 'm.a.',
  // Indian school levels
  'intermediate', 'matriculation', 'higher secondary', 'senior secondary',
  'hsc', 'ssc', 'cbse', 'icse',
  // European
  'abitur', 'diplom', 'magister', 'licence', 'maîtrise', 'laurea',
  'staatsexamen', 'kandidat',
  // UK
  'a-level', 'gcse', 'btec', 'hnc', 'hnd', 'nvq',
  // East Asian
  'o-level',
  // Latin America
  'licenciatura', 'bachillerato', 'técnico',
];
const hasDegreeKeyword = (text: string): boolean => {
  const lower = text.toLowerCase();
  return DEGREE_KEYWORDS.some((kw) => lower.includes(kw));
};

type IsLineNewSubsection = (line: Line, prevLine: Line) => boolean;

const createIsLineNewSubsectionByLineGap = (
  lines: Lines
): IsLineNewSubsection => {
  const lineGapToCount: { [lineGap: number]: number } = {};
  const linesY = lines.map((line) => {
    const first = getFirstItem(line);
    return first ? first.y : 0;
  });
  let lineGapWithMostCount: number = 0;
  let maxCount = 0;
  for (let i = 1; i < linesY.length; i++) {
    const lineGap = Math.round((linesY[i - 1] ?? 0) - (linesY[i] ?? 0));
    if (lineGap <= 0) continue;
    if (!lineGapToCount[lineGap]) lineGapToCount[lineGap] = 0;
    lineGapToCount[lineGap] += 1;
    if (lineGapToCount[lineGap] > maxCount) {
      lineGapWithMostCount = lineGap;
      maxCount = lineGapToCount[lineGap];
    }
  }
  const subsectionLineGapThreshold = lineGapWithMostCount * 1.4;

  const isLineNewSubsection = (line: Line, prevLine: Line) => {
    const prevFirst = getFirstItem(prevLine);
    const currFirst = getFirstItem(line);
    const prevY = prevFirst ? prevFirst.y : 0;
    const currY = currFirst ? currFirst.y : 0;
    return Math.round(prevY - currY) > subsectionLineGapThreshold;
  };

  return isLineNewSubsection;
};

const createSubsections = (
  lines: Lines,
  isLineNewSubsection: IsLineNewSubsection
): Subsections => {
  const subsections: Subsections = [];
  let subsection: Lines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (i === 0) {
      subsection.push(line);
      continue;
    }
    const prevLine = lines[i - 1];
    if (prevLine && isLineNewSubsection(line, prevLine)) {
      subsections.push(subsection);
      subsection = [];
    }
    subsection.push(line);
  }
  if (subsection.length > 0) {
    subsections.push(subsection);
  }
  return subsections;
};
