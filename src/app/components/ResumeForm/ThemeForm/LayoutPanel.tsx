"use client";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectTemplateSettings, updateLayout, updatePage } from "lib/redux/settingsSlice";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import type { HeaderStyle, GridType } from "lib/redux/types";

const HEADER_STYLES: { value: HeaderStyle; label: string; desc: string }[] = [
  { value: "left-aligned", label: "Left", desc: "Name and contact left-aligned" },
  { value: "centered", label: "Center", desc: "Name centered, contact below" },
  { value: "banner", label: "Banner", desc: "Full-width colored header" },
  { value: "split", label: "Split", desc: "Name left, contact right" },
];

const GRID_TYPES: { value: GridType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "card-based", label: "Card Based" },
  { value: "timeline", label: "Timeline" },
  { value: "modular", label: "Modular" },
];

const ALL_SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "languages", label: "Languages" },
  { id: "certifications", label: "Certifications" },
  { id: "awards", label: "Awards" },
  { id: "publications", label: "Publications" },
  { id: "volunteer", label: "Volunteer" },
  { id: "references", label: "References" },
  { id: "profiles", label: "Profiles" },
  { id: "interests", label: "Interests" },
];

export const LayoutPanel = () => {
  const dispatch = useAppDispatch();
  const ts = useAppSelector(selectTemplateSettings);
  const { layout, page } = ts;

  const moveSection = (sections: string[], idx: number, dir: "up" | "down") => {
    const arr = [...sections];
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= arr.length) return arr;
    const temp = arr[idx]!;
    arr[idx] = arr[newIdx]!;
    arr[newIdx] = temp;
    return arr;
  };

  return (
    <div className="flex flex-col gap-5">


      {/* ─── Header Style ────────────────── */}
      <div>
        <InputGroupWrapper label="Header Style" />
        <div className="mt-1 grid grid-cols-2 gap-2">
          {HEADER_STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => dispatch(updateLayout({ headerStyle: style.value }))}
              className={`flex flex-col items-start rounded-lg border-2 px-3 py-2 text-left transition-all ${
                (layout.headerStyle || "left-aligned") === style.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="text-xs font-semibold text-gray-800">{style.label}</span>
              <span className="text-[10px] text-gray-500">{style.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Grid Type ───────────────────── */}
      <div>
        <InputGroupWrapper label="Grid Type" />
        <div className="mt-1 flex flex-wrap gap-1.5">
          {GRID_TYPES.map((gt) => (
            <button
              key={gt.value}
              type="button"
              onClick={() => dispatch(updateLayout({ gridType: gt.value }))}
              className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${
                (layout.gridType || "standard") === gt.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {gt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Full Width ──────────────────── */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="fullWidth"
          checked={layout.fullWidth}
          onChange={(e) => dispatch(updateLayout({ fullWidth: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 accent-blue-500"
        />
        <label htmlFor="fullWidth" className="text-sm text-gray-700">
          Full Width Layout
        </label>
      </div>

      {/* ─── Section Order: Main Column ──── */}
      <div>
        <InputGroupWrapper label="Main Column Sections" />
        <div className="mt-1 flex flex-col gap-1">
          {layout.main.map((sectionId, idx) => {
            const section = ALL_SECTIONS.find((s) => s.id === sectionId);
            return (
              <div
                key={sectionId}
                className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1.5"
              >
                <span className="text-[10px] font-bold text-gray-400">{idx + 1}</span>
                <span className="flex-1 text-xs font-medium text-gray-700">{section?.label || sectionId}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newMain = moveSection(layout.main, idx, "up");
                    dispatch(updateLayout({ main: newMain }));
                  }}
                  disabled={idx === 0}
                  className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newMain = moveSection(layout.main, idx, "down");
                    dispatch(updateLayout({ main: newMain }));
                  }}
                  disabled={idx === layout.main.length - 1}
                  className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newMain = layout.main.filter((_, i) => i !== idx);
                    dispatch(updateLayout({ main: newMain }));
                  }}
                  className="rounded p-0.5 text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            );
          })}
          {/* Add section dropdown */}
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                dispatch(updateLayout({ main: [...layout.main, e.target.value] }));
              }
            }}
            className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-2 py-1.5 text-xs text-gray-500"
          >
            <option value="">+ Add section...</option>
            {ALL_SECTIONS.filter(
              (s) => !layout.main.includes(s.id) && !layout.sidebar.includes(s.id)
            ).map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Section Order: Sidebar ──────── */}
      {(layout.columns || 1) >= 2 && (
        <div>
          <InputGroupWrapper label="Sidebar Sections" />
          <div className="mt-1 flex flex-col gap-1">
            {layout.sidebar.map((sectionId, idx) => {
              const section = ALL_SECTIONS.find((s) => s.id === sectionId);
              return (
                <div
                  key={sectionId}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1.5"
                >
                  <span className="text-[10px] font-bold text-gray-400">{idx + 1}</span>
                  <span className="flex-1 text-xs font-medium text-gray-700">{section?.label || sectionId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const arr = moveSection(layout.sidebar, idx, "up");
                      dispatch(updateLayout({ sidebar: arr }));
                    }}
                    disabled={idx === 0}
                    className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const arr = moveSection(layout.sidebar, idx, "down");
                      dispatch(updateLayout({ sidebar: arr }));
                    }}
                    disabled={idx === layout.sidebar.length - 1}
                    className="rounded p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const arr = layout.sidebar.filter((_, i) => i !== idx);
                      dispatch(updateLayout({ sidebar: arr }));
                    }}
                    className="rounded p-0.5 text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  dispatch(updateLayout({ sidebar: [...layout.sidebar, e.target.value] }));
                }
              }}
              className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-2 py-1.5 text-xs text-gray-500"
            >
              <option value="">+ Add section...</option>
              {ALL_SECTIONS.filter(
                (s) => !layout.main.includes(s.id) && !layout.sidebar.includes(s.id)
              ).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ─── Page Settings ───────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Page Settings" />
        <div className="mt-2 flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Paper Size</label>
            <div className="mt-1 flex gap-2">
              {(["letter", "a4", "free-form"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => dispatch(updatePage({ format: size }))}
                  className={`flex-1 rounded-md border-2 py-2 text-center text-xs font-medium transition-all ${
                    page.format === size
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {size === "letter" ? "Letter (US)" : size === "a4" ? "A4 (Intl)" : "Free Form"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Margin X: {page.marginX}mm</label>
              <input
                type="range"
                min={10}
                max={50}
                value={page.marginX}
                onChange={(e) => dispatch(updatePage({ marginX: parseInt(e.target.value) }))}
                className="mt-1 w-full accent-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Margin Y: {page.marginY}mm</label>
              <input
                type="range"
                min={10}
                max={50}
                value={page.marginY}
                onChange={(e) => dispatch(updatePage({ marginY: parseInt(e.target.value) }))}
                className="mt-1 w-full accent-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { key: "forceOnePage", label: "Force one-page layout" },
              { key: "showPageNumbers", label: "Show page numbers" },
              { key: "showFooter", label: "Show footer" },
              { key: "hideIcons", label: "Hide section icons" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean((page as any)[key])}
                  onChange={(e) => dispatch(updatePage({ [key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-500"
                />
                {label}
              </label>
            ))}
          </div>

          {page.showFooter && (
            <div>
              <label className="text-xs font-medium text-gray-600">Footer Content</label>
              <input
                type="text"
                value={page.footerContent || ""}
                onChange={(e) => dispatch(updatePage({ footerContent: e.target.value }))}
                placeholder="Page {{page}} of {{pages}}"
                className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5 text-xs"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
