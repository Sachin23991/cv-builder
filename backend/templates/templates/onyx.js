/**
 * Onyx Template
 * A sleek, dark-themed template with clean typography
 */

import { generateHeader } from '../components/Header.js';
import { generateSection } from '../components/PageSection.js';

export function OnyxTemplate({ pageIndex, pageLayout, resumeData, cssVars }) {
  const isFirstPage = pageIndex === 0;
  const { main, sidebar, fullWidth } = pageLayout;
  const { basics, sections, summary } = resumeData;

  // Onyx specific styles
  const headerOptions = {
    showPicture: true,
    pictureShape: 'circle',
    picturePlacement: 'center',
    nameStyle: { fontSize: 24, fontWeight: 700, uppercase: true, letterSpacing: 2 },
    headlineStyle: { fontSize: 12, fontWeight: 400 },
    contactStyle: { fontSize: 9 },
    headerAlign: 'center'
  };

  let html = `<div class="template-onyx page-content" style="${cssVars}">`;

  // Header
  if (isFirstPage) {
    html += generateHeader(basics, headerOptions);
  }

  // Main sections
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

  // Sidebar sections
  if (!fullWidth && sidebar && sidebar.length > 0) {
    html += `<aside data-layout="sidebar" class="page-sidebar" style="width: var(--page-sidebar-width, 35%); flex-shrink: 0;">`;
    sidebar.forEach(sectionId => {
      if (sections[sectionId]) {
        html += generateSection(sectionId, sections[sectionId], { cssVars });
      }
    });
    html += `</aside>`;
  }

  html += `</div>`;

  return html;
}

export default OnyxTemplate;
