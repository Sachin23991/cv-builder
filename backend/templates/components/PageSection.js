/**
 * PageSection Component
 * Generic section wrapper for all section types
 */

import { generateLevelIcons } from '../utils/css-variables.js';
import * as ItemComponents from './items/index.js';

const DEFAULT_TITLES = {
  summary: 'Summary',
  profiles: 'Profiles',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  languages: 'Languages',
  interests: 'Interests',
  awards: 'Awards',
  certifications: 'Certifications',
  publications: 'Publications',
  volunteer: 'Volunteer',
  references: 'References'
};

/**
 * Generate section title HTML
 */
function generateSectionTitle(title, sectionType, options = {}) {
  const { showTitle = true, titleStyle = {} } = options;

  if (!showTitle) return '';

  const fontSize = titleStyle.fontSize || 12;
  const fontWeight = titleStyle.fontWeight || 600;
  const uppercase = titleStyle.uppercase ? 'text-transform: uppercase; letter-spacing: 1px;' : '';
  const borderBottom = titleStyle.borderBottom !== false ? 'border-bottom: 1pt solid var(--page-primary-color, #dc143c);' : '';

  return `
    <h6 class="section-title" style="
      font-size: ${fontSize}pt;
      font-weight: ${fontWeight};
      ${uppercase}
      ${borderBottom}
      margin: 0 0 8pt 0;
      padding-bottom: 4pt;
    ">${title || DEFAULT_TITLES[sectionType] || sectionType}</h6>
  `;
}

/**
 * Generate section content HTML by rendering items
 */
function generateSectionItems(sectionType, items = [], options = {}) {
  if (!items || items.length === 0) return '';

  const itemComponents = {
    summary: ItemComponents.SummaryItem,
    profiles: ItemComponents.ProfileItem,
    experience: ItemComponents.ExperienceItem,
    education: ItemComponents.EducationItem,
    projects: ItemComponents.ProjectItem,
    skills: ItemComponents.SkillItem,
    languages: ItemComponents.LanguageItem,
    interests: ItemComponents.InterestItem,
    awards: ItemComponents.AwardItem,
    certifications: ItemComponents.CertificationItem,
    publications: ItemComponents.PublicationItem,
    volunteer: ItemComponents.VolunteerItem,
    references: ItemComponents.ReferenceItem
  };

  const Component = itemComponents[sectionType];
  if (!Component) return '';

  return items
    .filter(item => !item.hidden)
    .map(item => Component(item, options))
    .join('');
}

/**
 * Generate page section HTML
 * @param {string} sectionType - Type of section (experience, education, etc.)
 * @param {Object} section - Section data with title, items, etc.
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function generateSection(sectionType, section = {}, options = {}) {
  const { title, items = [], hidden, columns = 1 } = section;

  // Skip hidden sections
  if (hidden) return '';

  // Skip empty sections
  if (!items || items.length === 0) return '';

  const titleHtml = generateSectionTitle(title, sectionType, options);
  const contentHtml = generateSectionItems(sectionType, items, { ...options, sectionType });

  if (!contentHtml) return '';

  const columnClass = columns > 1 ? `columns-${columns}` : '';

  return `
    <section class="page-section section-${sectionType} ${columnClass}" data-section="${sectionType}">
      ${titleHtml}
      <div class="section-content">
        ${contentHtml}
      </div>
    </section>
  `;
}

/**
 * Generate section for a specific page layout
 */
export function generateSectionsForLayout(sectionIds, resumeData, cssVars, pageLayout) {
  const { sections = {} } = resumeData;

  return sectionIds
    .map(sectionId => {
      // Handle built-in sections
      if (sections[sectionId]) {
        return generateSection(sectionId, sections[sectionId], { cssVars });
      }
      // Handle custom sections (by UUID)
      const customSection = (resumeData.customSections || []).find(cs => cs.id === sectionId);
      if (customSection) {
        return generateSection(customSection.type, customSection, { cssVars });
      }
      return '';
    })
    .filter(html => html)
    .join('');
}

export default generateSection;