import { useState } from "react";
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
  DEFAULT_THEME_COLOR,
  selectSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import type { FontFamily } from "components/fonts/constants";
import { Cog6ToothIcon, ViewColumnsIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { TemplateSelector } from "./TemplateSelector";
import { SuggestionSystem } from "./SuggestionSystem";
import { TemplateSettings } from "./TemplateSettings";
import { useTemplateStore } from "lib/stores/templateStore";

type Tab = "templates" | "settings" | "suggestions" | "custom_code";

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, documentSize, customHTML, customCSS } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();
  const { isTemplatePanelOpen, setTemplatePanelOpen } = useTemplateStore();
  const [activeTab, setActiveTab] = useState<Tab>("templates");

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-wide text-gray-900 ">
            Resume Setting
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-1 rounded-t px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "templates"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ViewColumnsIcon className="h-4 w-4" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-1 rounded-t px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex items-center gap-1 rounded-t px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "suggestions"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Suggestions
          </button>
          <button
            onClick={() => setActiveTab("custom_code")}
            className={`flex items-center gap-1 rounded-t px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "custom_code"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {'< / >'} Custom Code
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "templates" && <TemplateSelector />}
        {activeTab === "settings" && <TemplateSettings />}
        {activeTab === "suggestions" && <SuggestionSystem />}
        {activeTab === "custom_code" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              Select <b>Custom HTML (Overleaf)</b> in the Templates tab to preview your code. 
              You can use simple handlebars syntax (e.g. {'{{profile.name}}'}).
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom HTML</label>
              <textarea
                className="w-full h-48 p-2 font-mono text-xs border rounded outline-theme-purple bg-gray-50"
                value={customHTML}
                onChange={(e) => handleSettingsChange("customHTML" as GeneralSetting, e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
              <textarea
                className="w-full h-48 p-2 font-mono text-xs border rounded outline-theme-purple bg-gray-50"
                value={customCSS}
                onChange={(e) => handleSettingsChange("customCSS" as GeneralSetting, e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Legacy Settings - Always show below tabs for backward compatibility */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Quick Settings</h3>
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
          <div className="mt-4">
            <InputGroupWrapper label="Font Family" />
            <FontFamilySelectionsCSR
              selectedFontFamily={fontFamily}
              themeColor={themeColor}
              handleSettingsChange={handleSettingsChange}
            />
          </div>
          <div className="mt-4">
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
          <div className="mt-4">
            <InputGroupWrapper label="Document Size" />
            <DocumentSizeSelections
              themeColor={themeColor}
              selectedDocumentSize={documentSize}
              handleSettingsChange={handleSettingsChange}
            />
          </div>
        </div>
      </div>
    </BaseForm>
  );
};
