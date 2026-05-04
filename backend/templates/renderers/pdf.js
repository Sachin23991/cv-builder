/**
 * PDF Renderer
 * Generates PDF documents from resume data
 *
 * Note: This requires @react-pdf/renderer to be installed
 * For simplicity, this implementation generates HTML that can be
 * converted to PDF using puppeteer or similar tools
 */

import { renderTemplateToHTML } from './html.js';

/**
 * Render template to PDF buffer
 *
 * @param {string} templateId - Template identifier
 * @param {Object} resumeData - Resume data object
 * @param {Object} options - Render options { scale, includeFonts }
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function renderTemplateToPDF(templateId, resumeData, options = {}) {
  const { html } = renderTemplateToHTML(templateId, resumeData, options);

  // If puppeteer is available, use it for PDF generation
  try {
    const puppeteer = await import('puppeteer');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: resumeData.metadata?.page?.format?.toUpperCase() || 'A4',
      printBackground: true,
      margin: {
        top: resumeData.metadata?.page?.marginY || 12,
        right: resumeData.metadata?.page?.marginX || 14,
        bottom: resumeData.metadata?.page?.marginY || 12,
        left: resumeData.metadata?.page?.marginX || 14
      }
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  } catch (error) {
    // Fallback: Return HTML that can be converted client-side
    throw new Error(`PDF generation failed: ${error.message}. Please use the HTML renderer or ensure puppeteer is installed.`);
  }
}

/**
 * Generate PDF using HTML-to-PDF approach
 * This is a fallback when puppeteer is not available
 */
export async function generatePDFFromHTML(templateId, resumeData, options = {}) {
  // Return HTML that can be used for client-side PDF generation
  const { html } = renderTemplateToHTML(templateId, resumeData, options);
  return {
    html,
    format: resumeData.metadata?.page?.format || 'a4',
    message: 'PDF generation requires puppeteer. Use the HTML output for client-side conversion.'
  };
}

export default {
  renderTemplateToPDF,
  generatePDFFromHTML
};