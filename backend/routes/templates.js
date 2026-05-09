/**
 * Template Routes
 * Serves template configurations and renders templates to HTML/PDF
 */

import { Router } from 'express';
import {
  templateList,
  templatesByCategory,
  getTemplateById,
  getAllTemplateIds,
  templateCount,
} from '../templates/configurations.js';
import {
  renderTemplateToHTML,
  renderTemplateToSSR,
  renderTemplateToPDF,
  createPreviewSession,
  updatePreviewSession,
  getPreviewSession,
  deletePreviewSession,
  listTemplates
} from '../templates/renderers/index.js';

const router = Router();

/**
 * GET /api/templates
 * List all available templates
 */
router.get('/', (req, res) => {
  const data = {
    templates: templateList,
    count: templateCount,
    categories: Object.keys(templatesByCategory),
    renderable: listTemplates(),
  };

  const etag = `"templates-${templateCount}-v1"`;

  res.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
  res.set('ETag', etag);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.json({
    success: true,
    data,
  });
});

/**
 * GET /api/templates/category/:category
 * Get templates by category
 */
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const templates = templatesByCategory[category];

  if (!templates) {
    return res.status(404).json({
      success: false,
      error: 'Category not found',
    });
  }

  res.json({
    success: true,
    data: {
      category,
      templates,
      count: templates.length,
    },
  });
});

/**
 * GET /api/templates/all-ids
 * Get all template IDs (lightweight response)
 */
router.get('/ids/all', (_req, res) => {
  res.json({
    success: true,
    data: getAllTemplateIds(),
  });
});

/**
 * GET /api/templates/:id
 * Get specific template configuration
 */
router.get('/:id', (req, res) => {
  const template = getTemplateById(req.params.id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }
  res.json({
    success: true,
    data: template,
  });
});

/**
 * POST /api/templates/:id/render/html
 * Render template to HTML string
 */
router.post('/:id/render/html', (req, res) => {
  const { id } = req.params;
  const { resumeData, options } = req.body;

  // Validate template exists
  const template = getTemplateById(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }

  if (!resumeData) {
    return res.status(400).json({
      success: false,
      error: 'resumeData is required',
    });
  }

  try {
    const { html, css } = renderTemplateToHTML(id, resumeData, options);
    res.json({
      success: true,
      data: { html, css },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/templates/:id/render/ssr
 * Render template using React SSR
 */
router.post('/:id/render/ssr', async (req, res) => {
  const { id } = req.params;
  const { resumeData, options } = req.body;

  // Validate template exists
  const template = getTemplateById(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }

  if (!resumeData) {
    return res.status(400).json({
      success: false,
      error: 'resumeData is required',
    });
  }

  try {
    const result = await renderTemplateToSSR(id, resumeData, options);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/templates/:id/render/pdf
 * Render template to PDF binary
 */
router.post('/:id/render/pdf', async (req, res) => {
  const { id } = req.params;
  const { resumeData, options } = req.body;

  // Validate template exists
  const template = getTemplateById(id);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }

  if (!resumeData) {
    return res.status(400).json({
      success: false,
      error: 'resumeData is required',
    });
  }

  try {
    const pdfBuffer = await renderTemplateToPDF(id, resumeData, options);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.basics?.name || 'resume'}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/templates/preview/start
 * Start a new preview session
 */
router.post('/preview/start', (req, res) => {
  const { templateId, initialData } = req.body;

  if (!templateId) {
    return res.status(400).json({
      success: false,
      error: 'templateId is required',
    });
  }

  const template = getTemplateById(templateId);
  if (!template) {
    return res.status(404).json({
      success: false,
      error: 'Template not found',
    });
  }

  try {
    const { sessionId, html } = createPreviewSession(templateId, initialData || {});
    res.json({
      success: true,
      data: { sessionId, html },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PATCH /api/templates/preview/:sessionId
 * Update preview session with new data
 */
router.patch('/preview/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { resumeData } = req.body;

  if (!resumeData) {
    return res.status(400).json({
      success: false,
      error: 'resumeData is required',
    });
  }

  const { html, error } = updatePreviewSession(sessionId, resumeData);

  if (error) {
    return res.status(404).json({
      success: false,
      error,
    });
  }

  res.json({
    success: true,
    data: { html },
  });
});

/**
 * GET /api/templates/preview/:sessionId
 * Get preview session info
 */
router.get('/preview/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = getPreviewSession(sessionId);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found or expired',
    });
  }

  res.json({
    success: true,
    data: session,
  });
});

/**
 * DELETE /api/templates/preview/:sessionId
 * Delete a preview session
 */
router.delete('/preview/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const deleted = deletePreviewSession(sessionId);

  res.json({
    success: deleted,
    data: { deleted },
  });
});

export default router;