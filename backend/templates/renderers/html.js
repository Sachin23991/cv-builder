/**
 * HTML Renderer
 * Renders templates to HTML strings
 */

import { getTemplate, allTemplateIds } from '../templates/index.js';
import { generateCSSVariables, getPageDimensions } from '../utils/css-variables.js';
import { validateResumeData } from '../schema/resumeData.js';

// Global styles for all templates
const GLOBAL_CSS = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--page-body-font-family, 'IBM Plex Sans', sans-serif);
    font-size: var(--page-body-font-size, 10pt);
    line-height: var(--page-body-line-height, 1.5);
    color: var(--page-text-color, #333);
    background: #f5f5f5;
  }

  .resume-document {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin: 20px auto;
  }

  .page-content {
    padding: var(--page-margin-y, 12pt) var(--page-margin-x, 14pt);
  }

  .page-header {
    padding-bottom: var(--page-gap-y, 6pt);
    margin-bottom: var(--page-gap-y, 6pt);
  }

  .page-main, .page-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--page-gap-y, 6pt);
  }

  .section-title {
    font-family: var(--page-heading-font-family, 'IBM Plex Sans', sans-serif);
    font-size: var(--page-heading-font-size, 14pt);
    font-weight: var(--page-heading-font-weight, 600);
    line-height: var(--page-heading-line-height, 1.5);
    color: var(--page-text-color, #333);
  }

  .section-item {
    margin-bottom: var(--page-gap-y, 6pt);
  }

  .section-item:last-child {
    margin-bottom: 0;
  }

  .basics-name {
    font-size: 24pt;
    font-weight: 700;
    margin: 0;
  }

  .basics-headline {
    font-size: 11pt;
    margin: 4pt 0 0 0;
    opacity: 0.8;
  }

  .basics-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 6pt 16pt;
  }

  .contact-item {
    font-size: 9pt;
    color: #666;
  }

  .contact-item a {
    color: var(--page-primary-color, #dc143c);
    text-decoration: none;
  }

  .experience-item, .education-item, .project-item,
  .award-item, .certification-item, .volunteer-item,
  .reference-item {
    margin-bottom: 12pt;
  }

  .company, .school, .organization, .name {
    font-weight: 600;
  }

  .position, .degree, .title {
    font-weight: 500;
  }

  .period, .date {
    font-size: 9pt;
    color: #666;
  }

  .description {
    margin-top: 4pt;
    line-height: 1.4;
  }

  .skill-tag, .language-tag, .keyword-tag {
    display: inline-block;
    padding: 2pt 8pt;
    border-radius: 12pt;
    font-size: 9pt;
    margin: 2pt;
  }

  .skill-tag {
    background: var(--page-primary-color, #dc143c);
    color: white;
  }

  .language-tag {
    background: var(--page-primary-color, #dc143c);
    color: white;
  }

  .keyword-tag {
    background: rgba(0,0,0,0.1);
    color: #333;
  }

  a {
    color: var(--page-primary-color, #dc143c);
    text-decoration: none;
  }

  .level-icon {
    display: inline-block;
  }

  @media print {
    body {
      background: white;
    }

    .resume-document {
      box-shadow: none;
      margin: 0;
    }
  }
`;

/**
 * Render template to HTML string
 * @param {string} templateId - Template identifier
 * @param {Object} resumeData - Resume data object
 * @param {Object} options - Render options
 * @returns {Object} { html: string, css: string }
 */
export function renderTemplateToHTML(templateId, resumeData, options = {}) {
  // Validate and merge with defaults
  const validation = validateResumeData(resumeData);
  if (!validation.valid) {
    throw new Error(`Invalid resume data: ${validation.error}`);
  }

  const data = validation.data;
  const Template = getTemplate(templateId);

  // Generate CSS variables
  const cssVars = generateCSSVariables(data.metadata, data.picture);
  const pageDims = getPageDimensions(data.metadata?.page?.format || 'a4');

  // Get page layout
  const pages = data.metadata?.layout?.pages || [{
    fullWidth: false,
    main: ['summary', 'experience', 'education', 'projects'],
    sidebar: ['skills', 'languages', 'profiles']
  }];

  // Render all pages
  const pagesHtml = pages.map((pageLayout, pageIndex) => {
    return Template({ pageIndex, pageLayout, resumeData: data, cssVars });
  }).join('');

  // Combine HTML
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.basics?.name || 'Resume'} - Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;500;600;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Source+Sans+Pro:wght@400;600&family=Raleway:wght@400;500;600;700&family=Ubuntu:wght@400;500;700&family=Nunito:wght@400;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root { ${cssVars} }
    ${GLOBAL_CSS}
  </style>
</head>
<body>
  <div class="resume-document" style="width: ${pageDims.width}mm; min-height: ${pageDims.height}mm;">
    ${pagesHtml}
  </div>
</body>
</html>`;

  return { html, css: GLOBAL_CSS };
}

/**
 * List available templates
 */
export function listTemplates() {
  return allTemplateIds.map(id => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    category: getCategoryForTemplate(id)
  }));
}

function getCategoryForTemplate(templateId) {
  // Map templates to categories based on their visual style
  const categories = {
    // Professional
    onyx: 'professional',
    bronzor: 'professional',
    glalie: 'professional',
    lapras: 'professional',
    leafish: 'professional',
    rhyhorn: 'professional',
    // Creative
    pikachu: 'creative',
    chikorita: 'creative',
    ditgar: 'creative',
    gengar: 'creative',
    meowth: 'creative',
    // Modern
    azurill: 'minimal',
    ditto: 'modern',
    kakuna: 'minimal'
  };
  return categories[templateId] || 'professional';
}

export default {
  renderTemplateToHTML,
  listTemplates,
  allTemplateIds
};