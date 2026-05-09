import { useCallback, useEffect, useState } from "react";
import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import { InlineInput } from "components/ResumeForm/ThemeForm/InlineInput";
import {
  DocumentSizeSelections,
  FontFamilySelectionsCSR,
  FontSizeSelections,
} from "components/ResumeForm/ThemeForm/Selection";
import {
  changeSettings,
  changeActiveTemplate,
  DEFAULT_THEME_COLOR,
  selectSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { fetchAPI } from "lib/api";
import { useTemplateStore } from "lib/stores/templateStore";
import type { FontFamily } from "components/fonts/constants";
import {
  Cog6ToothIcon,
  ViewColumnsIcon,
  AdjustmentsHorizontalIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  PrinterIcon,
  SwatchIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { TemplateSelector } from "./TemplateSelector";
import { SuggestionSystem } from "./SuggestionSystem";
import { TemplateSettings } from "./TemplateSettings";
import { ColorPanel } from "./ColorPanel";
import { TypographyPanel } from "./TypographyPanel";
import { LayoutPanel } from "./LayoutPanel";
import { ContentPanel } from "./ContentPanel";
import { PrintPanel } from "./PrintPanel";
import { ThemePresetSelector } from "./ThemePresetSelector";

type Tab =
  | "templates"
  | "presets"
  | "colors"
  | "typography"
  | "layout"
  | "content"
  | "print"
  | "custom_code";

const TABS: { id: Tab; label: string; icon: JSX.Element }[] = [
  { id: "templates", label: "Templates", icon: <ViewColumnsIcon className="h-4 w-4" /> },
  { id: "presets", label: "Presets", icon: <SwatchIcon className="h-4 w-4" /> },
  { id: "colors", label: "Colors", icon: <PaintBrushIcon className="h-4 w-4" /> },
  { id: "typography", label: "Typography", icon: <DocumentTextIcon className="h-4 w-4" /> },
  { id: "layout", label: "Layout", icon: <Squares2X2Icon className="h-4 w-4" /> },
  { id: "content", label: "Content", icon: <AdjustmentsHorizontalIcon className="h-4 w-4" /> },
  { id: "print", label: "Print & A11y", icon: <PrinterIcon className="h-4 w-4" /> },
  { id: "custom_code", label: "</> Code", icon: <Cog6ToothIcon className="h-4 w-4" /> },
];

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, documentSize, customHTML, customCSS } = settings;
  const activeTemplate = settings.templateSettings.activeTemplate;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();
  const { setActiveTemplate: setStoreActiveTemplate } = useTemplateStore();
  const [activeTab, setActiveTab] = useState<Tab>("templates");
  const [templateVariables, setTemplateVariables] = useState<{
    variables?: Record<string, Record<string, { example?: string; description?: string }>>;
    usage?: Record<string, string>;
    starterTemplates?: Record<string, { html: string; css: string }>;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTemplateVariables = async () => {
      try {
        const data = await fetchAPI<{ success: boolean; data?: any }>("/api/templates/variables");

        if (isMounted && data?.success) {
          setTemplateVariables(data.data);
        }
      } catch (error) {
        console.error("Failed to load template variables:", error);
      }
    };

    loadTemplateVariables();

    return () => {
      isMounted = false;
    };
  }, []);

  const ensureCustomTemplate = useCallback(() => {
    if (activeTemplate === "custom-html") return;
    setStoreActiveTemplate("custom-html");
    dispatch(changeActiveTemplate("custom-html"));
  }, [activeTemplate, dispatch, setStoreActiveTemplate]);

  useEffect(() => {
    if (activeTab === "custom_code") {
      ensureCustomTemplate();
    }
  }, [activeTab, ensureCustomTemplate]);

  const applyStarter = (starter: "sleek" | "minimal") => {
    ensureCustomTemplate();
    const starterHTML =
      starter === "sleek"
        ? `<div class="cv-shell">\n  <header class="cv-hero">\n    <h1>{{profile.name}}</h1>\n    <p class="cv-role">{{profile.summary}}</p>\n    <p class="cv-meta">{{profile.email}} · {{profile.phone}} · {{profile.location}}</p>\n  </header>\n\n  <section>\n    <h2>Experience</h2>\n    {{#workExperiences}}\n      <article class="cv-card">\n        <h3>{{jobTitle}}</h3>\n        <p class="cv-company">{{company}} · {{date}}</p>\n      </article>\n    {{/workExperiences}}\n  </section>\n\n  <section>\n    <h2>Projects</h2>\n    {{#projects}}\n      <article class="cv-card">\n        <h3>{{project}}</h3>\n      </article>\n    {{/projects}}\n  </section>\n</div>`
        : `<div class="minimal-cv">\n  <h1>{{profile.name}}</h1>\n  <p>{{profile.summary}}</p>\n\n  <h2>Experience</h2>\n  {{#workExperiences}}\n    <p><strong>{{jobTitle}}</strong> — {{company}} ({{date}})</p>\n  {{/workExperiences}}\n</div>`;

    const starterCSS =
      starter === "sleek"
        ? `.cv-shell {\n  padding: 2.5rem;\n  background: linear-gradient(180deg, #0f172a 0, #111827 220px, #ffffff 220px);\n  color: #0f172a;\n  min-height: 100%;\n  font-family: "Space Grotesk", "Segoe UI", sans-serif;\n}\n\n.cv-hero {\n  color: #f8fafc;\n  margin-bottom: 2rem;\n}\n\n.cv-hero h1 {\n  font-size: 2.4rem;\n  letter-spacing: -0.02em;\n}\n\n.cv-role {\n  opacity: 0.9;\n  margin-top: 0.25rem;\n}\n\n.cv-meta {\n  opacity: 0.75;\n  font-size: 0.9rem;\n}\n\nsection {\n  margin-top: 1.5rem;\n}\n\nsection h2 {\n  border-bottom: 2px solid #0f172a;\n  padding-bottom: 0.35rem;\n  margin-bottom: 0.75rem;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  font-size: 0.8rem;\n}\n\n.cv-card {\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  padding: 0.85rem 1rem;\n  margin-bottom: 0.65rem;\n  background: #ffffff;\n  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);\n}\n\n.cv-company {\n  color: #475569;\n  font-size: 0.9rem;\n}`
        : `.minimal-cv {\n  padding: 2rem;\n  font-family: "Sora", "Segoe UI", sans-serif;\n  color: #111827;\n}\n\nh1 {\n  margin: 0 0 0.5rem;\n}\n\nh2 {\n  margin-top: 1.5rem;\n  font-size: 0.95rem;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n}`;

    dispatch(changeSettings({ field: "customHTML" as GeneralSetting, value: starterHTML }));
    dispatch(changeSettings({ field: "customCSS" as GeneralSetting, value: starterCSS }));
  };

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-5">
        {/* ─── Header ───────────────────────── */}
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-wide text-gray-900">
            Customization Studio
          </h1>
        </div>

        {/* ─── Tab Navigation — Scrollable Horizontal ─── */}
        <div className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── Tab Content ──────────────────── */}
        <div className="min-h-[300px]">
          {activeTab === "templates" && <TemplateSelector />}
          {activeTab === "presets" && <ThemePresetSelector />}
          {activeTab === "colors" && <ColorPanel />}
          {activeTab === "typography" && <TypographyPanel />}
          {activeTab === "layout" && <LayoutPanel />}
          {activeTab === "content" && <ContentPanel />}
          {activeTab === "print" && <PrintPanel />}
          {activeTab === "custom_code" && (
            <div className="code-studio-panel flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-slate-900">Live HTML/CSS Studio</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Overleaf-style editing: write code on the left, instant template update on the right preview.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applyStarter("sleek")}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    Starter: Sleek
                  </button>
                  <button
                    type="button"
                    onClick={() => applyStarter("minimal")}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    Starter: Minimal
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 font-semibold text-white">Backend-driven</span>
                  <span className="rounded-full bg-teal-100 px-2.5 py-1 font-semibold text-teal-700">Custom HTML</span>
                  <span className="rounded-full bg-sky-100 px-2.5 py-1 font-semibold text-sky-700">Custom CSS</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-700">Live Preview</span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-slate-500">
                  The backend exposes the same placeholder catalog the renderer uses, so your HTML can be as free-form as an Overleaf template while still rendering against structured resume data.
                </p>
              </div>

              {templateVariables?.variables && (
                <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm xl:grid-cols-2">
                  {Object.entries(templateVariables.variables).slice(0, 2).map(([groupName, group]) => (
                    <div key={groupName} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{groupName}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(group).slice(0, 5).map(([fieldName, fieldMeta]) => (
                          <span
                            key={fieldName}
                            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700"
                            title={fieldMeta.description}
                          >
                            {fieldMeta.example || `{{${groupName}.${fieldName}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    HTML
                  </label>
                  <textarea
                    className="code-editor-textarea h-72 w-full rounded-lg border border-slate-200 bg-slate-950 p-3 font-mono text-xs leading-6 text-slate-100 outline-none"
                    value={customHTML}
                    onChange={(e) => handleSettingsChange("customHTML" as GeneralSetting, e.target.value)}
                    spellCheck={false}
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    CSS
                  </label>
                  <textarea
                    className="code-editor-textarea h-72 w-full rounded-lg border border-slate-200 bg-slate-950 p-3 font-mono text-xs leading-6 text-slate-100 outline-none"
                    value={customCSS}
                    onChange={(e) => handleSettingsChange("customCSS" as GeneralSetting, e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </div>

              {templateVariables?.usage && (
                <div className="rounded-xl border border-slate-200 bg-slate-950 px-3 py-3 text-xs text-slate-100 shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold tracking-wide text-white">Template syntax</p>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-300">Mustache-style blocks</span>
                  </div>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {Object.entries(templateVariables.usage).map(([name, syntax]) => (
                      <div key={name} className="rounded-lg bg-white/5 px-2 py-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{name}</p>
                        <code className="mt-1 block break-all font-mono text-[11px] text-teal-200">{syntax}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Pro tip: choose <span className="font-semibold">Custom HTML</span> in the Templates tab to keep this editor and preview fully synced.
              </div>
            </div>
          )}
        </div>

        {/* ─── Legacy Quick Settings — collapsed by default ─── */}
        <details className="border-t border-gray-200 pt-3">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
            Quick Settings (Legacy)
          </summary>
          <div className="mt-3 flex flex-col gap-4">
            <div>
              <InlineInput
                label="Theme Color"
                name="themeColor"
                value={settings.themeColor}
                placeholder={DEFAULT_THEME_COLOR}
                onChange={handleSettingsChange}
                inputStyle={{ color: themeColor }}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {THEME_COLORS.map((color, idx) => (
                  <div
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm text-white"
                    style={{ backgroundColor: color }}
                    key={idx}
                    onClick={() => handleSettingsChange("themeColor", color)}
                    onKeyDown={(e) => {
                      if (["Enter", " "].includes(e.key))
                        handleSettingsChange("themeColor", color);
                    }}
                    tabIndex={0}
                  >
                    {settings.themeColor === color ? "✓" : ""}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <InputGroupWrapper label="Font Family" />
              <FontFamilySelectionsCSR
                selectedFontFamily={fontFamily}
                themeColor={themeColor}
                handleSettingsChange={handleSettingsChange}
              />
            </div>
            <div>
              <InlineInput
                label="Font Size (pt)"
                name="fontSize"
                value={fontSize}
                placeholder="11"
                onChange={handleSettingsChange}
              />
              <FontSizeSelections
                fontFamily={fontFamily as FontFamily}
                themeColor={themeColor}
                selectedFontSize={fontSize}
                handleSettingsChange={handleSettingsChange}
              />
            </div>
            <div>
              <InputGroupWrapper label="Document Size" />
              <DocumentSizeSelections
                themeColor={themeColor}
                selectedDocumentSize={documentSize}
                handleSettingsChange={handleSettingsChange}
              />
            </div>
          </div>
        </details>
      </div>
    </BaseForm>
  );
};
