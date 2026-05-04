/**
 * Template Configuration System
 * All template designs are stored here as JSON configs
 * Frontend reads these configs and renders templates accordingly
 */

export const templateConfigurations = {
  // ==========================================
  // PROFESSIONAL TEMPLATES
  // ==========================================

  'onyx': {
    id: 'onyx',
    name: 'Onyx',
    category: 'professional',
    description: 'A sleek, dark-themed template with clean typography',
    primaryColor: '#1a1a2e',
    layout: {
      type: 'two-column',
      sidebarWidth: 35,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingSize: 14,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'center',
      sectionSpacing: 16,
      itemSpacing: 12,
      borderRadius: 4,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'center',
        nameStyle: { fontSize: 24, fontWeight: 700, uppercase: true, letterSpacing: 2 },
        headlineStyle: { fontSize: 12, fontWeight: 400 },
        contactStyle: { fontSize: 9 },
      },
      experience: {
        title: 'Experience',
        showTitle: true,
        datePosition: 'right',
        companyStyle: { fontSize: 11, fontWeight: 600 },
        jobTitleStyle: { fontSize: 10, fontWeight: 500 },
        descriptionStyle: { fontSize: 9 },
      },
      education: {
        title: 'Education',
        showTitle: true,
        degreeStyle: { fontSize: 11, fontWeight: 600 },
        institutionStyle: { fontSize: 10 },
      },
      skills: {
        title: 'Skills',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: true, filled: true },
      },
      projects: {
        title: 'Projects',
        showTitle: true,
      },
      languages: {
        title: 'Languages',
        showTitle: true,
        layout: 'list',
      },
      profiles: {
        title: 'Profiles',
        showTitle: true,
        layout: 'icons',
      },
    },
  },

  'pikachu': {
    id: 'pikachu',
    name: 'Pikachu',
    category: 'creative',
    description: 'Bold yellow accents with energetic design',
    primaryColor: '#ffd700',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['summary', 'experience', 'projects'],
      sidebarSections: ['education', 'skills', 'languages'],
    },
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Poppins',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.6,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 8,
      cardStyle: 'shadow',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'rounded',
        picturePlacement: 'left',
        nameStyle: { fontSize: 22, fontWeight: 700 },
        headlineStyle: { fontSize: 11, fontWeight: 500 },
        contactStyle: { fontSize: 9 },
      },
      experience: {
        title: 'Work Experience',
        showTitle: true,
        datePosition: 'right',
        companyStyle: { fontSize: 11, fontWeight: 600 },
        jobTitleStyle: { fontSize: 10, fontWeight: 500 },
        descriptionStyle: { fontSize: 9 },
      },
      skills: {
        title: 'Skills',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: true, filled: true },
      },
    },
  },

  'azurill': {
    id: 'azurill',
    name: 'Azurill',
    category: 'minimal',
    description: 'Soft blue tones for a friendly appearance',
    primaryColor: '#87ceeb',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'education', 'projects'],
      sidebarSections: ['skills', 'languages'],
    },
    typography: {
      headingFont: 'Roboto',
      bodyFont: 'Roboto',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'center',
      sectionSpacing: 12,
      itemSpacing: 8,
      borderRadius: 12,
      cardStyle: 'none',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'center',
        nameStyle: { fontSize: 20, fontWeight: 600 },
        headlineStyle: { fontSize: 10 },
        contactStyle: { fontSize: 9 },
      },
      experience: {
        title: 'Experience',
        showTitle: true,
        datePosition: 'right',
        companyStyle: { fontSize: 11, fontWeight: 600 },
        jobTitleStyle: { fontSize: 10 },
        descriptionStyle: { fontSize: 9 },
      },
      skills: {
        title: 'Skills',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: true, filled: false },
      },
    },
  },

  'bronzer': {
    id: 'bronzer',
    name: 'Bronzer',
    category: 'professional',
    description: 'Metallic gray with structured layout',
    primaryColor: '#7c7c7c',
    layout: {
      type: 'two-column',
      sidebarWidth: 32,
      mainSections: ['experience', 'education', 'projects'],
      sidebarSections: ['skills', 'languages'],
    },
    typography: {
      headingFont: 'Roboto Slab',
      bodyFont: 'Arial',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.4,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 2,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 22, fontWeight: 700, uppercase: true },
        headlineStyle: { fontSize: 11 },
        contactStyle: { fontSize: 9 },
      },
      experience: {
        title: 'Professional Experience',
        showTitle: true,
        datePosition: 'right',
      },
    },
  },

  'chikorita': {
    id: 'chikorita',
    name: 'Chikorita',
    category: 'creative',
    description: 'Fresh green accents, nature-inspired',
    primaryColor: '#98fb98',
    layout: {
      type: 'two-column',
      sidebarWidth: 28,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages', 'interests'],
    },
    typography: {
      headingFont: 'Merriweather',
      bodyFont: 'Open Sans',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.6,
    },
    styles: {
      headerAlign: 'center',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 6,
      cardStyle: 'accent-border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'rounded',
        picturePlacement: 'center',
        nameStyle: { fontSize: 22, fontWeight: 700 },
        headlineStyle: { fontSize: 11 },
      },
      skills: {
        title: 'Technical Skills',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: false, filled: true },
      },
    },
  },

  'ditgar': {
    id: 'ditgar',
    name: 'Ditgar',
    category: 'creative',
    description: 'Bold crimson for strong visual impact',
    primaryColor: '#dc143c',
    layout: {
      type: 'two-column',
      sidebarWidth: 33,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'certifications', 'profiles'],
    },
    typography: {
      headingFont: 'Oswald',
      bodyFont: 'Roboto',
      headingSize: 14,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 16,
      itemSpacing: 12,
      borderRadius: 4,
      cardStyle: 'shadow',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'square',
        picturePlacement: 'left',
        nameStyle: { fontSize: 24, fontWeight: 700 },
        headlineStyle: { fontSize: 12, fontWeight: 500 },
      },
      experience: {
        title: 'Work History',
        showTitle: true,
        datePosition: 'right',
      },
    },
  },

  'ditto': {
    id: 'ditto',
    name: 'Ditto',
    category: 'modern',
    description: 'Purple tones, versatile and adaptable',
    primaryColor: '#9370db',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['summary', 'experience', 'education'],
      sidebarSections: ['skills', 'projects', 'languages'],
    },
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'center',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 8,
      cardStyle: 'gradient-border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'center',
        nameStyle: { fontSize: 20, fontWeight: 700 },
        headlineStyle: { fontSize: 11 },
      },
      summary: {
        title: 'Professional Summary',
        showTitle: true,
      },
    },
  },

  'gengar': {
    id: 'gengar',
    name: 'Gengar',
    category: 'creative',
    description: 'Deep purple, mysterious and elegant',
    primaryColor: '#4b0082',
    layout: {
      type: 'two-column',
      sidebarWidth: 32,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages', 'awards'],
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Lato',
      headingSize: 14,
      bodySize: 10,
      lineHeight: 1.6,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 16,
      itemSpacing: 12,
      borderRadius: 4,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'rounded',
        picturePlacement: 'left',
        nameStyle: { fontSize: 24, fontWeight: 700 },
        headlineStyle: { fontSize: 11 },
      },
    },
  },

  'glalie': {
    id: 'glalie',
    name: 'Glalie',
    category: 'professional',
    description: 'Ice blue, cool and professional',
    primaryColor: '#4682b4',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'education', 'projects'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: {
      headingFont: 'Roboto',
      bodyFont: 'Roboto',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 6,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'left',
      },
    },
  },

  'kakuna': {
    id: 'kakuna',
    name: 'Kakuna',
    category: 'minimal',
    description: 'Warm beige tones, approachable',
    primaryColor: '#deb887',
    layout: {
      type: 'two-column',
      sidebarWidth: 28,
      mainSections: ['experience', 'education'],
      sidebarSections: ['skills', 'languages'],
    },
    typography: {
      headingFont: 'Nunito',
      bodyFont: 'Nunito',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'center',
      sectionSpacing: 12,
      itemSpacing: 8,
      borderRadius: 10,
      cardStyle: 'none',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'center',
        nameStyle: { fontSize: 20, fontWeight: 600 },
      },
    },
  },

  'lapras': {
    id: 'lapras',
    name: 'Lapras',
    category: 'professional',
    description: 'Teal oceanic feel, calm and organized',
    primaryColor: '#5f9ea0',
    layout: {
      type: 'two-column',
      sidebarWidth: 32,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'certifications', 'profiles'],
    },
    typography: {
      headingFont: 'Raleway',
      bodyFont: 'Open Sans',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 4,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'rounded',
        picturePlacement: 'left',
      },
    },
  },

  'leafish': {
    id: 'leafish',
    name: 'Leafish',
    category: 'professional',
    description: 'Forest green, earthy and reliable',
    primaryColor: '#228b22',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'education', 'projects'],
      sidebarSections: ['skills', 'languages', 'interests'],
    },
    typography: {
      headingFont: 'Georgia',
      bodyFont: 'Arial',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 2,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 22, fontWeight: 700 },
      },
    },
  },

  'meowth': {
    id: 'meowth',
    name: 'Meowth',
    category: 'creative',
    description: 'Warm peach tones, friendly and inviting',
    primaryColor: '#ffdab9',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['summary', 'experience', 'projects'],
      sidebarSections: ['education', 'skills', 'languages'],
    },
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Poppins',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.6,
    },
    styles: {
      headerAlign: 'center',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 12,
      cardStyle: 'shadow',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'rounded',
        picturePlacement: 'center',
      },
    },
  },

  'rhyhorn': {
    id: 'rhyhorn',
    name: 'Rhyhorn',
    category: 'professional',
    description: 'Brown earth tones, solid and dependable',
    primaryColor: '#8b4513',
    layout: {
      type: 'two-column',
      sidebarWidth: 32,
      mainSections: ['experience', 'education', 'projects'],
      sidebarSections: ['skills', 'languages', 'certifications'],
    },
    typography: {
      headingFont: 'Roboto Slab',
      bodyFont: 'Roboto',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 3,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'left',
      },
    },
  },

  // ==========================================
  // ADDITIONAL PROFESSIONAL TEMPLATES
  // ==========================================

  'professional-blue': {
    id: 'professional-blue',
    name: 'Professional Blue',
    category: 'professional',
    description: 'Classic blue professional template',
    primaryColor: '#1e3a5f',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'education', 'projects'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.4,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 12,
      itemSpacing: 8,
      borderRadius: 0,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 22, fontWeight: 700, uppercase: true },
      },
    },
  },

  'minimal-elegant': {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    category: 'minimal',
    description: 'Clean and elegant minimal design',
    primaryColor: '#333333',
    layout: {
      type: 'single-column',
      mainSections: ['header', 'experience', 'education', 'skills'],
      sidebarSections: [],
    },
    typography: {
      headingFont: 'Helvetica',
      bodyFont: 'Helvetica',
      headingSize: 14,
      bodySize: 10,
      lineHeight: 1.6,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 20,
      itemSpacing: 12,
      borderRadius: 0,
      cardStyle: 'none',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 28, fontWeight: 300 },
        headlineStyle: { fontSize: 12 },
      },
      experience: {
        title: 'Experience',
        showTitle: true,
        datePosition: 'right',
      },
    },
  },

  'modern-gradient': {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    category: 'modern',
    description: 'Bold modern design with gradients',
    primaryColor: '#6366f1',
    layout: {
      type: 'two-column',
      sidebarWidth: 35,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages'],
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'center',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 16,
      cardStyle: 'gradient-bg',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'rounded',
        picturePlacement: 'center',
        nameStyle: { fontSize: 22, fontWeight: 700 },
        headlineStyle: { fontSize: 11 },
      },
    },
  },

  'executive': {
    id: 'executive',
    name: 'Executive',
    category: 'professional',
    description: 'Executive style for senior professionals',
    primaryColor: '#1a1a1a',
    layout: {
      type: 'two-column',
      sidebarWidth: 28,
      mainSections: ['experience', 'education'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: {
      headingFont: 'Times New Roman',
      bodyFont: 'Georgia',
      headingSize: 12,
      bodySize: 10,
      lineHeight: 1.4,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 16,
      itemSpacing: 10,
      borderRadius: 0,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 24, fontWeight: 700, uppercase: true },
        headlineStyle: { fontSize: 11, fontWeight: 400 },
      },
    },
  },

  'creative-artist': {
    id: 'creative-artist',
    name: 'Creative Artist',
    category: 'creative',
    description: 'Perfect for creative professionals',
    primaryColor: '#e91e63',
    layout: {
      type: 'two-column',
      sidebarWidth: 35,
      mainSections: ['projects', 'experience'],
      sidebarSections: ['skills', 'awards', 'profiles'],
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Lato',
      headingSize: 14,
      bodySize: 10,
      lineHeight: 1.6,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 12,
      borderRadius: 8,
      cardStyle: 'shadow',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'square',
        picturePlacement: 'left',
        nameStyle: { fontSize: 26, fontWeight: 700 },
      },
    },
  },

  // ==========================================
  // ACADEMIC TEMPLATES
  // ==========================================

  'academic': {
    id: 'academic',
    name: 'Academic CV',
    category: 'academic',
    description: 'Designed for academic positions',
    primaryColor: '#8b0000',
    layout: {
      type: 'two-column',
      sidebarWidth: 35,
      mainSections: ['education', 'publications', 'experience'],
      sidebarSections: ['skills', 'awards', 'references'],
    },
    typography: {
      headingFont: 'Times New Roman',
      bodyFont: 'Times New Roman',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 16,
      itemSpacing: 10,
      borderRadius: 0,
      cardStyle: 'none',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 24, fontWeight: 700 },
        headlineStyle: { fontSize: 11 },
      },
      publications: {
        title: 'Publications',
        showTitle: true,
      },
      education: {
        title: 'Academic Background',
        showTitle: true,
      },
    },
  },

  'research': {
    id: 'research',
    name: 'Research',
    category: 'academic',
    description: 'For research positions',
    primaryColor: '#2c3e50',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['education', 'experience', 'publications'],
      sidebarSections: ['skills', 'awards', 'profiles'],
    },
    typography: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 4,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 22, fontWeight: 700 },
      },
      publications: {
        title: 'Selected Publications',
        showTitle: true,
      },
    },
  },

  // ==========================================
  // INDUSTRY-SPECIFIC TEMPLATES
  // ==========================================

  'tech': {
    id: 'tech',
    name: 'Tech Resume',
    category: 'professional',
    description: 'For software engineers and tech roles',
    primaryColor: '#0077cc',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: {
      headingFont: 'Fira Code',
      bodyFont: 'Inter',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 12,
      itemSpacing: 8,
      borderRadius: 6,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 22, fontWeight: 700 },
      },
      skills: {
        title: 'Technical Skills',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: false, filled: true },
      },
      projects: {
        title: 'Projects',
        showTitle: true,
      },
    },
  },

  'consulting': {
    id: 'consulting',
    name: 'Consulting',
    category: 'professional',
    description: 'For consulting and finance roles',
    primaryColor: '#003366',
    layout: {
      type: 'two-column',
      sidebarWidth: 28,
      mainSections: ['experience', 'education'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: {
      headingFont: 'Arial',
      bodyFont: 'Georgia',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.4,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 0,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 22, fontWeight: 700, uppercase: true },
      },
    },
  },

  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare',
    category: 'professional',
    description: 'For medical and healthcare professionals',
    primaryColor: '#008080',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'education', 'certifications'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 4,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'left',
      },
      certifications: {
        title: 'Certifications & Licenses',
        showTitle: true,
      },
    },
  },

  'education-teaching': {
    id: 'education-teaching',
    name: 'Education',
    category: 'professional',
    description: 'For teachers and educators',
    primaryColor: '#6b46c1',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'education', 'projects'],
      sidebarSections: ['skills', 'languages', 'certifications'],
    },
    typography: {
      headingFont: 'Georgia',
      bodyFont: 'Arial',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 6,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'rounded',
        picturePlacement: 'left',
      },
    },
  },

  // ==========================================
  // NEW PROFESSIONAL TEMPLATES
  // ==========================================

  'tech-minimalist': {
    id: 'tech-minimalist',
    name: 'Tech Minimalist',
    category: 'professional',
    description: 'Clean, modern design for tech professionals with code-friendly aesthetics',
    primaryColor: '#2d3748',
    layout: {
      type: 'two-column',
      sidebarWidth: 32,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: {
      headingFont: 'Courier New',
      bodyFont: 'Segoe UI',
      headingSize: 12,
      bodySize: 10,
      lineHeight: 1.6,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 12,
      itemSpacing: 8,
      borderRadius: 2,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'left',
        nameStyle: { fontSize: 20, fontWeight: 600 },
        headlineStyle: { fontSize: 10 },
        contactStyle: { fontSize: 9 },
      },
      experience: {
        title: 'Experience',
        showTitle: true,
        datePosition: 'right',
        companyStyle: { fontSize: 11, fontWeight: 600 },
        jobTitleStyle: { fontSize: 10, fontWeight: 500 },
        descriptionStyle: { fontSize: 9 },
      },
      projects: {
        title: 'Projects',
        showTitle: true,
      },
      skills: {
        title: 'Technical Skills',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: true, filled: true },
      },
    },
  },

  'executive-pro': {
    id: 'executive-pro',
    name: 'Executive Pro',
    category: 'professional',
    description: 'Premium template designed for C-level and senior executives',
    primaryColor: '#1a202c',
    layout: {
      type: 'two-column',
      sidebarWidth: 28,
      mainSections: ['summary', 'experience', 'board_roles'],
      sidebarSections: ['education', 'skills', 'certifications'],
    },
    typography: {
      headingFont: 'Georgia',
      bodyFont: 'Garamond',
      headingSize: 13,
      bodySize: 11,
      lineHeight: 1.7,
    },
    styles: {
      headerAlign: 'center',
      sectionSpacing: 18,
      itemSpacing: 12,
      borderRadius: 0,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: false,
        nameStyle: { fontSize: 24, fontWeight: 700, uppercase: true, letterSpacing: 3 },
        headlineStyle: { fontSize: 12, fontWeight: 500 },
        contactStyle: { fontSize: 9 },
      },
      summary: {
        title: 'Executive Profile',
        showTitle: true,
      },
      experience: {
        title: 'Professional Experience',
        showTitle: true,
        datePosition: 'right',
        companyStyle: { fontSize: 11, fontWeight: 700 },
        jobTitleStyle: { fontSize: 10, fontWeight: 600 },
        descriptionStyle: { fontSize: 10 },
      },
      education: {
        title: 'Education',
        showTitle: true,
      },
      certifications: {
        title: 'Certifications & Awards',
        showTitle: true,
      },
    },
  },

  'startup-bold': {
    id: 'startup-bold',
    name: 'Startup Bold',
    category: 'modern',
    description: 'Dynamic, energetic template for startup founders and innovative professionals',
    primaryColor: '#ff6b6b',
    layout: {
      type: 'two-column',
      sidebarWidth: 35,
      mainSections: ['projects', 'experience', 'education'],
      sidebarSections: ['skills', 'achievements', 'profiles'],
    },
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      headingSize: 14,
      bodySize: 10,
      lineHeight: 1.6,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 16,
      itemSpacing: 12,
      borderRadius: 12,
      cardStyle: 'shadow',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'rounded',
        picturePlacement: 'left',
        nameStyle: { fontSize: 26, fontWeight: 800 },
        headlineStyle: { fontSize: 12, fontWeight: 600 },
        contactStyle: { fontSize: 10 },
      },
      projects: {
        title: 'Key Projects',
        showTitle: true,
      },
      experience: {
        title: 'Work History',
        showTitle: true,
        datePosition: 'right',
      },
      skills: {
        title: 'Core Competencies',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: true, filled: true },
      },
      achievements: {
        title: 'Achievements',
        showTitle: true,
      },
    },
  },

  'data-scientist': {
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'professional',
    description: 'Specialized template for data scientists, analysts, and quantitative professionals',
    primaryColor: '#4c51bf',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'projects', 'publications'],
      sidebarSections: ['skills', 'tools', 'education'],
    },
    typography: {
      headingFont: 'Roboto Mono',
      bodyFont: 'Roboto',
      headingSize: 13,
      bodySize: 10,
      lineHeight: 1.5,
    },
    styles: {
      headerAlign: 'left',
      sectionSpacing: 14,
      itemSpacing: 10,
      borderRadius: 4,
      cardStyle: 'border',
    },
    sections: {
      header: {
        showPicture: true,
        pictureShape: 'circle',
        picturePlacement: 'left',
        nameStyle: { fontSize: 22, fontWeight: 700 },
        headlineStyle: { fontSize: 11, fontWeight: 500 },
        contactStyle: { fontSize: 9 },
      },
      experience: {
        title: 'Professional Experience',
        showTitle: true,
        datePosition: 'right',
        companyStyle: { fontSize: 11, fontWeight: 600 },
        jobTitleStyle: { fontSize: 10, fontWeight: 500 },
        descriptionStyle: { fontSize: 9 },
      },
      projects: {
        title: 'Data Projects',
        showTitle: true,
      },
      publications: {
        title: 'Research & Publications',
        showTitle: true,
      },
      skills: {
        title: 'Technical Skills',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: false, filled: true },
      },
      tools: {
        title: 'Tools & Languages',
        showTitle: true,
        layout: 'tags',
        tagStyle: { rounded: true, filled: false },
      },
    },
  },

};

// Export template list for easy iteration
export const templateList = Object.values(templateConfigurations);

// Export by category
export const templatesByCategory = {
  professional: templateList.filter(t => t.category === 'professional'),
  creative: templateList.filter(t => t.category === 'creative'),
  academic: templateList.filter(t => t.category === 'academic'),
  modern: templateList.filter(t => t.category === 'modern'),
  minimal: templateList.filter(t => t.category === 'minimal'),
};

// Get template by ID
export const getTemplateById = (id) => templateConfigurations[id];

// Get all template IDs
export const getAllTemplateIds = () => Object.keys(templateConfigurations);

// Export count
export const templateCount = Object.keys(templateConfigurations).length;