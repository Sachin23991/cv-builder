/**
 * Ditgar Template
 * Bold crimson for strong visual impact
 */

import { generateHeader } from '../components/Header.js';
import { generateSection } from '../components/PageSection.js';

export function DitgarTemplate({ pageIndex, pageLayout, resumeData, cssVars }) {
  const isFirstPage = pageIndex === 0;
  const { main, sidebar, fullWidth } = pageLayout;
  const { basics, sections, summary } = resumeData;

  const headerOptions = {
    showPicture: true,
    pictureShape: 'square',
    picturePlacement: 'left',
    nameStyle: { fontSize: 24, fontWeight: 700 },
    headlineStyle: { fontSize: 12, fontWeight: 500 },
    contactStyle: { fontSize: 9 },
    headerAlign: 'left'
  };

  let html = `<div class="template-ditgar page-content" style="${cssVars}">`;

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

  // Sidebar
  if (!fullWidth && sidebar && sidebar.length > 0) {
    html += `<aside data-layout="sidebar" class="page-sidebar" style="width: var(--page-sidebar-width, 33%); flex-shrink: 0;">`;
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

export default DitgarTemplate;
