/**
 * ═══════════════════════════════════════════════════════════════
 *  Unified Resume/CV Backend Server
 *  Combines: Impact CV · Reactive Resume · Hugo Academic CV
 *  Stack:    Node.js + Express + MongoDB (Mongoose)
 *  Deploy:   AWS (EC2 / ECS / Elastic Beanstalk)
 * ═══════════════════════════════════════════════════════════════
 */

import 'dotenv/config';
import express      from 'express';
import cors         from 'cors';
import helmet       from 'helmet';
import morgan       from 'morgan';
import rateLimit    from 'express-rate-limit';
import path         from 'path';
import { fileURLToPath } from 'url';
import { spawn }    from 'child_process';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { connectDB }      from './db.js';
import resumeRoutes        from './routes/resumes.js';
import aiRoutes            from './routes/ai.js';
import templateRoutes, { devProcesses } from './routes/templates.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Global middleware ───────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
    : '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiter (general)
app.use('/api/', rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, slow down.' },
}));

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/resumes',   resumeRoutes);   // CRUD for all resume data
app.use('/api/ai',        aiRoutes);       // AI tailor + improve
app.use('/api/templates', templateRoutes); // Template info + dev-server mgmt

// ─── Health check (includes DB status) ───────────────────────────
app.get('/api/health', async (_req, res) => {
  const mongoose = (await import('mongoose')).default;
  const dbState  = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    success: true,
    status: dbState === 1 ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    database: dbStatus[dbState] || 'unknown',
    templatesRunning: devProcesses.size,
    timestamp: new Date().toISOString(),
  });
});

// ─── Serve static builds (for production) ────────────────────────
app.use('/static/impact-cv',
  express.static(path.join(__dirname, 'impact-cv', 'dist')));
app.use('/static/reactive-resume',
  express.static(path.join(__dirname, 'reactive-resume', '.output', 'public')));
app.use('/static/academic-cv',
  express.static(path.join(__dirname, 'hugo-theme-academic-cv', 'public')));

// ─── Root endpoint — API docs ────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'Unified Resume/CV Backend',
    version: '2.0.0',
    description: 'Backend for Impact CV + Reactive Resume + Hugo Academic CV',
    endpoints: {
      // Resumes CRUD
      'POST   /api/resumes':              'Create a new resume',
      'GET    /api/resumes':              'List resumes (?template=&userId=&search=&page=&limit=)',
      'GET    /api/resumes/:id':          'Get resume by ID',
      'GET    /api/resumes/slug/:slug':   'Get public resume by slug',
      'PUT    /api/resumes/:id':          'Full update',
      'PATCH  /api/resumes/:id':          'Partial update (e.g. change theme)',
      'DELETE /api/resumes/:id':          'Delete resume',
      'POST   /api/resumes/:id/duplicate':'Duplicate resume',
      // AI
      'POST   /api/ai/tailor':           'AI-tailor CV for a job description',
      'POST   /api/ai/improve':          'AI-improve a single section',
      // Templates
      'GET    /api/templates':            'List all available templates + features',
      'GET    /api/templates/:id':        'Get template info',
      'POST   /api/templates/:id/start':  'Start a template dev server',
      'POST   /api/templates/:id/stop':   'Stop a template dev server',
      'GET    /api/templates/status/all':  'Status of running dev servers',
      'POST   /api/templates/stop-all':   'Stop all dev servers',
      // Health
      'GET    /api/health':               'Health check (server + database)',
    },
    templates: ['impact-cv', 'reactive-resume', 'hugo-theme-academic-cv'],
  });
});

// ─── 404 handler ─────────────────────────────────────────────────
// ─── 404 handler (moved to middleware)
app.use(notFoundHandler);

// ─── Global error handler (middleware)
app.use(errorHandler);

// ─── Graceful shutdown ───────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n${signal} received — shutting down…`);
  for (const [id, info] of devProcesses) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(info.process.pid), '/f', '/t']);
      } else {
        process.kill(-info.process.pid, 'SIGTERM');
      }
    } catch { /* ignore */ }
  }
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ─── Start ───────────────────────────────────────────────────────
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           Unified Resume/CV Backend  v2.0.0                   ║
╠═══════════════════════════════════════════════════════════════╣
║  Server:    http://localhost:${PORT}
║  Database:  MongoDB connected ✅
║  Templates: 3 available
║
║  API Docs:  GET /
║  Health:    GET /api/health
║  Resumes:   /api/resumes      (CRUD)
║  AI:        /api/ai/tailor    (OpenAI)
║  Templates: /api/templates    (info + dev servers)
╚═══════════════════════════════════════════════════════════════╝
    `);
  });
}

start();
