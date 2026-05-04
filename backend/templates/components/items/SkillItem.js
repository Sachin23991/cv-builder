/**
 * Skill Item Component
 */

import { generateLevelIcons } from '../../utils/css-variables.js';

export function SkillItem(item = {}, options = {}) {
  const {
    layout = 'tags', // 'tags' | 'list' | 'levels'
    tagStyle = {},
    cssVars = ''
  } = options;

  const { name, proficiency, level = 0, keywords = [], icon, iconColor } = item;

  const tagRounded = tagStyle.rounded !== false;
  const tagFilled = tagStyle.filled !== false;
  const borderRadius = tagRounded ? '12pt' : '2pt';
  const backgroundColor = tagFilled ? 'var(--page-primary-color, #dc143c)' : 'transparent';
  const textColor = tagFilled ? 'white' : 'var(--page-text-color, #333)';

  if (layout === 'tags') {
    return `
      <span class="skill-tag" style="
        display: inline-block;
        padding: 2pt 8pt;
        border-radius: ${borderRadius};
        background: ${backgroundColor};
        color: ${textColor};
        font-size: 9pt;
        margin: 2pt;
      ">${name || ''}</span>
    `;
  }

  if (layout === 'levels') {
    const levelIcons = generateLevelIcons(level, 'circle', 'var(--page-primary-color, #dc143c)');
    return `
      <div class="skill-item" style="display: flex; align-items: center; gap: 8pt; margin-bottom: 4pt;">
        <span class="skill-name" style="flex: 1; font-size: 10pt;">${name || ''}</span>
        ${levelIcons ? `<span class="skill-level">${levelIcons}</span>` : ''}
        ${proficiency ? `<span class="skill-proficiency" style="font-size: 9pt; color: #666;">${proficiency}</span>` : ''}
      </div>
    `;
  }

  // Default: list layout
  return `
    <div class="skill-item" style="margin-bottom: 4pt;">
      <span class="skill-name" style="font-size: 10pt;">${name || ''}</span>
      ${proficiency ? `<span class="skill-proficiency" style="font-size: 9pt; color: #666; margin-left: 8pt;">${proficiency}</span>` : ''}
    </div>
  `;
}

export default SkillItem;