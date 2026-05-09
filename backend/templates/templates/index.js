/**
 * Templates Index
 * Export all template functions for programmatic access
 */

import OnyxTemplate from './onyx.js';
import PikachuTemplate from './pikachu.js';

// Template registry for dynamic lookup
export const templateRegistry = {
  onyx: () => OnyxTemplate,
  pikachu: () => PikachuTemplate,
};

// Get template by ID
export function getTemplate(templateId) {
  const factory = templateRegistry[templateId];
  if (!factory) {
    throw new Error(`Template '${templateId}' not found`);
  }
  return factory();
}

// List all template IDs
export const allTemplateIds = Object.keys(templateRegistry);

export default templateRegistry;

export {
  OnyxTemplate,
  PikachuTemplate,
};
