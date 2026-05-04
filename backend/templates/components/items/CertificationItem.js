/**
 * Certification Item Component
 */

export function CertificationItem(item = {}, options = {}) {
  const {
    datePosition = 'right',
    titleStyle = {},
    descriptionStyle = {},
    cssVars = ''
  } = options;

  const { title, issuer, date, website, description } = item;

  const titleFontSize = titleStyle.fontSize || 11;
  const titleFontWeight = titleStyle.fontWeight || 600;
  const descFontSize = descriptionStyle.fontSize || 9;

  return `
    <div class="certification-item section-item" style="margin-bottom: 10pt;">
      <div class="section-item-header" style="display: flex; justify-content: space-between; align-items: baseline;">
        <span class="title" style="font-size: ${titleFontSize}pt; font-weight: ${titleFontWeight};">${title || ''}</span>
        ${date && datePosition === 'right' ? `<span class="date" style="font-size: ${descFontSize}pt;">${date}</span>` : ''}
      </div>
      ${issuer ? `<div style="font-size: ${descFontSize}pt; color: #666;">${issuer}</div>` : ''}
      ${date && datePosition !== 'right' ? `<div style="font-size: ${descFontSize}pt;">${date}</div>` : ''}
      ${description ? `<p class="description" style="font-size: ${descFontSize}pt; margin: 4pt 0 0 0; line-height: 1.4;">${description}</p>` : ''}
      ${website?.url ? `<a href="${website.url}" target="_blank" style="font-size: ${descFontSize}pt; color: var(--page-primary-color);">${website.label || website.url}</a>` : ''}
    </div>
  `;
}

export default CertificationItem;