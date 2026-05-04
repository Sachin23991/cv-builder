/**
 * Template Registry
 * Fetches template configurations from backend and provides them to frontend
 */

import type { TemplateAdapter } from './adapters';
import { impactCVThemes } from './impactcv/themes';
import { apiUrl } from '../api';

// Default templates while backend loads
const defaultTemplates: TemplateAdapter[] = [
  {
    id: 'legacy-default',
    name: 'Classic PDF',
    source: 'legacy',
    category: 'professional',
    paradigm: 'pdf',
    description: 'Traditional PDF resume with colored header',
  },
  {
    id: 'custom-html',
    name: 'Custom HTML',
    source: 'custom-html',
    category: 'creative',
    paradigm: 'html',
    description: 'Write your own HTML/CSS template',
  },
];

// Impact-CV themes (20 themes)
const impactCVAdapters: TemplateAdapter[] = impactCVThemes.map((theme) => ({
  id: theme.id,
  name: theme.name,
  source: 'impact-cv' as const,
  category: theme.category,
  paradigm: 'config' as const,
  preview: theme.preview,
  description: `${theme.name} style template from Impact-CV`,
  render: () => null as unknown as JSX.Element,
  getDefaultSettings: () => ({
    layout: { sidebarWidth: 30, main: [], sidebar: [] },
    design: { colors: { primary: '#38bdf8', text: '#171717', background: '#ffffff' } },
  }),
}));

// Fetch templates from backend
let backendTemplates: TemplateAdapter[] = [];
let templatesLoaded = false;

export async function fetchTemplatesFromBackend(): Promise<TemplateAdapter[]> {
  try {
    const response = await fetch(apiUrl('/api/templates'));
    const data = await response.json();

    if (data.success && data.data?.templates) {
      backendTemplates = data.data.templates.map((t: any) => ({
        id: t.id,
        name: t.name,
        source: 'backend' as const,
        category: t.category as TemplateAdapter['category'],
        paradigm: 'config' as const,
        description: t.description,
        preview: t.preview,
        config: t, // Store full config for rendering
        render: () => null as unknown as JSX.Element,
        getDefaultSettings: () => ({
          layout: { sidebarWidth: t.layout?.sidebarWidth || 30, main: t.layout?.mainSections || [], sidebar: t.layout?.sidebarSections || [] },
          design: { colors: { primary: t.primaryColor || '#3b82f6', text: '#171717', background: '#ffffff' } },
        }),
      }));
      templatesLoaded = true;
    }
  } catch (error) {
    console.error('Failed to fetch templates from backend:', error);
  }

  return backendTemplates;
}

// Combined template registry
export const templateRegistry: TemplateAdapter[] = [
  ...defaultTemplates,
  ...impactCVAdapters,
  ...backendTemplates,
];

// Templates by source
export const templatesBySource = {
  legacy: templateRegistry.filter((t) => t.source === 'legacy'),
  'custom-html': templateRegistry.filter((t) => t.source === 'custom-html'),
  'impact-cv': templateRegistry.filter((t) => t.source === 'impact-cv'),
  backend: backendTemplates,
};

// Templates by category
export const templatesByCategory = {
  professional: templateRegistry.filter((t) => t.category === 'professional'),
  creative: templateRegistry.filter((t) => t.category === 'creative'),
  academic: templateRegistry.filter((t) => t.category === 'academic'),
  modern: templateRegistry.filter((t) => t.category === 'modern'),
  minimal: templateRegistry.filter((t) => t.category === 'minimal'),
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
  default: defaultTemplates.length,
  'impact-cv': impactCVAdapters.length,
  backend: backendTemplates.length,
};

// Update registry with backend templates
export const updateTemplateRegistry = (newTemplates: TemplateAdapter[]) => {
  backendTemplates = newTemplates;
  templatesLoaded = true;
  // Refresh the registry
  Object.assign(templateRegistry, [
    ...defaultTemplates,
    ...impactCVAdapters,
    ...backendTemplates,
  ]);
};

console.log(`[Template Registry] Initialized with ${templateCount.total} templates`);