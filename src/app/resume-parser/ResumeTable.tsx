"use client";
import { Fragment } from "react";
import type { Resume } from "lib/redux/types";
import { initialEducation, initialWorkExperience } from "lib/redux/resumeSlice";
import { deepClone } from "lib/deep-clone";

/* ─── Score Calculator ─────────────────────────────────────── */
function computeParseScore(resume: Resume): number {
  let score = 0;
  const max = 100;

  // Profile fields (50 pts total)
  if (resume?.profile?.name) score += 15;
  if (resume?.profile?.email) score += 12;
  if (resume?.profile?.phone) score += 8;
  if (resume?.profile?.location) score += 5;
  if (resume?.profile?.url) score += 5;
  if (resume?.profile?.summary && resume.profile.summary.length > 20) score += 5;

  // Work experience (25 pts)
  const hasWork = (resume?.workExperiences?.length || 0) > 0 && resume.workExperiences[0]?.company;
  if (hasWork) {
    score += 10;
    const descriptionsCount = resume.workExperiences.reduce((a, w) => a + (w?.descriptions?.length || 0), 0);
    score += Math.min(15, descriptionsCount * 3);
  }

  // Education (15 pts)
  const hasEdu = (resume?.educations?.length || 0) > 0 && resume.educations[0]?.school;
  if (hasEdu) {
    score += 8;
    if (resume.educations[0]?.degree) score += 4;
    if (resume.educations[0]?.gpa) score += 3;
  }

  // Skills (10 pts)
  const skillCount = (resume?.skills?.featuredSkills?.filter(s => s?.skill?.trim()).length || 0) + (resume?.skills?.descriptions?.length || 0);
  score += Math.min(10, skillCount * 2);

  return Math.min(max, score);
}

/* ─── Score Ring Component ─────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Poor";
  const bgColor = score >= 80 ? "from-emerald-50 to-emerald-100/50 border-emerald-200" : score >= 50 ? "from-amber-50 to-amber-100/50 border-amber-200" : "from-red-50 to-red-100/50 border-red-200";

  return (
    <div className={`flex items-center gap-5 rounded-2xl border bg-gradient-to-br p-5 ${bgColor}`}>
      <div className="parser-score-circle">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5" />
          <circle
            cx="32" cy="32" r={radius} fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        </svg>
        <div className="score-text">
          <span className="score-number">{score}</span>
          <span className="score-label">Score</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-extrabold text-gray-900">{label} Parse Quality</p>
        <p className="mt-1 text-xs text-gray-500">
          {score >= 80
            ? "Your resume parsed beautifully. ATS systems will read it well."
            : score >= 50
            ? "Most fields parsed correctly. Consider improving formatting."
            : "Many fields missing. Try a simpler, single-column format."}
        </p>
        <div className="mt-2 flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-0.5 text-[10px] font-bold text-gray-600">
            📋 {score >= 80 ? "ATS Ready" : score >= 50 ? "Needs Polish" : "Reformat"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Section Header ───────────────────────────────────────── */
const SectionHeader = ({ icon, label, count }: { icon: string; label: string; count?: number }) => (
  <tr className="section-header">
    <td colSpan={2}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
        <span>{icon}</span>
        {label}
        {count !== undefined && count > 1 && (
          <span style={{
            fontSize: "9px", fontWeight: 700,
            background: "rgba(99,102,241,0.1)", color: "#6366f1",
            padding: "1px 8px", borderRadius: "999px"
          }}>
            ×{count}
          </span>
        )}
      </span>
    </td>
  </tr>
);

/* ─── Table Row ────────────────────────────────────────────── */
const FieldRow = ({ label, value }: { label: string; value: string | string[] | null | undefined }) => {
  if (value == null) {
    return (
      <tr>
        <td className="field-label">{label}</td>
        <td className="field-value empty">—</td>
      </tr>
    );
  }
  const isEmpty = typeof value === "string" ? !value.trim() : value.length === 0 || value.every(v => !v || !v.trim());
  return (
    <tr>
      <td className="field-label">{label}</td>
      <td className={`field-value ${isEmpty ? "empty" : ""}`}>
        {isEmpty ? "—" : typeof value === "string" ? value : value.filter(Boolean).map((v, i) => (
          <span key={i} className="bullet">{v}</span>
        ))}
      </td>
    </tr>
  );
};

/* ─── Main Component ───────────────────────────────────────── */
export const ResumeTable = ({ resume, aiScore }: { resume: Resume; aiScore?: number }) => {
  const educations = !resume?.educations || resume.educations.length === 0
    ? [deepClone(initialEducation)]
    : resume.educations;
  const workExperiences = !resume?.workExperiences || resume.workExperiences.length === 0
    ? [deepClone(initialWorkExperience)]
    : resume.workExperiences;
  const skills = [...(resume?.skills?.descriptions || [])];
  const featuredSkills = (resume?.skills?.featuredSkills || [])
    .filter((item) => item?.skill?.trim())
    .map((item) => item.skill)
    .join(", ")
    .trim();
  if (featuredSkills) skills.unshift(featuredSkills);

  const score = aiScore !== undefined ? aiScore : computeParseScore(resume);
  
  const projects = resume?.projects || [];

  return (
    <div className="flex flex-col gap-5">
      {/* Parse Score */}
      <ScoreRing score={score} />

      {/* Results Table */}
      <table className="parser-table">
        <thead>
          <tr>
            <th style={{ width: "120px" }}>Field</th>
            <th>Parsed Value</th>
          </tr>
        </thead>
        <tbody>
          {/* Profile */}
          <SectionHeader icon="👤" label="Profile" />
          <FieldRow label="Name" value={resume.profile.name} />
          <FieldRow label="Email" value={resume.profile.email} />
          <FieldRow label="Phone" value={resume.profile.phone} />
          <FieldRow label="Location" value={resume.profile.location} />
          <FieldRow label="URL" value={resume.profile.url} />
          <FieldRow label="Summary" value={resume.profile.summary} />

          {/* Education */}
          <SectionHeader icon="🎓" label="Education" count={educations.length} />
          {educations.map((edu, idx) => (
            <Fragment key={idx}>
              <FieldRow label="School" value={edu.school} />
              <FieldRow label="Degree" value={edu.degree} />
              <FieldRow label="GPA / CGPA" value={edu.gpa} />
              <FieldRow label="Date" value={edu.date} />
              <FieldRow label="Details" value={edu.descriptions} />
              {idx < educations.length - 1 && (
                <tr><td colSpan={2} style={{ padding: "0", borderBottom: "2px solid #e2e8f0" }}></td></tr>
              )}
            </Fragment>
          ))}

          {/* Work Experience */}
          <SectionHeader icon="💼" label="Work Experience" count={workExperiences.length} />
          {workExperiences.map((exp, idx) => (
            <Fragment key={idx}>
              <FieldRow label="Company" value={exp.company} />
              <FieldRow label="Job Title" value={exp.jobTitle} />
              <FieldRow label="Date" value={exp.date} />
              <FieldRow label="Descriptions" value={exp.descriptions} />
              {idx < workExperiences.length - 1 && (
                <tr><td colSpan={2} style={{ padding: "0", borderBottom: "2px solid #e2e8f0" }}></td></tr>
              )}
            </Fragment>
          ))}

          {/* Projects */}
          {projects.length > 0 && (
            <>
              <SectionHeader icon="🚀" label="Projects" count={projects.length} />
              {projects.map((proj, idx) => (
                <Fragment key={idx}>
                  <FieldRow label="Project" value={proj.project} />
                  <FieldRow label="Date" value={proj.date} />
                  <FieldRow label="Descriptions" value={proj.descriptions} />
                  {idx < projects.length - 1 && (
                    <tr><td colSpan={2} style={{ padding: "0", borderBottom: "2px solid #e2e8f0" }}></td></tr>
                  )}
                </Fragment>
              ))}
            </>
          )}

          {/* Skills */}
          <SectionHeader icon="⚡" label="Skills" />
          <FieldRow label="Skills" value={skills} />
        </tbody>
      </table>
    </div>
  );
};
