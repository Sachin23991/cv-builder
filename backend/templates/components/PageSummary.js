/**
 * PageSummary Component
 * Renders the summary section with HTML content
 */

/**
 * Generate summary section HTML
 * @param {Object} summary - Summary data { title, content, hidden, columns }
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function generateSummary(summary = {}, options = {}) {
  const { title, content, hidden, columns = 1 } = summary;

  // Skip hidden
  if (hidden) return '';

  // Skip empty content
  if (!content) return '';

  const columnClass = columns > 1 ? `columns-${columns}` : '';

  return `
    <section class="page-section section-summary ${columnClass}" data-section="summary">
      ${title ? `<h6 class="section-title" style="
        font-size: 12pt;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 1pt solid var(--page-primary-color, #dc143c);
        margin: 0 0 8pt 0;
        padding-bottom: 4pt;
      ">${title}</h6>` : ''}
      <div class="section-content summary-content" style="
        font-size: var(--page-body-font-size, 10pt);
        line-height: var(--page-body-line-height, 1.5);
      ">
        ${content}
      </div>
    </section>
  `;
}

export default generateSummary;