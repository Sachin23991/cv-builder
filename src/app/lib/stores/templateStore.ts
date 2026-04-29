import { create } from "zustand";
import type { TemplateSettings } from "lib/redux/types";

interface TemplateStore {
  // State
  activeTemplate: string;
  templateSettings: TemplateSettings;
  previewScale: number;
  isTemplatePanelOpen: boolean;
  filterCategory: string | null;
  searchQuery: string;

  // Actions
  setActiveTemplate: (id: string) => void;
  updateTemplateSettings: (settings: Partial<TemplateSettings>) => void;
  updateLayout: (layout: Partial<TemplateSettings["layout"]>) => void;
  updateDesign: (design: Partial<TemplateSettings["design"]>) => void;
  updateTypography: (typography: Partial<TemplateSettings["typography"]>) => void;
  updatePage: (page: Partial<TemplateSettings["page"]>) => void;
  setPreviewScale: (scale: number) => void;
  setTemplatePanelOpen: (open: boolean) => void;
  setFilterCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetToDefaults: () => void;
}

const defaultTemplateSettings: TemplateSettings = {
  activeTemplate: "legacy-default",
  layout: {
    sidebarWidth: 30,
    main: ["summary", "experience", "education", "projects", "skills"],
    sidebar: ["profiles"],
    fullWidth: false,
  },
  design: {
    colors: {
      primary: "#38bdf8",
      text: "#171717",
      background: "#ffffff",
    },
    level: {
      type: "circle",
      icon: "none",
    },
  },
  typography: {
    body: { fontFamily: "Roboto", fontSize: 11, lineHeight: 1.5 },
    heading: { fontFamily: "Roboto", fontSize: 14, lineHeight: 1.3 },
  },
  page: {
    format: "letter",
    marginX: 20,
    marginY: 20,
    hideIcons: false,
  },
};

export const useTemplateStore = create<TemplateStore>((set) => ({
  // Initial state
  activeTemplate: "legacy-default",
  templateSettings: defaultTemplateSettings,
  previewScale: 1,
  isTemplatePanelOpen: false,
  filterCategory: null,
  searchQuery: "",

  // Actions
  setActiveTemplate: (id) => set({ activeTemplate: id }),

  updateTemplateSettings: (settings) =>
    set((state) => ({
      templateSettings: { ...state.templateSettings, ...settings },
    })),

  updateLayout: (layout) =>
    set((state) => ({
      templateSettings: {
        ...state.templateSettings,
        layout: { ...state.templateSettings.layout, ...layout },
      },
    })),

  updateDesign: (design) =>
    set((state) => ({
      templateSettings: {
        ...state.templateSettings,
        design: {
          ...state.templateSettings.design,
          colors: { ...state.templateSettings.design.colors, ...(design.colors || {}) },
          level: { ...state.templateSettings.design.level, ...(design.level || {}) },
        },
      },
    })),

  updateTypography: (typography) =>
    set((state) => ({
      templateSettings: {
        ...state.templateSettings,
        typography: {
          ...state.templateSettings.typography,
          body: { ...state.templateSettings.typography.body, ...(typography.body || {}) },
          heading: { ...state.templateSettings.typography.heading, ...(typography.heading || {}) },
        },
      },
    })),

  updatePage: (page) =>
    set((state) => ({
      templateSettings: {
        ...state.templateSettings,
        page: { ...state.templateSettings.page, ...page },
      },
    })),

  setPreviewScale: (scale) => set({ previewScale: scale }),

  setTemplatePanelOpen: (open) => set({ isTemplatePanelOpen: open }),

  setFilterCategory: (category) => set({ filterCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  resetToDefaults: () =>
    set({
      activeTemplate: "legacy-default",
      templateSettings: defaultTemplateSettings,
      previewScale: 1,
    }),
}));
