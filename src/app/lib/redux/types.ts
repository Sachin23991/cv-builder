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
}

export interface ResumeProject {
  id?: string;
  project: string;
  date: string;
  descriptions: string[];
  website?: string;
  company?: string;
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

// Template Settings for unified template system
export interface TemplateSettings {
  activeTemplate: string;
  layout: {
    sidebarWidth: number;
    main: string[];
    sidebar: string[];
    fullWidth: boolean;
  };
  design: {
    colors: {
      primary: string;
      text: string;
      background: string;
    };
    level: {
      type: 'hidden' | 'circle' | 'square' | 'rectangle' | 'progress-bar' | 'icon';
      icon: string;
    };
  };
  typography: {
    body: { fontFamily: string; fontSize: number; lineHeight: number };
    heading: { fontFamily: string; fontSize: number; lineHeight: number };
  };
  page: {
    format: 'a4' | 'letter' | 'free-form';
    marginX: number;
    marginY: number;
    hideIcons: boolean;
  };
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
