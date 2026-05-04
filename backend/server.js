/**
 * Resume/CV Backend Server
 * All template configurations stored in backend
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { connectDB } from './db.js';
import resumeRoutes from './routes/resumes.js';
import aiRoutes from './routes/ai.js';
import templateRoutes from './routes/templates.js';
import variableRoutes from './routes/variables.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
const defaultCorsOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  : defaultCorsOrigins;

// ─── Global middleware ───────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(cors({
  origin: corsOrigins,
  credentials: false,
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
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/templates', variableRoutes);

// ─── Health check ───────────────────────────
app.get('/api/health', async (_req, res) => {
  const mongoose = (await import('mongoose')).default;
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    success: true,
    status: dbState === 1 ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    database: dbStatus[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// ─── Root endpoint ────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'Resume/CV Backend',
    version: '2.0.0',
    description: 'Backend for ResumeMaker - All templates stored here',
    endpoints: {
      'POST /api/resumes': 'Create a new resume',
      'GET /api/resumes': 'List resumes',
      'GET /api/resumes/:id': 'Get resume by ID',
      'PUT /api/resumes/:id': 'Full update',
      'PATCH /api/resumes/:id': 'Partial update',
      'DELETE /api/resumes/:id': 'Delete resume',
      'POST /api/ai/tailor': 'AI-tailor CV for a job description',
      'POST /api/ai/improve': 'AI-improve a single section',
      'GET /api/templates': 'List all templates',
      'GET /api/templates/:id': 'Get template configuration',
      'GET /api/templates/category/:category': 'Get templates by category',
      'GET /api/health': 'Health check',
    },
    templateCount: 24,
    categories: ['professional', 'creative', 'academic', 'modern', 'minimal'],
  });
});

// ─── 404 handler ─────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global error handler ─────────────────────────────────────────
app.use(errorHandler);

// ─── Graceful shutdown ───────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received — shutting down…');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('\nSIGINT received — shutting down…');
  process.exit(0);
});

// ─── Start ───────────────────────────────────────────────────────
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           Resume/CV Backend  v2.0.0                           ║
╠═══════════════════════════════════════════════════════════════╣
║  Server:    http://localhost:${PORT}
║  Database:  MongoDB connected ✅
║  Templates: 24 fully customizable templates
║
║  API Docs:  GET /
║  Health:     GET /api/health
║  Resumes:    /api/resumes      (CRUD)
║  AI:         /api/ai/tailor    (OpenAI)
║  Templates:  /api/templates    (24 templates)
╚═══════════════════════════════════════════════════════════════╝
    `);
  });
}

start();