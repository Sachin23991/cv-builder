"use client";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectTemplateSettings, updateTypography } from "lib/redux/settingsSlice";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";

// ─── Font Options ─────────────────────────────────────────
const FONT_FAMILIES = {
  "Sans-serif": [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
    "Raleway", "Nunito", "Outfit", "Space Grotesk", "DM Sans",
    "Source Sans Pro", "Noto Sans", "Work Sans", "Manrope",
  ],
  "Serif": [
    "Playfair Display", "Merriweather", "Lora", "Georgia", "Garamond",
    "Libre Baskerville", "Crimson Text", "EB Garamond", "Cormorant Garamond",
    "Times New Roman", "Roboto Slab",
  ],
  "Monospace": [
    "JetBrains Mono", "Fira Code", "Source Code Pro", "IBM Plex Mono",
  ],
  "Display": [
    "Syne", "Clash Display", "Oswald", "Abril Fatface",
  ],
  "ATS-Safe": [
    "Arial", "Calibri", "Helvetica", "Times New Roman", "Verdana", "Tahoma",
  ],
};

const FONT_WEIGHTS = [
  { value: 300, label: "Light" },
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semibold" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extra Bold" },
];

const TEXT_TRANSFORMS = [
  { value: "none", label: "Normal" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "capitalize", label: "Title Case" },
  { value: "lowercase", label: "lowercase" },
];

// ─── Font Select Component ────────────────────────────────
function FontSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (val: string) => void;
  label: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        style={{ fontFamily: value }}
      >
        {Object.entries(FONT_FAMILIES).map(([category, fonts]) => (
          <optgroup key={category} label={category}>
            {fonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

// ─── Slider Component ─────────────────────────────────────
function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <span className="text-xs font-mono text-gray-500">
          {value}{unit || ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-blue-500"
      />
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────
export const TypographyPanel = () => {
  const dispatch = useAppDispatch();
  const ts = useAppSelector(selectTemplateSettings);
  const { typography } = ts;

  return (
    <div className="flex flex-col gap-5">
      {/* ─── Name / Title ─────────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Name / Title" />
        <div className="mt-2 flex flex-col gap-3">
          <FontSelect
            label="Font Family"
            value={typography.name?.fontFamily || typography.heading.fontFamily}
            onChange={(val) =>
              dispatch(updateTypography({ name: { ...typography.name, fontFamily: val } }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Size"
              value={typography.name?.fontSize || 28}
              onChange={(val) =>
                dispatch(updateTypography({ name: { ...typography.name, fontSize: val } }))
              }
              min={18}
              max={48}
              step={1}
              unit="pt"
            />
            <div>
              <label className="text-xs font-medium text-gray-600">Weight</label>
              <select
                value={typography.name?.fontWeight || 700}
                onChange={(e) =>
                  dispatch(
                    updateTypography({
                      name: { ...typography.name, fontWeight: parseInt(e.target.value) },
                    })
                  )
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              >
                {FONT_WEIGHTS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label} ({w.value})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Text Transform</label>
            <div className="mt-1 flex gap-1.5">
              {TEXT_TRANSFORMS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() =>
                    dispatch(
                      updateTypography({ name: { ...typography.name, textTransform: t.value } })
                    )
                  }
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                    (typography.name?.textTransform || "none") === t.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {/* Preview */}
          <div
            className="rounded-md border border-gray-200 bg-white px-3 py-2"
            style={{
              fontFamily: typography.name?.fontFamily || typography.heading.fontFamily,
              fontSize: `${(typography.name?.fontSize || 28) * 0.6}px`,
              fontWeight: typography.name?.fontWeight || 700,
              textTransform: (typography.name?.textTransform || "none") as React.CSSProperties["textTransform"],
              letterSpacing: `${typography.letterSpacing || 0}px`,
            }}
          >
            John Doe
          </div>
        </div>
      </div>

      {/* ─── Heading ──────────────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Section Headings" />
        <div className="mt-2 flex flex-col gap-3">
          <FontSelect
            label="Font Family"
            value={typography.heading.fontFamily}
            onChange={(val) =>
              dispatch(updateTypography({ heading: { ...typography.heading, fontFamily: val } }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Size"
              value={typography.heading.fontSize}
              onChange={(val) =>
                dispatch(updateTypography({ heading: { ...typography.heading, fontSize: val } }))
              }
              min={10}
              max={24}
              step={0.5}
              unit="pt"
            />
            <Slider
              label="Line Height"
              value={typography.heading.lineHeight}
              onChange={(val) =>
                dispatch(
                  updateTypography({ heading: { ...typography.heading, lineHeight: val } })
                )
              }
              min={1.0}
              max={2.0}
              step={0.05}
            />
          </div>
        </div>
      </div>

      {/* ─── Body Text ────────────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Body Text" />
        <div className="mt-2 flex flex-col gap-3">
          <FontSelect
            label="Font Family"
            value={typography.body.fontFamily}
            onChange={(val) =>
              dispatch(updateTypography({ body: { ...typography.body, fontFamily: val } }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Size"
              value={typography.body.fontSize}
              onChange={(val) =>
                dispatch(updateTypography({ body: { ...typography.body, fontSize: val } }))
              }
              min={8}
              max={16}
              step={0.5}
              unit="pt"
            />
            <Slider
              label="Line Height"
              value={typography.body.lineHeight}
              onChange={(val) =>
                dispatch(updateTypography({ body: { ...typography.body, lineHeight: val } }))
              }
              min={1.0}
              max={2.0}
              step={0.05}
            />
          </div>
        </div>
      </div>

      {/* ─── Subheading & Small ────────────── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Subheading & Small Text" />
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Slider
            label="Subheading Size"
            value={typography.subheading?.fontSize || 12}
            onChange={(val) =>
              dispatch(updateTypography({ subheading: { ...typography.subheading, fontSize: val } }))
            }
            min={9}
            max={18}
            step={0.5}
            unit="pt"
          />
          <Slider
            label="Small Text Size"
            value={typography.small?.fontSize || 9}
            onChange={(val) =>
              dispatch(updateTypography({ small: { fontSize: val } }))
            }
            min={7}
            max={12}
            step={0.5}
            unit="pt"
          />
        </div>
      </div>

      {/* ─── Global Typography Options ───── */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
        <InputGroupWrapper label="Global Options" />
        <div className="mt-2 flex flex-col gap-3">
          <Slider
            label="Letter Spacing (tracking)"
            value={typography.letterSpacing || 0}
            onChange={(val) => dispatch(updateTypography({ letterSpacing: val }))}
            min={-2}
            max={5}
            step={0.25}
            unit="px"
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600">Font Features</label>
            <div className="flex flex-wrap gap-3">
              {[
                { key: "smallCaps" as const, label: "Small Caps" },
                { key: "ligatures" as const, label: "Ligatures" },
                { key: "oldstyleFigures" as const, label: "Oldstyle Figures" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-1.5 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={typography.fontFeatures?.[key] || false}
                    onChange={(e) =>
                      dispatch(
                        updateTypography({
                          fontFeatures: {
                            ...typography.fontFeatures,
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
        </div>
      </div>
    </div>
  );
};
