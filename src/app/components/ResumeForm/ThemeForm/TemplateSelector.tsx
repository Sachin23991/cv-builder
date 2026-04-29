"use client";
import { useState, useMemo } from "react";
import { templateRegistry, templatesByCategory, templateCount, getTemplateById } from "lib/templates";
import { useTemplateStore } from "lib/stores/templateStore";
import { SparklesIcon, ViewColumnsIcon, SwatchIcon } from "@heroicons/react/24/outline";

const categoryIcons: Record<string, JSX.Element> = {
  professional: <ViewColumnsIcon className="h-4 w-4" />,
  creative: <SparklesIcon className="h-4 w-4" />,
  academic: <SwatchIcon className="h-4 w-4" />,
  modern: <SparklesIcon className="h-4 w-4" />,
  minimal: <SwatchIcon className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  professional: "Professional",
  creative: "Creative",
  academic: "Academic",
  modern: "Modern",
  minimal: "Minimal",
};

import { useDispatch } from "react-redux";
import { changeActiveTemplate } from "lib/redux/settingsSlice";

export const TemplateSelector = () => {
  const { activeTemplate, setActiveTemplate, filterCategory, setFilterCategory, searchQuery, setSearchQuery } = useTemplateStore();
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const dispatch = useDispatch();

  const filteredTemplates = useMemo(() => {
    let templates = templateRegistry;

    if (filterCategory) {
      templates = templates.filter((t) => t.category === filterCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.source.toLowerCase().includes(query)
      );
    }

    return templates;
  }, [filterCategory, searchQuery]);

  const displayedTemplates = showAllTemplates ? filteredTemplates : filteredTemplates.slice(0, 12);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCategory(null)}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filterCategory === null
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All ({templateCount.total})
        </button>
        {Object.entries(templatesByCategory).map(([category, templates]) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {categoryIcons[category]}
            {categoryLabels[category]} ({templates.length})
          </button>
        ))}
      </div>

      {/* Source filters */}
      <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-3">
        <span className="text-xs text-gray-500">Sources:</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          Legacy: {templateCount.legacy}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          Impact-CV: {templateCount["impact-cv"]}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          Reactive: {templateCount["reactive-resume"]}
        </span>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {displayedTemplates.map((template) => {
          const isActive = activeTemplate === template.id;
          const themeConfig = template.source === "impact-cv" ? getTemplateById(template.id) : null;

          return (
            <button
              key={template.id}
              onClick={() => {
                setActiveTemplate(template.id);
                dispatch(changeActiveTemplate(template.id));
              }}
              className={`group relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                isActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {/* Preview placeholder */}
              <div className={`h-20 w-full rounded ${isActive ? "ring-2 ring-blue-500" : ""}`}>
                {template.preview ? (
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center rounded"
                    style={{ backgroundColor: template.id.includes("reactive") ? "#1a1a2e" : "#f3f4f6" }}
                  >
                    <span className="text-xs font-bold text-gray-400">{template.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Name and source */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">{template.name}</p>
                <p className="text-xs text-gray-500">{template.source.replace("-", " ")}</p>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Show more/less */}
      {filteredTemplates.length > 12 && (
        <button
          onClick={() => setShowAllTemplates(!showAllTemplates)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {showAllTemplates ? "Show less" : `Show all ${filteredTemplates.length} templates`}
        </button>
      )}
    </div>
  );
};
