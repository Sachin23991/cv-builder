/**
 * Template Registry — Simplified
 * 
 * Only 2 genuine template engines:
 *   1. Modern HTML (default) — config-driven, reads all Redux settings
 *   2. Custom HTML — Overleaf-style code editor
 * 
 * Visual variations (colors, fonts, layout) are handled by the 9 Presets
 * in the Presets tab of the Customization Studio.
 */

import type { TemplateAdapter } from './adapters';

export const templateRegistry: TemplateAdapter[] = [
  {
    id: 'modern-html',
    name: 'Modern HTML',
    source: 'impact-cv',
    category: 'professional',
    paradigm: 'config',
    description: 'Smart template that responds to all Customization Studio settings',
  },
  {
    id: 'custom-html',
    name: 'Custom HTML',
    source: 'custom-html',
    category: 'creative',
    paradigm: 'html',
    description: 'Write your own HTML/CSS template (Overleaf-style)',
  },
];

// Get template by ID
export const getTemplateById = (id: string): TemplateAdapter | undefined =>
  templateRegistry.find((t) => t.id === id);

// Search templates
export const searchTemplates = (query: string): TemplateAdapter[] => {
  const lower = query.toLowerCase();
  return templateRegistry.filter(
    (t) =>
      t.name.toLowerCase().includes(lower) ||
      t.description?.toLowerCase().includes(lower)
  );
};

// No backend templates needed — everything is config-driven via presets
export async function fetchTemplatesFromBackend(): Promise<TemplateAdapter[]> {
  return [];
}

console.log(`[Template Registry] ${templateRegistry.length} template engines loaded`);