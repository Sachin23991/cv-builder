import { useState, useRef, useEffect } from "react";
import { ExpanderWithHeightTransition } from "components/ExpanderWithHeightTransition";
import {
  DeleteIconButton,
  MoveIconButton,
  ShowIconButton,
} from "components/ResumeForm/Form/IconButton";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeFormHeading,
  changeFormOrder,
  changeShowForm,
  selectHeadingByForm,
  selectIsFirstForm,
  selectIsLastForm,
  selectShowByForm,
  ShowForm,
} from "lib/redux/settingsSlice";
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  LightBulbIcon,
  WrenchIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import {
  addSectionInForm,
  deleteSectionInFormByIdx,
  moveSectionInForm,
} from "lib/redux/resumeSlice";

// ─── AI integration ───────────────────────────────────────────
const FORM_TO_AI_SECTION: { [section in ShowForm]?: string } = {
  workExperiences: "workExperience",
  educations: "education",
  projects: "project",
  skills: "skills",
  custom: "custom",
};

// Each section's attributes the user can ask AI to write
interface AttributeOption {
  key: string;
  label: string;
  icon: string;
}

const SECTION_ATTRIBUTES: { [section in ShowForm]?: AttributeOption[] } = {
  workExperiences: [
    { key: "company", label: "Company Name", icon: "🏢" },
    { key: "jobTitle", label: "Job Title", icon: "💼" },
    { key: "date", label: "Date Range", icon: "📅" },
    { key: "descriptions", label: "Description / Bullets", icon: "📝" },
  ],
  educations: [
    { key: "school", label: "School Name", icon: "🏫" },
    { key: "degree", label: "Degree", icon: "🎓" },
    { key: "gpa", label: "GPA", icon: "📊" },
    { key: "date", label: "Date Range", icon: "📅" },
    { key: "descriptions", label: "Description / Bullets", icon: "📝" },
  ],
  projects: [
    { key: "project", label: "Project Name", icon: "🚀" },
    { key: "date", label: "Date Range", icon: "📅" },
    { key: "descriptions", label: "Description / Bullets", icon: "📝" },
  ],
  skills: [
    { key: "descriptions", label: "Skills List", icon: "🛠️" },
  ],
  custom: [
    { key: "descriptions", label: "Content / Bullets", icon: "📝" },
  ],
};

export const openResumeAI = (section: string, itemIndex = 0, attribute = "descriptions") => {
  window.dispatchEvent(
    new CustomEvent("resumemaker:open-ai", {
      detail: { mode: "resume", section, itemIndex, attribute },
    })
  );
};

// ─── Sparkles SVG icon ────────────────────────────────────────
const SparklesIconSVG = ({ className = "h-3 w-3" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
    />
  </svg>
);

// ─── Ask AI Dropdown ──────────────────────────────────────────
const AskAIDropdown = ({ form, itemIndex = 0 }: { form: ShowForm; itemIndex?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const attributes = SECTION_ATTRIBUTES[form];
  const aiSection = FORM_TO_AI_SECTION[form];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
    return undefined;
  }, [isOpen]);

  if (!attributes || !aiSection) return null;

  return (
    <div ref={dropdownRef} className="ask-ai-dropdown-wrapper">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`ask-ai-trigger ${isOpen ? "ask-ai-trigger-active" : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <SparklesIconSVG className="h-3.5 w-3.5" />
        Ask AI
        <svg
          className={`ask-ai-chevron ${isOpen ? "ask-ai-chevron-open" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="ask-ai-menu" role="menu">
          <div className="ask-ai-menu-header">
            <SparklesIconSVG className="h-3.5 w-3.5 text-indigo-500" />
            <span>What should AI write?</span>
          </div>
          <div className="ask-ai-menu-items">
            {attributes.map((attr) => (
              <button
                key={attr.key}
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                  openResumeAI(aiSection, itemIndex, attr.key);
                }}
                className="ask-ai-menu-item"
              >
                <span className="ask-ai-menu-item-icon">{attr.icon}</span>
                <span className="ask-ai-menu-item-label">{attr.label}</span>
                <svg className="ask-ai-menu-item-arrow" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * BaseForm is the bare bone form, i.e. just the outline with no title and no control buttons.
 * ProfileForm uses this to compose its outline.
 */
export const BaseForm = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`flex flex-col gap-3 transition-opacity duration-200 resume-form-base ${className}`}>
    {children}
  </section>
);

const FORM_TO_ICON: { [section in ShowForm]?: typeof BuildingOfficeIcon } = {
  workExperiences: BuildingOfficeIcon,
  educations: AcademicCapIcon,
  projects: LightBulbIcon,
  skills: WrenchIcon,
  custom: WrenchIcon,
};

export const Form = ({
  form,
  addButtonText,
  children,
}: {
  form: ShowForm;
  addButtonText?: string;
  children: React.ReactNode;
}) => {
  const showForm = useAppSelector(selectShowByForm(form));
  const heading = useAppSelector(selectHeadingByForm(form));

  const dispatch = useAppDispatch();
  const setShowForm = (showForm: boolean) => {
    dispatch(changeShowForm({ field: form, value: showForm }));
  };
  const setHeading = (heading: string) => {
    dispatch(changeFormHeading({ field: form, value: heading }));
  };

  const isFirstForm = useAppSelector(selectIsFirstForm(form));
  const isLastForm = useAppSelector(selectIsLastForm(form));

  const handleMoveClick = (type: "up" | "down") => {
    dispatch(changeFormOrder({ form, type }));
  };

  const Icon = FORM_TO_ICON[form];
  if (!Icon) return null;

  return (
    <BaseForm
      className={`transition-opacity duration-200 ${
        showForm ? "pb-6" : "pb-2 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex grow items-center gap-2">
          <Icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <input
            type="text"
            className="block w-full resume-input text-lg font-semibold tracking-wide outline-none"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="Section title"
          />
        </div>
        <div className="flex items-center gap-0.5">
          {/* Single "Ask AI" dropdown for the whole section */}
          <AskAIDropdown form={form} />
          {!isFirstForm && (
            <MoveIconButton type="up" onClick={handleMoveClick} />
          )}
          {!isLastForm && (
            <MoveIconButton type="down" onClick={handleMoveClick} />
          )}
          <ShowIconButton show={showForm} setShow={setShowForm} />
        </div>
      </div>
      <ExpanderWithHeightTransition expanded={showForm}>
        {children}
      </ExpanderWithHeightTransition>
      {showForm && addButtonText && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              dispatch(addSectionInForm({ form }));
            }}
            className="flex items-center rounded-md bg-white py-2 pl-3 pr-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PlusSmallIcon
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {addButtonText}
          </button>
        </div>
      )}
    </BaseForm>
  );
};

export const FormSection = ({
  form,
  idx,
  showMoveUp,
  showMoveDown,
  showDelete,
  deleteButtonTooltipText,
  children,
}: {
  form: ShowForm;
  idx: number;
  showMoveUp: boolean;
  showMoveDown: boolean;
  showDelete: boolean;
  deleteButtonTooltipText: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const handleDeleteClick = () => {
    dispatch(deleteSectionInFormByIdx({ form, idx }));
  };
  const handleMoveClick = (direction: "up" | "down") => {
    dispatch(moveSectionInForm({ form, direction, idx }));
  };

  return (
    <>
      {idx !== 0 && (
        <div className="mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
      )}
      <div className="relative grid grid-cols-6 gap-3">
        {children}
        <div className={`absolute right-0 top-0 flex gap-0.5`}>
          {/* No per-item Ask AI button — handled at section level */}
          <div
            className={`transition-all duration-300 ${
              showMoveUp ? "" : "invisible opacity-0"
            } ${showMoveDown ? "" : "-mr-6"}`}
          >
            <MoveIconButton
              type="up"
              size="small"
              onClick={() => handleMoveClick("up")}
            />
          </div>
          <div
            className={`transition-all duration-300 ${
              showMoveDown ? "" : "invisible opacity-0"
            }`}
          >
            <MoveIconButton
              type="down"
              size="small"
              onClick={() => handleMoveClick("down")}
            />
          </div>
          <div
            className={`transition-all duration-300 ${
              showDelete ? "" : "invisible opacity-0"
            }`}
          >
            <DeleteIconButton
              onClick={handleDeleteClick}
              tooltipText={deleteButtonTooltipText}
            />
          </div>
        </div>
      </div>
    </>
  );
};
