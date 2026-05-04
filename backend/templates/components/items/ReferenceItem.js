/**
 * Reference Item Component
 */

export function ReferenceItem(item = {}, options = {}) {
  const {
    nameStyle = {},
    positionStyle = {},
    descriptionStyle = {},
    cssVars = ''
  } = options;

  const { name, position, website, phone, description } = item;

  const nameFontSize = nameStyle.fontSize || 11;
  const nameFontWeight = nameStyle.fontWeight || 600;
  const posFontSize = positionStyle.fontSize || 10;
  const descFontSize = descriptionStyle.fontSize || 9;

  return `
    <div class="reference-item section-item" style="margin-bottom: 10pt;">
      <div class="reference-header">
        <span class="name" style="font-size: ${nameFontSize}pt; font-weight: ${nameFontWeight};">${name || ''}</span>
        ${position ? `<span class="position" style="font-size: ${posFontSize}pt; color: #666; margin-left: 8pt;">${position}</span>` : ''}
      </div>
      ${phone ? `<div style="font-size: ${descFontSize}pt;">☎ ${phone}</div>` : ''}
      ${website?.url ? `<a href="${website.url}" target="_blank" style="font-size: ${descFontSize}pt; color: var(--page-primary-color);">${website.label || website.url}</a>` : ''}
      ${description ? `<p class="description" style="font-size: ${descFontSize}pt; margin: 6pt 0 0 0; line-height: 1.4; font-style: italic;">"${description}"</p>` : ''}
    </div>
  `;
}

export default ReferenceItem;