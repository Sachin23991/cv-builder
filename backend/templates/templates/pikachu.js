/**
 * Pikachu Template
 * Bold yellow accents with energetic design
 */

import { generateHeader } from '../components/Header.js';
import { generateSection } from '../components/PageSection.js';

export function PikachuTemplate({ pageIndex, pageLayout, resumeData, cssVars }) {
  const isFirstPage = pageIndex === 0;
  const { main, sidebar, fullWidth } = pageLayout;
  const { basics, sections, summary } = resumeData;

  const headerOptions = {
    showPicture: true,
    pictureShape: 'rounded',
    picturePlacement: 'left',
    nameStyle: { fontSize: 22, fontWeight: 700 },
    headlineStyle: { fontSize: 11, fontWeight: 500 },
    contactStyle: { fontSize: 9 },
    headerAlign: 'left'
  };

  let html = `<div class="template-pikachu page-content" style="${cssVars}; background: var(--page-background-color, white);">`;

  // Sidebar column with picture and sidebar sections
  if (!fullWidth && sidebar && sidebar.length > 0) {
    html += `<aside data-layout="sidebar" class="page-sidebar" style="width: var(--page-sidebar-width, 30%); flex-shrink: 0;`;

    // Add colored sidebar background for Pikachu
    const primaryColor = cssVars.match(/--page-primary-color:\s*([^;]+)/)?.[1] || '#ffd700';
    html += ` background: ${primaryColor}; color: white; padding: 12pt; border-radius: 8pt;`;

    html += `">`;

    // Picture in sidebar
    if (isFirstPage && basics.pictureUrl) {
      html += `
        <div class="sidebar-picture" style="width: 60pt; height: 60pt; border-radius: 8pt; overflow: hidden; margin-bottom: 8pt;">
          <img src="${basics.pictureUrl}" alt="${basics.name}" style="width: 100%; height: 100%; object-fit: cover;"/>
        </div>
      `;
    }

    sidebar.forEach(sectionId => {
      if (sections[sectionId]) {
        html += generateSection(sectionId, sections[sectionId], { cssVars });
      }
    });
    html += `</aside>`;
  }

  // Main column
  html += `<main data-layout="main" class="page-main" style="flex: 1; padding: 0 16pt;">`;

  // Header in main column
  if (isFirstPage) {
    html += generateHeader(basics, headerOptions);
  }

  // Main sections
  if (main && main.length > 0) {
    main.forEach(sectionId => {
      if (sectionId === 'summary' && summary) {
        html += generateSection(sectionId, summary, { cssVars });
      } else if (sections[sectionId]) {
        html += generateSection(sectionId, sections[sectionId], { cssVars });
      }
    });
  }

  html += `</main></div>`;

  return html;
}

export default PikachuTemplate;
