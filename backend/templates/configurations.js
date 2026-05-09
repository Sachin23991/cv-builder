/**
 * Template Configuration System
 * 13 genuinely distinct templates:
 *   - 7 industry-specific (Tech, Consulting, Healthcare, Creative, Academic, Research, Executive)
 *   - 3 style variants (Onyx Dark, Minimal Elegant, Modern Gradient)
 *   - 3 LaTeX-inspired (Jake's Resume, ModernCV, Academic CV)
 *
 * Each template provides structural defaults (layout, sections).
 * Users customize colors/typography/etc via the Customization Studio.
 */

export const templateConfigurations = {

  // ==========================================
  // INDUSTRY-SPECIFIC TEMPLATES
  // ==========================================

  'tech': {
    id: 'tech',
    name: 'Tech Resume',
    category: 'professional',
    description: 'ATS-optimized for software engineers — skills-first with projects section',
    primaryColor: '#0077cc',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: { headingFont: 'Inter', bodyFont: 'Inter', headingSize: 13, bodySize: 10, lineHeight: 1.5 },
    styles: { headerAlign: 'left', sectionSpacing: 12, itemSpacing: 8, borderRadius: 6, cardStyle: 'border' },
    sections: {
      header: { showPicture: false, nameStyle: { fontSize: 22, fontWeight: 700 } },
      skills: { title: 'Technical Skills', showTitle: true, layout: 'tags', tagStyle: { rounded: false, filled: true } },
      projects: { title: 'Projects', showTitle: true },
    },
  },

  'consulting': {
    id: 'consulting',
    name: 'Finance & Consulting',
    category: 'professional',
    description: 'Conservative, structured layout for banking, consulting, and finance roles',
    primaryColor: '#003366',
    layout: {
      type: 'single-column',
      mainSections: ['summary', 'experience', 'education', 'skills', 'certifications'],
      sidebarSections: [],
    },
    typography: { headingFont: 'Georgia', bodyFont: 'Arial', headingSize: 13, bodySize: 10, lineHeight: 1.4 },
    styles: { headerAlign: 'left', sectionSpacing: 14, itemSpacing: 10, borderRadius: 0, cardStyle: 'border' },
    sections: {
      header: { showPicture: false, nameStyle: { fontSize: 22, fontWeight: 700, uppercase: true } },
    },
  },

  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare',
    category: 'professional',
    description: 'For medical professionals — certifications and clinical experience first',
    primaryColor: '#008080',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['experience', 'education', 'certifications'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: { headingFont: 'Arial', bodyFont: 'Arial', headingSize: 13, bodySize: 10, lineHeight: 1.5 },
    styles: { headerAlign: 'left', sectionSpacing: 14, itemSpacing: 10, borderRadius: 4, cardStyle: 'border' },
    sections: {
      header: { showPicture: true, pictureShape: 'circle', picturePlacement: 'left' },
      certifications: { title: 'Certifications & Licenses', showTitle: true },
    },
  },

  'creative-artist': {
    id: 'creative-artist',
    name: 'Creative Portfolio',
    category: 'creative',
    description: 'Bold colors and project-forward layout for designers and creatives',
    primaryColor: '#e91e63',
    layout: {
      type: 'two-column',
      sidebarWidth: 35,
      mainSections: ['projects', 'experience'],
      sidebarSections: ['skills', 'awards', 'profiles'],
    },
    typography: { headingFont: 'Playfair Display', bodyFont: 'Lato', headingSize: 14, bodySize: 10, lineHeight: 1.6 },
    styles: { headerAlign: 'left', sectionSpacing: 14, itemSpacing: 12, borderRadius: 8, cardStyle: 'shadow' },
    sections: {
      header: { showPicture: true, pictureShape: 'square', picturePlacement: 'left', nameStyle: { fontSize: 26, fontWeight: 700 } },
    },
  },

  'academic': {
    id: 'academic',
    name: 'Academic CV',
    category: 'academic',
    description: 'Extended CV for academic positions — publications and research focus',
    primaryColor: '#8b0000',
    layout: {
      type: 'single-column',
      mainSections: ['education', 'publications', 'experience', 'awards'],
      sidebarSections: [],
    },
    typography: { headingFont: 'Times New Roman', bodyFont: 'Times New Roman', headingSize: 13, bodySize: 10, lineHeight: 1.5 },
    styles: { headerAlign: 'left', sectionSpacing: 16, itemSpacing: 10, borderRadius: 0, cardStyle: 'none' },
    sections: {
      header: { showPicture: false, nameStyle: { fontSize: 24, fontWeight: 700 } },
      publications: { title: 'Publications', showTitle: true },
      education: { title: 'Academic Background', showTitle: true },
    },
  },

  'research': {
    id: 'research',
    name: 'Research',
    category: 'academic',
    description: 'For research positions — emphasizes publications and technical skills',
    primaryColor: '#2c3e50',
    layout: {
      type: 'two-column',
      sidebarWidth: 30,
      mainSections: ['education', 'experience', 'publications'],
      sidebarSections: ['skills', 'awards', 'profiles'],
    },
    typography: { headingFont: 'Arial', bodyFont: 'Arial', headingSize: 13, bodySize: 10, lineHeight: 1.5 },
    styles: { headerAlign: 'left', sectionSpacing: 14, itemSpacing: 10, borderRadius: 4, cardStyle: 'border' },
    sections: {
      header: { showPicture: false, nameStyle: { fontSize: 22, fontWeight: 700 } },
      publications: { title: 'Selected Publications', showTitle: true },
    },
  },

  'executive': {
    id: 'executive',
    name: 'Executive',
    category: 'professional',
    description: 'Premium template for C-level and senior leadership roles',
    primaryColor: '#1a1a2e',
    layout: {
      type: 'single-column',
      mainSections: ['summary', 'experience', 'education', 'certifications'],
      sidebarSections: [],
    },
    typography: { headingFont: 'Georgia', bodyFont: 'Garamond', headingSize: 13, bodySize: 11, lineHeight: 1.7 },
    styles: { headerAlign: 'center', sectionSpacing: 18, itemSpacing: 12, borderRadius: 0, cardStyle: 'border' },
    sections: {
      header: { showPicture: false, nameStyle: { fontSize: 24, fontWeight: 700, uppercase: true, letterSpacing: 3 } },
      summary: { title: 'Executive Profile', showTitle: true },
    },
  },

  // ==========================================
  // STYLE VARIANTS
  // ==========================================

  'onyx': {
    id: 'onyx',
    name: 'Onyx',
    category: 'professional',
    description: 'Dark-themed professional template with clean two-column layout',
    primaryColor: '#1a1a2e',
    layout: {
      type: 'two-column',
      sidebarWidth: 35,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: { headingFont: 'Inter', bodyFont: 'Inter', headingSize: 14, bodySize: 10, lineHeight: 1.5 },
    styles: { headerAlign: 'center', sectionSpacing: 16, itemSpacing: 12, borderRadius: 4, cardStyle: 'border' },
    sections: {
      header: { showPicture: true, pictureShape: 'circle', picturePlacement: 'center', nameStyle: { fontSize: 24, fontWeight: 700, uppercase: true, letterSpacing: 2 } },
      skills: { title: 'Skills', showTitle: true, layout: 'tags', tagStyle: { rounded: true, filled: true } },
    },
  },

  'minimal-elegant': {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    category: 'minimal',
    description: 'Ultra-clean single-column design — lets content speak for itself',
    primaryColor: '#333333',
    layout: {
      type: 'single-column',
      mainSections: ['summary', 'experience', 'education', 'skills'],
      sidebarSections: [],
    },
    typography: { headingFont: 'Helvetica', bodyFont: 'Helvetica', headingSize: 14, bodySize: 10, lineHeight: 1.6 },
    styles: { headerAlign: 'left', sectionSpacing: 20, itemSpacing: 12, borderRadius: 0, cardStyle: 'none' },
    sections: {
      header: { showPicture: false, nameStyle: { fontSize: 28, fontWeight: 300 } },
    },
  },

  'modern-gradient': {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    category: 'modern',
    description: 'Bold modern design with gradient accents and rounded cards',
    primaryColor: '#6366f1',
    layout: {
      type: 'two-column',
      sidebarWidth: 35,
      mainSections: ['experience', 'projects', 'education'],
      sidebarSections: ['skills', 'languages'],
    },
    typography: { headingFont: 'Inter', bodyFont: 'Inter', headingSize: 13, bodySize: 10, lineHeight: 1.5 },
    styles: { headerAlign: 'center', sectionSpacing: 14, itemSpacing: 10, borderRadius: 16, cardStyle: 'gradient-bg' },
    sections: {
      header: { showPicture: true, pictureShape: 'rounded', picturePlacement: 'center', nameStyle: { fontSize: 22, fontWeight: 700 } },
    },
  },

  // ==========================================
  // LATEX-INSPIRED TEMPLATES (Overleaf style)
  // ==========================================

  'latex-jake': {
    id: 'latex-jake',
    name: "Jake's Resume (LaTeX)",
    category: 'professional',
    description: 'The gold-standard ATS LaTeX template — clean, single-column, Computer Modern style',
    primaryColor: '#000000',
    layout: {
      type: 'single-column',
      mainSections: ['education', 'experience', 'projects', 'skills'],
      sidebarSections: [],
    },
    typography: { headingFont: 'Libre Baskerville', bodyFont: 'Libre Baskerville', headingSize: 12, bodySize: 10, lineHeight: 1.4 },
    styles: { headerAlign: 'center', sectionSpacing: 10, itemSpacing: 6, borderRadius: 0, cardStyle: 'none' },
    sections: {
      header: { showPicture: false, nameStyle: { fontSize: 26, fontWeight: 700 } },
      education: { title: 'Education', showTitle: true },
      experience: { title: 'Experience', showTitle: true },
      projects: { title: 'Projects', showTitle: true },
      skills: { title: 'Technical Skills', showTitle: true, layout: 'inline' },
    },
    latexStyle: true,
  },

  'latex-moderncv': {
    id: 'latex-moderncv',
    name: 'ModernCV (LaTeX)',
    category: 'professional',
    description: 'Professional two-column LaTeX CV — inspired by the ModernCV package',
    primaryColor: '#2563eb',
    layout: {
      type: 'two-column',
      sidebarWidth: 28,
      mainSections: ['summary', 'experience', 'education'],
      sidebarSections: ['skills', 'languages', 'profiles'],
    },
    typography: { headingFont: 'Lora', bodyFont: 'Source Sans Pro', headingSize: 13, bodySize: 10, lineHeight: 1.5 },
    styles: { headerAlign: 'left', sectionSpacing: 14, itemSpacing: 10, borderRadius: 0, cardStyle: 'none' },
    sections: {
      header: { showPicture: true, pictureShape: 'circle', picturePlacement: 'left', nameStyle: { fontSize: 28, fontWeight: 300 } },
    },
    latexStyle: true,
  },

  'latex-academic': {
    id: 'latex-academic',
    name: 'Academic CV (LaTeX)',
    category: 'academic',
    description: 'Extended academic CV in LaTeX style — publications, grants, teaching',
    primaryColor: '#7c2d12',
    layout: {
      type: 'single-column',
      mainSections: ['education', 'experience', 'publications', 'awards', 'skills'],
      sidebarSections: [],
    },
    typography: { headingFont: 'EB Garamond', bodyFont: 'EB Garamond', headingSize: 14, bodySize: 11, lineHeight: 1.6 },
    styles: { headerAlign: 'center', sectionSpacing: 16, itemSpacing: 10, borderRadius: 0, cardStyle: 'none' },
    sections: {
      header: { showPicture: false, nameStyle: { fontSize: 28, fontWeight: 400 } },
      publications: { title: 'Publications', showTitle: true },
      education: { title: 'Education', showTitle: true },
    },
    latexStyle: true,
  },
};

// Export helpers
export const templateList = Object.values(templateConfigurations);
export const templatesByCategory = {
  professional: templateList.filter(t => t.category === 'professional'),
  creative: templateList.filter(t => t.category === 'creative'),
  academic: templateList.filter(t => t.category === 'academic'),
  modern: templateList.filter(t => t.category === 'modern'),
  minimal: templateList.filter(t => t.category === 'minimal'),
};
export const getTemplateById = (id) => templateConfigurations[id];
export const getAllTemplateIds = () => Object.keys(templateConfigurations);
export const templateCount = Object.keys(templateConfigurations).length;