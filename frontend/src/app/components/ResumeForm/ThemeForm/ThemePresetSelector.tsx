"use client";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectTemplateSettings, updateDesign, updateTypography, updateLayout, updateContent } from "lib/redux/settingsSlice";
import { themePresets, type ThemePreset } from "lib/templates/presets";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";

export const ThemePresetSelector = () => {
  const dispatch = useAppDispatch();
  const ts = useAppSelector(selectTemplateSettings);
  const currentTheme = ts.design.theme || "modern";

  const applyPreset = (preset: ThemePreset) => {
    const { settings } = preset;
    if (settings.design) dispatch(updateDesign(settings.design as any));
    if (settings.typography) dispatch(updateTypography(settings.typography as any));
    if (settings.layout) dispatch(updateLayout(settings.layout as any));
    if (settings.content) dispatch(updateContent(settings.content as any));
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <InputGroupWrapper label="Theme Presets" />
        <p className="mt-0.5 text-[11px] text-gray-500">
          One-click to apply a complete visual identity — colors, fonts, layout, and more.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {themePresets.map((preset) => {
          const isActive = currentTheme === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-3 transition-all ${
                isActive
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-lg"
              }`}
            >
              {/* Color preview bar */}
              <div className="flex w-full gap-0.5 overflow-hidden rounded-md">
                <div
                  className="h-6 flex-1"
                  style={{ backgroundColor: preset.preview.primaryColor }}
                />
                <div
                  className="h-6 flex-1"
                  style={{ backgroundColor: preset.preview.secondaryColor }}
                />
                <div
                  className="h-6 flex-1"
                  style={{ backgroundColor: preset.preview.bgColor, border: "1px solid #e5e7eb" }}
                />
              </div>

              {/* Emoji + name */}
              <div className="flex items-center gap-1">
                <span className="text-sm">{preset.emoji}</span>
                <span className="text-xs font-semibold text-gray-800">{preset.name}</span>
              </div>

              {/* Description */}
              <span className="text-center text-[10px] leading-tight text-gray-500">
                {preset.description}
              </span>

              {/* Active badge */}
              {isActive && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow-sm">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Current theme summary */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">Active Theme</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
            {themePresets.find((p) => p.id === currentTheme)?.name || "Custom"}
          </span>
        </div>
        <div className="mt-2 flex gap-1">
          {Object.values(ts.design.colors)
            .filter(Boolean)
            .slice(0, 7)
            .map((color, idx) => (
              <div
                key={idx}
                className="h-5 w-5 rounded-full border border-gray-200"
                style={{ backgroundColor: color as string }}
                title={color as string}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
