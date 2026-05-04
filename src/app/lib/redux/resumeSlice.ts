import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import type {
  FeaturedSkill,
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
} from "lib/redux/types";
import type { ShowForm } from "lib/redux/settingsSlice";

export const initialProfile: ResumeProfile = {
  name: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  url: "",
};

export const initialWorkExperience: ResumeWorkExperience = {
  company: "",
  jobTitle: "",
  date: "",
  descriptions: [],
};

export const initialEducation: ResumeEducation = {
  school: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [],
};

export const initialProject: ResumeProject = {
  project: "",
  date: "",
  descriptions: [],
};

export const initialFeaturedSkill: FeaturedSkill = { skill: "", rating: 4 };
export const initialFeaturedSkills: FeaturedSkill[] = Array(6).fill({
  ...initialFeaturedSkill,
});
export const initialSkills: ResumeSkills = {
  featuredSkills: initialFeaturedSkills,
  descriptions: [],
};

export const initialCustom = {
  descriptions: [],
};

// Additional section initial values
export const initialLanguage = {
  id: '',
  language: '',
  fluency: '',
  level: 3,
};

export const initialInterest = {
  id: '',
  name: '',
  keywords: [] as string[],
};

export const initialAward = {
  id: '',
  title: '',
  awarder: '',
  date: '',
  description: '',
};

export const initialCertification = {
  id: '',
  title: '',
  issuer: '',
  date: '',
  description: '',
};

export const initialPublication = {
  id: '',
  title: '',
  publisher: '',
  date: '',
  description: '',
};

export const initialVolunteer = {
  id: '',
  organization: '',
  location: '',
  period: '',
  description: '',
};

export const initialReference = {
  id: '',
  name: '',
  position: '',
  phone: '',
  email: '',
  description: '',
};

export const initialProfileLink = {
  id: '',
  network: '',
  username: '',
  url: '',
};

export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [initialWorkExperience],
  educations: [initialEducation],
  projects: [initialProject],
  skills: initialSkills,
  custom: initialCustom,
  languages: [],
  interests: [],
  awards: [],
  certifications: [],
  publications: [],
  volunteer: [],
  references: [],
  profiles: [],
  customSections: [],
};

// Keep the field & value type in sync with CreateHandleChangeArgsWithDescriptions (components\ResumeForm\types.ts)
export type CreateChangeActionWithDescriptions<T> = {
  idx: number;
} & (
  | {
      field: Exclude<keyof T, "descriptions">;
      value: string;
    }
  | { field: "descriptions"; value: string[] }
);

export const resumeSlice = createSlice({
  name: "resume",
  initialState: initialResumeState,
  reducers: {
    changeProfile: (
      draft,
      action: PayloadAction<{ field: keyof ResumeProfile; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft.profile[field] = value;
    },
    changeWorkExperiences: (
      draft,
      action: PayloadAction<
        CreateChangeActionWithDescriptions<ResumeWorkExperience>
      >
    ) => {
      const { idx, field, value } = action.payload;
      const workExperience = draft.workExperiences[idx];
      (workExperience as any)[field] = value;
    },
    changeEducations: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeEducation>>
    ) => {
      const { idx, field, value } = action.payload;
      const education = draft.educations[idx];
      (education as any)[field] = value;
    },
    changeProjects: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeProject>>
    ) => {
      const { idx, field, value } = action.payload;
      const project = draft.projects[idx];
      (project as any)[field] = value;
    },
    changeSkills: (
      draft,
      action: PayloadAction<
        | { field: "descriptions"; value: string[] }
        | {
            field: "featuredSkills";
            idx: number;
            skill: string;
            rating: number;
          }
      >
    ) => {
      const { field } = action.payload;
      if (field === "descriptions") {
        const { value } = action.payload;
        draft.skills.descriptions = value;
      } else {
        const { idx, skill, rating } = action.payload;
        const featuredSkill = draft.skills.featuredSkills[idx];
        featuredSkill.skill = skill;
        featuredSkill.rating = rating;
      }
    },
    changeCustom: (
      draft,
      action: PayloadAction<{ field: "descriptions"; value: string[] }>
    ) => {
      const { value } = action.payload;
      draft.custom.descriptions = value;
    },
    changeLanguages: (
      draft,
      action: PayloadAction<{ idx: number; field: keyof typeof initialLanguage; value: string | number }>
    ) => {
      const { idx, field, value } = action.payload;
      (draft.languages[idx] as any)[field] = value;
    },
    changeInterests: (
      draft,
      action: PayloadAction<{ idx: number; field: keyof typeof initialInterest; value: string | string[] }>
    ) => {
      const { idx, field, value } = action.payload;
      (draft.interests[idx] as any)[field] = value;
    },
    changeAwards: (
      draft,
      action: PayloadAction<{ idx: number; field: keyof typeof initialAward; value: string }>
    ) => {
      const { idx, field, value } = action.payload;
      (draft.awards[idx] as any)[field] = value;
    },
    changeCertifications: (
      draft,
      action: PayloadAction<{ idx: number; field: keyof typeof initialCertification; value: string }>
    ) => {
      const { idx, field, value } = action.payload;
      (draft.certifications[idx] as any)[field] = value;
    },
    changePublications: (
      draft,
      action: PayloadAction<{ idx: number; field: keyof typeof initialPublication; value: string }>
    ) => {
      const { idx, field, value } = action.payload;
      (draft.publications[idx] as any)[field] = value;
    },
    changeVolunteer: (
      draft,
      action: PayloadAction<{ idx: number; field: keyof typeof initialVolunteer; value: string }>
    ) => {
      const { idx, field, value } = action.payload;
      (draft.volunteer[idx] as any)[field] = value;
    },
    changeReferences: (
      draft,
      action: PayloadAction<{ idx: number; field: keyof typeof initialReference; value: string }>
    ) => {
      const { idx, field, value } = action.payload;
      (draft.references[idx] as any)[field] = value;
    },
    changeProfiles: (
      draft,
      action: PayloadAction<{ idx: number; field: keyof typeof initialProfileLink; value: string }>
    ) => {
      const { idx, field, value } = action.payload;
      (draft.profiles[idx] as any)[field] = value;
    },
    addLanguage: (draft) => {
      draft.languages.push({ ...initialLanguage, id: crypto.randomUUID() });
    },
    addInterest: (draft) => {
      draft.interests.push({ ...initialInterest, id: crypto.randomUUID() });
    },
    addAward: (draft) => {
      draft.awards.push({ ...initialAward, id: crypto.randomUUID() });
    },
    addCertification: (draft) => {
      draft.certifications.push({ ...initialCertification, id: crypto.randomUUID() });
    },
    addPublication: (draft) => {
      draft.publications.push({ ...initialPublication, id: crypto.randomUUID() });
    },
    addVolunteer: (draft) => {
      draft.volunteer.push({ ...initialVolunteer, id: crypto.randomUUID() });
    },
    addReference: (draft) => {
      draft.references.push({ ...initialReference, id: crypto.randomUUID() });
    },
    addProfile: (draft) => {
      draft.profiles.push({ ...initialProfileLink, id: crypto.randomUUID() });
    },
    deleteLanguage: (draft, action: PayloadAction<number>) => {
      draft.languages.splice(action.payload, 1);
    },
    deleteInterest: (draft, action: PayloadAction<number>) => {
      draft.interests.splice(action.payload, 1);
    },
    deleteAward: (draft, action: PayloadAction<number>) => {
      draft.awards.splice(action.payload, 1);
    },
    deleteCertification: (draft, action: PayloadAction<number>) => {
      draft.certifications.splice(action.payload, 1);
    },
    deletePublication: (draft, action: PayloadAction<number>) => {
      draft.publications.splice(action.payload, 1);
    },
    deleteVolunteer: (draft, action: PayloadAction<number>) => {
      draft.volunteer.splice(action.payload, 1);
    },
    deleteReference: (draft, action: PayloadAction<number>) => {
      draft.references.splice(action.payload, 1);
    },
    deleteProfile: (draft, action: PayloadAction<number>) => {
      draft.profiles.splice(action.payload, 1);
    },
    addSectionInForm: (draft, action: PayloadAction<{ form: ShowForm }>) => {
      const { form } = action.payload;
      switch (form) {
        case "workExperiences": {
          draft.workExperiences.push(structuredClone(initialWorkExperience));
          return draft;
        }
        case "educations": {
          draft.educations.push(structuredClone(initialEducation));
          return draft;
        }
        case "projects": {
          draft.projects.push(structuredClone(initialProject));
          return draft;
        }
      }
    },
    moveSectionInForm: (
      draft,
      action: PayloadAction<{
        form: ShowForm;
        idx: number;
        direction: "up" | "down";
      }>
    ) => {
      const { form, idx, direction } = action.payload;
      if (form !== "skills" && form !== "custom") {
        if (
          (idx === 0 && direction === "up") ||
          (idx === draft[form].length - 1 && direction === "down")
        ) {
          return draft;
        }

        const section = draft[form][idx];
        if (direction === "up") {
          draft[form][idx] = draft[form][idx - 1];
          draft[form][idx - 1] = section;
        } else {
          draft[form][idx] = draft[form][idx + 1];
          draft[form][idx + 1] = section;
        }
      }
    },
    deleteSectionInFormByIdx: (
      draft,
      action: PayloadAction<{ form: ShowForm; idx: number }>
    ) => {
      const { form, idx } = action.payload;
      if (form !== "skills" && form !== "custom") {
        draft[form].splice(idx, 1);
      }
    },
    setResume: (draft, action: PayloadAction<Resume>) => {
      return action.payload;
    },
  },
});

export const {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  changeCustom,
  changeLanguages,
  changeInterests,
  changeAwards,
  changeCertifications,
  changePublications,
  changeVolunteer,
  changeReferences,
  changeProfiles,
  addLanguage,
  addInterest,
  addAward,
  addCertification,
  addPublication,
  addVolunteer,
  addReference,
  addProfile,
  deleteLanguage,
  deleteInterest,
  deleteAward,
  deleteCertification,
  deletePublication,
  deleteVolunteer,
  deleteReference,
  deleteProfile,
  addSectionInForm,
  moveSectionInForm,
  deleteSectionInFormByIdx,
  setResume,
} = resumeSlice.actions;

export const selectResume = (state: RootState) => state.resume;
export const selectProfile = (state: RootState) => state.resume.profile;
export const selectWorkExperiences = (state: RootState) =>
  state.resume.workExperiences;
export const selectEducations = (state: RootState) => state.resume.educations;
export const selectProjects = (state: RootState) => state.resume.projects;
export const selectSkills = (state: RootState) => state.resume.skills;
export const selectCustom = (state: RootState) => state.resume.custom;

export default resumeSlice.reducer;
