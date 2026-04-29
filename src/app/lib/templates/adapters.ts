import type { Resume, TemplateSettings } from "lib/redux/types";

export type TemplateParadigm = "config" | "component" | "pdf";
export type TemplateSource = "impact-cv" | "reactive-resume" | "legacy";
export type TemplateCategory = "professional" | "creative" | "academic" | "modern" | "minimal";

export interface TemplateAdapter {
  id: string;
  name: string;
  source: TemplateSource;
  category: TemplateCategory;
  paradigm: TemplateParadigm;
  preview?: string;
  description?: string;
  render: (resume: Resume, settings: TemplateSettings) => JSX.Element;
  exportPDF?: () => Promise<Blob>;
  getDefaultSettings: () => Partial<TemplateSettings>;
}

export interface ImpactCVThemeConfig {
  id: string;
  name: string;
  color: string;
  fontClass: string;
  spacing: string;
  headerStyle: string;
  sectionTitleStyle: string;
  sectionContentStyle: string;
  backgroundClass?: string;
  cardStyle?: string;
  borderStyle?: string;
  imagePlacement?: "left" | "right" | "center" | "top";
  imageStyle?: string;
  preview?: string;
}
