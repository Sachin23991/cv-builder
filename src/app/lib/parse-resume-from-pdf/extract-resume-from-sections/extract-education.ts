import type {
  TextItem,
  FeatureSet,
  ResumeSectionToLines,
} from "lib/parse-resume-from-pdf/types";
import type { ResumeEducation } from "lib/redux/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import { divideSectionIntoSubsections } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/subsections";
import {
  DATE_FEATURE_SETS,
  hasComma,
  hasLetter,
  hasNumber,
  isBold,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import { getTextWithHighestFeatureScore } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/feature-scoring-system";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

/**
 * Industry-standard education extraction supporting international formats.
 *
 *              Unique Attribute
 * School       Has school/institution keyword
 * Degree       Has degree keyword
 * GPA          Has GPA/CGPA/Percentage pattern
 * Date         Has year/month pattern
 */

// ─── School Detection ────────────────────────────────────────────
// prettier-ignore
const SCHOOLS = [
  // Universal
  'College', 'University', 'Institute', 'School', 'Academy', 'Polytechnic',
  'Campus', 'Faculty', 'Department',
  // Indian
  'Vidyalaya', 'Vidya', 'Vihar', 'Vidyapeeth', 'Vishwavidyalaya',
  'Mahavidyalaya', 'Gurukul', 'Convent', 'Public School', 'Kendriya',
  // European — French, German, Spanish, Italian, Portuguese, Dutch, Scandinavian
  'Lycée', 'Gymnasium', 'Hochschule', 'Universität', 'Fachhochschule',
  'Colegio', 'Universidad', 'Università', 'Universidade', 'Universiteit',
  'École', 'Escuela', 'Scuola', 'Skola',
  // UK
  'Grammar School', 'Sixth Form',
  // East Asian
  '大学', '大學', '学院', '學院',
  // Middle Eastern
  'جامعة', 'دانشگاه',
  // African
  'Chuo Kikuu',
  // Other
  'BASIS', 'Magnet', 'Seminary', 'Conservatory', 'Foundation',
];
const hasSchool = (item: TextItem) =>
  SCHOOLS.some((school) =>
    item.text.toLowerCase().includes(school.toLowerCase())
  );

// ─── Degree Detection ────────────────────────────────────────────
// prettier-ignore
const DEGREES = [
  // US / International
  "Associate", "Bachelor", "Master", "PhD", "Ph.D", "Doctorate", "Diploma",
  // Common Abbreviations
  "B.S.", "B.A.", "M.S.", "M.A.", "B.Sc", "M.Sc", "B.Com", "M.Com",
  "B.E.", "M.E.", "B.B.A", "M.B.A", "MBA", "BBA", "D.Phil",
  // Indian
  "B.Tech", "M.Tech", "BTech", "MTech", "B.Arch", "M.Arch",
  "B.Pharm", "M.Pharm", "MBBS", "BDS", "MDS", "BCA", "MCA",
  "B.Ed", "M.Ed", "LLB", "LLM", "B.Des", "M.Des",
  // Indian School Levels
  "Intermediate", "Matriculation", "Higher Secondary", "Senior Secondary",
  "Secondary", "HSC", "SSC", "CBSE", "ICSE", "ISC",
  "10th", "12th", "10+2", "Class X", "Class XII", "Class 10", "Class 12",
  // UK
  "A-Level", "A Level", "GCSE", "BTEC", "HNC", "HND", "NVQ",
  "Foundation Degree", "O-Level", "O Level",
  // European
  "Abitur", "Diplom", "Magister", "Staatsexamen", "Licence", "Maîtrise",
  "Laurea", "Kandidat", "Licentiat",
  // Latin American
  "Licenciatura", "Bachillerato", "Técnico", "Tecnólogo", "Pregrado",
  // East Asian
  "学士", "硕士", "博士",
  // French system
  "Baccalauréat", "DUT", "BTS", "Prépa", "Grande École",
  // Australian / NZ
  "Certificate III", "Certificate IV", "Advanced Diploma",
  // General
  "Postgraduate", "Undergraduate", "Graduate", "Certification", "Certificate",
];

const hasDegree = (item: TextItem) => {
  const text = item.text;
  return (
    DEGREES.some(
      (degree) =>
        text.includes(degree) ||
        text.toLowerCase().includes(degree.toLowerCase())
    ) ||
    // Match common abbreviations: AA, B.S., MBA, B.Tech, etc.
    /\b[ABM]\.[A-Z]/.test(text) ||
    /\b[ABM][A-Z]{1,3}\b/.test(text) ||
    // Match "Bachelor of...", "Master of..."
    /\b(Bachelor|Master|Doctor)\s+(of|in)\b/i.test(text)
  );
};

// ─── GPA / CGPA / Percentage / Global Grading Detection ─────────
// US GPA: 0.00 - 4.00
const matchUSGPA = (item: TextItem) =>
  item.text.match(/\b([0-3]\.\d{1,2}|4\.0{1,2})\b/);

// CGPA: 0.00 - 10.00 (Indian, common scale)
const matchCGPA = (item: TextItem) =>
  item.text.match(/(?:CGPA|C\.G\.P\.A|SGPA|GPA|CPI|WAM)\s*[:\-–]?\s*(\d{1,2}\.\d{1,2})/i);

// German grade: 1.0 - 5.0 (1.0 = best)
const matchGermanGrade = (item: TextItem) =>
  item.text.match(/(?:Note|Abschlussnote|Durchschnitt)\s*[:\-–]?\s*([1-5]\.\d)/i);

// French grade: X/20
const matchFrenchGrade = (item: TextItem) =>
  item.text.match(/(\d{1,2}(?:\.\d{1,2})?)\s*\/\s*20/);

// UK Honours: "First Class", "2:1", "Upper Second", "Distinction"
const matchUKHonours = (item: TextItem) =>
  item.text.match(/\b(First Class|1st Class|2:1|2\.1|Upper Second|2:2|2\.2|Lower Second|Third Class|Distinction|Merit|Credit|Pass|Honours?)\b/i);

// ECTS grade: A-F
const matchECTSGrade = (item: TextItem) =>
  item.text.match(/(?:ECTS|Grade)\s*[:\-–]?\s*([A-F])\b/i);

// Percentage: "Percentage: 92" or "92%" or "Marks: 94"
const matchPercentage = (item: TextItem) =>
  item.text.match(
    /(?:Percentage|Percent|Marks|Score|Grade)\s*[:\-–]?\s*(\d{1,3}(?:\.\d{1,2})?)\s*%?/i
  ) || item.text.match(/(\d{2,3}(?:\.\d{1,2})?)\s*%/);

// Generic GPA pattern: any "X.XX" where text also mentions GPA/CGPA/grade context
const matchGenericGradeNumber = (item: TextItem) => {
  const text = item.text;
  // If text explicitly mentions GPA/CGPA/grade context, extract the number
  if (/(?:GPA|CGPA|C\.G\.P\.A|CPI|grade|score)/i.test(text)) {
    const match = text.match(/(\d{1,2}\.\d{1,2})/);
    if (match) return match;
  }
  return null;
};

// Fallback: match any decimal that could be a grade (0-10 range)
const matchGradeInRange = (item: TextItem) => {
  const match = item.text.match(/\b(\d{1,2}\.\d{1,2})\b/);
  if (match) {
    const val = parseFloat(match[1] ?? "0");
    if (val >= 0 && val <= 10) return match;
  }
  return null;
};

// Fallback: match plain number that could be a percentage (50-100)
const matchPlainPercentage = (item: TextItem) => {
  const text = item.text.trim();
  const val = parseFloat(text);
  if (Number.isFinite(val) && val >= 50 && val <= 100 && text.length <= 6) {
    return [String(val)] as RegExpMatchArray;
  }
  return null;
};

const hasGPAContext = (item: TextItem) =>
  /(?:GPA|CGPA|C\.G\.P\.A|CPI|SGPA|grade|percentage|percent|marks|score)/i.test(
    item.text
  );

// ─── Feature Sets ────────────────────────────────────────────────

const SCHOOL_FEATURE_SETS: FeatureSet[] = [
  [hasSchool, 4],
  [hasDegree, -4],
  [hasNumber, -3],
  [hasGPAContext, -4],
];

const DEGREE_FEATURE_SETS: FeatureSet[] = [
  [hasDegree, 4],
  [hasSchool, -3],
  [hasGPAContext, -2], // Penalize if it's mainly a GPA field
];

const GPA_FEATURE_SETS: FeatureSet[] = [
  [matchCGPA, 4, true], // Strongest: explicit "CGPA: 9.05"
  [matchPercentage, 4, true], // "Percentage: 92" or "92%"
  [matchGermanGrade, 4, true], // German "Note: 1.3"
  [matchFrenchGrade, 4, true], // French "14/20"
  [matchUKHonours, 4, true], // UK "First Class", "2:1"
  [matchECTSGrade, 3, true], // ECTS "Grade: A"
  [matchGenericGradeNumber, 3, true], // Number in GPA context
  [matchUSGPA, 3, true], // US 0-4 scale
  [matchGradeInRange, 2, true], // Any decimal 0-10
  [matchPlainPercentage, 1, true], // Plain number 50-100
  [hasComma, -3],
  // Reduce penalty for having letters — GPA fields often have "CGPA:", "Percentage:"
  [(item: TextItem) => item.text.split(/\s+/).length > 4, -3],
];

// ─── Main Extraction ─────────────────────────────────────────────

export const extractEducation = (sections: ResumeSectionToLines) => {
  const educations: ResumeEducation[] = [];
  const educationsScores = [];
  const lines = getSectionLinesByKeywords(sections, ["education"]);
  const subsections = divideSectionIntoSubsections(lines);

  for (const subsectionLines of subsections) {
    const textItems = subsectionLines.flat();

    // Skip subsections with no meaningful content
    if (textItems.length === 0) continue;
    if (textItems.every((item) => !item.text.trim())) continue;

    const [school, schoolScores] = getTextWithHighestFeatureScore(
      textItems,
      SCHOOL_FEATURE_SETS
    );
    const [degree, degreeScores] = getTextWithHighestFeatureScore(
      textItems,
      DEGREE_FEATURE_SETS
    );
    const [gpa, gpaScores] = getTextWithHighestFeatureScore(
      textItems,
      GPA_FEATURE_SETS
    );
    const [date, dateScores] = getTextWithHighestFeatureScore(
      textItems,
      DATE_FEATURE_SETS
    );

    let descriptions: string[] = [];
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines);
    if (descriptionsLineIdx !== undefined) {
      const descriptionsLines = subsectionLines.slice(descriptionsLineIdx);
      descriptions = getBulletPointsFromLines(descriptionsLines);
    }

    // Post-process: if GPA is empty, try to extract from degree text
    let finalGPA = gpa;
    let finalDegree = degree;
    if (!finalGPA && finalDegree) {
      // Check if CGPA/GPA/Percentage is embedded in degree text
      const cgpaInDegree = finalDegree.match(
        /(?:CGPA|C\.G\.P\.A|GPA|CPI|SGPA)\s*[:\-–]?\s*(\d{1,2}\.\d{1,2})/i
      );
      const pctInDegree = finalDegree.match(
        /(?:Percentage|Percent|Marks)\s*[:\-–]?\s*(\d{1,3}(?:\.\d{1,2})?)\s*%?/i
      );
      if (cgpaInDegree) {
        finalGPA = cgpaInDegree[1] ?? "";
        // Clean the degree text by removing the GPA portion
        finalDegree = finalDegree
          .replace(
            /[;,]?\s*(?:CGPA|C\.G\.P\.A|GPA|CPI|SGPA)\s*[:\-–]?\s*\d{1,2}\.\d{1,2}/i,
            ""
          )
          .trim();
      } else if (pctInDegree) {
        finalGPA = (pctInDegree[1] ?? "") + "%";
        finalDegree = finalDegree
          .replace(
            /[;,]?\s*(?:Percentage|Percent|Marks)\s*[:\-–]?\s*\d{1,3}(?:\.\d{1,2})?\s*%?/i,
            ""
          )
          .trim();
      }
    }

    // Post-process: if GPA is empty, scan all text items directly
    if (!finalGPA) {
      for (const item of textItems) {
        const text = item.text;
        // CGPA/GPA/WAM explicit pattern
        const cgpaMatch = text.match(
          /(?:CGPA|C\.G\.P\.A|GPA|CPI|SGPA|WAM)\s*[:\-–]?\s*(\d{1,2}\.\d{1,2})/i
        );
        // Percentage
        const pctMatch = text.match(
          /(?:Percentage|Percent|Marks|Score)\s*[:\-–]?\s*(\d{1,3}(?:\.\d{1,2})?)\s*%?/i
        );
        // UK Honours classification
        const ukMatch = text.match(
          /\b(First Class|1st Class|2:1|2\.1|Upper Second|2:2|2\.2|Lower Second|Third Class|Distinction|Merit)\b/i
        );
        // French X/20
        const frMatch = text.match(/(\d{1,2}(?:\.\d{1,2})?)\s*\/\s*20/);
        // German Note
        const deMatch = text.match(
          /(?:Note|Abschlussnote|Durchschnitt)\s*[:\-–]?\s*([1-5]\.\d)/i
        );
        // Percentage symbol
        const pctSymbol = text.match(/(\d{2,3}(?:\.\d{1,2})?)\s*%/);

        if (cgpaMatch) { finalGPA = cgpaMatch[1] ?? ""; break; }
        if (pctMatch) { finalGPA = (pctMatch[1] ?? "") + "%"; break; }
        if (ukMatch) { finalGPA = ukMatch[1] ?? ""; break; }
        if (frMatch) { finalGPA = (frMatch[1] ?? "") + "/20"; break; }
        if (deMatch) { finalGPA = deMatch[1] ?? ""; break; }
        if (pctSymbol) { finalGPA = (pctSymbol[1] ?? "") + "%"; break; }
      }
    }

    // Post-process: if school is empty, try first bold text item or first line text
    let finalSchool = school;
    if (!finalSchool) {
      // Try to find a bold text item that isn't the degree
      const boldItems = textItems.filter(
        (item) => isBold(item) && item.text.trim() && item.text !== degree
      );
      if (boldItems.length > 0 && boldItems[0]) {
        finalSchool = boldItems[0].text.trim();
      } else if (subsectionLines.length > 0) {
        const firstLine = subsectionLines[0];
        const firstItem = firstLine && firstLine.length > 0 ? firstLine[0] : undefined;
        if (firstItem) {
          const firstText = firstItem.text.trim();
          if (firstText && firstText !== degree && firstText !== date) {
            finalSchool = firstText;
          }
        }
      }
    }

    educations.push({
      school: finalSchool,
      degree: finalDegree,
      gpa: finalGPA,
      date,
      descriptions,
    });
    educationsScores.push({
      schoolScores,
      degreeScores,
      gpaScores,
      dateScores,
    });
  }

  if (educations.length !== 0) {
    const coursesLines = getSectionLinesByKeywords(sections, ["course"]);
    if (coursesLines.length !== 0) {
      const firstEdu = educations[0];
      if (firstEdu) {
        firstEdu.descriptions.push(
          "Courses: " +
            coursesLines
              .flat()
              .map((item) => item.text)
              .join(" ")
        );
      }
    }
  }

  return {
    educations,
    educationsScores,
  };
};
