/**
 * utils/fileManager.js
 * Shared file & storage utilities used across all routes
 */

import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '..');

/** Resolve a path relative to the backend root */
export function rootPath(...parts) {
  return path.join(ROOT_DIR, ...parts);
}

/** Ensure a directory exists, creating it recursively if needed */
export async function ensureDir(dirPath) {
  await fse.ensureDir(dirPath);
}

/** Read JSON file safely — returns null on error */
export async function readJson(filePath) {
  try {
    const raw = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Write JSON file (pretty-printed) */
export async function writeJson(filePath, data) {
  await fse.ensureDir(path.dirname(filePath));
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/** Delete a file silently */
export async function removeFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch { /* ignore */ }
}

/** List all JSON files in a directory — returns array of parsed objects with ids */
export async function listJsonFiles(dirPath) {
  try {
    const files = await fs.promises.readdir(dirPath);
    const results = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const data = await readJson(path.join(dirPath, file));
      if (data) results.push(data);
    }
    return results;
  } catch {
    return [];
  }
}

/** Generate a new UUID */
export function newId() {
  return uuidv4();
}

/** Convert base64 data URI to a Buffer + mime type */
export function decodeDataUri(dataUri) {
  const matches = dataUri.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid data URI');
  return {
    mimeType: matches[1],
    buffer: Buffer.from(matches[2], 'base64'),
  };
}

/** Get file extension from mime type */
export function extFromMime(mimeType) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
  };
  return map[mimeType] || '';
}
