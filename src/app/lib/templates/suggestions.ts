import type { TemplateAdapter } from "./adapters";
import { templateRegistry } from "./registry";

export interface SuggestionCriteria {
  jobTitle?: string;
  industry?: string;
  experienceLevel?: "entry" | "mid" | "senior" | "executive";
  designPreference?: "modern" | "traditional" | "creative" | "minimal";
  atsCompatibility?: boolean;
  colorPreference?: string;
}

/**
 * With only 2 template engines (modern-html, custom-html),
 * suggestions now focus on recommending presets rather than templates.
 * This is a simplified version that still satisfies the exported API.
 */

// Main suggestion function — returns the modern-html template for most cases
export const suggestTemplates = (
  _criteria: SuggestionCriteria,
  limit: number = 2
): TemplateAdapter[] => {
  return templateRegistry.slice(0, limit);
};

// Quick suggestions — just return available templates
export const getQuickSuggestions = (): TemplateAdapter[] => {
  return templateRegistry.filter(Boolean);
};

// Question-based suggestions
export const getSuggestionsFromAnswers = (answers: {
  role?: string;
  experience?: string;
  style?: string;
  ats?: boolean;
}): TemplateAdapter[] => {
  // For custom HTML users, suggest custom-html
  if (answers.style === "creative") {
    return templateRegistry.filter((t) => t.id === "custom-html");
  }
  // Default: modern-html
  return templateRegistry.filter((t) => t.id === "modern-html");
};
