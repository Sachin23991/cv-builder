/**
 * Resume Data Schema
 * Based on reactive-resume's schema with adaptations for backend use
 */

// Helper function for optional catch
const optionalCatch = (schema, fallback) => {
  try {
    return schema.parse(fallback);
  } catch {
    return fallback;
  }
};

// Icon schema
export const iconSchema = {
  type: 'string',
  description: 'Icon name from @phosphor-icons/web or empty string to hide',
  default: ''
};

// URL schema
export const urlSchema = {
  type: 'object',
  properties: {
    url: { type: 'string', description: 'Must be valid URL with http:// or https://' },
    label: { type: 'string', description: 'Display label, defaults to URL' }
  },
  required: ['url']
};

// Picture schema
export const pictureSchema = {
  type: 'object',
  properties: {
    hidden: { type: 'boolean', default: false },
    url: { type: 'string', description: 'URL to picture, prefer local paths' },
    size: { type: 'number', min: 32, max: 512, default: 80 },
    rotation: { type: 'number', min: 0, max: 360, default: 0 },
    aspectRatio: { type: 'number', min: 0.5, max: 2.5, default: 1 },
    borderRadius: { type: 'number', min: 0, max: 100, default: 0 },
    borderColor: { type: 'string', default: 'rgba(0, 0, 0, 0.5)' },
    borderWidth: { type: 'number', min: 0, default: 0 },
    shadowColor: { type: 'string', default: 'rgba(0, 0, 0, 0.5)' },
    shadowWidth: { type: 'number', min: 0, default: 0 }
  }
};

// Custom field schema
export const customFieldSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'UUID' },
    icon: iconSchema,
    text: { type: 'string' },
    link: { type: 'string', default: '' }
  },
  required: ['id', 'icon', 'text']
};

// Basics schema
export const basicsSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    headline: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    location: { type: 'string' },
    website: urlSchema,
    customFields: { type: 'array', items: customFieldSchema, default: [] }
  }
};

// Summary schema
export const summarySchema = {
  type: 'object',
  properties: {
    title: { type: 'string', default: 'Summary' },
    columns: { type: 'number', default: 1 },
    hidden: { type: 'boolean', default: false },
    content: { type: 'string', description: 'HTML-formatted string' }
  }
};

// Base item schema
export const baseItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'UUID' },
    hidden: { type: 'boolean', default: false },
    options: {
      type: 'object',
      properties: { showLinkInTitle: { type: 'boolean', default: false } }
    }
  }
};

// Experience item schema
export const experienceItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    company: { type: 'string', minLength: 1 },
    position: { type: 'string' },
    location: { type: 'string' },
    period: { type: 'string' },
    website: urlSchema,
    description: { type: 'string', description: 'HTML-formatted string' },
    roles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          position: { type: 'string' },
          period: { type: 'string' },
          description: { type: 'string' }
        }
      },
      default: []
    }
  },
  required: ['id', 'company']
};

// Education item schema
export const educationItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    school: { type: 'string', minLength: 1 },
    degree: { type: 'string' },
    area: { type: 'string' },
    grade: { type: 'string' },
    location: { type: 'string' },
    period: { type: 'string' },
    website: urlSchema,
    description: { type: 'string', description: 'HTML-formatted string' }
  },
  required: ['id', 'school']
};

// Projects item schema
export const projectItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    name: { type: 'string', minLength: 1 },
    period: { type: 'string' },
    website: urlSchema,
    description: { type: 'string', description: 'HTML-formatted string' }
  },
  required: ['id', 'name']
};

// Skills item schema
export const skillItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    icon: iconSchema,
    iconColor: { type: 'string', default: '' },
    name: { type: 'string', minLength: 1 },
    proficiency: { type: 'string' },
    level: { type: 'number', min: 0, max: 5, default: 0 },
    keywords: { type: 'array', items: { type: 'string' }, default: [] }
  },
  required: ['id', 'name']
};

// Languages item schema
export const languageItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    language: { type: 'string', minLength: 1 },
    fluency: { type: 'string' },
    level: { type: 'number', min: 0, max: 5, default: 0 }
  },
  required: ['id', 'language']
};

// Profiles item schema
export const profileItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    icon: iconSchema,
    iconColor: { type: 'string', default: '' },
    network: { type: 'string', minLength: 1 },
    username: { type: 'string' },
    website: urlSchema
  },
  required: ['id', 'network']
};

// Awards item schema
export const awardItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    title: { type: 'string', minLength: 1 },
    awarder: { type: 'string' },
    date: { type: 'string' },
    website: urlSchema,
    description: { type: 'string', description: 'HTML-formatted string' }
  },
  required: ['id', 'title']
};

// Certifications item schema
export const certificationItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    title: { type: 'string', minLength: 1 },
    issuer: { type: 'string' },
    date: { type: 'string' },
    website: urlSchema,
    description: { type: 'string', description: 'HTML-formatted string' }
  },
  required: ['id', 'title']
};

// Interests item schema
export const interestItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    icon: iconSchema,
    iconColor: { type: 'string', default: '' },
    name: { type: 'string', minLength: 1 },
    keywords: { type: 'array', items: { type: 'string' }, default: [] }
  },
  required: ['id', 'name']
};

// Publications item schema
export const publicationItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    title: { type: 'string', minLength: 1 },
    publisher: { type: 'string' },
    date: { type: 'string' },
    website: urlSchema,
    description: { type: 'string', description: 'HTML-formatted string' }
  },
  required: ['id', 'title']
};

// Volunteer item schema
export const volunteerItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    organization: { type: 'string', minLength: 1 },
    location: { type: 'string' },
    period: { type: 'string' },
    website: urlSchema,
    description: { type: 'string', description: 'HTML-formatted string' }
  },
  required: ['id', 'organization']
};

// References item schema
export const referenceItemSchema = {
  type: 'object',
  properties: {
    ...baseItemSchema.properties,
    name: { type: 'string', minLength: 1 },
    position: { type: 'string' },
    website: urlSchema,
    phone: { type: 'string' },
    description: { type: 'string', description: 'HTML-formatted string' }
  },
  required: ['id', 'name']
};

// Section types
export const sectionTypes = [
  'summary', 'profiles', 'experience', 'education', 'projects',
  'skills', 'languages', 'interests', 'awards', 'certifications',
  'publications', 'volunteer', 'references'
];

// Base section schema
export const baseSectionSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    columns: { type: 'number', default: 1 },
    hidden: { type: 'boolean', default: false }
  }
};

// Sections schema
export const sectionsSchema = {
  type: 'object',
  properties: {
    profiles: { ...baseSectionSchema, items: profileItemSchema },
    experience: { ...baseSectionSchema, items: experienceItemSchema },
    education: { ...baseSectionSchema, items: educationItemSchema },
    projects: { ...baseSectionSchema, items: projectItemSchema },
    skills: { ...baseSectionSchema, items: skillItemSchema },
    languages: { ...baseSectionSchema, items: languageItemSchema },
    interests: { ...baseSectionSchema, items: interestItemSchema },
    awards: { ...baseSectionSchema, items: awardItemSchema },
    certifications: { ...baseSectionSchema, items: certificationItemSchema },
    publications: { ...baseSectionSchema, items: publicationItemSchema },
    volunteer: { ...baseSectionSchema, items: volunteerItemSchema },
    references: { ...baseSectionSchema, items: referenceItemSchema }
  }
};

// Page layout schema
export const pageLayoutSchema = {
  type: 'object',
  properties: {
    fullWidth: { type: 'boolean', default: false },
    main: { type: 'array', items: { type: 'string' }, description: 'Section IDs' },
    sidebar: { type: 'array', items: { type: 'string' }, description: 'Section IDs' }
  }
};

// Layout schema
export const layoutSchema = {
  type: 'object',
  properties: {
    sidebarWidth: { type: 'number', min: 10, max: 50, default: 35 },
    pages: { type: 'array', items: pageLayoutSchema }
  }
};

// CSS schema
export const cssSchema = {
  type: 'object',
  properties: {
    enabled: { type: 'boolean', default: false },
    value: { type: 'string', description: 'Valid CSS string' }
  }
};

// Page schema
export const pageSchema = {
  type: 'object',
  properties: {
    gapX: { type: 'number', min: 0, default: 4 },
    gapY: { type: 'number', min: 0, default: 6 },
    marginX: { type: 'number', min: 0, default: 14 },
    marginY: { type: 'number', min: 0, default: 12 },
    format: { type: 'string', enum: ['a4', 'letter', 'free-form'], default: 'a4' },
    locale: { type: 'string', default: 'en-US' },
    hideIcons: { type: 'boolean', default: false }
  }
};

// Level design schema
export const levelDesignSchema = {
  type: 'object',
  properties: {
    icon: iconSchema,
    type: {
      type: 'string',
      enum: ['hidden', 'circle', 'square', 'rectangle', 'rectangle-full', 'progress-bar', 'icon'],
      default: 'circle'
    }
  }
};

// Color design schema
export const colorDesignSchema = {
  type: 'object',
  properties: {
    primary: { type: 'string', default: 'rgba(220, 38, 38, 1)' },
    text: { type: 'string', default: 'rgba(0, 0, 0, 1)' },
    background: { type: 'string', default: 'rgba(255, 255, 255, 1)' }
  }
};

// Design schema
export const designSchema = {
  type: 'object',
  properties: {
    level: levelDesignSchema,
    colors: colorDesignSchema
  }
};

// Typography item schema
export const typographyItemSchema = {
  type: 'object',
  properties: {
    fontFamily: { type: 'string', description: 'Google Fonts family' },
    fontWeights: { type: 'array', items: { type: 'string' }, default: ['400'] },
    fontSize: { type: 'number', min: 6, max: 24, default: 11 },
    lineHeight: { type: 'number', min: 0.5, max: 4, default: 1.5 }
  }
};

// Typography schema
export const typographySchema = {
  type: 'object',
  properties: {
    body: typographyItemSchema,
    heading: typographyItemSchema
  }
};

// Metadata schema
export const metadataSchema = {
  type: 'object',
  properties: {
    template: { type: 'string', default: 'onyx' },
    layout: layoutSchema,
    css: cssSchema,
    page: pageSchema,
    design: designSchema,
    typography: typographySchema,
    notes: { type: 'string', default: '' }
  }
};

// Main resume data schema
export const resumeDataSchema = {
  type: 'object',
  properties: {
    picture: pictureSchema,
    basics: basicsSchema,
    summary: summarySchema,
    sections: sectionsSchema,
    customSections: { type: 'array', default: [] },
    metadata: metadataSchema
  }
};

// Default resume data
export const defaultResumeData = {
  picture: {
    hidden: false,
    url: '',
    size: 80,
    rotation: 0,
    aspectRatio: 1,
    borderRadius: 0,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowWidth: 0
  },
  basics: {
    name: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    website: { url: '', label: '' },
    customFields: []
  },
  summary: {
    title: 'Summary',
    columns: 1,
    hidden: false,
    content: ''
  },
  sections: {
    profiles: { title: 'Profiles', columns: 1, hidden: false, items: [] },
    experience: { title: 'Experience', columns: 1, hidden: false, items: [] },
    education: { title: 'Education', columns: 1, hidden: false, items: [] },
    projects: { title: 'Projects', columns: 1, hidden: false, items: [] },
    skills: { title: 'Skills', columns: 1, hidden: false, items: [] },
    languages: { title: 'Languages', columns: 1, hidden: false, items: [] },
    interests: { title: 'Interests', columns: 1, hidden: false, items: [] },
    awards: { title: 'Awards', columns: 1, hidden: false, items: [] },
    certifications: { title: 'Certifications', columns: 1, hidden: false, items: [] },
    publications: { title: 'Publications', columns: 1, hidden: false, items: [] },
    volunteer: { title: 'Volunteer', columns: 1, hidden: false, items: [] },
    references: { title: 'References', columns: 1, hidden: false, items: [] }
  },
  customSections: [],
  metadata: {
    template: 'onyx',
    layout: {
      sidebarWidth: 35,
      pages: [
        {
          fullWidth: false,
          main: ['summary', 'experience', 'education', 'projects'],
          sidebar: ['skills', 'languages', 'profiles']
        }
      ]
    },
    css: { enabled: false, value: '' },
    page: { gapX: 4, gapY: 6, marginX: 14, marginY: 12, format: 'a4', locale: 'en-US', hideIcons: false },
    design: {
      colors: { primary: 'rgba(220, 38, 38, 1)', text: 'rgba(0, 0, 0, 1)', background: 'rgba(255, 255, 255, 1)' },
      level: { icon: 'star', type: 'circle' }
    },
    typography: {
      body: { fontFamily: 'IBM Plex Sans', fontWeights: ['400', '500'], fontSize: 10, lineHeight: 1.5 },
      heading: { fontFamily: 'IBM Plex Sans', fontWeights: ['600'], fontSize: 14, lineHeight: 1.5 }
    },
    notes: ''
  }
};

// Validate resume data
export function validateResumeData(data) {
  // Simple validation - check required fields exist
  const required = ['picture', 'basics', 'summary', 'sections', 'metadata'];
  for (const field of required) {
    if (!(field in data)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  return { valid: true, data: { ...defaultResumeData, ...data } };
}

export default resumeDataSchema;