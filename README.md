# Open Resume

An open-source, feature-rich resume builder and parser built with Next.js, Redux, and Tailwind CSS. Create, edit, preview, and export professional resumes with ease.

## Features

- **Live Resume Editor** — Split-screen editing with real-time preview
- **PDF Import** — Automatically parse and extract data from existing PDF resumes
- **35+ Templates** — 20 Impact-CV themes + 14 Reactive-Resume templates
- **Custom HTML Template** — Bring your own Overleaf/LaTeX-style template
- **Theme Customization** — Colors, typography, layout, and page format
- **AI-Powered Tailoring** — Optimize your resume for specific job descriptions (via backend)
- **ATS-Friendly Parser** — Parse and analyze resumes for applicant tracking systems
- **State Persistence** — Auto-save to localStorage, survive browser refresh
- **Export to PDF** — Download your resume as a high-quality PDF document

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 13 (App Router) |
| UI Library | React 18 |
| State Management | Redux Toolkit + React Redux |
| Styling | Tailwind CSS 3.3 |
| Animations | Framer Motion 12 |
| PDF Generation | @react-pdf/renderer |
| PDF Parsing | pdfjs-dist 3.7 |
| Icons | Lucide React |
| UI Store | Zustand 4.5 |

## Project Structure

```
open-resume/
├── src/app/
│   ├── page.tsx                    # Landing page
│   ├── resume-builder/             # Main editor (form + live preview)
│   ├── resume-import/              # PDF upload & import
│   ├── resume-parser/              # ATS parser playground
│   ├── components/
│   │   ├── TopNavBar.tsx            # Navigation header
│   │   ├── Resume/                  # Preview components
│   │   │   ├── index.tsx            # Container with template switching
│   │   │   ├── TemplatePreview.tsx   # HTML template renderer
│   │   │   ├── ResumeControlBar.tsx  # Zoom, download, print controls
│   │   │   └── ResumePDF/            # Legacy PDF renderer
│   │   ├── ResumeForm/              # Form components
│   │   │   ├── index.tsx             # Dynamic form renderer
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── WorkExperiencesForm.tsx
│   │   │   ├── EducationsForm.tsx
│   │   │   ├── ProjectsForm.tsx
│   │   │   ├── SkillsForm.tsx
│   │   │   └── ThemeForm/            # Template settings
│   │   └── ResumeDropzone.tsx       # PDF drag & drop upload
│   └── lib/
│       ├── redux/                   # Redux state management
│       │   ├── store.ts             # Store configuration
│       │   ├── resumeSlice.ts       # Resume data slice
│       │   ├── settingsSlice.ts     # UI/theme settings slice
│       │   └── types.ts             # TypeScript interfaces
│       ├── templates/               # Template system
│       │   ├── registry.ts          # All available templates
│       │   ├── adapters.ts          # Template adapter interface
│       │   └── impactcv/themes.ts   # 20 Impact-CV themes
│       ├── parse-resume-from-pdf/   # PDF parsing algorithm
│       │   ├── index.ts
│       │   ├── read-pdf.ts
│       │   ├── group-text-items-into-lines.ts
│       │   ├── group-lines-into-sections.ts
│       │   └── extract-resume-from-sections/
│       └── stores/                  # Zustand stores
│           └── templateStore.ts    # Template selector UI state
├── backend/                         # Express.js backend
│   ├── server.js                    # Express server
│   ├── models/Resume.js             # Mongoose schema
│   └── routes/
│       ├── resumes.js               # CRUD endpoints
│       ├── ai.js                    # AI tailoring endpoints
│       └── templates.js             # Template management
└── public/                          # Static assets
```

## Architecture

### Data Flow

```
PDF Upload → Parser → Redux Store ←→ Resume Builder UI
                                     ↓
                              Template Preview → PDF Export
```

### Redux Store

The app uses two Redux slices:

**resumeSlice** — Holds all resume data:
- `profile` — Name, email, phone, location, summary
- `workExperiences` — Work history with dates and descriptions
- `educations` — Education entries with degree and dates
- `projects` — Project entries with descriptions
- `skills` — Featured skills with ratings
- `custom` — Custom sections
- Plus: languages, interests, awards, certifications, publications, volunteer, references, profiles

**settingsSlice** — Holds UI and theme settings:
- `activeTemplate` — Current template ID
- `layout` — Sidebar width, section ordering
- `design` — Colors, skill level indicators
- `typography` — Font families, sizes, line heights
- `page` — Paper format, margins

State is automatically persisted to localStorage under the key `open-resume-state`.

### Template System

Templates implement a `TemplateAdapter` interface:

```typescript
interface TemplateAdapter {
  id: string;
  name: string;
  source: "impact-cv" | "reactive-resume" | "legacy";
  category: "professional" | "creative" | "academic" | "modern" | "minimal";
  paradigm: "config" | "component" | "pdf";
  render: (resume: Resume, settings: TemplateSettings) => JSX.Element;
  getDefaultSettings: () => Partial<TemplateSettings>;
}
```

**Available Templates:**
- **Legacy** — Classic PDF with colored header
- **Custom HTML** — Mustache-style `{{}}` interpolation for custom templates
- **20 Impact-CV Themes** — Basic, Casual, Professional, Creative, Modern, Business, Minimal, Elegant, Technical, Vibrant, Nordic, Blueprint, Gradient, Retro, Academic, Corporate, Artistic, Classic, Digital, Futuristic
- **14 Reactive-Resume Templates** — Onyx, Pikachu, Azurill, Bronzor, Chikorita, Ditgar, Ditto, Gengar, Glalie, Kakuna, Lapras, Leafish, Meowth, Rhyhorn

### PDF Parsing Algorithm

The parser follows a 4-step pipeline:

1. **Read PDF** — `readPdf(fileUrl)` uses pdfjs-dist to extract text items
2. **Group into Lines** — `groupTextItemsIntoLines()` clusters adjacent text
3. **Detect Sections** — `groupLinesIntoSections()` identifies section boundaries
4. **Extract Data** — `extractResumeFromSections()` uses feature scoring to extract resume attributes

Feature scoring assigns points to text snippets based on pattern matching. Higher scores indicate stronger matches for a given attribute.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, testimonials |
| `/resume-builder` | Split-screen editor with form and live preview |
| `/resume-import` | Drag-and-drop PDF import |
| `/resume-parser` | ATS parser playground with algorithm explanation |

## Getting Started

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend (Optional — for AI features)

```bash
cd backend

# Install backend dependencies
npm install

# Start the server (runs on port 3001)
node server.js
```

The backend provides AI tailoring endpoints (`POST /api/ai/tailor`, `POST /api/ai/improve`) using OpenRouter API.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests in watch mode |
| `npm run test:ci` | Run Jest tests in CI mode |

## Dependencies Overview

- **@react-pdf/renderer** — Generate PDF documents
- **pdfjs-dist** — Parse PDF files and extract text
- **framer-motion** — Smooth animations and page transitions
- **zustand** — Lightweight UI state management for template selector
- **tailwind-scrollbar** — Custom scrollbar styling
- **@vercel/analytics** — Track visitor analytics

## State Persistence

Resume data and settings are automatically saved to localStorage on every change. The `useSetInitialStore()` hook hydrates the Redux store from localStorage on app load, merging with defaults for backward compatibility.

## License
Made By Sachin Rao Mandhiya
This project is open source.