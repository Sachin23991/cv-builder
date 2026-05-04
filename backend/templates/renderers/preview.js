/**
 * Preview Session Manager
 * Manages live preview sessions for real-time editing
 */

import { randomUUID } from 'node:crypto';
import { renderTemplateToHTML } from './html.js';

// In-memory session store (use Redis/DB for production)
const sessions = new Map();

// Session timeout (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

// Cleanup expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastUpdate > SESSION_TIMEOUT) {
      sessions.delete(sessionId);
    }
  }
}, 60000); // Check every minute

/**
 * Create a new preview session
 * @param {string} templateId - Template to preview
 * @param {Object} initialData - Initial resume data
 * @returns {Object} { sessionId, html }
 */
export function createPreviewSession(templateId, initialData) {
  const sessionId = randomUUID();
  const now = Date.now();

  // Render initial state
  const { html } = renderTemplateToHTML(templateId, initialData);

  sessions.set(sessionId, {
    templateId,
    resumeData: initialData,
    createdAt: now,
    lastUpdate: now,
    html
  });

  return { sessionId, html };
}

/**
 * Update preview session with new data
 * @param {string} sessionId - Session identifier
 * @param {Object} resumeData - Updated resume data
 * @returns {Object} { html, error }
 */
export function updatePreviewSession(sessionId, resumeData) {
  const session = sessions.get(sessionId);

  if (!session) {
    return { error: 'Session not found or expired', html: null };
  }

  // Render updated content
  try {
    const { html } = renderTemplateToHTML(session.templateId, resumeData);

    session.resumeData = resumeData;
    session.lastUpdate = Date.now();
    session.html = html;

    return { html, error: null };
  } catch (error) {
    return { html: null, error: error.message };
  }
}

/**
 * Get preview session info
 * @param {string} sessionId - Session identifier
 * @returns {Object|null} Session info
 */
export function getPreviewSession(sessionId) {
  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  return {
    sessionId,
    templateId: session.templateId,
    createdAt: session.createdAt,
    lastUpdate: session.lastUpdate,
    html: session.html
  };
}

/**
 * Delete a preview session
 * @param {string} sessionId - Session identifier
 * @returns {boolean} Success
 */
export function deletePreviewSession(sessionId) {
  return sessions.delete(sessionId);
}

/**
 * List active sessions (for debugging)
 * @returns {Array} List of session summaries
 */
export function listPreviewSessions() {
  const now = Date.now();
  const active = [];

  for (const [sessionId, session] of sessions.entries()) {
    active.push({
      sessionId,
      templateId: session.templateId,
      age: now - session.createdAt,
      lastUpdate: now - session.lastUpdate
    });
  }

  return active;
}

export default {
  createPreviewSession,
  updatePreviewSession,
  getPreviewSession,
  deletePreviewSession,
  listPreviewSessions
};
