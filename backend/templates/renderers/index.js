/**
 * Renderers Index
 * Export all renderer functions
 */

import { renderTemplateToHTML, listTemplates } from './html.js';
import { renderTemplateToSSR } from './ssr.js';
import { renderTemplateToPDF, generatePDFFromHTML } from './pdf.js';
import {
  createPreviewSession,
  updatePreviewSession,
  getPreviewSession,
  deletePreviewSession,
  listPreviewSessions,
} from './preview.js';

export { renderTemplateToHTML, listTemplates };
export { renderTemplateToSSR };
export { renderTemplateToPDF, generatePDFFromHTML };
export {
  createPreviewSession,
  updatePreviewSession,
  getPreviewSession,
  deletePreviewSession,
  listPreviewSessions,
};

export default {
  renderTemplateToHTML,
  renderTemplateToSSR,
  renderTemplateToPDF,
  createPreviewSession,
  updatePreviewSession,
  getPreviewSession,
  deletePreviewSession,
  listTemplates,
};
