/**
 * models/Resume.js — Mongoose schema for resumes/CVs
 * Covers ALL data structures from Impact CV, Reactive Resume, and Academic CV
 */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// ─── Impact CV section schemas ───────────────────────────────────
const BasicInfoSchema = new Schema({
  name:     { type: String, default: '' },
  role:     { type: String, default: '' },
  location: { type: String, default: '' },
  email:    { type: String, default: '' },
  website:  { type: String, default: '' },
  phone:    { type: String, default: '' },
  github:   { type: String, default: '' },
  linkedin: { type: String, default: '' },
  photo:    { type: String, default: '' },       // base64 or URL
}, { _id: false });

const ExperienceSchema = new Schema({
  role:         { type: String, default: '' },
  company:      { type: String, default: '' },
  startDate:    { type: String, default: '' },
  endDate:      { type: String, default: '' },
  current:      { type: Boolean, default: false },
  achievements: [{ type: String }],
});

const EducationSchema = new Schema({
  degree:    { type: String, default: '' },
  institute: { type: String, default: '' },
  location:  { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate:   { type: String, default: '' },
  current:   { type: Boolean, default: false },
});

const SkillSchema = new Schema({
  title:   { type: String, default: '' },
  details: { type: String, default: '' },
});

const ProjectSchema = new Schema({
  name:    { type: String, default: '' },
  company: { type: String, default: '' },
  details: [{ type: String }],
});

const SectionConfigSchema = new Schema({
  visibility: { type: Schema.Types.Mixed, default: {} },
  titles:     { type: Schema.Types.Mixed, default: {} },
  order:      [{ type: String }],
}, { _id: false });

// ─── Academic CV extras ──────────────────────────────────────────
const PublicationSchema = new Schema({
  title:     { type: String, default: '' },
  authors:   { type: String, default: '' },
  journal:   { type: String, default: '' },
  year:      { type: String, default: '' },
  doi:       { type: String, default: '' },
  abstract:  { type: String, default: '' },
});

const CourseSchema = new Schema({
  title:       { type: String, default: '' },
  institution: { type: String, default: '' },
  year:        { type: String, default: '' },
  description: { type: String, default: '' },
});

// ─── Reactive Resume extras ─────────────────────────────────────
const CustomSectionSchema = new Schema({
  name:    { type: String, default: '' },
  items:   [{ type: Schema.Types.Mixed }],
  visible: { type: Boolean, default: true },
});

// ─── Main Resume document ────────────────────────────────────────
const ResumeSchema = new Schema({
  // Owner / auth
  userId:    { type: String, index: true },
  
  // Which template this resume uses
  template:  {
    type: String,
    enum: ['impact-cv', 'reactive-resume', 'hugo-academic-cv'],
    default: 'impact-cv',
  },

  // Display name for the resume
  title:     { type: String, default: 'Untitled Resume' },

  // Active theme (20 themes from Impact CV)
  activeTheme: {
    type: String,
    enum: [
      'basic', 'casual', 'professional', 'creative', 'modern',
      'business', 'minimal', 'elegant', 'technical', 'vibrant',
      'academic', 'corporate', 'artistic', 'classic', 'digital',
      'futuristic', 'nordic', 'blueprint', 'gradient', 'retro',
    ],
    default: 'professional',
  },

  // Core sections (shared across templates)
  basicInfo:    { type: BasicInfoSchema,   default: () => ({}) },
  summary:      { type: String,            default: '' },
  experiences:  [ExperienceSchema],
  education:    [EducationSchema],
  skills:       [SkillSchema],
  projects:     [ProjectSchema],

  // Section config (Impact CV)
  sectionConfig: { type: SectionConfigSchema, default: () => ({}) },

  // Academic CV extras
  publications: [PublicationSchema],
  courses:      [CourseSchema],

  // Reactive Resume extras
  customSections: [CustomSectionSchema],
  metadata: { type: Schema.Types.Mixed, default: {} },

  // Visibility / sharing
  isPublic: { type: Boolean, default: false },
  slug:     { type: String, unique: true, sparse: true },

}, { timestamps: true });

// Text index for search
ResumeSchema.index({ title: 'text', 'basicInfo.name': 'text' });

export const Resume = model('Resume', ResumeSchema);
export default Resume;
