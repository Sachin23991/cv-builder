"use client";
import { useMemo } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectTemplateSettings, selectSettings } from "lib/redux/settingsSlice";
import { getTemplateById } from "lib/templates";
import { impactCVThemes } from "lib/templates/impactcv/themes";

// Impact-CV style preview renderer
const ImpactCVPreview = ({ themeId }: { themeId: string }) => {
  const resume = useAppSelector(selectResume);
  const theme = impactCVThemes.find((t) => t.id === themeId);

  if (!theme) return <div>Theme not found</div>;

  const { profile, workExperiences, educations, projects, skills } = resume;

  return (
    <div className={`${theme.fontClass} ${theme.spacing} ${theme.backgroundClass || ""}`}>
      {/* Header */}
      <header className={`${theme.headerStyle} ${theme.color} mb-6`}>
        <h1 className="font-bold">{profile.name || "Your Name"}</h1>
        {profile.summary && <p className="mt-2 text-sm font-normal opacity-80">{profile.summary}</p>}
      </header>

      {/* Contact Info */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        {profile.email && <span>{profile.email}</span>}
        {profile.phone && <span>{profile.phone}</span>}
        {profile.location && <span>{profile.location}</span>}
        {profile.url && <span>{profile.url}</span>}
      </div>

      {/* Work Experience */}
      {workExperiences.length > 0 && workExperiences[0].company && (
        <section className="mb-6">
          <h2 className={theme.sectionTitleStyle}>Work Experience</h2>
          <div className={theme.sectionContentStyle}>
            {workExperiences.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{exp.jobTitle}</h3>
                  <span className="text-sm">{exp.date}</span>
                </div>
                <p className="text-sm text-gray-600">{exp.company}</p>
                {exp.descriptions.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {exp.descriptions.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && educations[0].school && (
        <section className="mb-6">
          <h2 className={theme.sectionTitleStyle}>Education</h2>
          <div className={theme.sectionContentStyle}>
            {educations.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <span className="text-sm">{edu.date}</span>
                </div>
                <p className="text-sm text-gray-600">{edu.school}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && projects[0].project && (
        <section className="mb-6">
          <h2 className={theme.sectionTitleStyle}>Projects</h2>
          <div className={theme.sectionContentStyle}>
            {projects.map((proj, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="font-semibold">{proj.project}</h3>
                {proj.descriptions.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {proj.descriptions.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.featuredSkills.some((s) => s.skill) && (
        <section className="mb-6">
          <h2 className={theme.sectionTitleStyle}>Skills</h2>
          <div className={theme.sectionContentStyle}>
            <div className="flex flex-wrap gap-2">
              {skills.featuredSkills
                .filter((s) => s.skill)
                .map((skill, idx) => (
                  <span key={idx} className="rounded bg-gray-200 px-2 py-1 text-xs">
                    {skill.skill}
                  </span>
                ))}
            </div>
            {skills.descriptions.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {skills.descriptions.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
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

// Reactive-Resume style preview
const ReactiveResumePreview = ({ templateId }: { templateId: string }) => {
  const resume = useAppSelector(selectResume);
  const templateName = templateId.replace("reactive-", "");
  const template = getTemplateById(templateId);
  const color = (template && 'color' in template ? template.color : "#3b82f6") as string;
  
  const { profile, workExperiences, educations, projects, skills } = resume;

  return (
    <div className="h-full bg-white p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center border-b-2 pb-4 text-center" style={{ borderColor: color }}>
        <h1 className="text-3xl font-bold uppercase tracking-wider" style={{ color }}>
          {profile.name || "Your Name"}
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-600">{profile.summary}</p>
        
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          {profile.email && <span className="flex items-center gap-1">✉ {profile.email}</span>}
          {profile.phone && <span className="flex items-center gap-1">☏ {profile.phone}</span>}
          {profile.location && <span className="flex items-center gap-1">⌂ {profile.location}</span>}
          {profile.url && <span className="flex items-center gap-1">🔗 {profile.url}</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Work Experience */}
          {workExperiences.length > 0 && workExperiences[0].company && (
            <section>
              <h2 className="mb-3 border-b pb-1 text-lg font-bold" style={{ borderColor: `${color}40`, color }}>
                Experience
              </h2>
              <div className="space-y-4">
                {workExperiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-gray-800">{exp.jobTitle}</h3>
                      <span className="text-xs font-medium" style={{ color }}>{exp.date}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{exp.company}</p>
                    {exp.descriptions.length > 0 && (
                      <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                        {exp.descriptions.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && projects[0].project && (
            <section>
              <h2 className="mb-3 border-b pb-1 text-lg font-bold" style={{ borderColor: `${color}40`, color }}>
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-gray-800">{proj.project}</h3>
                      <span className="text-xs font-medium" style={{ color }}>{proj.date}</span>
                    </div>
                    {proj.descriptions.length > 0 && (
                      <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                        {proj.descriptions.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-1 space-y-6">
          {/* Education */}
          {educations.length > 0 && educations[0].school && (
            <section>
              <h2 className="mb-3 border-b pb-1 text-lg font-bold" style={{ borderColor: `${color}40`, color }}>
                Education
              </h2>
              <div className="space-y-3">
                {educations.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-xs font-medium" style={{ color }}>{edu.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.featuredSkills.some((s) => s.skill) && (
            <section>
              <h2 className="mb-3 border-b pb-1 text-lg font-bold" style={{ borderColor: `${color}40`, color }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.featuredSkills
                  .filter((s) => s.skill)
                  .map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {skill.skill}
                    </span>
                  ))}
              </div>
              {skills.descriptions.length > 0 && (
                <ul className="mt-3 list-disc pl-5 text-sm text-gray-600">
                  {skills.descriptions.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomHTMLPreview = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  
  // Very basic mustache/handlebars style interpolation
  const interpolate = (html: string, data: any) => {
    let result = html;
    
    // Replace loops: {{#array}} ... {{/array}}
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

    // Replace basic variables: {{profile.name}}
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
      <div 
        dangerouslySetInnerHTML={{ __html: parsedHTML }} 
      />
    </div>
  );
};

export const TemplatePreview = () => {
  const settings = useAppSelector(selectSettings);
  const { templateSettings } = settings;
  const { activeTemplate } = templateSettings;

  const template = getTemplateById(activeTemplate);

  const renderPreview = () => {
    if (activeTemplate === "custom-html") {
      return <CustomHTMLPreview />;
    }

    if (!template) {
      return <LegacyPreview />;
    }

    switch (template.source) {
      case "impact-cv":
        return <ImpactCVPreview themeId={activeTemplate} />;
      case "legacy":
        return <LegacyPreview />;
      case "reactive-resume":
        return <ReactiveResumePreview templateId={activeTemplate} />;
      default:
        return <LegacyPreview />;
    }
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
        {renderPreview()}
      </div>
    </div>
  );
};
