import type { TemplateAdapter } from "./adapters";
import { templateRegistry, templatesByCategory } from "./registry";

export interface SuggestionCriteria {
  jobTitle?: string;
  industry?: string;
  experienceLevel?: "entry" | "mid" | "senior" | "executive";
  designPreference?: "modern" | "traditional" | "creative" | "minimal";
  atsCompatibility?: boolean;
  colorPreference?: string;
}

// Keywords that map to categories
const industryKeywords: Record<string, string[]> = {
  tech: ["engineer", "developer", "software", "data", "analyst", "IT", "devops", "architect"],
  creative: ["designer", "artist", "creative", "writer", "content", "marketing", "brand"],
  finance: ["accountant", "financial", "banking", "investment", "economist", "finance"],
  medical: ["doctor", "nurse", "healthcare", "medical", "pharma", "biotech"],
  academic: ["professor", "researcher", "phd", "academic", "scientist", "teacher"],
  legal: ["lawyer", "attorney", "legal", "counsel", "compliance"],
  business: ["manager", "director", "executive", "CEO", "COO", "CTO", "business", "consultant"],
};

const jobTitleKeywords: Record<string, string[]> = {
  "entry": ["junior", "intern", "associate", "entry", "starter", "beginner"],
  "mid": ["senior", "lead", "specialist", "analyst", "consultant"],
  "senior": ["senior", "principal", "staff", "head", "director", "VP"],
  "executive": ["VP", "Vice President", "Director", "C-level", "CEO", "COO", "CTO", "CFO"],
};

// ATS-friendly templates (simple, single-column, clean)
const atsFriendlyTemplates = [
  "impactcv-basic",
  "impactcv-minimal",
  "impactcv-nordic",
  "impactcv-professional",
  "impactcv-technical",
];

// Score a template based on criteria
const scoreTemplate = (template: TemplateAdapter, criteria: SuggestionCriteria): number => {
  let score = 0;

  // Industry matching
  if (criteria.industry) {
    const industryKey = Object.entries(industryKeywords).find(([, keywords]) =>
      keywords.some((k) => criteria.industry?.toLowerCase().includes(k))
    )?.[0];

    if (industryKey === "tech" && template.category === "professional") score += 3;
    if (industryKey === "creative" && template.category === "creative") score += 3;
    if (industryKey === "academic" && (template.category === "academic" || template.id.includes("academic"))) score += 4;
    if (industryKey === "finance" && template.category === "professional") score += 3;
  }

  // Experience level matching
  if (criteria.experienceLevel) {
    const level = criteria.experienceLevel;

    if (level === "entry" && (template.category === "minimal" || template.id.includes("basic"))) {
      score += 3;
    }
    if (level === "senior" || level === "executive") {
      if (template.category === "professional" || template.source === "legacy") {
        score += 3;
      }
    }
    if (level === "mid" && (template.category === "professional" || template.category === "modern")) {
      score += 2;
    }
  }

  // Design preference matching
  if (criteria.designPreference) {
    if (criteria.designPreference === template.category) {
      score += 4;
    }
  }

  // ATS compatibility
  if (criteria.atsCompatibility && atsFriendlyTemplates.includes(template.id)) {
    score += 5;
  }

  // Boost professional templates for most job applications
  if (template.category === "professional") {
    score += 1;
  }

  return score;
};

// Main suggestion function
export const suggestTemplates = (
  criteria: SuggestionCriteria,
  limit: number = 5
): TemplateAdapter[] => {
  const scored = templateRegistry.map((template) => ({
    template,
    score: scoreTemplate(template, criteria),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return top N templates with positive scores
  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.template);
};

// Get suggestions based on common scenarios
export const getQuickSuggestions = (): TemplateAdapter[] => {
  return [
    // Always good options for different scenarios
    templateRegistry.find((t) => t.id === "impactcv-professional")!,
    templateRegistry.find((t) => t.id === "impactcv-modern")!,
    templateRegistry.find((t) => t.id === "impactcv-minimal")!,
    templateRegistry.find((t) => t.id === "impactcv-technical")!,
    templateRegistry.find((t) => t.id === "reactive-onyx")!,
  ].filter(Boolean);
};

// Question-based suggestions
export const getSuggestionsFromAnswers = (answers: {
  role?: string;
  experience?: string;
  style?: string;
  ats?: boolean;
}): TemplateAdapter[] => {
  const criteria: SuggestionCriteria = {};

  if (answers.role) {
    criteria.industry = answers.role;
  }

  if (answers.experience) {
    criteria.experienceLevel = answers.experience as SuggestionCriteria["experienceLevel"];
  }

  if (answers.style) {
    criteria.designPreference = answers.style as SuggestionCriteria["designPreference"];
  }

  if (answers.ats) {
    criteria.atsCompatibility = true;
  }

  return suggestTemplates(criteria);
};
