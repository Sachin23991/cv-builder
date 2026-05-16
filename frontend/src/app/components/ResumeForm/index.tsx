"use client";
import { useState, lazy, Suspense } from "react";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import { ShowForm, selectFormsOrder } from "lib/redux/settingsSlice";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { cx } from "lib/cx";

// Lazy load form components
const WorkExperiencesForm = lazy(() =>
  import("components/ResumeForm/WorkExperiencesForm").then((mod) => ({
    default: mod.WorkExperiencesForm,
  }))
);
const EducationsForm = lazy(() =>
  import("components/ResumeForm/EducationsForm").then((mod) => ({
    default: mod.EducationsForm,
  }))
);
const ProjectsForm = lazy(() =>
  import("components/ResumeForm/ProjectsForm").then((mod) => ({
    default: mod.ProjectsForm,
  }))
);
const SkillsForm = lazy(() =>
  import("components/ResumeForm/SkillsForm").then((mod) => ({
    default: mod.SkillsForm,
  }))
);
const CustomForm = lazy(() =>
  import("components/ResumeForm/CustomForm").then((mod) => ({
    default: mod.CustomForm,
  }))
);

const formTypeToComponent: { [type in ShowForm]?: any } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={cx(
        "flex w-full justify-start",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex w-full max-w-none min-w-0 flex-col gap-6 p-[var(--resume-padding)]">
        <ProfileForm />
        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          if (!Component) return null;
          return (
            <Suspense key={form} fallback={<div className="h-24" />}>
              <Component />
            </Suspense>
          );
        })}
        <ThemeForm />
        <br />
      </section>
    </div>
  );
};
