# Frontend Documentation - ResumeMaker

## Project Overview

**ResumeMaker** is a free, open-source resume builder and parser built with Next.js, React, Redux, and Tailwind CSS. The application allows users to create, edit, preview, and export professional resumes with real-time preview.

---

## Tech Stack

### Core Framework & Libraries
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | ^13.4.4 | React framework with App Router |
| **React** | ^18.2.0 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Redux Toolkit** | ^2.11.2 | State management |
| **React Redux** | ^8.1.3 | React bindings for Redux |
| **Tailwind CSS** | ^3.3.2 | Utility-first CSS framework |
| **Framer Motion** | ^12.38.0 | Animation library |
| **GSAP** | ^3.15.0 | Scroll-driven animations |
| **Lenis** | ^1.3.23 | Smooth scrolling |

### Key Dependencies
| Library | Purpose |
|---------|---------|
| `@react-pdf/renderer` | PDF generation for resume export |
| `@monaco-editor/react` | Code editor for custom HTML/CSS |
| `lucide-react` | Icon library |
| `@heroicons/react` | Additional icons |
| `zustand` | Lightweight state management (template store) |
| `zod` | Schema validation |

---

## Directory Structure

```
src/app/
├── layout.tsx                 # Root layout with providers
├── page.tsx                   # Home page (landing page)
├── globals.css                # Global styles & CSS variables
├── globals-css.ts             # CSS-in-JS utilities
├── lib/                       # Utility functions & shared logic
│   ├── redux/                 # Redux store, slices, hooks
│   ├── templates/             # Template registry & adapters
│   ├── parse-resume-from-pdf/ # PDF parsing logic
│   ├── hooks/                 # Custom React hooks
│   └── stores/                # Zustand stores
├── components/                # Reusable UI components
│   ├── Resume/                # Resume preview components
│   ├── ResumeForm/            # Form components for resume editing
│   ├── fonts/                 # Font loading & registration
│   └── [other UI components]
├── home/                      # Home page specific components
├── resume-builder/            # Resume builder page
├── resume-parser/             # Resume parser page
└── resume-import/             # Resume import page
```

---

## Page Structure

### 1. Layout (`app/layout.tsx`)

**Purpose:** Root layout wrapping all pages with providers and global components.

**Components Used:**
- `AppProviders` - Redux store provider + smooth scroll
- `TopNavBar` - Navigation header
- `AIAssistant` - Floating AI chat helper
- `Analytics` - Vercel analytics

```
< html >
  < body >
    < AppProviders >
      < TopNavBar />
      {children}
      < AIAssistant />
      < Analytics />
    </ AppProviders >
  </ body >
</ html >
```

---

### 2. Home Page (`app/page.tsx`)

**Purpose:** Landing page with marketing content and animated sections.

**Components:**
| Component | File Path | Purpose |
|-----------|-----------|---------|
| `Hero` | `components/Hero.tsx` | Hero section with GSAP animations |
| `AutoTypingResume` | `home/AutoTypingResume.tsx` | Live demo of resume being typed |
| `Steps` | `home/Steps.tsx` | How-it-works steps |
| `Features` | `home/Features.tsx` | Feature highlights |
| `Testimonials` | `home/Testimonials.tsx` | User testimonials |
| `QuestionsAndAnswers` | `home/Q&A.tsx` | FAQ section |

**Animations:**
- GSAP ScrollTrigger for scroll-based animations
- Framer Motion for entrance animations
- Custom `Reveal` wrapper component

---

### 3. Resume Builder (`app/resume-builder/page.tsx`)

**Purpose:** Main resume editing interface with split-screen layout.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│                    Main Content Area                     │
│  ┌─────────────────────┬───────────────────────────────┐│
│  │                     │                               ││
│  │   ResumeForm        │          Resume Preview       ││
│  │   (Left Panel)      │       (Right Panel)           ││
│  │   - Form inputs     │    - Live PDF/HTML preview    ││
│  │   - Collapsible     │    - Zoom controls            ││
│  │   - Drag & drop     │    - Download button          ││
│  │                     │                               ││
│  └─────────────────────┴───────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Components:**
| Component | Purpose |
|-----------|---------|
| `ResumeForm` | Form container for all resume sections |
| `Resume` | Preview container with control bar |

**Animations:**
- Framer Motion slide-in from left/right on mount

---

### 4. Resume Parser (`app/resume-parser/page.tsx`)

**Purpose:** Parse uploaded PDF resumes and display extracted data.

**Features:**
- PDF preview iframe
- Parsed data table view
- Algorithm explanation article
- Example resume switcher

**Parsing Pipeline:**
```
PDF → readPdf() → TextItems → groupTextItemsIntoLines() 
    → groupLinesIntoSections() → extractResumeFromSections() → Resume
```

---

### 5. Resume Import (`app/resume-import/page.tsx`)

**Purpose:** Import existing resumes via PDF upload.

**Features:**
- First-time vs returning user detection
- Local storage check for saved data
- `ResumeDropzone` for file upload

---

## Component Architecture

### Core UI Components

#### `TopNavBar` (`components/TopNavBar.tsx`)
**Purpose:** Site navigation header.

**Structure:**
- Logo + brand name
- Navigation links (Builder, Parser)
- GitHub star button iframe

---

#### `AIAssistant` (`components/AIAssistant.tsx`)
**Purpose:** Floating chat widget for resume help.

**Features:**
- Expandable chat window
- Mock AI responses (pattern-based)
- Framer Motion animations
- System prompt for resume-specific guidance

**State:**
```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
}
```

---

#### `AppProviders` (`components/AppProviders.tsx`)
**Purpose:** Wrap app with Redux provider and smooth scroll.

```tsx
<Provider store={store}>
  <SmoothScrollProvider>
    {children}
  </SmoothScrollProvider>
</Provider>
```

---

#### `SmoothScrollProvider` (`components/SmoothScrollProvider.tsx`)
**Purpose:** Enable smooth scrolling with Lenis + GSAP integration.

**Implementation:**
- Lenis for smooth scroll physics
- GSAP ScrollTrigger sync for scroll-driven animations

---

#### `FlexboxSpacer` (`components/FlexboxSpacer.tsx`)
**Purpose:** Flexible spacing component for layouts.

---

#### `Button` (`components/Button.tsx`)
**Purpose:** Reusable button with variants.

---

#### `Tooltip` (`components/Tooltip.tsx`)
**Purpose:** Tooltip wrapper for interactive elements.

---

#### `ExpanderWithHeightTransition` (`components/ExpanderWithHeightTransition.tsx`)
**Purpose:** Animate height changes for collapsible sections.

---

#### `ResumeDropzone` (`components/ResumeDropzone.tsx`)
**Purpose:** Drag-and-drop file upload zone.

---

### Resume Preview Components

#### `Resume` (`components/Resume/index.tsx`)
**Purpose:** Main preview container with control bar.

**Features:**
- Dual-mode preview (HTML template vs Legacy PDF)
- Zoom/scale controls
- Document size handling (A4/Letter)
- Font registration via hooks

**Key Logic:**
```typescript
const useHTMLPreview = activeTemplate && activeTemplate.source !== "legacy";
```

---

#### `ResumeIframeCSR` (`components/Resume/ResumeIFrame.tsx`)
**Purpose:** Render PDF preview in iframe for Legacy mode.

---

#### `ResumeControlBar` (`components/Resume/ResumeControlBar.tsx`)
**Purpose:** Bottom control bar for preview actions.

**Features:**
- Zoom slider
- Download button (PDF export)
- Document size toggle

---

#### `TemplatePreview` (`components/Resume/TemplatePreview.tsx`)
**Purpose:** Dynamic template renderer based on backend config.

**Preview Types:**
1. **ConfigBasedTemplate** - Backend-driven template config
2. **CustomHTMLPreview** - User-defined HTML/CSS with mustache interpolation
3. **ImpactCVPreview** - Impact-CV theme style
4. **LegacyPreview** - Original PDF-style preview

**Template Interpolation:**
```typescript
// Mustache-style block interpolation
const interpolate = (html: string, data: any) => {
  // Handle loops: {{#workExperiences}}...{{/workExperiences}}
  // Handle nested: {{profile.name}}
};
```

---

#### `ResumePDF` (`components/Resume/ResumePDF/index.tsx`)
**Purpose:** PDF document structure using @react-pdf/renderer.

**Structure:**
```
<Document>
  <Page>
    <View themeColorBar />
    <View padding>
      <ResumePDFProfile />
      {showFormsOrder.map(form => formTypeToComponent[form]())}
    </View>
  </Page>
</Document>
```

**Sub-components:**
| Component | Purpose |
|-----------|---------|
| `ResumePDFProfile` | Name, contact, summary |
| `ResumePDFWorkExperience` | Work history section |
| `ResumePDFEducation` | Education section |
| `ResumePDFProject` | Projects section |
| `ResumePDFSkills` | Skills section |
| `ResumePDFCustom` | Custom sections |

**Common Components (`components/Resume/ResumePDF/common/`):**
- `ResumePDFIcon` - Icon renderer for PDF
- `SuppressResumePDFErrorMessage` - Suppress dev warnings

---

### Form Components

#### `ResumeForm` (`components/ResumeForm/index.tsx`)
**Purpose:** Main form container with all resume sections.

**Structure:**
```
<ResumeForm>
  <ProfileForm />
  {formsOrder.map(form => FormComponent)}
  <ThemeForm />
</ResumeForm>
```

**Form Order Management:**
- Redux state controls section order
- Move up/down buttons reorder sections

---

#### `BaseForm` (`components/ResumeForm/Form/index.tsx`)
**Purpose:** Bare-bones form container (no header).

**Used by:** `ProfileForm`

---

#### `Form` (`components/ResumeForm/Form/index.tsx`)
**Purpose:** Collapsible form section with header controls.

**Features:**
- Icon per section type
- Heading editor (editable input)
- Show/hide toggle
- Move up/down buttons
- "Add" button for multi-section forms

**Form Types:**
```typescript
type ShowForm = "workExperiences" | "educations" | "projects" | "skills" | "custom";
```

---

#### `FormSection` (`components/ResumeForm/Form/index.tsx`)
**Purpose:** Individual section within a form (for multi-item forms like work experience).

**Features:**
- Delete button
- Move up/down within section
- Dotted separator between sections

---

#### `ProfileForm` (`components/ResumeForm/ProfileForm.tsx`)
**Purpose:** Personal information form.

**Fields:**
- Name
- Objective/Summary
- Email
- Phone
- Website/URL
- Location

---

#### `WorkExperiencesForm` (`components/ResumeForm/WorkExperiencesForm.tsx`)
**Purpose:** Work history form.

**Fields per entry:**
- Company
- Job Title
- Date
- Description (bullet points)

---

#### `EducationsForm` (`components/ResumeForm/EducationsForm.tsx`)
**Purpose:** Education history form.

---

#### `ProjectsForm` (`components/ResumeForm/ProjectsForm.tsx`)
**Purpose:** Projects form.

---

#### `SkillsForm` (`components/ResumeForm/SkillsForm.tsx`)
**Purpose:** Skills form with featured skills.

---

#### `CustomForm` (`components/ResumeForm/CustomForm.tsx`)
**Purpose:** Custom sections form.

---

#### `ThemeForm` (`components/ResumeForm/ThemeForm/index.tsx`)
**Purpose:** Resume settings and customization.

**Tabs:**
1. **Templates** - Template selector
2. **Settings** - Quick settings (font, size, color)
3. **Suggestions** - AI-powered suggestions
4. **Custom Code** - HTML/CSS editor

**Settings:**
- Theme color picker + swatches
- Font family selection
- Font size selection
- Document size (A4/Letter)
- Custom HTML/CSS editor

**Sub-components:**
| Component | Purpose |
|-----------|---------|
| `TemplateSelector` | Template grid with preview |
| `TemplateSettings` | Per-template settings |
| `SuggestionSystem` | AI suggestions |
| `InlineInput` | Inline form input |
| `Selection` components | Font/size pickers |

---

### Form Input Components

#### `InputGroup` (`components/ResumeForm/Form/InputGroup.tsx`)
**Purpose:** Form input wrappers and labels.

**Components:**
- `Input` - Text input with label
- `Textarea` - Multi-line text
- `BulletListTextarea` - Textarea for bullet points

---

#### `IconButton` (`components/ResumeForm/Form/IconButton.tsx`)
**Purpose:** Icon-only buttons for form actions.

**Types:**
- `DeleteIconButton` - Delete section
- `MoveIconButton` - Reorder sections
- `ShowIconButton` - Toggle visibility

---

### Template Components

#### `TemplateSelector` (`components/ResumeForm/ThemeForm/TemplateSelector.tsx`)
**Purpose:** Grid of available templates.

---

#### `TemplateSettings` (`components/ResumeForm/ThemeForm/TemplateSettings.tsx`)
**Purpose:** Settings specific to selected template.

---

#### `SuggestionSystem` (`components/ResumeForm/ThemeForm/SuggestionSystem.tsx`)
**Purpose:** AI-powered resume suggestions.

---

#### `TemplatePreview` (`components/Resume/TemplatePreview.tsx`)
**Purpose:** Live preview of selected template.

*(See detailed description in Resume Preview Components section)*

---

### Home Page Components

#### `Hero` (`components/Hero.tsx` and `home/Hero.tsx`)
**Purpose:** Landing page hero section.

**Features:**
- GSAP parallax on scroll
- Entrance animations
- CTA buttons

---

#### `AutoTypingResume` (`home/AutoTypingResume.tsx`)
**Purpose:** Animated demo of resume being typed.

---

#### `Features` (`home/Features.tsx`)
**Purpose:** Feature highlights grid.

**Features:**
- 4 feature cards with icons
- GSAP staggered entrance
- Icon float animation

---

#### `Steps` (`home/Steps.tsx`)
**Purpose:** How-it-works steps.

---

#### `Testimonials` (`home/Testimonials.tsx`)
**Purpose:** User testimonials.

---

#### `QuestionsAndAnswers` (`home/QuestionsAndAnswers.tsx`)
**Purpose:** FAQ accordion.

---

#### `LogoCloud` (`home/LogoCloud.tsx`)
**Purpose:** Logo showcase section.

---

### Documentation Components (`components/documentation/`)

**Purpose:** Reusable documentation UI elements.

| Component | Purpose |
|-----------|---------|
| `Heading` | Section headings (h1-h6) |
| `Paragraph` | Text paragraphs |
| `Link` | Styled links |
| `Badge` | Badge/pill UI |
| `Table` | Data tables |
| `index.tsx` | Documentation page composer |

---

### Resume Parser Components

#### `ResumeTable` (`resume-parser/ResumeTable.tsx`)
**Purpose:** Display parsed resume data in table format.

---

#### `ResumeParserAlgorithmArticle` (`resume-parser/ResumeParserAlgorithmArticle.tsx`)
**Purpose:** Explain parsing algorithm step-by-step.

---

### Font Components (`components/fonts/`)

#### `hooks.tsx`
**Purpose:** Font registration hooks for @react-pdf/renderer.

**Hooks:**
- `useRegisterReactPDFFont` - Register custom fonts
- `useRegisterReactPDFHyphenationCallback` - Hyphenation setup

---

#### `NonEnglishFontsCSSLoader` (`components/fonts/NonEnglishFontsCSSLoader.tsx`)
**Purpose:** Load CSS for non-English fonts.

---

#### `FontsZh` (`components/fonts/FontsZh.tsx`)
**Purpose:** Chinese font support.

---

#### `constants.ts` & `lib.ts`
**Purpose:** Font definitions and utilities.

---

## Redux State Management

### Store (`lib/redux/store.ts`)
```typescript
const store = configureStore({
  reducer: {
    resume: resumeReducer,
    settings: settingsReducer,
  },
});
```

### Slices

#### `resumeSlice.ts`
**State:** `Resume` object
```typescript
interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  custom: ResumeCustom[];
}
```

**Actions:**
- `changeProfile` - Update profile fields
- `changeWorkExperiences` - Update work entries
- `addSectionInForm` - Add new section
- `deleteSectionInFormByIdx` - Remove section
- `moveSectionInForm` - Reorder sections

---

#### `settingsSlice.ts`
**State:** `Settings` object
```typescript
interface Settings {
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: "A4" | "Letter";
  formToHeading: Record<ShowForm, string>;
  formToShow: Record<ShowForm, boolean>;
  formsOrder: ShowForm[];
  customHTML: string;
  customCSS: string;
  templateSettings: TemplateSettings;
}
```

**Actions:**
- `changeSettings` - Update setting fields
- `changeActiveTemplate` - Switch template
- `changeFormHeading` - Update form heading
- `changeShowForm` - Toggle form visibility
- `changeFormOrder` - Reorder forms

---

### Custom Hooks (`lib/redux/hooks.tsx`)

| Hook | Purpose |
|------|---------|
| `useAppSelector` | Typed useSelector |
| `useAppDispatch` | Typed useDispatch |
| `useSetInitialStore` | Initialize from localStorage |
| `useSaveStateToLocalStorageOnChange` | Persist state changes |

---

## Template System

### Template Registry (`lib/templates/registry.ts`)
**Purpose:** Register and retrieve templates.

---

### Template Adapters (`lib/templates/adapters.ts`)
**Purpose:** Convert between template formats.

---

### Template Store (`lib/stores/templateStore.ts`)
**Purpose:** Zustand store for template state.

---

### Backend API Integration

**Endpoints:**
- `/api/templates` - Fetch all templates
- `/api/templates/variables` - Get template variable definitions

**Template Config Structure:**
```typescript
interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  layout: {
    type: "single-column" | "two-column";
    sidebarWidth: number;
    mainSections: string[];
    sidebarSections: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: number;
    bodySize: number;
  };
  styles: {
    headerAlign: string;
    sectionSpacing: number;
    borderRadius: number;
  };
  sections: Record<string, any>;
}
```

---

## Animation System

### GSAP Setup
**Usage:** Scroll-driven animations via ScrollTrigger.

**Pattern:**
```typescript
gsap.fromTo(
  element,
  { fromState },
  {
    toState,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  }
);
```

### Framer Motion Setup
**Usage:** Component entrance/exit animations.

**Pattern:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
/>
```

### Lenis Smooth Scroll
**Purpose:** Smooth scroll physics.

**Configuration:**
```typescript
new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
```

---

## Key Utilities

### `cx` (`lib/cx.ts`)
**Purpose:** Class name merger (like clsx/classnames).

---

### `api.ts` (`lib/api.ts`)
**Purpose:** API URL helper for backend calls.

---

### PDF Parsing (`lib/parse-resume-from-pdf/`)

**Pipeline:**
1. `read-pdf.ts` - Extract text items from PDF
2. `group-text-items-into-lines.ts` - Group by Y-position
3. `group-lines-into-sections.ts` - Group by spacing
4. `extract-resume-from-sections/` - Extract structured data

---

## CSS Architecture

### CSS Variables (`globals.css`)
```css
:root {
  --top-nav-bar-height: 4rem;
  --resume-control-bar-height: 4rem;
  --resume-padding: 1.5rem;
}
```

### Tailwind Config
**Plugins:**
- `tailwind-scrollbar` - Custom scrollbar styling
- `prettier-plugin-tailwindcss` - Class sorting

---

## Key Patterns

### 1. Client Components
All interactive components use `"use client"` directive for:
- State management
- Event handlers
- Browser APIs

### 2. Dynamic Imports
Heavy components lazy-loaded:
```typescript
const ResumePDF = dynamic(() => import("..."), { ssr: false });
```

### 3. Local Storage Persistence
Redux state synced to localStorage:
- Resume data
- Settings
- First-time user flag

### 4. Responsive Design
- Mobile-first Tailwind classes
- `md:` breakpoint for split layouts
- Collapsible sections on mobile

---

## File Naming Conventions

| Pattern | Example |
|---------|---------|
| Components | PascalCase (`ResumeForm.tsx`) |
| Utilities | kebab-case (`parse-resume-from-pdf.ts`) |
| Hooks | `use*` prefix (`useAppSelector.tsx`) |
| Types | `types.ts` or alongside slice |

---

## Summary

ResumeMaker is a comprehensive resume builder with:
- **Real-time preview** - See changes instantly
- **Multiple templates** - Backend-driven template system
- **PDF export** - High-quality PDF generation
- **Resume parser** - ATS compatibility checker
- **AI assistant** - Built-in help chatbot
- **Privacy-focused** - Data stored locally in browser
- **Open-source** - Fully customizable codebase

The frontend is built with modern React patterns, leveraging Redux for state, Tailwind for styling, and GSAP/Framer Motion for animations.
