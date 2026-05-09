import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import type { Resume } from "lib/redux/types";
const stripHtml = (html: string) => {
  if (!html || !html.startsWith("<")) return html;
  // Replace block elements with newlines, remove other tags
  let text = html.replace(/<\/(p|div|li)>/ig, '\n');
  text = text.replace(/<[^>]*>?/gm, '');
  return text.trim();
};

export const generateDocx = async (resume: Resume): Promise<Blob> => {
  const children: any[] = [];

  // Profile
  if (resume.profile.name) {
    children.push(
      new Paragraph({
        text: resume.profile.name,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );
  }

  const contactInfo = [
    resume.profile.email,
    resume.profile.phone,
    resume.profile.url,
    resume.profile.location,
  ].filter(Boolean).join(" | ");

  if (contactInfo) {
    children.push(
      new Paragraph({
        text: contactInfo,
        alignment: AlignmentType.CENTER,
      })
    );
  }

  if (resume.profile.summary) {
    children.push(
      new Paragraph({
        text: stripHtml(resume.profile.summary),
        spacing: { before: 200, after: 200 },
      })
    );
  }

  // Experience
  if (resume.workExperiences.length > 0) {
    children.push(
      new Paragraph({
        text: "WORK EXPERIENCE",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    resume.workExperiences.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.jobTitle, bold: true }),
            new TextRun({ text: ` - ${exp.company}` }),
          ],
        })
      );
      children.push(
        new Paragraph({
          text: exp.date,
          italics: true,
          spacing: { after: 100 },
        })
      );
      
      const descs = exp.descriptions.length === 1 && exp.descriptions[0].startsWith("<")
        ? stripHtml(exp.descriptions[0]).split('\n').filter(Boolean)
        : exp.descriptions;
        
      descs.forEach((desc) => {
        children.push(
          new Paragraph({
            text: desc,
            bullet: { level: 0 },
          })
        );
      });
    });
  }

  // Education
  if (resume.educations.length > 0) {
    children.push(
      new Paragraph({
        text: "EDUCATION",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    resume.educations.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            new TextRun({ text: ` - ${edu.school}` }),
          ],
        })
      );
      if (edu.date || edu.gpa) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: [edu.date, edu.gpa].filter(Boolean).join(" | "), italics: true })
            ],
            spacing: { after: 100 },
          })
        );
      }
      const descs = edu.descriptions.length === 1 && edu.descriptions[0].startsWith("<")
        ? stripHtml(edu.descriptions[0]).split('\n').filter(Boolean)
        : edu.descriptions;

      descs.forEach((desc) => {
        children.push(
          new Paragraph({
            text: desc,
            bullet: { level: 0 },
          })
        );
      });
    });
  }

  // Projects
  if (resume.projects.length > 0) {
    children.push(
      new Paragraph({
        text: "PROJECTS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    resume.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.project, bold: true }),
          ],
        })
      );
      if (proj.date) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: proj.date, italics: true }),
            ],
            spacing: { after: 100 },
          })
        );
      }
      const descs = proj.descriptions.length === 1 && proj.descriptions[0].startsWith("<")
        ? stripHtml(proj.descriptions[0]).split('\n').filter(Boolean)
        : proj.descriptions;

      descs.forEach((desc) => {
        children.push(
          new Paragraph({
            text: desc,
            bullet: { level: 0 },
          })
        );
      });
    });
  }

  // Skills
  const skillsList = resume.skills.descriptions.join(", ");
  const featuredSkillsList = resume.skills.featuredSkills.map((s) => s.skill).join(", ");
  const allSkills = [featuredSkillsList, skillsList].filter(Boolean).join(", ");
  
  if (allSkills) {
    children.push(
      new Paragraph({
        text: "SKILLS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    children.push(
      new Paragraph({
        text: allSkills,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
};
