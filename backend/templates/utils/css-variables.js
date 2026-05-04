/**
 * CSS Variables Generator
 * Generates --page-* CSS variables for template styling
 */

const PAGE_DIMENSIONS = {
  a4: { width: 210, height: 297 }, // mm
  letter: { width: 216, height: 279 }, // mm
  'free-form': { width: 210, height: 297 }
};

// Font family builders
const FONT_FAMILIES = {
  'IBM Plex Sans': "'IBM Plex Sans', sans-serif",
  'IBM Plex Serif': "'IBM Plex Serif', serif",
  'Inter': "'Inter', sans-serif",
  'Roboto': "'Roboto', sans-serif",
  'Open Sans': "'Open Sans', sans-serif",
  'Lato': "'Lato', sans-serif",
  'Montserrat': "'Montserrat', sans-serif",
  'Poppins': "'Poppins', sans-serif",
  'Playfair Display': "'Playfair Display', serif",
  'Merriweather': "'Merriweather', serif",
  'Source Sans Pro': "'Source Sans Pro', sans-serif",
  'Raleway': "'Raleway', sans-serif",
  'Ubuntu': "'Ubuntu', sans-serif",
  'Nunito': "'Nunito', sans-serif",
  'Fira Code': "'Fira Code', monospace",
  'Georgia': "'Georgia', serif",
  'Arial': "'Arial', sans-serif",
  'Times New Roman': "'Times New Roman', serif",
  'Helvetica': "'Helvetica', sans-serif"
};

// Get font family CSS
export function getFontFamily(fontFamily) {
  return FONT_FAMILIES[fontFamily] || `'${fontFamily}', sans-serif`;
}

// Get page dimensions in mm
export function getPageDimensions(format = 'a4') {
  return PAGE_DIMENSIONS[format.toLowerCase()] || PAGE_DIMENSIONS.a4;
}

// Generate CSS variables from metadata
export function generateCSSVariables(metadata = {}, picture = {}) {
  const {
    page = {},
    design = {},
    typography = {},
    layout = {}
  } = metadata;

  const { colors = {}, level = {} } = design;
  const { body = {}, heading = {} } = typography;

  const pageDims = getPageDimensions(page.format);

  const vars = {
    '--picture-border-radius': `${picture.borderRadius || 0}pt`,
    '--picture-size': `${picture.size || 80}pt`,
    '--page-width': `${pageDims.width}mm`,
    '--page-height': `${pageDims.height}mm`,
    '--page-sidebar-width': `${layout.sidebarWidth || 35}%`,
    '--page-text-color': colors.text || 'rgba(0, 0, 0, 1)',
    '--page-primary-color': colors.primary || 'rgba(220, 38, 38, 1)',
    '--page-background-color': colors.background || 'rgba(255, 255, 255, 1)',
    '--page-body-font-family': getFontFamily(body.fontFamily || 'IBM Plex Sans'),
    '--page-body-font-weight': '400',
    '--page-body-font-weight-bold': (body.fontWeights || ['400', '500'])[1] || '500',
    '--page-body-font-size': `${body.fontSize || 10}pt`,
    '--page-body-line-height': body.lineHeight || 1.5,
    '--page-heading-font-family': getFontFamily(heading.fontFamily || 'IBM Plex Sans'),
    '--page-heading-font-weight': (heading.fontWeights || ['600'])[0] || '600',
    '--page-heading-font-size': `${heading.fontSize || 14}pt`,
    '--page-heading-line-height': heading.lineHeight || 1.5,
    '--page-margin-x': `${page.marginX || 14}pt`,
    '--page-margin-y': `${page.marginY || 12}pt`,
    '--page-gap-x': `${page.gapX || 4}pt`,
    '--page-gap-y': `${page.gapY || 6}pt`,
    '--page-hide-icons': page.hideIcons ? 'none' : 'inline'
  };

  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
}

// Generate level icons HTML
export function generateLevelIcons(level = 0, type = 'circle', color = '') {
  if (level === 0 || type === 'hidden') return '';

  const iconColor = color || 'var(--page-primary-color)';
  const icons = [];

  for (let i = 0; i < 5; i++) {
    const filled = i < level;
    if (type === 'circle') {
      icons.push(`<span class="level-icon" style="display:inline-block;width:8pt;height:8pt;border-radius:50%;background:${filled ? iconColor : 'transparent'};border:1pt solid ${iconColor};margin-right:2pt;"></span>`);
    } else if (type === 'square') {
      icons.push(`<span class="level-icon" style="display:inline-block;width:8pt;height:8pt;background:${filled ? iconColor : 'transparent'};border:1pt solid ${iconColor};margin-right:2pt;"></span>`);
    } else if (type === 'progress-bar') {
      icons.push(`<span class="level-icon" style="display:inline-block;width:20pt;height:4pt;background:${filled ? iconColor : 'transparent'};border:1pt solid ${iconColor};margin-right:2pt;"></span>`);
    }
  }

  return icons.join('');
}

export default {
  generateCSSVariables,
  getFontFamily,
  getPageDimensions,
  generateLevelIcons
};