/**
 * routes/resumes.js — Full CRUD + search for resumes
 * Handles requests from ANY template (impact-cv, reactive-resume, hugo-academic-cv)
 */
import { Router } from 'express';
import Resume from '../models/Resume.js';

const router = Router();

// ──────────────────────────────────────────────
// CREATE — POST /api/resumes
// ──────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const doc = await Resume.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// READ ALL — GET /api/resumes
// Supports ?template=impact-cv  &userId=xxx  &search=keyword
// ──────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.template) filter.template = req.query.template;
    if (req.query.userId)   filter.userId   = req.query.userId;
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
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Resume.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, error: 'Resume not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// READ BY SLUG — GET /api/resumes/slug/:slug
// (for public sharing links)
// ──────────────────────────────────────────────
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const doc = await Resume.findOne({ slug: req.params.slug, isPublic: true }).lean();
    if (!doc) return res.status(404).json({ success: false, error: 'Resume not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// UPDATE — PUT /api/resumes/:id
// ──────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const doc = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!doc) return res.status(404).json({ success: false, error: 'Resume not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// PATCH — PATCH /api/resumes/:id
// Partial update (e.g. just change theme)
// ──────────────────────────────────────────────
router.patch('/:id', async (req, res, next) => {
  try {
    const doc = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!doc) return res.status(404).json({ success: false, error: 'Resume not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// DELETE — DELETE /api/resumes/:id
// ──────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await Resume.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Resume not found' });
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// DUPLICATE — POST /api/resumes/:id/duplicate
// ──────────────────────────────────────────────
router.post('/:id/duplicate', async (req, res, next) => {
  try {
    const original = await Resume.findById(req.params.id).lean();
    if (!original) return res.status(404).json({ success: false, error: 'Resume not found' });

    delete original._id;
    delete original.slug;
    original.title = `${original.title} (Copy)`;
    original.isPublic = false;

    const copy = await Resume.create(original);
    res.status(201).json({ success: true, data: copy });
  } catch (err) {
    next(err);
  }
});

export default router;
