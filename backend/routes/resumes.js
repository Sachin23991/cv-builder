/**
 * routes/resumes.js — Full CRUD + search for resumes
 * Fixes applied:
 *   #1  — requireAuth + ownership checks on every mutating route
 *   #2  — Zod input validation; req.body never hits the DB raw
 *   #9  — nanoid slugs instead of raw ObjectIDs in URLs
 *   #18 — Safe duplicate via destructuring (no delete on lean doc)
 */
import { Router } from 'express';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import Resume from '../models/Resume.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

// ─── Zod schemas ──────────────────────────────────────────────────

const ALLOWED_TEMPLATES = ['impact-cv', 'reactive-resume', 'hugo-academic-cv'];
const ALLOWED_THEMES = [
  'basic', 'casual', 'professional', 'creative', 'modern',
  'business', 'minimal', 'elegant', 'technical', 'vibrant',
  'academic', 'corporate', 'artistic', 'classic', 'digital',
  'futuristic', 'nordic', 'blueprint', 'gradient', 'retro',
];

const CreateResumeSchema = z.object({
  title:         z.string().min(1, 'Title is required').max(200).default('Untitled Resume'),
  template:      z.enum(ALLOWED_TEMPLATES).default('impact-cv'),
  activeTheme:   z.enum(ALLOWED_THEMES).default('professional'),
  // Core data sections — passthrough allows any valid sub-fields
  basicInfo:     z.record(z.unknown()).optional(),
  summary:       z.string().max(2000).optional(),
  experiences:   z.array(z.record(z.unknown())).optional(),
  education:     z.array(z.record(z.unknown())).optional(),
  skills:        z.array(z.record(z.unknown())).optional(),
  projects:      z.array(z.record(z.unknown())).optional(),
  publications:  z.array(z.record(z.unknown())).optional(),
  courses:       z.array(z.record(z.unknown())).optional(),
  customSections:z.array(z.record(z.unknown())).optional(),
  sectionConfig: z.record(z.unknown()).optional(),
  metadata:      z.record(z.unknown()).optional(),
  isPublic:      z.boolean().default(false),
});

// Partial update — every field optional
const UpdateResumeSchema = CreateResumeSchema.partial();

// ─── Helper: ownership guard ───────────────────────────────────────
function ownershipCheck(doc, req, res) {
  if (!doc.userId) return true; // legacy doc with no userId — allow for now
  if (doc.userId.toString() !== req.user.id.toString()) {
    res.status(403).json({ success: false, error: 'Forbidden — you do not own this resume' });
    return false;
  }
  return true;
}

// ──────────────────────────────────────────────
// CREATE — POST /api/resumes
// ──────────────────────────────────────────────
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = CreateResumeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten() });
    }

    const doc = await Resume.create({
      ...parsed.data,
      userId: req.user.id,   // always set from token — never from body
      slug: nanoid(10),
    });

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// READ ALL — GET /api/resumes
// Authenticated users see only their resumes.
// ──────────────────────────────────────────────
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.template) filter.template = req.query.template;
    if (req.query.search)   filter.$text    = { $search: req.query.search };

    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip  = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      Resume.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Resume.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: docs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// READ ONE — GET /api/resumes/:id
// ──────────────────────────────────────────────
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const doc = await Resume.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, error: 'Resume not found' });
    if (!ownershipCheck(doc, req, res)) return;
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// READ BY SLUG — GET /api/resumes/slug/:slug
// Public sharing — no auth required
// ──────────────────────────────────────────────
router.get('/slug/:slug', optionalAuth, async (req, res, next) => {
  try {
    const doc = await Resume.findOne({ slug: req.params.slug, isPublic: true }).lean();
    if (!doc) return res.status(404).json({ success: false, error: 'Resume not found or not public' });
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// UPDATE (full) — PUT /api/resumes/:id
// ──────────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const parsed = UpdateResumeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten() });
    }

    const existing = await Resume.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Resume not found' });
    if (!ownershipCheck(existing, req, res)) return;

    // Prevent overwriting ownership fields
    const { userId: _u, slug: _s, ...safeData } = parsed.data;

    const doc = await Resume.findByIdAndUpdate(req.params.id, safeData, {
      new: true, runValidators: true,
    });
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// PATCH (partial) — PATCH /api/resumes/:id
// ──────────────────────────────────────────────
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const parsed = UpdateResumeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.flatten() });
    }

    const existing = await Resume.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'Resume not found' });
    if (!ownershipCheck(existing, req, res)) return;

    const { userId: _u, slug: _s, ...safeData } = parsed.data;

    const doc = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: safeData },
      { new: true, runValidators: true },
    );
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// DELETE — DELETE /api/resumes/:id
// ──────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const doc = await Resume.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Resume not found' });
    if (!ownershipCheck(doc, req, res)) return;
    await doc.deleteOne();
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// DUPLICATE — POST /api/resumes/:id/duplicate
// Fix #18: use destructuring instead of delete on lean()
// ──────────────────────────────────────────────
router.post('/:id/duplicate', requireAuth, async (req, res, next) => {
  try {
    const original = await Resume.findById(req.params.id).lean();
    if (!original) return res.status(404).json({ success: false, error: 'Resume not found' });
    if (!ownershipCheck(original, req, res)) return;

    // Safe: destructure out fields we must not carry over
    const { _id, slug, __v, createdAt, updatedAt, ...rest } = original;

    const copy = await Resume.create({
      ...rest,
      title: `${rest.title} (Copy)`,
      isPublic: false,
      userId: req.user.id,
      slug: nanoid(10),
    });

    res.status(201).json({ success: true, data: copy });
  } catch (err) {
    next(err);
  }
});

export default router;
