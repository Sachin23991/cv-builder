/**
 * Summary Item Component
 */

export function SummaryItem(item = {}, options = {}) {
  const { cssVars = '' } = options;

  const { content } = item;

  if (!content) return '';

  return `
    <div class="summary-item" style="font-size: 10pt; line-height: 1.5;">
      ${content}
    </div>
  `;
}

export default SummaryItem;