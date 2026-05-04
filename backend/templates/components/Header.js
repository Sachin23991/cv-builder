/**
 * Header Component
 * Generates header HTML for resume templates
 */

import { generateLevelIcons } from '../utils/css-variables.js';

// Icon map (simplified - no Phosphor in pure HTML)
const ICONS = {
  mail: '✉',
  phone: '☎',
  mapPin: '⌖',
  globe: '🌐',
  github: '⌂',
  linkedin: 'in',
  twitter: 'tw',
  facebook: 'fb',
  instagram: 'ig',
  default: '●'
};

function getIcon(iconName) {
  return ICONS[iconName?.toLowerCase()] || ICONS.default;
}

function formatUrl(url) {
  if (!url) return '';
  // Remove protocol for display
  return url.replace(/^https?:\/\//, '');
}

/**
 * Generate header HTML
 * @param {Object} basics - Basic info object
 * @param {Object} options - Header options (showPicture, pictureShape, etc.)
 * @returns {string} HTML string
 */
export function generateHeader(basics = {}, options = {}) {
  const {
    showPicture = true,
    pictureShape = 'circle',
    picturePlacement = 'left',
    nameStyle = {},
    headlineStyle = {},
    contactStyle = {},
    headerAlign = 'left'
  } = options;

  const { name, headline, email, phone, location, website, customFields = [] } = basics;

  const nameFontSize = nameStyle.fontSize || 22;
  const nameFontWeight = nameStyle.fontWeight || 700;
  const nameUppercase = nameStyle.uppercase ? 'text-transform: uppercase; letter-spacing: 2px;' : '';
  const headlineFontSize = headlineStyle.fontSize || 11;
  const contactFontSize = contactStyle.fontSize || 9;

  // Picture HTML
  let pictureHtml = '';
  if (showPicture && basics.pictureUrl) {
    const borderRadius = pictureShape === 'circle' ? '50%' : (pictureShape === 'rounded' ? '8px' : '0');
    pictureHtml = `
      <div class="header-picture" style="
        width: 80pt;
        height: 80pt;
        border-radius: ${borderRadius};
        overflow: hidden;
        flex-shrink: 0;
      ">
        <img src="${basics.pictureUrl}" alt="${name}" style="
          width: 100%;
          height: 100%;
          object-fit: cover;
        "/>
      </div>
    `;
  }

  // Contact items
  const contactItems = [];

  if (email) {
    contactItems.push(`<span class="contact-item contact-email">✉ ${email}</span>`);
  }
  if (phone) {
    contactItems.push(`<span class="contact-item contact-phone">☎ ${phone}</span>`);
  }
  if (location) {
    contactItems.push(`<span class="contact-item contact-location">⌖ ${location}</span>`);
  }
  if (website?.url) {
    contactItems.push(`<span class="contact-item contact-website">🌐 ${formatUrl(website.url)}</span>`);
  }

  // Custom fields
  customFields.forEach(field => {
    const icon = field.icon ? getIcon(field.icon) : '●';
    if (field.link) {
      contactItems.push(`<a class="contact-item contact-custom" href="${field.link}" target="_blank">${icon} ${field.text}</a>`);
    } else {
      contactItems.push(`<span class="contact-item contact-custom">${icon} ${field.text}</span>`);
    }
  });

  // Build header based on placement
  let headerContent = '';

  if (picturePlacement === 'center' && showPicture) {
    headerContent = `
      <div class="header-content" style="text-align: center;">
        ${pictureHtml}
        <div class="header-text" style="margin-top: 8pt;">
          ${name ? `<h1 class="basics-name" style="font-size: ${nameFontSize}pt; font-weight: ${nameFontWeight}; ${nameUppercase}; margin: 0;">${name}</h1>` : ''}
          ${headline ? `<p class="basics-headline" style="font-size: ${headlineFontSize}pt; margin: 4pt 0 0 0; opacity: 0.8;">${headline}</p>` : ''}
        </div>
        ${contactItems.length ? `<div class="basics-contact" style="font-size: ${contactFontSize}pt; margin-top: 8pt; display: flex; flex-wrap: wrap; justify-content: center; gap: 8pt 16pt;">${contactItems.join('')}</div>` : ''}
      </div>
    `;
  } else {
    headerContent = `
      <div class="header-content" style="display: flex; align-items: center; gap: 12pt;">
        ${picturePlacement === 'left' && showPicture ? pictureHtml : ''}
        <div class="header-text" style="flex: 1;">
          ${name ? `<h1 class="basics-name" style="font-size: ${nameFontSize}pt; font-weight: ${nameFontWeight}; ${nameUppercase}; margin: 0;">${name}</h1>` : ''}
          ${headline ? `<p class="basics-headline" style="font-size: ${headlineFontSize}pt; margin: 4pt 0 0 0; opacity: 0.8;">${headline}</p>` : ''}
          ${contactItems.length ? `<div class="basics-contact" style="font-size: ${contactFontSize}pt; margin-top: 6pt; display: flex; flex-wrap: wrap; gap: 6pt 16pt;">${contactItems.join('')}</div>` : ''}
        </div>
        ${picturePlacement === 'right' && showPicture ? pictureHtml : ''}
      </div>
    `;
  }

  return `
    <div class="page-header" style="
      padding-bottom: 12pt;
      margin-bottom: 12pt;
      border-bottom: 1pt solid var(--page-primary-color, #dc143c);
    ">
      ${headerContent}
    </div>
  `;
}

export default generateHeader;