"use client";
import { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectTemplateSettings, selectSettings } from "lib/redux/settingsSlice";
import { apiUrl } from "lib/api";

// Template configuration from backend
interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  primaryColor: string;
  layout: {
    type: string;
    sidebarWidth: number;
    mainSections: string[];
    sidebarSections: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: number;
    bodySize: number;
    lineHeight: number;
  };
  styles: {
    headerAlign: string;
    sectionSpacing: number;
    itemSpacing: number;
    borderRadius: number;
    cardStyle: string;
  };
  sections: Record<string, any>;
}

// Fetch templates from backend
async function fetchBackendTemplates(): Promise<TemplateConfig[]> {
  try {
    const response = await fetch(apiUrl('/api/templates'));
    const data = await response.json();
    if (data.success && data.data?.templates) {
      return data.data.templates;
    }
  } catch (error) {
    console.error('Failed to fetch templates:', error);
  }
  return [];
}

// Dynamic Template Renderer - Reads config from backend and renders accordingly
const ConfigBasedTemplate = ({ templateConfig, resume }: { templateConfig: TemplateConfig; resume: any }) => {
  const {
    layout,
    typography,
    styles,
    sections,
    primaryColor
  } = templateConfig;

  const { profile, workExperiences, educations, projects, skills, languages, profiles } = resume;

  // Helper to render section content
  const renderSectionContent = (sectionType: string) => {
    switch (sectionType) {
      case 'experience':
        return workExperiences.length > 0 && workExperiences[0].company ? (
          <div className="space-y-4">
            {workExperiences.map((exp: any, idx: number) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-800">{exp.jobTitle}</h3>
                  <span className="text-xs font-medium ml-2" style={{ color: primaryColor }}>{exp.date}</span>
                </div>
                <p className="text-sm text-gray-600">{exp.company}</p>
                {exp.descriptions.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                    {exp.descriptions.map((desc: string, i: number) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return educations.length > 0 && educations[0].school ? (
          <div className="space-y-3">
            {educations.map((edu: any, idx: number) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.school}</p>
                <p className="text-xs font-medium" style={{ color: primaryColor }}>{edu.date}</p>
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return projects.length > 0 && projects[0].project ? (
          <div className="space-y-3">
            {projects.map((proj: any, idx: number) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-800">{proj.project}</h3>
                {proj.descriptions.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                    {proj.descriptions.map((desc: string, i: number) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return skills.featuredSkills.some((s: any) => s.skill) ? (
          <div className="flex flex-wrap gap-2">
            {skills.featuredSkills
              .filter((s: any) => s.skill)
              .map((skill: any, idx: number) => (
                <span
                  key={idx}
                  className="rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  {skill.skill}
                </span>
              ))}
          </div>
        ) : null;

      case 'languages':
        return languages?.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {languages.map((lang: any, idx: number) => (
              <li key={idx}>{lang.language} - {lang.fluency}</li>
            ))}
          </ul>
        ) : null;

      case 'profiles':
        return profiles?.length > 0 ? (
          <div className="space-y-1 text-sm">
            {profiles.map((prof: any, idx: number) => (
              <div key={idx}>
                {prof.label}: {prof.url}
              </div>
            ))}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Render section title
  const renderSectionTitle = (sectionKey: string) => {
    const sectionConfig = sections[sectionKey];
    if (sectionConfig?.showTitle === false) return null;

    const titles: Record<string, string> = {
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      skills: 'Skills',
      languages: 'Languages',
      profiles: 'Profiles',
      summary: 'Summary',
      certifications: 'Certifications',
      awards: 'Awards',
      publications: 'Publications',
    };

    return (
      <h2
        className="mb-3 border-b pb-1 text-lg font-bold"
        style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
      >
        {titles[sectionKey] || sectionKey}
      </h2>
    );
  };

  // Two-column layout
  if (layout.type === 'two-column') {
    return (
      <div className="h-full bg-white p-8">
        {/* Header */}
        <div
          className={`mb-6 ${styles.headerAlign === 'center' ? 'text-center' : 'text-left'}`}
          style={{ borderBottom: `3px solid ${primaryColor}`, paddingBottom: styles.sectionSpacing }}
        >
          <h1
            className="font-bold uppercase tracking-wider"
            style={{ fontSize: typography.headingSize + 6, color: primaryColor }}
          >
            {profile.name || 'Your Name'}
          </h1>
          {profile.summary && (
            <p className="mt-2 text-sm font-medium text-gray-600">{profile.summary}</p>
          )}
          <div className={`mt-3 flex flex-wrap gap-4 text-xs text-gray-500 ${styles.headerAlign === 'center' ? 'justify-center' : ''}`}>
            {profile.email && <span>✉ {profile.email}</span>}
            {profile.phone && <span>☏ {profile.phone}</span>}
            {profile.location && <span>⌂ {profile.location}</span>}
            {profile.url && <span>🔗 {profile.url}</span>}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Main Column */}
          <div className="flex-1 space-y-6">
            {layout.mainSections.map((sectionType) => (
              <section key={sectionType}>
                {renderSectionTitle(sectionType)}
                {renderSectionContent(sectionType)}
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <div
            className="shrink-0 space-y-6"
            style={{ width: `${layout.sidebarWidth}%` }}
          >
            {layout.sidebarSections.map((sectionType) => (
              <section key={sectionType}>
                {renderSectionTitle(sectionType)}
                {renderSectionContent(sectionType)}
              </section>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Single column layout
  return (
    <div className="h-full bg-white p-8">
      {/* Header */}
      <div className={`mb-8 ${styles.headerAlign === 'center' ? 'text-center' : 'text-left'}`}>
        <h1 className="font-bold" style={{ fontSize: typography.headingSize + 10 }}>
          {profile.name || 'Your Name'}
        </h1>
        {profile.summary && (
          <p className="mt-2 text-sm text-gray-600">{profile.summary}</p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {[...layout.mainSections, ...layout.sidebarSections].map((sectionType) => (
          <section key={sectionType}>
            {renderSectionTitle(sectionType)}
            {renderSectionContent(sectionType)}
          </section>
        ))}
      </div>
    </div>
  );
};

// Legacy PDF style preview
const LegacyPreview = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectTemplateSettings);
  const { profile, workExperiences, educations, projects, skills } = resume;

  return (
    <div className="p-6" style={{ fontFamily: settings.typography.body.fontFamily }}>
      {/* Header with colored bar */}
      <div
        className="mb-4 rounded-t-lg pb-4"
        style={{ borderBottom: `4px solid ${settings.design.colors.primary}` }}
      >
        <h1 className="text-2xl font-bold" style={{ color: settings.design.colors.text }}>
          {profile.name || "Your Name"}
        </h1>
        <p className="mt-1 text-sm" style={{ color: settings.design.colors.text }}>
          {profile.summary}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs" style={{ color: settings.design.colors.text }}>
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>{profile.phone}</span>}
          {profile.location && <span>{profile.location}</span>}
          {profile.url && <span>{profile.url}</span>}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {workExperiences.length > 0 && workExperiences[0].company && (
          <section>
            <h2
              className="mb-2 text-sm font-bold uppercase tracking-wide"
              style={{ color: settings.design.colors.primary }}
            >
              Work Experience
            </h2>
            {workExperiences.map((exp, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-semibold">{exp.jobTitle}</span>
                  <span className="text-xs">{exp.date}</span>
                </div>
                <p className="text-xs text-gray-600">{exp.company}</p>
                {exp.descriptions.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-xs">
                    {exp.descriptions.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {educations.length > 0 && educations[0].school && (
          <section>
            <h2
              className="mb-2 text-sm font-bold uppercase tracking-wide"
              style={{ color: settings.design.colors.primary }}
            >
              Education
            </h2>
            {educations.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{edu.degree}</span>
                  <span className="text-xs">{edu.date}</span>
                </div>
                <p className="text-xs text-gray-600">{edu.school}</p>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && projects[0].project && (
          <section>
            <h2
              className="mb-2 text-sm font-bold uppercase tracking-wide"
              style={{ color: settings.design.colors.primary }}
            >
              Projects
            </h2>
            {projects.map((proj, idx) => (
              <div key={idx} className="mb-2">
                <span className="font-semibold">{proj.project}</span>
                {proj.descriptions.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-xs">
                    {proj.descriptions.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {skills.featuredSkills.some((s) => s.skill) && (
          <section>
            <h2
              className="mb-2 text-sm font-bold uppercase tracking-wide"
              style={{ color: settings.design.colors.primary }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.featuredSkills
                .filter((s) => s.skill)
                .map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded px-2 py-0.5 text-xs"
                    style={{ backgroundColor: `${settings.design.colors.primary}20` }}
                  >
                    {skill.skill}
                  </span>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Impact-CV style preview renderer
const ImpactCVPreview = ({ themeId }: { themeId: string }) => {
  const resume = useAppSelector(selectResume);
  const template = useMemo(() => {
    // Try to get from Impact-CV themes
    return null; // Will be handled by default theme lookup
  }, [themeId]);

  return <LegacyPreview />;
};

const CustomHTMLPreview = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);

  // Very basic mustache/handlebars style interpolation
  const interpolate = (html: string, data: any) => {
    let result = html;

    const loopRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    result = result.replace(loopRegex, (match, key, innerTemplate) => {
      if (Array.isArray(data[key])) {
        return data[key].map((item: any) => {
          let itemHTML = innerTemplate;
          Object.keys(item).forEach((itemKey) => {
            const val = typeof item[itemKey] === 'string' ? item[itemKey] : '';
            itemHTML = itemHTML.replace(new RegExp(`\\{\\{${itemKey}\\}\\}`, 'g'), val);
          });
          return itemHTML;
        }).join('');
      }
      return '';
    });

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        Object.keys(data[key]).forEach((subKey) => {
          const val = typeof data[key][subKey] === 'string' ? data[key][subKey] : '';
          result = result.replace(new RegExp(`\\{\\{${key}\\.${subKey}\\}\\}`, 'g'), val);
        });
      }
    });

    return result;
  };

  const parsedHTML = interpolate(settings.customHTML, resume);

  return (
    <div className="h-full bg-white relative">
      <style>{settings.customCSS}</style>
      <div dangerouslySetInnerHTML={{ __html: parsedHTML }} />
    </div>
  );
};

// Main TemplatePreview component
export const TemplatePreview = () => {
  const settings = useAppSelector(selectSettings);
  const resume = useAppSelector(selectResume);
  const { templateSettings } = settings;
  const { activeTemplate } = templateSettings;

  const [backendTemplates, setBackendTemplates] = useState<TemplateConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch templates from backend on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch(apiUrl('/api/templates'));
        const data = await response.json();
        if (data.success && data.data?.templates) {
          setBackendTemplates(data.data.templates);
        }
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  // Find template configuration
  const templateConfig = useMemo(() => {
    return backendTemplates.find(t => t.id === activeTemplate);
  }, [backendTemplates, activeTemplate]);

  const renderPreview = () => {
    // Custom HTML template
    if (activeTemplate === 'custom-html') {
      return <CustomHTMLPreview />;
    }

    // Check if we have a backend template config
    if (templateConfig) {
      return <ConfigBasedTemplate templateConfig={templateConfig} resume={resume} />;
    }

    // Impact-CV style
    if (activeTemplate.startsWith('impactcv-')) {
      return <ImpactCVPreview themeId={activeTemplate} />;
    }

    // Legacy default
    return <LegacyPreview />;
  };

  return (
    <div
      className="h-full bg-white transition-all duration-500 ease-in-out"
      style={{
        fontSize: `${templateSettings.typography.body.fontSize}px`,
        lineHeight: templateSettings.typography.body.lineHeight,
      }}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading template...</div>
          </div>
        ) : (
          renderPreview()
        )}
      </div>
    </div>
  );
};