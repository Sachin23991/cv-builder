import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import type { TemplateSettings } from "lib/redux/types";

export interface Settings {
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: string;
  formToShow: {
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
    languages: boolean;
    interests: boolean;
    awards: boolean;
    certifications: boolean;
    publications: boolean;
    volunteer: boolean;
    references: boolean;
    profiles: boolean;
  };
  formToHeading: {
    workExperiences: string;
    educations: string;
    projects: string;
    skills: string;
    custom: string;
    languages: string;
    interests: string;
    awards: string;
    certifications: string;
    publications: string;
    volunteer: string;
    references: string;
    profiles: string;
  };
  formsOrder: ShowForm[];
  showBulletPoints: {
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  templateSettings: TemplateSettings;
  customHTML: string;
  customCSS: string;
}

export type ShowForm = 'workExperiences' | 'educations' | 'projects' | 'skills' | 'custom' | 'languages' | 'interests' | 'awards' | 'certifications' | 'publications' | 'volunteer' | 'references' | 'profiles';
export type FormWithBulletPoints = keyof Settings["showBulletPoints"];
export type GeneralSetting = Exclude<
  keyof Settings,
  "formToShow" | "formToHeading" | "formsOrder" | "showBulletPoints" | "templateSettings"
>;

export const DEFAULT_THEME_COLOR = "#38bdf8"; // sky-400
export const DEFAULT_FONT_FAMILY = "Roboto";
export const DEFAULT_FONT_SIZE = "11"; // text-base https://tailwindcss.com/docs/font-size
export const DEFAULT_FONT_COLOR = "#171717"; // text-neutral-800

export const initialSettings: Settings = {
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: "Letter",
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
    languages: false,
    interests: false,
    awards: false,
    certifications: false,
    publications: false,
    volunteer: false,
    references: false,
    profiles: false,
  },
  formToHeading: {
    workExperiences: "WORK EXPERIENCE",
    educations: "EDUCATION",
    projects: "PROJECT",
    skills: "SKILLS",
    custom: "CUSTOM SECTION",
    languages: "LANGUAGES",
    interests: "INTERESTS",
    awards: "AWARDS",
    certifications: "CERTIFICATIONS",
    publications: "PUBLICATIONS",
    volunteer: "VOLUNTEER",
    references: "REFERENCES",
    profiles: "PROFILES",
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
  templateSettings: {
    activeTemplate: "modern-html",
    layout: {
      sidebarWidth: 30,
      main: ["summary", "experience", "education", "projects", "skills"],
      sidebar: ["profiles"],
      fullWidth: false,
      columns: 1 as const,
      sidebarPosition: "left" as const,
      headerStyle: "left-aligned" as const,
      gridType: "standard" as const,
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
      theme: "modern" as const,
      colorMode: "light" as const,
      background: {
        type: "solid" as const,
        gradient: "",
        pattern: "",
      },
      cardStyle: "none" as const,
      borderStyle: "hairline" as const,
      shadowLevel: "none" as const,
      accentTreatment: "underline" as const,
      sectionDivider: "line" as const,
      level: {
        type: "circle" as const,
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
      format: "letter" as const,
      marginX: 20,
      marginY: 20,
      hideIcons: false,
      forceOnePage: false,
      showPageNumbers: false,
      showFooter: false,
      footerContent: "",
    },
    content: {
      bulletStyle: "circle" as const,
      dateFormat: "month-year" as const,
      datePlacement: "right" as const,
      emphasisRules: {
        boldRole: true,
        italicOrg: false,
        highlightMetrics: false,
      },
      showPhoto: false,
      photoShape: "circle" as const,
      photoSize: 80,
      showSkillBars: true,
      skillBarStyle: "chips" as const,
      showIcons: true,
      iconStyle: "outline" as const,
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
  },
  customHTML: `<div class="resume-container">\n  <h1>{{profile.name}}</h1>\n  <p>{{profile.summary}}</p>\n  \n  <h2>Experience</h2>\n  {{#workExperiences}}\n    <div class="exp">\n      <h3>{{jobTitle}} at {{company}}</h3>\n      <p>{{date}}</p>\n    </div>\n  {{/workExperiences}}\n</div>`,
  customCSS: `.resume-container {\n  padding: 2rem;\n  font-family: sans-serif;\n}\nh1 {\n  color: var(--theme-color, #14b8a6);\n  border-bottom: 2px solid #ccc;\n}`
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettings,
  reducers: {
    changeSettings: (
      draft,
      action: PayloadAction<{ field: GeneralSetting; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft[field] = value;
    },
    changeShowForm: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: boolean }>
    ) => {
      const { field, value } = action.payload;
      draft.formToShow[field] = value;
    },
    changeFormHeading: (
      draft,
      action: PayloadAction<{ field: ShowForm; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft.formToHeading[field] = value;
    },
    changeFormOrder: (
      draft,
      action: PayloadAction<{ form: ShowForm; type: "up" | "down" }>
    ) => {
      const { form, type } = action.payload;
      const lastIdx = draft.formsOrder.length - 1;
      const pos = draft.formsOrder.indexOf(form);
      const newPos = type === "up" ? pos - 1 : pos + 1;
      const swapFormOrder = (idx1: number, idx2: number) => {
        const temp = draft.formsOrder[idx1]!;
        draft.formsOrder[idx1] = draft.formsOrder[idx2]!;
        draft.formsOrder[idx2] = temp;
      };
      if (newPos >= 0 && newPos <= lastIdx) {
        swapFormOrder(pos, newPos);
      }
    },
    changeShowBulletPoints: (
      draft,
      action: PayloadAction<{
        field: FormWithBulletPoints;
        value: boolean;
      }>
    ) => {
      const { field, value } = action.payload;
      draft["showBulletPoints"][field] = value;
    },
    setSettings: (draft, action: PayloadAction<Settings>) => {
      return action.payload;
    },
    changeActiveTemplate: (draft, action: PayloadAction<string>) => {
      draft.templateSettings.activeTemplate = action.payload;
    },
    updateTemplateSettings: (draft, action: PayloadAction<Partial<TemplateSettings>>) => {
      Object.assign(draft.templateSettings, action.payload);
    },
    updateLayout: (draft, action: PayloadAction<Partial<TemplateSettings['layout']>>) => {
      Object.assign(draft.templateSettings.layout, action.payload);
    },
    updateDesign: (draft, action: PayloadAction<Partial<TemplateSettings['design']>>) => {
      Object.assign(draft.templateSettings.design, action.payload);
    },
    updateTypography: (draft, action: PayloadAction<Partial<TemplateSettings['typography']>>) => {
      Object.assign(draft.templateSettings.typography, action.payload);
    },
    updatePage: (draft, action: PayloadAction<Partial<TemplateSettings['page']>>) => {
      Object.assign(draft.templateSettings.page, action.payload);
    },
    updateContent: (draft, action: PayloadAction<Partial<NonNullable<TemplateSettings['content']>>>) => {
      if (!draft.templateSettings.content) {
        draft.templateSettings.content = {} as NonNullable<TemplateSettings['content']>;
      }
      Object.assign(draft.templateSettings.content, action.payload);
    },
    updatePrint: (draft, action: PayloadAction<Partial<NonNullable<TemplateSettings['print']>>>) => {
      if (!draft.templateSettings.print) {
        draft.templateSettings.print = {} as NonNullable<TemplateSettings['print']>;
      }
      Object.assign(draft.templateSettings.print, action.payload);
    },
    updateAccessibility: (draft, action: PayloadAction<Partial<NonNullable<TemplateSettings['accessibility']>>>) => {
      if (!draft.templateSettings.accessibility) {
        draft.templateSettings.accessibility = {} as NonNullable<TemplateSettings['accessibility']>;
      }
      Object.assign(draft.templateSettings.accessibility, action.payload);
    },
  },
});

export const {
  changeSettings,
  changeShowForm,
  changeFormHeading,
  changeFormOrder,
  changeShowBulletPoints,
  setSettings,
  changeActiveTemplate,
  updateTemplateSettings,
  updateLayout,
  updateDesign,
  updateTypography,
  updatePage,
  updateContent,
  updatePrint,
  updateAccessibility,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectThemeColor = (state: RootState) => state.settings.themeColor;

export const selectFormToShow = (state: RootState) => state.settings.formToShow;
export const selectShowByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToShow[form];

export const selectFormToHeading = (state: RootState) =>
  state.settings.formToHeading;
export const selectHeadingByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToHeading[form];

export const selectFormsOrder = (state: RootState) => state.settings.formsOrder;
export const selectIsFirstForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[0] === form;
export const selectIsLastForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[state.settings.formsOrder.length - 1] === form;

export const selectShowBulletPoints =
  (form: FormWithBulletPoints) => (state: RootState) =>
    state.settings.showBulletPoints[form];

export const selectTemplateSettings = (state: RootState) => state.settings.templateSettings;
export const selectActiveTemplate = (state: RootState) => state.settings.templateSettings.activeTemplate;
export const selectContentSettings = (state: RootState) => state.settings.templateSettings.content;
export const selectPrintSettings = (state: RootState) => state.settings.templateSettings.print;
export const selectAccessibilitySettings = (state: RootState) => state.settings.templateSettings.accessibility;
export const selectDesignColors = (state: RootState) => state.settings.templateSettings.design.colors;

export default settingsSlice.reducer;
