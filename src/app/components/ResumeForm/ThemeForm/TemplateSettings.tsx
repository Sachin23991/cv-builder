"use client";
import { useTemplateStore } from "lib/stores/templateStore";
import { getTemplateById } from "lib/templates";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";

export const TemplateSettings = () => {
  const { activeTemplate, templateSettings, updateDesign, updateTypography, updateLayout, updatePage } =
    useTemplateStore();

  const template = getTemplateById(activeTemplate);

  if (!template) return null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-900">Template: {template.name}</h3>
        <p className="text-xs text-gray-500">{template.description}</p>
      </div>

      {/* Color Settings */}
      <div>
        <InputGroupWrapper label="Primary Color" />
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={templateSettings.design.colors.primary}
            onChange={(e) => updateDesign({ colors: { ...templateSettings.design.colors, primary: e.target.value } })}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300"
          />
          <input
            type="text"
            value={templateSettings.design.colors.primary}
            onChange={(e) => updateDesign({ colors: { ...templateSettings.design.colors, primary: e.target.value } })}
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div>
        <InputGroupWrapper label="Text Color" />
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={templateSettings.design.colors.text}
            onChange={(e) => updateDesign({ colors: { ...templateSettings.design.colors, text: e.target.value } })}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300"
          />
          <input
            type="text"
            value={templateSettings.design.colors.text}
            onChange={(e) => updateDesign({ colors: { ...templateSettings.design.colors, text: e.target.value } })}
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div>
        <InputGroupWrapper label="Background Color" />
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={templateSettings.design.colors.background}
            onChange={(e) => updateDesign({ colors: { ...templateSettings.design.colors, background: e.target.value } })}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300"
          />
          <input
            type="text"
            value={templateSettings.design.colors.background}
            onChange={(e) => updateDesign({ colors: { ...templateSettings.design.colors, background: e.target.value } })}
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Typography Settings */}
      <div>
        <InputGroupWrapper label="Body Font Family" />
        <select
          value={templateSettings.typography.body.fontFamily}
          onChange={(e) =>
            updateTypography({
              body: { ...templateSettings.typography.body, fontFamily: e.target.value },
            })
          }
          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Raleway">Raleway</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Lora">Lora</option>
          <option value="Roboto Slab">Roboto Slab</option>
        </select>
      </div>

      <div>
        <InputGroupWrapper label="Body Font Size (pt)" />
        <input
          type="number"
          value={templateSettings.typography.body.fontSize}
          onChange={(e) =>
            updateTypography({
              body: { ...templateSettings.typography.body, fontSize: parseInt(e.target.value) || 11 },
            })
          }
          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          min="8"
          max="16"
        />
      </div>

      <div>
        <InputGroupWrapper label="Heading Font Family" />
        <select
          value={templateSettings.typography.heading.fontFamily}
          onChange={(e) =>
            updateTypography({
              heading: { ...templateSettings.typography.heading, fontFamily: e.target.value },
            })
          }
          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Lora">Lora</option>
        </select>
      </div>

      {/* Layout Settings */}
      <div>
        <InputGroupWrapper label="Sidebar Width (%)" />
        <input
          type="range"
          min="20"
          max="40"
          value={templateSettings.layout.sidebarWidth}
          onChange={(e) => updateLayout({ sidebarWidth: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>20%</span>
          <span>{templateSettings.layout.sidebarWidth}%</span>
          <span>40%</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="fullWidth"
          checked={templateSettings.layout.fullWidth}
          onChange={(e) => updateLayout({ fullWidth: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="fullWidth" className="text-sm text-gray-700">Full Width Layout</label>
      </div>

      {/* Page Settings */}
      <div>
        <InputGroupWrapper label="Page Format" />
        <select
          value={templateSettings.page.format}
          onChange={(e) =>
            updatePage({ format: e.target.value as "a4" | "letter" | "free-form" })
          }
          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="letter">Letter (US)</option>
          <option value="a4">A4 (International)</option>
          <option value="free-form">Free Form</option>
        </select>
      </div>

      <div>
        <InputGroupWrapper label="Margin X (mm)" />
        <input
          type="number"
          value={templateSettings.page.marginX}
          onChange={(e) => updatePage({ marginX: parseInt(e.target.value) || 20 })}
          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          min="10"
          max="50"
        />
      </div>

      <div>
        <InputGroupWrapper label="Margin Y (mm)" />
        <input
          type="number"
          value={templateSettings.page.marginY}
          onChange={(e) => updatePage({ marginY: parseInt(e.target.value) || 20 })}
          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          min="10"
          max="50"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hideIcons"
          checked={templateSettings.page.hideIcons}
          onChange={(e) => updatePage({ hideIcons: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="hideIcons" className="text-sm text-gray-700">Hide Section Icons</label>
      </div>
    </div>
  );
};
