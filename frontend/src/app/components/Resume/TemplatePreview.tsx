"use client";
import { useMemo } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectTemplateSettings, selectSettings } from "lib/redux/settingsSlice";
import type { TemplateSettings } from "lib/redux/types";

// ─── Style Helpers ─────────────────────────────────────────
const BULLETS: Record<string, string> = {
  circle: "•", square: "■", dash: "–", arrow: "→", checkmark: "✓", none: "",
};

function dividerStyle(type: string | undefined, color: string): React.CSSProperties {
  switch (type) {
    case "line": return { borderBottom: `2px solid ${color}40`, paddingBottom: 6, marginBottom: 10 };
    case "double-line": return { borderBottom: `4px double ${color}50`, paddingBottom: 6, marginBottom: 10 };
    case "dots": return { borderBottom: `3px dotted ${color}40`, paddingBottom: 6, marginBottom: 10 };
    case "gradient": return { borderImage: `linear-gradient(90deg, ${color}, transparent) 1`, borderBottom: "2px solid", paddingBottom: 6, marginBottom: 10 };
    default: return { marginBottom: 10 };
  }
}

function cardStyle(type: string | undefined, shadow: string | undefined): React.CSSProperties {
  const base: React.CSSProperties = {};
  switch (type) {
    case "boxed": Object.assign(base, { border: "1px solid #e2e8f0", padding: 12 }); break;
    case "rounded": Object.assign(base, { border: "1px solid #e2e8f0", borderRadius: 10, padding: 12 }); break;
    case "ghost": Object.assign(base, { border: "1px solid transparent", padding: 12, background: "rgba(0,0,0,0.02)" }); break;
    case "elevated": Object.assign(base, { borderRadius: 10, padding: 12, background: "#fff" }); break;
  }
  switch (shadow) {
    case "soft": base.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; break;
    case "medium": base.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; break;
    case "heavy": base.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; break;
  }
  return base;
}

function borderCSS(type: string | undefined): string {
  switch (type) {
    case "hairline": return "1px solid #e2e8f0";
    case "thick": return "2px solid #cbd5e1";
    case "dotted": return "1px dotted #cbd5e1";
    case "dashed": return "1px dashed #cbd5e1";
    default: return "none";
  }
}

// ─── Section Heading ───────────────────────────────────────
function SectionHeading({ title, ts }: { title: string; ts: TemplateSettings }) {
  const c = ts.design.colors;
  const typ = ts.typography;
  const accent = ts.design.accentTreatment;

  const style: React.CSSProperties = {
    fontFamily: typ.heading.fontFamily,
    fontSize: typ.heading.fontSize,
    lineHeight: typ.heading.lineHeight,
    color: c.primary,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: (ts.typography.letterSpacing || 0) + 1,
    ...dividerStyle(ts.design.sectionDivider, c.primary),
  };

  if (accent === "header-bar") {
    style.background = c.primary;
    style.color = "#ffffff";
    style.padding = "4px 10px";
    style.borderRadius = 4;
    style.display = "inline-block";
    style.marginBottom = 10;
  }
  if (accent === "underline") {
    style.borderBottom = `3px solid ${c.primary}`;
  }

  return <h2 style={style}>{title}</h2>;
}

// ─── Experience Item ───────────────────────────────────────
function ExperienceItem({ exp, ts }: { exp: any; ts: TemplateSettings }) {
  const c = ts.design.colors;
  const typ = ts.typography;
  const content = ts.content;
  const bullet = BULLETS[content?.bulletStyle || "circle"];
  const bold = content?.emphasisRules?.boldRole !== false;
  const italic = content?.emphasisRules?.italicOrg || false;

  return (
    <div style={{ marginBottom: ts.typography.body.fontSize * 1.2, ...cardStyle(ts.design.cardStyle, ts.design.shadowLevel) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
        <h3 style={{ fontFamily: typ.heading.fontFamily, fontSize: typ.body.fontSize + 1, fontWeight: bold ? 600 : 400, color: c.text }}>
          {exp.jobTitle}
        </h3>
        {content?.datePlacement !== "below" && (
          <span style={{ fontSize: ts.typography.small?.fontSize || 9, color: c.muted || "#64748b", fontWeight: 500, flexShrink: 0 }}>
            {exp.date}
          </span>
        )}
      </div>
      <p style={{ fontSize: typ.body.fontSize, color: c.secondary || c.muted || "#475569", fontStyle: italic ? "italic" : "normal" }}>
        {exp.company}{exp.location ? ` · ${exp.location}` : ""}
      </p>
      {content?.datePlacement === "below" && (
        <p style={{ fontSize: ts.typography.small?.fontSize || 9, color: c.muted || "#64748b" }}>{exp.date}</p>
      )}
      {exp.descriptions?.length > 0 && (
        <ul style={{ marginTop: 4, paddingLeft: bullet ? 16 : 0, listStyle: "none", fontSize: typ.body.fontSize, lineHeight: typ.body.lineHeight, color: c.text }}>
          {exp.descriptions.map((d: string, i: number) => (
            <li key={i} style={{ marginBottom: 2 }}>
              {bullet && <span style={{ marginRight: 6, color: c.primary }}>{bullet}</span>}
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Education Item ────────────────────────────────────────
function EducationItem({ edu, ts }: { edu: any; ts: TemplateSettings }) {
  const c = ts.design.colors;
  const typ = ts.typography;
  return (
    <div style={{ marginBottom: typ.body.fontSize, ...cardStyle(ts.design.cardStyle, ts.design.shadowLevel) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ fontFamily: typ.heading.fontFamily, fontSize: typ.body.fontSize + 1, fontWeight: 600, color: c.text }}>{edu.degree}</h3>
        <span style={{ fontSize: ts.typography.small?.fontSize || 9, color: c.muted || "#64748b" }}>{edu.date}</span>
      </div>
      <p style={{ fontSize: typ.body.fontSize, color: c.secondary || "#475569" }}>{edu.school}</p>
      {edu.gpa && <p style={{ fontSize: ts.typography.small?.fontSize || 9, color: c.muted || "#64748b" }}>GPA: {edu.gpa}</p>}
      {edu.descriptions?.length > 0 && (
        <ul style={{ marginTop: 3, paddingLeft: 16, listStyle: "none", fontSize: typ.body.fontSize - 1, color: c.text }}>
          {edu.descriptions.map((d: string, i: number) => <li key={i}>• {d}</li>)}
        </ul>
      )}
    </div>
  );
}

// ─── Project Item ──────────────────────────────────────────
function ProjectItem({ proj, ts }: { proj: any; ts: TemplateSettings }) {
  const c = ts.design.colors;
  const typ = ts.typography;
  const bullet = BULLETS[ts.content?.bulletStyle || "circle"];
  return (
    <div style={{ marginBottom: typ.body.fontSize, ...cardStyle(ts.design.cardStyle, ts.design.shadowLevel) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ fontFamily: typ.heading.fontFamily, fontSize: typ.body.fontSize + 1, fontWeight: 600, color: c.text }}>{proj.project}</h3>
        {proj.date && <span style={{ fontSize: ts.typography.small?.fontSize || 9, color: c.muted || "#64748b" }}>{proj.date}</span>}
      </div>
      {proj.descriptions?.length > 0 && (
        <ul style={{ marginTop: 3, paddingLeft: bullet ? 16 : 0, listStyle: "none", fontSize: typ.body.fontSize, lineHeight: typ.body.lineHeight, color: c.text }}>
          {proj.descriptions.map((d: string, i: number) => (
            <li key={i} style={{ marginBottom: 2 }}>
              {bullet && <span style={{ marginRight: 6, color: c.primary }}>{bullet}</span>}{d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Skills Section ────────────────────────────────────────
function SkillsSection({ skills, ts }: { skills: any; ts: TemplateSettings }) {
  const c = ts.design.colors;
  const typ = ts.typography;
  const style = ts.content?.skillBarStyle || "chips";
  const featured = skills.featuredSkills?.filter((s: any) => s.skill) || [];
  if (featured.length === 0 && (!skills.descriptions || skills.descriptions.length === 0)) return null;

  return (
    <div>
      {style === "chips" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {featured.map((s: any, i: number) => (
            <span key={i} style={{
              padding: "3px 10px", borderRadius: 20, fontSize: typ.body.fontSize - 1,
              fontWeight: 500, background: `${c.primary}15`, color: c.primary, border: `1px solid ${c.primary}30`,
            }}>{s.skill}</span>
          ))}
        </div>
      )}
      {style === "bar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {featured.map((s: any, i: number) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: typ.body.fontSize - 1, color: c.text, marginBottom: 2 }}>
                <span>{s.skill}</span>
                <span style={{ color: c.muted || "#94a3b8" }}>{s.rating}/5</span>
              </div>
              <div style={{ height: 5, background: `${c.primary}20`, borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${(s.rating / 5) * 100}%`, background: c.primary, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {style === "dots" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {featured.map((s: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: typ.body.fontSize - 1 }}>
              <span style={{ flex: 1, color: c.text }}>{s.skill}</span>
              <div style={{ display: "flex", gap: 3 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} style={{ width: 8, height: 8, borderRadius: "50%", background: n <= s.rating ? c.primary : `${c.primary}20` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {skills.descriptions?.length > 0 && (
        <div style={{ marginTop: 8, fontSize: typ.body.fontSize, color: c.text }}>
          {skills.descriptions.map((d: string, i: number) => d && <p key={i} style={{ marginBottom: 3 }}>• {d}</p>)}
        </div>
      )}
    </div>
  );
}

// ─── Simple List Sections ──────────────────────────────────
function LanguagesSection({ languages, ts }: { languages: any[]; ts: TemplateSettings }) {
  if (!languages?.length) return null;
  const c = ts.design.colors;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: ts.typography.body.fontSize }}>
      {languages.map((l: any, i: number) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", color: c.text }}>
          <span>{l.language}</span>
          <span style={{ color: c.muted || "#94a3b8", fontSize: ts.typography.small?.fontSize || 9 }}>{l.fluency}</span>
        </div>
      ))}
    </div>
  );
}

function CertsSection({ items, ts }: { items: any[]; ts: TemplateSettings }) {
  if (!items?.length) return null;
  return (
    <div style={{ fontSize: ts.typography.body.fontSize, color: ts.design.colors.text }}>
      {items.map((c: any, i: number) => (
        <div key={i} style={{ marginBottom: 6 }}>
          <div style={{ fontWeight: 600 }}>{c.title}</div>
          <div style={{ fontSize: ts.typography.small?.fontSize || 9, color: ts.design.colors.muted || "#94a3b8" }}>{c.issuer} · {c.date}</div>
        </div>
      ))}
    </div>
  );
}

function AwardsSection({ items, ts }: { items: any[]; ts: TemplateSettings }) {
  if (!items?.length) return null;
  return (
    <div style={{ fontSize: ts.typography.body.fontSize, color: ts.design.colors.text }}>
      {items.map((a: any, i: number) => (
        <div key={i} style={{ marginBottom: 6 }}>
          <div style={{ fontWeight: 600 }}>{a.title}</div>
          <div style={{ fontSize: ts.typography.small?.fontSize || 9, color: ts.design.colors.muted || "#94a3b8" }}>{a.awarder} · {a.date}</div>
        </div>
      ))}
    </div>
  );
}

function PublicationsSection({ items, ts }: { items: any[]; ts: TemplateSettings }) {
  if (!items?.length) return null;
  return (
    <div style={{ fontSize: ts.typography.body.fontSize, color: ts.design.colors.text }}>
      {items.map((p: any, i: number) => (
        <div key={i} style={{ marginBottom: 6 }}>
          <div style={{ fontWeight: 600 }}>{p.title}</div>
          <div style={{ fontSize: ts.typography.small?.fontSize || 9, color: ts.design.colors.muted || "#94a3b8" }}>{p.publisher} · {p.date}</div>
        </div>
      ))}
    </div>
  );
}

function ProfilesSection({ items, ts }: { items: any[]; ts: TemplateSettings }) {
  if (!items?.length) return null;
  return (
    <div style={{ fontSize: ts.typography.body.fontSize, color: ts.design.colors.text }}>
      {items.map((p: any, i: number) => (
        <div key={i} style={{ marginBottom: 4 }}>
          <span style={{ fontWeight: 500 }}>{p.network}</span>
          {p.url && <span style={{ color: ts.design.colors.link || ts.design.colors.primary, marginLeft: 6, fontSize: ts.typography.small?.fontSize || 9 }}>{p.username || p.url}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Section Router ────────────────────────────────────────
function RenderSection({ sectionKey, resume, ts, headingOverrides }: {
  sectionKey: string; resume: any; ts: TemplateSettings; headingOverrides?: Record<string, string>;
}) {
  const labels: Record<string, string> = {
    summary: "Summary", experience: "Experience", education: "Education",
    projects: "Projects", skills: "Skills", languages: "Languages",
    certifications: "Certifications", awards: "Awards", publications: "Publications",
    profiles: "Profiles", volunteer: "Volunteer", references: "References",
    ...headingOverrides,
  };

  let content: React.ReactNode = null;

  switch (sectionKey) {
    case "summary":
      if (!resume.profile.summary) return null;
      content = <p style={{ fontSize: ts.typography.body.fontSize, lineHeight: ts.typography.body.lineHeight, color: ts.design.colors.text }}>{resume.profile.summary}</p>;
      break;
    case "experience":
      if (!resume.workExperiences?.length || !resume.workExperiences[0]?.company) return null;
      content = <>{resume.workExperiences.map((e: any, i: number) => <ExperienceItem key={i} exp={e} ts={ts} />)}</>;
      break;
    case "education":
      if (!resume.educations?.length || !resume.educations[0]?.school) return null;
      content = <>{resume.educations.map((e: any, i: number) => <EducationItem key={i} edu={e} ts={ts} />)}</>;
      break;
    case "projects":
      if (!resume.projects?.length || !resume.projects[0]?.project) return null;
      content = <>{resume.projects.map((p: any, i: number) => <ProjectItem key={i} proj={p} ts={ts} />)}</>;
      break;
    case "skills":
      content = <SkillsSection skills={resume.skills} ts={ts} />;
      break;
    case "languages":
      content = <LanguagesSection languages={resume.languages} ts={ts} />;
      break;
    case "certifications":
      content = <CertsSection items={resume.certifications} ts={ts} />;
      break;
    case "awards":
      content = <AwardsSection items={resume.awards} ts={ts} />;
      break;
    case "publications":
      content = <PublicationsSection items={resume.publications} ts={ts} />;
      break;
    case "profiles":
      content = <ProfilesSection items={resume.profiles} ts={ts} />;
      break;
    default:
      return null;
  }

  if (!content) return null;

  return (
    <section style={{ marginBottom: 14 }}>
      <SectionHeading title={labels[sectionKey] || sectionKey} ts={ts} />
      {content}
    </section>
  );
}

// ─── Resume Header ─────────────────────────────────────────
function ResumeHeader({ profile, ts }: { profile: any; ts: TemplateSettings }) {
  const c = ts.design.colors;
  const nameTyp = ts.typography.name;
  const headerStyle = ts.layout.headerStyle || "left-aligned";
  const isBanner = headerStyle === "banner";
  const isCentered = headerStyle === "centered" || isBanner;
  const showPhoto = ts.content?.showPhoto || false;

  const containerStyle: React.CSSProperties = {
    textAlign: isCentered ? "center" : "left",
    padding: isBanner ? "24px 20px" : "0 0 12px 0",
    background: isBanner ? c.headerBg || c.primary : "transparent",
    color: isBanner ? c.headerText || "#ffffff" : c.text,
    borderBottom: !isBanner ? `3px solid ${c.primary}` : "none",
    marginBottom: 16,
    borderRadius: isBanner ? 8 : 0,
    display: headerStyle === "split" ? "flex" : "block",
    justifyContent: headerStyle === "split" ? "space-between" : undefined,
    alignItems: headerStyle === "split" ? "center" : undefined,
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: nameTyp?.fontFamily || ts.typography.heading.fontFamily,
    fontSize: nameTyp?.fontSize || 28,
    fontWeight: nameTyp?.fontWeight || 700,
    textTransform: (nameTyp?.textTransform || "none") as React.CSSProperties["textTransform"],
    letterSpacing: ts.typography.letterSpacing || 0,
    margin: 0,
    color: isBanner ? c.headerText || "#ffffff" : c.primary,
  };

  const contactColor = isBanner ? `${c.headerText || "#ffffff"}cc` : c.muted || "#64748b";

  return (
    <div style={containerStyle}>
      {showPhoto && profile.photo && (
        <div style={{
          width: ts.content?.photoSize || 80,
          height: ts.content?.photoSize || 80,
          borderRadius: ts.content?.photoShape === "circle" ? "50%" : ts.content?.photoShape === "rounded" ? 8 : 0,
          overflow: "hidden",
          margin: isCentered ? "0 auto 10px" : "0 0 10px 0",
          border: `2px solid ${c.primary}40`,
        }}>
          <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <h1 style={nameStyle}>{profile.name || "Your Name"}</h1>
      {profile.headline && (
        <p style={{ fontSize: ts.typography.subheading?.fontSize || 12, fontWeight: 500, marginTop: 4, color: isBanner ? `${c.headerText}dd` : c.secondary || c.text }}>
          {profile.headline}
        </p>
      )}
      <div style={{
        marginTop: 8, display: "flex", flexWrap: "wrap", gap: 12,
        fontSize: ts.typography.small?.fontSize || 9, color: contactColor,
        justifyContent: isCentered ? "center" : "flex-start",
      }}>
        {profile.email && <span>✉ {profile.email}</span>}
        {profile.phone && <span>☏ {profile.phone}</span>}
        {profile.location && <span>⌂ {profile.location}</span>}
        {profile.url && <span style={{ color: isBanner ? contactColor : c.link || c.primary }}>🔗 {profile.url}</span>}
        {profile.linkedin && <span>in {profile.linkedin}</span>}
        {profile.github && <span>⌘ {profile.github}</span>}
      </div>
    </div>
  );
}

// ─── Custom HTML Preview ───────────────────────────────────
function CustomHTMLPreview() {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);

  const interpolate = (html: string, data: any) => {
    let result = html;
    const loopRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;
    result = result.replace(loopRegex, (_match, key, innerTemplate) => {
      if (Array.isArray(data[key])) {
        return data[key].map((item: any) => {
          let itemHTML = innerTemplate;
          Object.keys(item).forEach((itemKey) => {
            const val = typeof item[itemKey] === "string" ? item[itemKey] : "";
            itemHTML = itemHTML.replace(new RegExp(`\\{\\{${itemKey}\\}\\}`, "g"), val);
          });
          return itemHTML;
        }).join("");
      }
      return "";
    });
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "object" && !Array.isArray(data[key])) {
        Object.keys(data[key]).forEach((subKey) => {
          const val = typeof data[key][subKey] === "string" ? data[key][subKey] : "";
          result = result.replace(new RegExp(`\\{\\{${key}\\.${subKey}\\}\\}`, "g"), val);
        });
      }
    });
    return result;
  };

  return (
    <div className="h-full bg-white relative">
      <style>{settings.customCSS}</style>
      <div dangerouslySetInnerHTML={{ __html: interpolate(settings.customHTML, resume) }} />
    </div>
  );
}

// ─── Main TemplatePreview ──────────────────────────────────
export const TemplatePreview = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const ts = useAppSelector(selectTemplateSettings);

  // Custom HTML mode
  if (ts.activeTemplate === "custom-html") return <CustomHTMLPreview />;

  const c = ts.design.colors;
  const columns = ts.layout.columns || 1;
  const sidebarPos = ts.layout.sidebarPosition || "left";
  const mainSections = ts.layout.main?.length ? ts.layout.main : ["summary", "experience", "education", "projects", "skills"];
  const sidebarSections = ts.layout.sidebar || [];
  const hasSidebar = columns >= 2 && sidebarSections.length > 0;

  // Page-level styles
  const bgType = ts.design.background?.type;
  const pageStyle: React.CSSProperties = {
    fontFamily: ts.typography.body.fontFamily,
    fontSize: ts.typography.body.fontSize,
    lineHeight: ts.typography.body.lineHeight,
    color: c.text,
    background: bgType === "gradient" && ts.design.background?.gradient
      ? ts.design.background.gradient
      : c.background,
    minHeight: "100%",
    padding: `${ts.page.marginY || 20}px ${ts.page.marginX || 20}px`,
    letterSpacing: ts.typography.letterSpacing || 0,
  };

  // Sidebar accent bar
  const sidebarAccent = ts.design.accentTreatment === "sidebar-bar";

  // Sidebar styles
  const sidebarStyle: React.CSSProperties = {
    width: `${ts.layout.sidebarWidth || 30}%`,
    flexShrink: 0,
    padding: 16,
    background: c.sidebarBg || "#f8fafc",
    color: c.sidebarText || c.text,
    borderRadius: 8,
    borderLeft: sidebarAccent && sidebarPos === "right" ? `4px solid ${c.primary}` : undefined,
    borderRight: sidebarAccent && sidebarPos === "left" ? `4px solid ${c.primary}` : undefined,
  };

  // Override sidebar section heading colors
  const sidebarTS: TemplateSettings = {
    ...ts,
    design: {
      ...ts.design,
      colors: {
        ...c,
        text: c.sidebarText || c.text,
        primary: c.accent || c.primary,
      },
    },
  };

  return (
    <div style={pageStyle}>
      <ResumeHeader profile={resume.profile} ts={ts} />

      {hasSidebar ? (
        <div style={{ display: "flex", gap: 20, flexDirection: sidebarPos === "right" ? "row" : "row-reverse" }}>
          {/* Main Column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {mainSections.map((key) => (
              <RenderSection key={key} sectionKey={key} resume={resume} ts={ts} />
            ))}
          </div>
          {/* Sidebar */}
          <div style={sidebarStyle}>
            {sidebarSections.map((key) => (
              <RenderSection key={key} sectionKey={key} resume={resume} ts={sidebarTS} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {mainSections.map((key) => (
            <RenderSection key={key} sectionKey={key} resume={resume} ts={ts} />
          ))}
        </div>
      )}
    </div>
  );
};