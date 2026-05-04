/**
 * Volunteer Item Component
 */

export function VolunteerItem(item = {}, options = {}) {
  const {
    datePosition = 'right',
    orgStyle = {},
    descriptionStyle = {},
    cssVars = ''
  } = options;

  const { organization, location, period, website, description } = item;

  const orgFontSize = orgStyle.fontSize || 11;
  const orgFontWeight = orgStyle.fontWeight || 600;
  const descFontSize = descriptionStyle.fontSize || 9;

  return `
    <div class="volunteer-item section-item" style="margin-bottom: 10pt;">
      <div class="section-item-header" style="display: flex; justify-content: space-between; align-items: baseline;">
        <span class="organization" style="font-size: ${orgFontSize}pt; font-weight: ${orgFontWeight};">${organization || ''}</span>
        ${period && datePosition === 'right' ? `<span class="period" style="font-size: ${descFontSize}pt;">${period}</span>` : ''}
      </div>
      ${location ? `<div style="font-size: ${descFontSize}pt; color: #666;">${location}</div>` : ''}
      ${period && datePosition !== 'right' ? `<div style="font-size: ${descFontSize}pt;">${period}</div>` : ''}
      ${description ? `<p class="description" style="font-size: ${descFontSize}pt; margin: 4pt 0 0 0; line-height: 1.4;">${description}</p>` : ''}
      ${website?.url ? `<a href="${website.url}" target="_blank" style="font-size: ${descFontSize}pt; color: var(--page-primary-color);">${website.label || website.url}</a>` : ''}
    </div>
  `;
}

export default VolunteerItem;