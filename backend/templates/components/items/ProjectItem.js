/**
 * Project Item Component
 */

export function ProjectItem(item = {}, options = {}) {
  const {
    datePosition = 'right',
    nameStyle = {},
    descriptionStyle = {},
    cssVars = ''
  } = options;

  const { name, period, website, description } = item;

  const nameFontSize = nameStyle.fontSize || 11;
  const nameFontWeight = nameStyle.fontWeight || 600;
  const descFontSize = descriptionStyle.fontSize || 9;

  return `
    <div class="project-item section-item" style="margin-bottom: 10pt;">
      <div class="section-item-header" style="display: flex; justify-content: space-between; align-items: baseline;">
        <span class="name" style="font-size: ${nameFontSize}pt; font-weight: ${nameFontWeight};">${name || ''}</span>
        ${period && datePosition === 'right' ? `<span class="period" style="font-size: ${descFontSize}pt;">${period}</span>` : ''}
      </div>
      ${period && datePosition !== 'right' ? `<div style="font-size: ${descFontSize}pt; margin-top: 2pt;">${period}</div>` : ''}
      ${description ? `<p class="description" style="font-size: ${descFontSize}pt; margin: 4pt 0 0 0; line-height: 1.4;">${description}</p>` : ''}
      ${website?.url ? `<a href="${website.url}" target="_blank" style="font-size: ${descFontSize}pt; color: var(--page-primary-color); display: block; margin-top: 4pt;">${website.label || website.url}</a>` : ''}
    </div>
  `;
}

export default ProjectItem;