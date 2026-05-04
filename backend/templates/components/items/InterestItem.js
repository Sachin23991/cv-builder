/**
 * Interest Item Component
 */

export function InterestItem(item = {}, options = {}) {
  const { cssVars = '' } = options;

  const { name, keywords = [], icon } = item;

  const keywordsHtml = keywords && keywords.length > 0
    ? keywords.map(k => `<span class="keyword-tag" style="
      display: inline-block;
      padding: 1pt 6pt;
      border-radius: 8pt;
      background: rgba(0,0,0,0.1);
      font-size: 8pt;
      margin: 2pt;
    ">${k}</span>`).join('')
    : '';

  return `
    <div class="interest-item" style="margin-bottom: 8pt;">
      <span class="interest-name" style="font-size: 10pt; font-weight: 500;">${name || ''}</span>
      ${keywordsHtml ? `<div class="interest-keywords" style="margin-top: 4pt;">${keywordsHtml}</div>` : ''}
    </div>
  `;
}

export default InterestItem;