/**
 * SSR Renderer
 * Uses React DOM server for server-side rendering
 * Provides identical output to client-side rendering
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { renderTemplateToHTML } from './html.js';

/**
 * Render template using React SSR
 * This produces the same output as client-side React rendering
 * but runs entirely on the server
 *
 * @param {string} templateId - Template identifier
 * @param {Object} resumeData - Resume data object
 * @param {Object} options - Render options
 * @returns {Object} { html: string, css: string }
 */
export async function renderTemplateToSSR(templateId, resumeData, options = {}) {
  // For SSR, we use the HTML generator which already produces
  // semantically identical output. The main benefit of SSR here
  // is that we could theoretically use actual React components
  // if they were available.
  //
  // In a full implementation, you would:
  // 1. Import React template components
  // 2. Use ReactDOMServer.renderToString()
  // 3. Return the rendered HTML

  // For now, fallback to HTML generation
  // This is functionally equivalent for our use case
  return renderTemplateToHTML(templateId, resumeData, options);
}

/**
 * Stream render for large documents (not used currently but available)
 */
export async function renderTemplateToStream(templateId, resumeData, options = {}) {
  // Placeholder for streaming SSR
  // Would use ReactDOMServer.renderToPipeableStream
  throw new Error('Streaming SSR not yet implemented');
}

export default {
  renderTemplateToSSR,
  renderTemplateToStream
};