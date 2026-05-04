/**
 * Template Variables / Placeholders API
 * Lists all available variables for custom HTML/CSS templates
 */

import { Router } from 'express';

const router = Router();

/**
 * GET /api/templates/variables
 * Get all available template variables/placeholders for custom HTML templates
 */
router.get('/variables', (_req, res) => {
  const variables = {
    profile: {
      name: { type: 'string', example: '{{profile.name}}', description: 'Full name' },
      headline: { type: 'string', example: '{{profile.headline}}', description: 'Professional headline' },
      summary: { type: 'string', example: '{{profile.summary}}', description: 'Professional summary' },
      email: { type: 'string', example: '{{profile.email}}', description: 'Email address' },
      phone: { type: 'string', example: '{{profile.phone}}', description: 'Phone number' },
      location: { type: 'string', example: '{{profile.location}}', description: 'City, Country' },
      url: { type: 'string', example: '{{profile.url}}', description: 'Personal website' },
      customFields: { type: 'array', example: '{{#profile.customFields}}{{text}}{{/profile.customFields}}', description: 'Custom contact fields' },
    },
    sections: {
      workExperiences: {
        type: 'array',
        itemProperties: {
          jobTitle: { type: 'string', description: 'Job title/position' },
          company: { type: 'string', description: 'Company name' },
          location: { type: 'string', description: 'Job location' },
          date: { type: 'string', description: 'Employment period' },
          descriptions: { type: 'array', description: 'Bullet points/achievements' },
        },
        example: '{{#workExperiences}}<h3>{{jobTitle}}</h3>{{company}}{{/workExperiences}}',
        description: 'Work experience entries'
      },
      educations: {
        type: 'array',
        itemProperties: {
          school: { type: 'string', description: 'Institution name' },
          degree: { type: 'string', description: 'Degree title' },
          date: { type: 'string', description: 'Graduation year' },
          descriptions: { type: 'array', description: 'Achievements/courses' },
        },
        example: '{{#educations}}<h3>{{degree}}</h3>{{school}}{{/educations}}',
        description: 'Education entries'
      },
      projects: {
        type: 'array',
        itemProperties: {
          project: { type: 'string', description: 'Project name' },
          date: { type: 'string', description: 'Project period' },
          descriptions: { type: 'array', description: 'Project details' },
        },
        example: '{{#projects}}<h3>{{project}}</h3>{{/projects}}',
        description: 'Projects entries'
      },
      skills: {
        type: 'object',
        properties: {
          featuredSkills: { type: 'array', description: 'Main skills list' },
          otherSkills: { type: 'array', description: 'Additional skills' },
        },
        itemProperties: {
          skill: { type: 'string', description: 'Skill name' },
          proficiency: { type: 'string', description: 'Proficiency level' },
        },
        example: '{{#skills.featuredSkills}}<span>{{skill}}</span>{{/skills.featuredSkills}}',
        description: 'Skills section'
      },
      languages: {
        type: 'array',
        itemProperties: {
          language: { type: 'string', description: 'Language name' },
          fluency: { type: 'string', description: 'Fluency level' },
        },
        example: '{{#languages}}{{language}}{{/languages}}',
        description: 'Language entries'
      },
      profiles: {
        type: 'array',
        itemProperties: {
          label: { type: 'string', description: 'Network name (LinkedIn, GitHub, etc.)' },
          url: { type: 'string', description: 'Profile URL' },
        },
        example: '{{#profiles}}{{label}}: {{url}}{{/profiles}}',
        description: 'Social/Professional profiles'
      },
      awards: {
        type: 'array',
        itemProperties: {
          title: { type: 'string', description: 'Award title' },
          awarder: { type: 'string', description: 'Awarding organization' },
          date: { type: 'string', description: 'Date received' },
        },
        description: 'Awards & recognitions'
      },
      certifications: {
        type: 'array',
        itemProperties: {
          title: { type: 'string', description: 'Certification name' },
          issuer: { type: 'string', description: 'Issuing organization' },
          date: { type: 'string', description: 'Date obtained' },
        },
        description: 'Professional certifications'
      },
      publications: {
        type: 'array',
        itemProperties: {
          title: { type: 'string', description: 'Publication title' },
          publisher: { type: 'string', description: 'Publisher name' },
          date: { type: 'string', description: 'Publication date' },
        },
        description: 'Publications (academic/research)'
      },
      volunteer: {
        type: 'array',
        itemProperties: {
          organization: { type: 'string', description: 'Organization name' },
          position: { type: 'string', description: 'Role/position' },
          date: { type: 'string', description: 'Volunteering period' },
        },
        description: 'Volunteer experience'
      },
      interests: {
        type: 'array',
        description: 'Personal interests/hobbies'
      },
      references: {
        type: 'array',
        itemProperties: {
          name: { type: 'string', description: 'Reference name' },
          position: { type: 'string', description: 'Reference title' },
          company: { type: 'string', description: 'Reference company' },
        },
        description: 'Professional references'
      },
    },
    cssVariables: {
      '--theme-color': { type: 'color', example: 'color: var(--theme-color)', description: 'Primary theme color' },
      '--resume-bg': { type: 'color', example: 'background: var(--resume-bg)', description: 'Resume background' },
      '--resume-text': { type: 'color', example: 'color: var(--resume-text)', description: 'Main text color' },
      '--font-heading': { type: 'string', example: 'font-family: var(--font-heading)', description: 'Heading font' },
      '--font-body': { type: 'string', example: 'font-family: var(--font-body)', description: 'Body font' },
    }
  };

  const usage = {
    loops: '{{#sectionName}}...{{/sectionName}}',
    nested: '{{section.nested}}',
    arrays: '{{#sectionName}}{{property}}{{/sectionName}}',
    conditionals: '{{#if field}}...{{/if}}',
  };

  const starterTemplates = {
    sleek: {
      html: `<div class="resume">
  <header class="header">
    <h1>{{profile.name}}</h1>
    <p class="headline">{{profile.headline}}</p>
    <div class="contact">
      <span>{{profile.email}}</span>
      <span>{{profile.phone}}</span>
      <span>{{profile.location}}</span>
    </div>
  </header>

  <section class="experience">
    <h2>Experience</h2>
    {{#workExperiences}}
    <div class="exp-item">
      <div class="exp-header">
        <h3>{{jobTitle}}</h3>
        <span class="date">{{date}}</span>
      </div>
      <p class="company">{{company}}</p>
      {{#descriptions}}
      <ul class="points"><li>{{.}}</li></ul>
      {{/descriptions}}
    </div>
    {{/workExperiences}}
  </section>
</div>`,
      css: `.resume { font-family: 'Inter', sans-serif; }
.header { text-align: center; margin-bottom: 2rem; }
.header h1 { font-size: 2rem; color: var(--theme-color); }
.exp-item { margin-bottom: 1.5rem; }
.exp-header { display: flex; justify-content: space-between; }`
    },
    minimal: {
      html: `<article class="resume">
  <h1>{{profile.name}}</h1>
  <p>{{profile.summary}}</p>

  <h2>Work Experience</h2>
  {{#workExperiences}}
  <section>
    <strong>{{jobTitle}}</strong> at {{company}}
    <em>{{date}}</em>
  </section>
  {{/workExperiences}}
</article>`,
      css: `.resume { max-width: 800px; margin: 0 auto; padding: 2rem; }
h1 { border-bottom: 2px solid #000; }`
    },
    professional: {
      html: `<div class="cv">
  <aside class="sidebar">
    <div class="profile-section">
      <h1>{{profile.name}}</h1>
      <p>{{profile.headline}}</p>
    </div>
    <div class="skills">
      <h3>Skills</h3>
      {{#skills.featuredSkills}}
      <span class="skill-tag">{{skill}}</span>
      {{/skills.featuredSkills}}
    </div>
  </aside>
  <main class="main">
    {{#workExperiences}}
    <article class="job">
      <h3>{{jobTitle}}</h3>
      <strong>{{company}}</strong>
      <span>{{date}}</span>
      <ul>{{#descriptions}}<li>{{.}}</li>{{/descriptions}}</ul>
    </article>
    {{/workExperiences}}
  </main>
</div>`,
      css: `.cv { display: grid; grid-template-columns: 300px 1fr; gap: 2rem; }
.sidebar { background: #f5f5f5; padding: 1.5rem; }
.main { padding: 1.5rem; }
.skill-tag { display: inline-block; padding: 0.25rem 0.75rem; background: var(--theme-color); color: white; border-radius: 999px; margin: 0.25rem; font-size: 0.85rem; }`
    }
  };

  res.json({
    success: true,
    data: {
      variables,
      usage,
      starterTemplates,
      totalVariables: Object.keys(variables.profile).length +
                      Object.keys(variables.sections).length +
                      Object.keys(variables.cssVariables).length,
    },
  });
});

export default router;
