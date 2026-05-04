/**
 * Experience Item Component
 */

export function ExperienceItem(item = {}, options = {}) {
  const {
    datePosition = 'right',
    companyStyle = {},
    jobTitleStyle = {},
    descriptionStyle = {},
    cssVars = ''
  } = options;

  const { company, position, location, period, website, description, roles = [] } = item;

  const companyFontSize = companyStyle.fontSize || 11;
  const companyFontWeight = companyStyle.fontWeight || 600;
  const jobTitleFontSize = jobTitleStyle.fontSize || 10;
  const descFontSize = descriptionStyle.fontSize || 9;

  // If has roles (career progression), show them
  if (roles && roles.length > 0) {
    const rolesHtml = roles.map(role => `
      <div class="role-item" style="margin-top: 6pt;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span class="role-position" style="font-size: ${jobTitleFontSize}pt; font-weight: 500;">${role.position || position}</span>
          ${role.period ? `<span class="role-period" style="font-size: ${descFontSize}pt; color: var(--page-text-color, #333);">${role.period}</span>` : ''}
        </div>
        ${role.description ? `<p class="role-description" style="font-size: ${descFontSize}pt; margin: 4pt 0 0 0; line-height: 1.4;">${role.description}</p>` : ''}
      </div>
    `).join('');

    return `
      <div class="experience-item section-item" style="margin-bottom: 12pt;">
        <div class="section-item-header" style="display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <span class="company" style="font-size: ${companyFontSize}pt; font-weight: ${companyFontWeight};">${company || ''}</span>
            ${location ? `<span class="location" style="font-size: ${descFontSize}pt; color: #666; margin-left: 8pt;">${location}</span>` : ''}
          </div>
          ${period ? `<span class="period" style="font-size: ${descFontSize}pt;">${period}</span>` : ''}
        </div>
        ${rolesHtml}
        ${website?.url ? `<a href="${website.url}" target="_blank" style="font-size: ${descFontSize}pt; color: var(--page-primary-color);">${website.label || website.url}</a>` : ''}
      </div>
    `;
  }

  // Single role (standard display)
  const headerContent = `
    <div class="section-item-header" style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
      <div>
        <span class="company" style="font-size: ${companyFontSize}pt; font-weight: ${companyFontWeight};">${company || ''}</span>
        ${position ? `<span class="position" style="font-size: ${jobTitleFontSize}pt; font-weight: 400; margin-left: 8pt;">${position}</span>` : ''}
        ${location ? `<span class="location" style="font-size: ${descFontSize}pt; color: #666; margin-left: 8pt;">${location}</span>` : ''}
      </div>
      ${period && datePosition === 'right' ? `<span class="period" style="font-size: ${descFontSize}pt; white-space: nowrap;">${period}</span>` : ''}
    </div>
  `;

  const periodHtml = period && datePosition !== 'right' ? `
    <div style="font-size: ${descFontSize}pt; margin-bottom: 4pt;">${period}</div>
  ` : '';

  const descriptionHtml = description ? `
    <p class="description" style="font-size: ${descFontSize}pt; margin: 6pt 0 0 0; line-height: 1.4;">${description}</p>
  ` : '';

  const websiteHtml = website?.url ? `
    <a href="${website.url}" target="_blank" style="font-size: ${descFontSize}pt; color: var(--page-primary-color); display: block; margin-top: 4pt;">${website.label || website.url}</a>
  ` : '';

  return `
    <div class="experience-item section-item" style="margin-bottom: 12pt;">
      ${headerContent}
      ${periodHtml}
      ${descriptionHtml}
      ${websiteHtml}
    </div>
  `;
}

export default ExperienceItem;