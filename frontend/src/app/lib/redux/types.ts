export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: string;
  // Extended fields from other templates
  headline?: string;
  github?: string;
  linkedin?: string;
  photo?: string;
}

export interface ResumeWorkExperience {
  id?: string;
  company: string;
  jobTitle: string;
  date: string;
  descriptions: string[];
  location?: string;
  website?: string;
  current?: boolean;
  hideBullets?: boolean;
}

export interface ResumeEducation {
  id?: string;
  school: string;
  degree: string;
  date: string;
  gpa: string;
  descriptions: string[];
  field?: string;
  location?: string;
  website?: string;
  current?: boolean;
  hideBullets?: boolean;
}

export interface ResumeProject {
  id?: string;
  project: string;
  date: string;
  descriptions: string[];
  website?: string;
  company?: string;
  hideBullets?: boolean;
}

export interface FeaturedSkill {
  skill: string;
  rating: number;
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  descriptions: string[];
}

export interface ResumeCustom {
  descriptions: string[];
}

// Additional section types from reactive-resume
export interface ResumeLanguage {
  id: string;
  language: string;
  fluency: string;
  level: number;
}

export interface ResumeInterest {
  id: string;
  name: string;
  keywords: string[];
}

export interface ResumeAward {
  id: string;
  title: string;
  awarder: string;
  date: string;
  description: string;
}

export interface ResumeCertification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface ResumePublication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  description: string;
}

export interface ResumeVolunteer {
  id: string;
  organization: string;
  location: string;
  period: string;
  description: string;
}

export interface ResumeReference {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  description: string;
}

export interface ResumeProfileLink {
  id: string;
  network: string;
  username: string;
  url: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  type: 'experience' | 'education' | 'projects' | 'skills' | 'languages' | 'interests' | 'awards' | 'certifications' | 'publications' | 'volunteer' | 'references';
  columns: number;
  hidden: boolean;
  items: unknown[];
}

// ─── Theme Variant ─────────────────────────────────────────
export type ThemeVariant =
  | 'minimal' | 'modern' | 'classic' | 'creative'
  | 'corporate' | 'executive' | 'academic'
  | 'infographic' | 'portfolio-first';

export type ColorMode = 'light' | 'dark' | 'auto';
export type BackgroundType = 'solid' | 'gradient' | 'pattern';
export type CardStyle = 'none' | 'boxed' | 'rounded' | 'ghost' | 'elevated';
export type BorderStyle = 'none' | 'hairline' | 'thick' | 'dotted' | 'dashed';
export type ShadowLevel = 'none' | 'soft' | 'medium' | 'heavy';
export type AccentTreatment = 'none' | 'sidebar-bar' | 'header-bar' | 'corner-badge' | 'underline';
export type SectionDivider = 'line' | 'double-line' | 'dots' | 'gradient' | 'none';
export type BulletStyle = 'circle' | 'square' | 'dash' | 'arrow' | 'checkmark' | 'none';
export type DateFormat = 'month-year' | 'mm-yyyy' | 'yyyy' | 'duration';
export type DatePlacement = 'right' | 'inline' | 'below';
export type PhotoShape = 'circle' | 'square' | 'rounded';
export type SkillBarStyle = 'bar' | 'dots' | 'circle' | 'chips';
export type IconStyle = 'outline' | 'filled' | 'duotone';
export type HeaderStyle = 'centered' | 'left-aligned' | 'banner' | 'split';
export type GridType = 'standard' | 'card-based' | 'timeline' | 'modular';

// Template Settings for unified template system
export interface TemplateSettings {
  activeTemplate: string;

  // ─── Layout & Structure ─────────────────────────────────
  layout: {
    sidebarWidth: number;
    main: string[];
    sidebar: string[];
    fullWidth: boolean;
    columns?: 1 | 2 | 3;
    sidebarPosition?: 'left' | 'right';
    headerStyle?: HeaderStyle;
    gridType?: GridType;
    sectionOrder?: string[];
  };

  // ─── Visual / Theme ─────────────────────────────────────
  design: {
    colors: {
      primary: string;
      text: string;
      background: string;
      secondary?: string;
      accent?: string;
      muted?: string;
      link?: string;
      sidebarBg?: string;
      sidebarText?: string;
      headerBg?: string;
      headerText?: string;
    };
    theme?: ThemeVariant;
    colorMode?: ColorMode;
    background?: {
      type: BackgroundType;
      gradient?: string;
      pattern?: string;
    };
    cardStyle?: CardStyle;
    borderStyle?: BorderStyle;
    shadowLevel?: ShadowLevel;
    accentTreatment?: AccentTreatment;
    sectionDivider?: SectionDivider;
    level: {
      type: 'hidden' | 'circle' | 'square' | 'rectangle' | 'progress-bar' | 'icon';
      icon: string;
    };
  };

  // ─── Typography ─────────────────────────────────────────
  typography: {
    body: { fontFamily: string; fontSize: number; lineHeight: number };
    heading: { fontFamily: string; fontSize: number; lineHeight: number };
    name?: { fontFamily?: string; fontSize?: number; fontWeight?: number; textTransform?: string };
    subheading?: { fontFamily?: string; fontSize?: number; fontWeight?: number };
    small?: { fontSize?: number };
    letterSpacing?: number;
    fontFeatures?: {
      smallCaps?: boolean;
      ligatures?: boolean;
      oldstyleFigures?: boolean;
    };
  };

  // ─── Page Settings ──────────────────────────────────────
  page: {
    format: 'a4' | 'letter' | 'free-form';
    marginX: number;
    marginY: number;
    hideIcons: boolean;
    forceOnePage?: boolean;
    showPageNumbers?: boolean;
    showFooter?: boolean;
    footerContent?: string;
  };

  // ─── Content & Copy ─────────────────────────────────────
  content?: {
    bulletStyle?: BulletStyle;
    dateFormat?: DateFormat;
    datePlacement?: DatePlacement;
    emphasisRules?: {
      boldRole?: boolean;
      italicOrg?: boolean;
      highlightMetrics?: boolean;
    };
    showPhoto?: boolean;
    photoShape?: PhotoShape;
    photoSize?: number;
    showSkillBars?: boolean;
    skillBarStyle?: SkillBarStyle;
    showIcons?: boolean;
    iconStyle?: IconStyle;
    sectionLabels?: Record<string, string>;
  };

  // ─── Print & PDF ────────────────────────────────────────
  print?: {
    optimized?: boolean;
    grayscale?: boolean;
    removeShadows?: boolean;
    removeAnimations?: boolean;
    embedFonts?: boolean;
  };

  // ─── Accessibility ──────────────────────────────────────
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
    reduceMotion?: boolean;
  };

  // ─── Custom CSS Override ────────────────────────────────
  css?: {
    enabled: boolean;
    value: string;
  };
}

export interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  custom: ResumeCustom;
  // Additional sections
  languages: ResumeLanguage[];
  interests: ResumeInterest[];
  awards: ResumeAward[];
  certifications: ResumeCertification[];
  publications: ResumePublication[];
  volunteer: ResumeVolunteer[];
  references: ResumeReference[];
  profiles: ResumeProfileLink[];
  customSections: ResumeCustomSection[];
}

export type ResumeKey = keyof Resume;
