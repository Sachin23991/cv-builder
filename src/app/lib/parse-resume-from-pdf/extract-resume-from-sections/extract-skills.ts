import type { ResumeSkills } from "lib/redux/types";
import type { ResumeSectionToLines } from "lib/parse-resume-from-pdf/types";
import { deepClone } from "lib/deep-clone";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import { initialFeaturedSkills } from "lib/redux/resumeSlice";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

/**
 * Extract skills from the skills section.
 *
 * Skills are commonly presented in several formats:
 *   1. Comma-separated list: "JavaScript, Python, React, Node.js"
 *   2. Pipe-separated list: "JavaScript | Python | React"
 *   3. Bullet points: "• JavaScript  • Python  • React"
 *   4. Category + list: "Languages: JavaScript, Python, Java"
 *   5. Free-form descriptions
 *
 * The parser attempts to extract individual skills from all these formats
 * and populate both featuredSkills (top 6) and descriptions.
 */
export const extractSkills = (sections: ResumeSectionToLines) => {
  const lines = getSectionLinesByKeywords(sections, ["skill", "technical", "competenc", "qualification"]);
  const descriptionsLineIdx = getDescriptionsLineIdx(lines) ?? 0;
  const descriptionsLines = lines.slice(descriptionsLineIdx);
  const descriptions = getBulletPointsFromLines(descriptionsLines);

  // Try to parse individual skills from all lines
  const allSkillTexts: string[] = [];
  for (const line of lines) {
    for (const item of line) {
      const text = item.text.trim();
      if (!text) continue;

      // Check for category pattern: "Category: skill1, skill2, skill3"
      const categoryMatch = text.match(/^([^:]+):\s*(.+)$/);
      if (categoryMatch) {
        const skillsText = categoryMatch[2] ?? "";
        const skills = splitSkillsText(skillsText);
        allSkillTexts.push(...skills);
        continue;
      }

      // Check for comma or pipe-separated lists
      if (text.includes(",") || text.includes("|") || text.includes("•")) {
        const skills = splitSkillsText(text);
        if (skills.length > 1) {
          allSkillTexts.push(...skills);
          continue;
        }
      }

      // Otherwise, add the whole text as a skill if it's not too long
      if (text.split(/\s+/).length <= 5) {
        allSkillTexts.push(text);
      }
    }
  }

  // Deduplicate and clean
  const uniqueSkills = Array.from(new Set(
    allSkillTexts
      .map((s) => s.trim())
      .filter((s): s is string => s.length > 0 && s.length < 50)
  ));

  const featuredSkills = deepClone(initialFeaturedSkills);
  
  if (uniqueSkills.length > 0) {
    // Populate featured skills from parsed individual skills
    for (let i = 0; i < Math.min(uniqueSkills.length, 6); i++) {
      const fs = featuredSkills[i];
      const skill = uniqueSkills[i];
      if (fs && skill) fs.skill = skill;
    }
  } else if (descriptionsLineIdx !== 0) {
    // Fallback to original behavior
    const featuredSkillsLines = lines.slice(0, descriptionsLineIdx);
    const featuredSkillsTextItems = featuredSkillsLines
      .flat()
      .filter((item) => item.text.trim())
      .slice(0, 6);
    for (let i = 0; i < featuredSkillsTextItems.length; i++) {
      const fs = featuredSkills[i];
      const item = featuredSkillsTextItems[i];
      if (fs && item) fs.skill = item.text;
    }
  }

  // If we extracted individual skills, use the remaining ones as descriptions
  const finalDescriptions = uniqueSkills.length > 6
    ? [uniqueSkills.slice(6).join(", ")]
    : descriptions;

  const skills: ResumeSkills = {
    featuredSkills,
    descriptions: finalDescriptions.length > 0 ? finalDescriptions : descriptions,
  };

  return { skills };
};

/**
 * Split a skills text string by common delimiters (comma, pipe, bullet, semicolon)
 */
function splitSkillsText(text: string): string[] {
  return text
    .split(/[,|;•⋅∙●⦁⚫︎⬤⚬○]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 50);
}
