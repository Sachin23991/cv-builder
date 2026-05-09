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
  updateContent: (content: Partial<NonNullable<TemplateSettings["content"]>>) => void;
  updatePrint: (print: Partial<NonNullable<TemplateSettings["print"]>>) => void;
  updateAccessibility: (a11y: Partial<NonNullable<TemplateSettings["accessibility"]>>) => void;
  setPreviewScale: (scale: number) => void;
  setTemplatePanelOpen: (open: boolean) => void;
  setFilterCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetToDefaults: () => void;
  applyPreset: (preset: Partial<TemplateSettings>) => void;
}

const defaultTemplateSettings: TemplateSettings = {
  activeTemplate: "modern-html",
  layout: {
    sidebarWidth: 30,
    main: ["summary", "experience", "education", "projects", "skills"],
    sidebar: ["profiles"],
    fullWidth: false,
    columns: 1,
    sidebarPosition: "left",
    headerStyle: "left-aligned",
    gridType: "standard",
    sectionOrder: ["summary", "experience", "education", "projects", "skills", "languages", "certifications", "awards"],
  },
  design: {
    colors: {
      primary: "#38bdf8",
      text: "#171717",
      background: "#ffffff",
      secondary: "#0f766e",
      accent: "#6366f1",
      muted: "#64748b",
      link: "#0ea5e9",
      sidebarBg: "#0f172a",
      sidebarText: "#f8fafc",
      headerBg: "#ffffff",
      headerText: "#0f172a",
    },
    theme: "modern",
    colorMode: "light",
    background: {
      type: "solid",
      gradient: "",
      pattern: "",
    },
    cardStyle: "none",
    borderStyle: "hairline",
    shadowLevel: "none",
    accentTreatment: "underline",
    sectionDivider: "line",
    level: {
      type: "circle",
      icon: "none",
    },
  },
  typography: {
    body: { fontFamily: "Roboto", fontSize: 11, lineHeight: 1.5 },
    heading: { fontFamily: "Roboto", fontSize: 14, lineHeight: 1.3 },
    name: { fontFamily: "Roboto", fontSize: 28, fontWeight: 700, textTransform: "none" },
    subheading: { fontFamily: "Roboto", fontSize: 12, fontWeight: 600 },
    small: { fontSize: 9 },
    letterSpacing: 0,
    fontFeatures: {
      smallCaps: false,
      ligatures: true,
      oldstyleFigures: false,
    },
  },
  page: {
    format: "letter",
    marginX: 20,
    marginY: 20,
    hideIcons: false,
    forceOnePage: false,
    showPageNumbers: false,
    showFooter: false,
    footerContent: "",
  },
  content: {
    bulletStyle: "circle",
    dateFormat: "month-year",
    datePlacement: "right",
    emphasisRules: {
      boldRole: true,
      italicOrg: false,
      highlightMetrics: false,
    },
    showPhoto: false,
    photoShape: "circle",
    photoSize: 80,
    showSkillBars: true,
    skillBarStyle: "chips",
    showIcons: true,
    iconStyle: "outline",
    sectionLabels: {},
  },
  print: {
    optimized: false,
    grayscale: false,
    removeShadows: true,
    removeAnimations: true,
    embedFonts: true,
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
  },
};

export const useTemplateStore = create<TemplateStore>((set) => ({
  // Initial state
  activeTemplate: "modern-html",
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
          ...(design.theme !== undefined && { theme: design.theme }),
          ...(design.colorMode !== undefined && { colorMode: design.colorMode }),
          ...(design.background !== undefined && { background: { ...state.templateSettings.design.background, ...design.background } }),
          ...(design.cardStyle !== undefined && { cardStyle: design.cardStyle }),
          ...(design.borderStyle !== undefined && { borderStyle: design.borderStyle }),
          ...(design.shadowLevel !== undefined && { shadowLevel: design.shadowLevel }),
          ...(design.accentTreatment !== undefined && { accentTreatment: design.accentTreatment }),
          ...(design.sectionDivider !== undefined && { sectionDivider: design.sectionDivider }),
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
          ...(typography.name !== undefined && { name: { ...state.templateSettings.typography.name, ...typography.name } }),
          ...(typography.subheading !== undefined && { subheading: { ...state.templateSettings.typography.subheading, ...typography.subheading } }),
          ...(typography.small !== undefined && { small: { ...state.templateSettings.typography.small, ...typography.small } }),
          ...(typography.letterSpacing !== undefined && { letterSpacing: typography.letterSpacing }),
          ...(typography.fontFeatures !== undefined && { fontFeatures: { ...state.templateSettings.typography.fontFeatures, ...typography.fontFeatures } }),
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

  updateContent: (content) =>
    set((state) => ({
      templateSettings: {
        ...state.templateSettings,
        content: { ...state.templateSettings.content, ...content },
      },
    })),

  updatePrint: (print) =>
    set((state) => ({
      templateSettings: {
        ...state.templateSettings,
        print: { ...state.templateSettings.print, ...print },
      },
    })),

  updateAccessibility: (a11y) =>
    set((state) => ({
      templateSettings: {
        ...state.templateSettings,
        accessibility: { ...state.templateSettings.accessibility, ...a11y },
      },
    })),

  setPreviewScale: (scale) => set({ previewScale: scale }),

  setTemplatePanelOpen: (open) => set({ isTemplatePanelOpen: open }),

  setFilterCategory: (category) => set({ filterCategory: category }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  applyPreset: (preset) =>
    set((state) => ({
      templateSettings: {
        ...state.templateSettings,
        ...preset,
        design: { ...state.templateSettings.design, ...(preset.design || {}) },
        typography: { ...state.templateSettings.typography, ...(preset.typography || {}) },
        layout: { ...state.templateSettings.layout, ...(preset.layout || {}) },
        page: { ...state.templateSettings.page, ...(preset.page || {}) },
        content: { ...state.templateSettings.content, ...(preset.content || {}) },
      },
    })),

  resetToDefaults: () =>
    set({
      activeTemplate: "modern-html",
      templateSettings: defaultTemplateSettings,
      previewScale: 1,
    }),
}));
