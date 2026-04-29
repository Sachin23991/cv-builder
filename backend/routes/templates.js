/**
 * routes/templates.js — Template management + dev-server orchestration
 * Manages all three sub-project templates and can start/stop their dev servers
 */
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

const router = Router();

// ─── Template registry ──────────────────────────────────────────
const templates = {
  'impact-cv': {
    name: 'Impact CV',
    type: 'vite',
    path: path.join(ROOT, 'impact-cv'),
    port: 3002,
    description: 'Modern React CV builder — 20 themes, AI tailoring, PDF/HTML export',
    themes: [
      'basic','casual','professional','creative','modern','business',
      'minimal','elegant','technical','vibrant','academic','corporate',
      'artistic','classic','digital','futuristic','nordic','blueprint',
      'gradient','retro',
    ],
    features: ['theme-selector','ai-tailor','pdf-export','html-export','json-import-export','photo-upload','section-config'],
  },
  'reactive-resume': {
    name: 'Reactive Resume',
    type: 'tanstack',
    path: path.join(ROOT, 'reactive-resume'),
    port: 3003,
    description: 'Full-featured resume builder — AI integration, auth, printer service',
    features: ['ai-multi-provider','auth','printer','storage','i18n','drag-drop','mcp'],
  },
  'hugo-theme-academic-cv': {
    name: 'Academic CV',
    type: 'hugo',
    path: path.join(ROOT, 'hugo-theme-academic-cv'),
    port: 3004,
    description: 'Academic CV — publications, courses, events, blog',
    features: ['publications','courses','events','blog','pagefind-search'],
  },
};

// Running dev-server processes
const devProcesses = new Map();

// ──────────────────────────────────────────────
// GET /api/templates — list all templates
// ──────────────────────────────────────────────
router.get('/', (_req, res) => {
  const list = Object.entries(templates).map(([id, cfg]) => ({
    id,
    name: cfg.name,
    type: cfg.type,
    port: cfg.port,
    description: cfg.description,
    features: cfg.features,
    themes: cfg.themes || [],
    running: devProcesses.has(id),
  }));
  res.json({ success: true, data: list });
});

// ──────────────────────────────────────────────
// GET /api/templates/:id — single template info
// ──────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const cfg = templates[req.params.id];
  if (!cfg) return res.status(404).json({ success: false, error: 'Template not found' });
  res.json({
    success: true,
    data: { id: req.params.id, ...cfg, running: devProcesses.has(req.params.id) },
  });
});

// ──────────────────────────────────────────────
// POST /api/templates/:id/start — start dev server
// ──────────────────────────────────────────────
router.post('/:id/start', (req, res) => {
  const id  = req.params.id;
  const cfg = templates[id];
  if (!cfg) return res.status(404).json({ success: false, error: 'Template not found' });

  if (devProcesses.has(id)) {
    return res.json({ success: true, message: `${cfg.name} already running`, port: cfg.port });
  }

  let command, args;
  if (cfg.type === 'vite' || cfg.type === 'tanstack') {
    command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    args = ['run', 'dev', '--', '--port', String(cfg.port), '--host', '0.0.0.0'];
  } else if (cfg.type === 'hugo') {
    command = 'hugo';
    args = ['server', '--port', String(cfg.port), '--bind', '0.0.0.0'];
  }

  const proc = spawn(command, args, {
    cwd: cfg.path,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  proc.stdout.on('data', (d) => console.log(`[${id}] ${d}`));
  proc.stderr.on('data', (d) => console.error(`[${id}] ${d}`));
  proc.on('close', (code) => {
    console.log(`[${id}] exited (code ${code})`);
    devProcesses.delete(id);
  });

  devProcesses.set(id, { process: proc, port: cfg.port });
  res.json({
    success: true,
    message: `${cfg.name} starting on port ${cfg.port}`,
    port: cfg.port,
    url: `http://localhost:${cfg.port}`,
  });
});

// ──────────────────────────────────────────────
// POST /api/templates/:id/stop — stop dev server
// ──────────────────────────────────────────────
router.post('/:id/stop', (req, res) => {
  const id = req.params.id;
  const info = devProcesses.get(id);
  if (!info) return res.status(400).json({ success: false, error: `${id} is not running` });

  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(info.process.pid), '/f', '/t']);
    } else {
      process.kill(-info.process.pid, 'SIGTERM');
    }
  } catch { /* ignore */ }

  devProcesses.delete(id);
  res.json({ success: true, message: `${templates[id].name} stopped` });
});

// ──────────────────────────────────────────────
// GET /api/templates/status — all running servers
// ──────────────────────────────────────────────
router.get('/status/all', (_req, res) => {
  const status = {};
  for (const [id, info] of devProcesses) {
    status[id] = { running: true, port: info.port, pid: info.process.pid };
  }
  res.json({ success: true, data: status });
});

// ──────────────────────────────────────────────
// POST /api/templates/stop-all
// ──────────────────────────────────────────────
router.post('/stop-all', (_req, res) => {
  const stopped = [];
  for (const [id, info] of devProcesses) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(info.process.pid), '/f', '/t']);
      } else {
        process.kill(-info.process.pid, 'SIGTERM');
      }
      stopped.push(id);
    } catch { /* ignore */ }
  }
  devProcesses.clear();
  res.json({ success: true, stopped });
});

export { devProcesses };
export default router;
