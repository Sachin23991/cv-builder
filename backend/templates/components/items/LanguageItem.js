/**
 * Language Item Component
 */

import { generateLevelIcons } from '../../utils/css-variables.js';

export function LanguageItem(item = {}, options = {}) {
  const {
    layout = 'list',
    cssVars = ''
  } = options;

  const { language, fluency, level = 0 } = item;

  if (layout === 'tags') {
    return `
      <span class="language-tag" style="
        display: inline-block;
        padding: 2pt 8pt;
        border-radius: 12pt;
        background: var(--page-primary-color, #dc143c);
        color: white;
        font-size: 9pt;
        margin: 2pt;
      ">${language || ''}</span>
    `;
  }

  // List layout (default)
  const levelIcons = level > 0 ? generateLevelIcons(level, 'circle', 'var(--page-primary-color, #dc143c)') : '';

  return `
    <div class="language-item" style="display: flex; align-items: center; gap: 8pt; margin-bottom: 4pt;">
      <span class="language-name" style="flex: 1; font-size: 10pt;">${language || ''}</span>
      ${levelIcons ? `<span class="language-level">${levelIcons}</span>` : ''}
      ${fluency ? `<span class="language-fluency" style="font-size: 9pt; color: #666;">${fluency}</span>` : ''}
    </div>
  `;
}

export default LanguageItem;