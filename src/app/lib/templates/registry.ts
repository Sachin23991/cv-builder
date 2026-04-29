import type { TemplateAdapter } from "./adapters";
import { impactCVThemes } from "./impactcv/themes";
import { reactiveResumeTemplates } from "./reactiveresume/templates";

// Legacy template (current React-PDF based)
const legacyTemplate: TemplateAdapter = {
  id: "legacy-default",
  name: "Classic PDF",
  source: "legacy",
  category: "professional",
  paradigm: "pdf",
  description: "Traditional PDF resume with colored header",
};

// Custom HTML Template (Overleaf style)
const customHTMLTemplate: TemplateAdapter = {
  id: "custom-html",
  name: "Custom HTML (Overleaf)",
  source: "custom-html" as any,
  category: "creative",
  paradigm: "html" as any,
  description: "Write your own raw HTML/CSS for complete freedom",
};

// Impact-CV themes (20 themes)
const impactCVAdapters: TemplateAdapter[] = impactCVThemes.map((theme) => ({
  id: theme.id,
  name: theme.name,
  source: "impact-cv" as const,
  category: theme.category,
  paradigm: "config" as const,
  preview: theme.preview,
  description: `${theme.name} style template from Impact-CV`,
  render: () => {
    // Placeholder - actual rendering component created separately
    return null as unknown as JSX.Element;
  },
  getDefaultSettings: () => ({
    layout: { sidebarWidth: 30, main: [], sidebar: [] },
    design: { colors: { primary: "#38bdf8", text: "#171717", background: "#ffffff" } },
  }),
}));

// Reactive-Resume templates (14 templates)
const reactiveResumeAdapters: TemplateAdapter[] = reactiveResumeTemplates.map((template) => ({
  id: template.id,
  name: template.name,
  source: "reactive-resume" as const,
  category: template.category,
  paradigm: "component" as const,
  description: template.description,
  render: () => {
    return null as unknown as JSX.Element;
  },
  getDefaultSettings: () => ({
    layout: { sidebarWidth: 30, main: [], sidebar: [] },
    design: { colors: { primary: template.color, text: "#171717", background: "#ffffff" } },
  }),
}));

// All templates combined
export const templateRegistry: TemplateAdapter[] = [
  legacyTemplate,
  customHTMLTemplate,
  ...impactCVAdapters,
  ...reactiveResumeAdapters,
];

// Templates by source
export const templatesBySource = {
  legacy: templateRegistry.filter((t) => t.source === "legacy"),
  "custom-html": templateRegistry.filter((t) => t.source === "custom-html"),
  "impact-cv": templateRegistry.filter((t) => t.source === "impact-cv"),
  "reactive-resume": templateRegistry.filter((t) => t.source === "reactive-resume"),
};

// Templates by category
export const templatesByCategory = {
  professional: templateRegistry.filter((t) => t.category === "professional"),
  creative: templateRegistry.filter((t) => t.category === "creative"),
  academic: templateRegistry.filter((t) => t.category === "academic"),
  modern: templateRegistry.filter((t) => t.category === "modern"),
  minimal: templateRegistry.filter((t) => t.category === "minimal"),
};

// Get template by ID
export const getTemplateById = (id: string): TemplateAdapter | undefined => {
  return templateRegistry.find((t) => t.id === id);
};

// Search templates
export const searchTemplates = (query: string): TemplateAdapter[] => {
  const lower = query.toLowerCase();
  return templateRegistry.filter(
    (t) =>
      t.name.toLowerCase().includes(lower) ||
      t.description?.toLowerCase().includes(lower) ||
      t.source.toLowerCase().includes(lower)
  );
};

// Total count
export const templateCount = {
  total: templateRegistry.length,
  legacy: templatesBySource.legacy.length,
  "impact-cv": templatesBySource["impact-cv"].length,
  "reactive-resume": templatesBySource["reactive-resume"].length,
};

console.log(`[Template Registry] Loaded ${templateCount.total} templates:`, {
  legacy: templateCount.legacy,
  "impact-cv": templateCount["impact-cv"],
  "reactive-resume": templateCount["reactive-resume"],
});
