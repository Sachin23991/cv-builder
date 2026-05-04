/**
 * Templates Index
 * Export all template functions for programmatic access
 */

import OnyxTemplate from './onyx.js';
import PikachuTemplate from './pikachu.js';
import AzurillTemplate from './azurill.js';
import BronzorTemplate from './bronzor.js';
import ChikoritaTemplate from './chikorita.js';
import DitgarTemplate from './ditgar.js';
import DittoTemplate from './ditto.js';
import GengarTemplate from './gengar.js';
import GlalieTemplate from './glalie.js';
import KakunaTemplate from './kakuna.js';
import LaprasTemplate from './lapras.js';
import LeafishTemplate from './leafish.js';
import MeowthTemplate from './meowth.js';
import RhyhornTemplate from './rhyhorn.js';

// Template registry for dynamic lookup
export const templateRegistry = {
  onyx: () => OnyxTemplate,
  pikachu: () => PikachuTemplate,
  azurill: () => AzurillTemplate,
  bronzor: () => BronzorTemplate,
  chikorita: () => ChikoritaTemplate,
  ditgar: () => DitgarTemplate,
  ditto: () => DittoTemplate,
  gengar: () => GengarTemplate,
  glalie: () => GlalieTemplate,
  kakuna: () => KakunaTemplate,
  lapras: () => LaprasTemplate,
  leafish: () => LeafishTemplate,
  meowth: () => MeowthTemplate,
  rhyhorn: () => RhyhornTemplate
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
  AzurillTemplate,
  BronzorTemplate,
  ChikoritaTemplate,
  DitgarTemplate,
  DittoTemplate,
  GengarTemplate,
  GlalieTemplate,
  KakunaTemplate,
  LaprasTemplate,
  LeafishTemplate,
  MeowthTemplate,
  RhyhornTemplate,
};
