"use client";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectTemplateSettings, updateContent } from "lib/redux/settingsSlice";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import type { BulletStyle, DateFormat, DatePlacement, PhotoShape, SkillBarStyle, IconStyle } from "lib/redux/types";

const BULLET_STYLES: { value: BulletStyle; label: string; preview: string }[] = [
  { value: "circle", label: "Circle", preview: "●" },
  { value: "square", label: "Square", preview: "■" },
  { value: "dash", label: "Dash", preview: "—" },
  { value: "arrow", label: "Arrow", preview: "▸" },
  { value: "checkmark", label: "Check", preview: "✓" },
  { value: "none", label: "None", preview: " " },
];

const DATE_FORMATS: { value: DateFormat; label: string; example: string }[] = [
  { value: "month-year", label: "Month Year", example: "Jan 2024" },
  { value: "mm-yyyy", label: "MM/YYYY", example: "01/2024" },
  { value: "yyyy", label: "YYYY", example: "2024" },
  { value: "duration", label: "Duration", example: "2 years" },
];

const DATE_PLACEMENTS: { value: DatePlacement; label: string }[] = [
  { value: "right", label: "Right-aligned" },
  { value: "inline", label: "Inline" },
  { value: "below", label: "Below company" },
];

const PHOTO_SHAPES: { value: PhotoShape; label: string; icon: string }[] = [
  { value: "circle", label: "Circle", icon: "⬤" },
  { value: "square", label: "Square", icon: "⬛" },
  { value: "rounded", label: "Rounded", icon: "▢" },
];

const SKILL_BAR_STYLES: { value: SkillBarStyle; label: string }[] = [
  { value: "bar", label: "Progress Bars" },
  { value: "dots", label: "Dot Rating" },
  { value: "circle", label: "Circle Chart" },
  { value: "chips", label: "Skill Chips" },
];

const ICON_STYLES: { value: IconStyle; label: string }[] = [
  { value: "outline", label: "Outline" },
  { value: "filled", label: "Filled" },
  { value: "duotone", label: "Duotone" },
];

export const ContentPanel = () => {
  const dispatch = useAppDispatch();
  const ts = useAppSelector(selectTemplateSettings);
  const content = ts.content || {};

  return (
    <div className="flex flex-col gap-5">
      {/* ─── Bullet Style ────────────────── */}
      <div>
        <InputGroupWrapper label="Bullet Style" />
        <div className="mt-1 flex flex-wrap gap-1.5">
          {BULLET_STYLES.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => dispatch(updateContent({ bulletStyle: b.value }))}
              className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${
                (content.bulletStyle || "circle") === b.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <span className="text-sm">{b.preview}</span>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Date Format ─────────────────── */}
      <div>
        <InputGroupWrapper label="Date Format" />
        <div className="mt-1 flex flex-col gap-1.5">
          {DATE_FORMATS.map((df) => (
            <button
              key={df.value}
              type="button"
              onClick={() => dispatch(updateContent({ dateFormat: df.value }))}
              className={`flex items-center justify-between rounded-md border px-3 py-2 text-xs transition-all ${
                (content.dateFormat || "month-year") === df.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="font-medium text-gray-800">{df.label}</span>
              <span className="font-mono text-gray-500">{df.example}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Date Placement ──────────────── */}
      <div>
        <InputGroupWrapper label="Date Placement" />
        <div className="mt-1 flex gap-1.5">
          {DATE_PLACEMENTS.map((dp) => (
            <button
              key={dp.value}
              type="button"
              onClick={() => dispatch(updateContent({ datePlacement: dp.value }))}
              className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-all ${
                (content.datePlacement || "right") === dp.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {dp.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Emphasis Rules ──────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Emphasis Rules" />
        <div className="mt-2 flex flex-col gap-2">
          {[
            { key: "boldRole" as const, label: "Bold job title / role" },
            { key: "italicOrg" as const, label: "Italicize organization name" },
            { key: "highlightMetrics" as const, label: "Highlight metrics / KPIs" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={content.emphasisRules?.[key] ?? (key === "boldRole")}
                onChange={(e) =>
                  dispatch(
                    updateContent({
                      emphasisRules: {
                        ...content.emphasisRules,
                        [key]: e.target.checked,
                      },
                    })
                  )
                }
                className="h-3.5 w-3.5 rounded border-gray-300 accent-blue-500"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ─── Profile Photo ───────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <div className="flex items-center justify-between">
          <InputGroupWrapper label="Profile Photo" />
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={content.showPhoto ?? false}
              onChange={(e) => dispatch(updateContent({ showPhoto: e.target.checked }))}
              className="h-3.5 w-3.5 rounded border-gray-300 accent-blue-500"
            />
            <span className="text-xs text-gray-600">Show</span>
          </label>
        </div>
        {content.showPhoto && (
          <div className="mt-2 flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Shape</label>
              <div className="mt-1 flex gap-1.5">
                {PHOTO_SHAPES.map((ps) => (
                  <button
                    key={ps.value}
                    type="button"
                    onClick={() => dispatch(updateContent({ photoShape: ps.value }))}
                    className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${
                      (content.photoShape || "circle") === ps.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {ps.icon} {ps.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                Size: {content.photoSize || 80}px
              </label>
              <input
                type="range"
                min={40}
                max={160}
                value={content.photoSize || 80}
                onChange={(e) => dispatch(updateContent({ photoSize: parseInt(e.target.value) }))}
                className="mt-1 w-full accent-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Skill Visualization ─────────── */}
      <div>
        <InputGroupWrapper label="Skill Visualization" />
        <div className="mt-1 flex items-center gap-2">
          <input
            type="checkbox"
            checked={content.showSkillBars ?? true}
            onChange={(e) => dispatch(updateContent({ showSkillBars: e.target.checked }))}
            className="h-3.5 w-3.5 rounded border-gray-300 accent-blue-500"
          />
          <span className="text-xs text-gray-600">Show skill levels</span>
        </div>
        {(content.showSkillBars ?? true) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SKILL_BAR_STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => dispatch(updateContent({ skillBarStyle: s.value }))}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${
                  (content.skillBarStyle || "chips") === s.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Icons ────────────────────────── */}
      <div>
        <div className="flex items-center gap-2">
          <InputGroupWrapper label="Icons" />
          <input
            type="checkbox"
            checked={content.showIcons ?? true}
            onChange={(e) => dispatch(updateContent({ showIcons: e.target.checked }))}
            className="h-3.5 w-3.5 rounded border-gray-300 accent-blue-500"
          />
        </div>
        {(content.showIcons ?? true) && (
          <div className="mt-1 flex gap-1.5">
            {ICON_STYLES.map((is) => (
              <button
                key={is.value}
                type="button"
                onClick={() => dispatch(updateContent({ iconStyle: is.value }))}
                className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-all ${
                  (content.iconStyle || "outline") === is.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {is.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── ATS Notice ──────────────────── */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <span className="font-semibold">ATS Tip:</span> For maximum ATS compatibility, use circle bullets,
        Month Year date format, and disable photos and skill bars.
      </div>
    </div>
  );
};
