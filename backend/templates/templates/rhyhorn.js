/**
 * Rhyhorn Template
 * Brown earth tones, solid and dependable
 */

import { generateHeader } from '../components/Header.js';
import { generateSection } from '../components/PageSection.js';

export function RhyhornTemplate({ pageIndex, pageLayout, resumeData, cssVars }) {
  const isFirstPage = pageIndex === 0;
  const { main, sidebar, fullWidth } = pageLayout;
  const { basics, sections, summary } = resumeData;

  const headerOptions = {
    showPicture: true,
    pictureShape: 'circle',
    picturePlacement: 'left',
    nameStyle: { fontSize: 20, fontWeight: 600 },
    headlineStyle: { fontSize: 11 },
    contactStyle: { fontSize: 9 },
    headerAlign: 'left'
  };

  let html = `<div class="template-rhyhorn page-content" style="${cssVars}">`;

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
    html += `<aside data-layout="sidebar" class="page-sidebar" style="width: var(--page-sidebar-width, 32%); flex-shrink: 0;">`;
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

export default RhyhornTemplate;
