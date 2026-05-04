/**
 * Education Item Component
 */

export function EducationItem(item = {}, options = {}) {
  const {
    datePosition = 'right',
    degreeStyle = {},
    institutionStyle = {},
    descriptionStyle = {},
    cssVars = ''
  } = options;

  const { school, degree, area, grade, location, period, website, description } = item;

  const degreeFontSize = degreeStyle.fontSize || 11;
  const degreeFontWeight = degreeStyle.fontWeight || 600;
  const instFontSize = institutionStyle.fontSize || 10;
  const descFontSize = descriptionStyle.fontSize || 9;

  return `
    <div class="education-item section-item" style="margin-bottom: 12pt;">
      <div class="section-item-header" style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
        <div>
          <span class="degree" style="font-size: ${degreeFontSize}pt; font-weight: ${degreeFontWeight};">${degree || ''}</span>
          ${area ? `<span class="area" style="font-size: ${instFontSize}pt; color: #666; margin-left: 6pt;">in ${area}</span>` : ''}
        </div>
        ${period && datePosition === 'right' ? `<span class="period" style="font-size: ${descFontSize}pt;">${period}</span>` : ''}
      </div>
      <div style="font-size: ${instFontSize}pt; margin-top: 2pt;">
        <span class="school">${school || ''}</span>
        ${location ? `<span class="location" style="color: #666; margin-left: 6pt;">${location}</span>` : ''}
      </div>
      ${grade ? `<div style="font-size: ${descFontSize}pt; margin-top: 2pt;"><span class="grade">${grade}</span></div>` : ''}
      ${period && datePosition !== 'right' ? `<div style="font-size: ${descFontSize}pt; margin-top: 2pt;">${period}</div>` : ''}
      ${description ? `<p class="description" style="font-size: ${descFontSize}pt; margin: 6pt 0 0 0; line-height: 1.4;">${description}</p>` : ''}
      ${website?.url ? `<a href="${website.url}" target="_blank" style="font-size: ${descFontSize}pt; color: var(--page-primary-color); display: block; margin-top: 4pt;">${website.label || website.url}</a>` : ''}
    </div>
  `;
}

export default EducationItem;