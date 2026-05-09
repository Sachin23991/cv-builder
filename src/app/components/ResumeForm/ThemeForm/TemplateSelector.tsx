"use client";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeActiveTemplate, selectTemplateSettings } from "lib/redux/settingsSlice";
import { useTemplateStore } from "lib/stores/templateStore";
import { templateRegistry } from "lib/templates";
import {
  CodeBracketIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const TEMPLATE_META = {
  "modern-html": {
    icon: <DocumentTextIcon className="h-7 w-7" />,
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
    badge: "Recommended",
    badgeColor: "bg-emerald-100 text-emerald-700",
    features: ["Live preview", "Full customization", "ATS-friendly", "PDF export"],
  },
  "custom-html": {
    icon: <CodeBracketIcon className="h-7 w-7" />,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    badge: "Advanced",
    badgeColor: "bg-amber-100 text-amber-700",
    features: ["Custom HTML/CSS", "Mustache syntax", "Overleaf-style", "Full control"],
  },
} as const;

export const TemplateSelector = () => {
  const dispatch = useAppDispatch();
  const ts = useAppSelector(selectTemplateSettings);
  const { setActiveTemplate: setStoreTemplate } = useTemplateStore();

  const activeId = ts.activeTemplate;

  const selectTemplate = (id: string) => {
    setStoreTemplate(id);
    dispatch(changeActiveTemplate(id));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Template Engine</h3>
        <p className="mt-1 text-xs text-gray-500">
          Choose your rendering engine. Use <strong>Presets</strong> tab for visual styles.
        </p>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 gap-4">
        {templateRegistry.map((template) => {
          const isActive = activeId === template.id;
          const meta = TEMPLATE_META[template.id as keyof typeof TEMPLATE_META];
          if (!meta) return null;

          return (
            <button
              key={template.id}
              onClick={() => selectTemplate(template.id)}
              className={`group relative flex flex-col gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                isActive
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-300"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md ${meta.glow}`}>
                    {meta.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{template.name}</h4>
                    <p className="mt-0.5 text-xs text-gray-500">{template.description}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${meta.badgeColor}`}>
                  {meta.badge}
                </span>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {meta.features.map((f) => (
                  <span key={f} className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                    isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {f}
                  </span>
                ))}
              </div>

              {/* Active checkmark */}
              {isActive && (
                <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info callout */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
        <strong>💡 Tip:</strong> The <strong>Modern HTML</strong> engine responds to all settings in the Colors, Typography, Layout, and Content panels. 
        Switch to the <strong>Presets</strong> tab for instant visual makeovers.
      </div>
    </div>
  );
};
