/**
 * Resume/CV Backend Server
 * Fixes applied:
 *   #3  — CSP re-enabled via helmet with real directives
 *   #4  — JSON body limit dropped from 50mb → 1mb globally
 *   #5  — Separate stricter rate limiter for /api/ai routes
 *   #7  — CORS fail-fast in production if CORS_ORIGINS not set
 *   #10 — HTTPS redirect via X-Forwarded-Proto in production
 *   #16 — Request ID middleware (x-request-id header on every response)
 *   #36 — morgan('combined') in production, 'dev' locally
 *   #38 — Graceful shutdown drains in-flight requests before exit
 *   #39 — Env var validation at startup
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
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

// ─── Fix #39 — Fail fast on missing required env vars ────────────
const REQUIRED_ENV = ['MONGODB_URI'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`\n❌ FATAL: Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error('Please set them in your .env file and restart.\n');
  process.exit(1);
}

// Fix #7 — Require CORS_ORIGINS in production
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) {
  console.error('\n❌ FATAL: CORS_ORIGINS must be set in production\n');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// ─── CORS config ──────────────────────────────────────────────────
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003']; // dev only

// ─── Fix #10 — HTTPS redirect in production ───────────────────────
if (isProduction) {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// ─── Fix #16 — Request ID middleware ─────────────────────────────
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
});

// ─── Fix #3 — CSP re-enabled ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'"],
      styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com', 'https://fonts.cdnfonts.com'],
      imgSrc:      ["'self'", 'data:', 'blob:'],
      connectSrc:  ["'self'", process.env.APP_URL || 'http://localhost:3000'],
      frameSrc:    ["'none'"],
      objectSrc:   ["'none'"],
    },
    reportOnly: !isProduction, // report-only in dev, enforced in production
  },
}));

// ─── Fix #36 — Structured logging ────────────────────────────────
app.use(morgan(isProduction ? 'combined' : 'dev'));

// ─── CORS ─────────────────────────────────────────────────────────
app.use(cors({
  origin: corsOrigins,
  credentials: false,
}));

// ─── Fix #4 — Reduced body limits ─────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Rate limiters ────────────────────────────────────────────────

// General API rate limiter
app.use('/api/', rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { success: false, error: 'Too many requests, please slow down.' },
}));

// Fix #5 — Stricter rate limiter for AI routes (5 req/min per user/IP)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 5,
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'AI rate limit reached — please wait a minute.' },
});

// ─── API Routes ───────────────────────────────────────────────────
app.use('/api/resumes',   resumeRoutes);
app.use('/api/ai',        aiLimiter, aiRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/templates', variableRoutes);

// ─── Health check ─────────────────────────────────────────────────
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

// ─── Root endpoint ────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'Resume/CV Backend',
    version: '2.0.0',
    description: 'Backend for ResumeMaker — All templates stored here',
    endpoints: {
      'POST /api/resumes':              'Create a new resume (auth required)',
      'GET /api/resumes':               'List your resumes (auth required)',
      'GET /api/resumes/:id':           'Get resume by ID (auth required)',
      'GET /api/resumes/slug/:slug':    'Get public resume by slug',
      'PUT /api/resumes/:id':           'Full update (auth + ownership)',
      'PATCH /api/resumes/:id':         'Partial update (auth + ownership)',
      'DELETE /api/resumes/:id':        'Delete resume (auth + ownership)',
      'POST /api/ai/tailor':            'AI-tailor CV for a job description',
      'POST /api/ai/improve':           'AI-improve a single section',
      'GET /api/templates':             'List all templates',
      'GET /api/templates/:id':         'Get template configuration',
      'GET /api/templates/category/:c': 'Get templates by category',
      'GET /api/health':                'Health check',
    },
    templateCount: 13,
    categories: ['professional', 'creative', 'academic', 'modern', 'minimal'],
  });
});

// ─── Error handlers ───────────────────────────────────────────────
app.use(notFoundHandler);

// Fix #16 — Include requestId in error responses
app.use((err, req, res, next) => {
  console.error({ requestId: req.id, error: err.message, stack: err.stack });
  errorHandler(err, req, res, next);
});

// ─── Fix #38 — Graceful shutdown (drain in-flight requests) ───────
let server;

async function shutdown(signal) {
  console.log(`\n${signal} received — starting graceful shutdown…`);
  server.close(async () => {
    console.log('HTTP server closed');
    try {
      const mongoose = (await import('mongoose')).default;
      await mongoose.connection.close();
      console.log('MongoDB disconnected');
    } catch (e) {
      console.error('Error closing MongoDB:', e.message);
    }
    process.exit(0);
  });
  // Force-exit after 30s if requests don't finish
  setTimeout(() => {
    console.error('Could not close connections in time — forcing exit');
    process.exit(1);
  }, 30_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ─── Start ────────────────────────────────────────────────────────
async function start() {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           Resume/CV Backend  v2.0.0                           ║
╠═══════════════════════════════════════════════════════════════╣
║  Server:    http://localhost:${PORT}
║  Database:  MongoDB connected ✅
║  CSP:       ${isProduction ? 'Enforced ✅' : 'Report-only (dev)'}
║  Auth:      JWT required on all resume routes ✅
║  AI limit:  5 req/min per user ✅
║
║  API Docs:  GET /
║  Health:     GET /api/health
╚═══════════════════════════════════════════════════════════════╝
    `);
  });
}

start();