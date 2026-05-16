"use client";
import { useState } from "react";
import { suggestTemplates, getQuickSuggestions, type SuggestionCriteria } from "lib/templates";
import { changeActiveTemplate } from "lib/redux/settingsSlice";
import { useTemplateStore } from "lib/stores/templateStore";
import { SparklesIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior (6-10 years)" },
  { value: "executive", label: "Executive (10+ years)" },
];

const designPreferences = [
  { value: "modern", label: "Modern & Sleek" },
  { value: "traditional", label: "Traditional & Professional" },
  { value: "creative", label: "Creative & Bold" },
  { value: "minimal", label: "Minimal & Clean" },
];

export const SuggestionSystem = () => {
  const { setActiveTemplate, setTemplatePanelOpen } = useTemplateStore();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<ReturnType<typeof getQuickSuggestions>>([]);
  const [answers, setAnswers] = useState<{
    role?: string;
    experience?: string;
    style?: string;
    ats?: boolean;
  }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSuggest = () => {
    const criteria: SuggestionCriteria = {
      experienceLevel: answers.experience as SuggestionCriteria["experienceLevel"],
      designPreference: answers.style as SuggestionCriteria["designPreference"],
      atsCompatibility: answers.ats,
    };

    const results = suggestTemplates(criteria, 5);
    if (results.length === 0) {
      setSuggestions(getQuickSuggestions());
    } else {
      setSuggestions(results);
    }
    setShowResults(true);
  };

  const handleSelectTemplate = (templateId: string) => {
    setActiveTemplate(templateId);
    dispatch(changeActiveTemplate(templateId));
    setTemplatePanelOpen(false);
  };

  const handleQuickPick = () => {
    const quick = getQuickSuggestions();
    setSuggestions(quick);
    setShowResults(true);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-gray-900">Template Suggestions</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {isExpanded ? "Hide" : "Get Suggestions"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Quick suggestions */}
          <div>
            <p className="mb-2 text-sm text-gray-600">Not sure? Get quick picks:</p>
            <button
              onClick={handleQuickPick}
              className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
            >
              Show Popular Templates
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="mb-3 text-sm font-medium text-gray-700">Or answer a few questions:</p>

            {/* Experience Level */}
            <div className="mb-3">
              <label className="mb-1 block text-sm text-gray-600">Experience Level</label>
              <select
                value={answers.experience || ""}
                onChange={(e) => setAnswers({ ...answers, experience: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select...</option>
                {experienceLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Design Preference */}
            <div className="mb-3">
              <label className="mb-1 block text-sm text-gray-600">Design Preference</label>
              <select
                value={answers.style || ""}
                onChange={(e) => setAnswers({ ...answers, style: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select...</option>
                {designPreferences.map((pref) => (
                  <option key={pref.value} value={pref.value}>
                    {pref.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ATS Compatibility */}
            <div className="mb-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="atsCheck"
                checked={answers.ats || false}
                onChange={(e) => setAnswers({ ...answers, ats: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="atsCheck" className="text-sm text-gray-600">
                I need ATS-friendly template (for online applications)
              </label>
            </div>

            <button
              onClick={handleSuggest}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Get Suggestions
            </button>
          </div>

          {/* Results */}
          {showResults && suggestions.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-2 flex items-center gap-2">
                <LightBulbIcon className="h-4 w-4 text-yellow-500" />
                <p className="text-sm font-medium text-gray-700">Recommended for you:</p>
              </div>
              <div className="space-y-2">
                {suggestions.slice(0, 5).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-left hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.source}</p>
                    </div>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {template.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
