/**
 * Chikorita Template
 * Fresh green accents, nature-inspired
 */

import { generateHeader } from '../components/Header.js';
import { generateSection } from '../components/PageSection.js';

export function ChikoritaTemplate({ pageIndex, pageLayout, resumeData, cssVars }) {
  const isFirstPage = pageIndex === 0;
  const { main, sidebar, fullWidth } = pageLayout;
  const { basics, sections, summary } = resumeData;

  const headerOptions = {
    showPicture: true,
    pictureShape: 'rounded',
    picturePlacement: 'center',
    nameStyle: { fontSize: 22, fontWeight: 700 },
    headlineStyle: { fontSize: 11 },
    contactStyle: { fontSize: 9 },
    headerAlign: 'center'
  };

  let html = `<div class="template-chikorita page-content" style="${cssVars}">`;

  if (isFirstPage) {
    html += generateHeader(basics, headerOptions);
  }

  html += `<div style="display: flex; gap: var(--page-gap-x, 16pt);">`;

  // Main column
  if (main && main.length > 0) {
    html += `<main data-layout="main" class="page-main" style="flex: 1;">`;
    main.forEach(sectionId => {
      if (sectionId === 'summary' && summary) {
        html += generateSection(sectionId, summary, { cssVars });
      } else if (sections[sectionId]) {
        html += generateSection(sectionId, sections[sectionId], { cssVars });
      }
    });
    html += `</main>`;
  }

  // Sidebar with green accent
  if (!fullWidth && sidebar && sidebar.length > 0) {
    html += `<aside data-layout="sidebar" class="page-sidebar" style="width: var(--page-sidebar-width, 28%); flex-shrink: 0; border-left: 2pt solid var(--page-primary-color, #98fb98); padding-left: 12pt;">`;
    sidebar.forEach(sectionId => {
      if (sections[sectionId]) {
        html += generateSection(sectionId, sections[sectionId], { cssVars });
      }
    });
    html += `</aside>`;
  }

  html += `</div></div>`;

  return html;
}

export default ChikoritaTemplate;
