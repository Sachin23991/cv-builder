"use client";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectTemplateSettings, updateDesign } from "lib/redux/settingsSlice";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import type {
  CardStyle, BorderStyle, ShadowLevel,
  AccentTreatment, SectionDivider, BackgroundType,
} from "lib/redux/types";

// ─── Curated Color Palettes ──────────────────────────────
const COLOR_PALETTES = [
  { name: "Ocean", colors: { primary: "#0ea5e9", secondary: "#0f766e", accent: "#06b6d4", background: "#ffffff", text: "#0f172a", muted: "#64748b" } },
  { name: "Midnight", colors: { primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7", background: "#ffffff", text: "#1e1b4b", muted: "#6b7280" } },
  { name: "Forest", colors: { primary: "#16a34a", secondary: "#15803d", accent: "#22c55e", background: "#ffffff", text: "#14532d", muted: "#6b7280" } },
  { name: "Sunset", colors: { primary: "#f97316", secondary: "#ea580c", accent: "#fb923c", background: "#fffbeb", text: "#431407", muted: "#78716c" } },
  { name: "Rose", colors: { primary: "#e11d48", secondary: "#be123c", accent: "#f43f5e", background: "#fff1f2", text: "#1c1917", muted: "#78716c" } },
  { name: "Slate Pro", colors: { primary: "#334155", secondary: "#475569", accent: "#64748b", background: "#ffffff", text: "#0f172a", muted: "#94a3b8" } },
  { name: "Navy", colors: { primary: "#1e3a5f", secondary: "#2563eb", accent: "#3b82f6", background: "#ffffff", text: "#1e293b", muted: "#94a3b8" } },
  { name: "Gold", colors: { primary: "#b45309", secondary: "#d97706", accent: "#f59e0b", background: "#fffbeb", text: "#1c1917", muted: "#78716c" } },
];

const CARD_STYLES: { value: CardStyle; label: string; icon: string }[] = [
  { value: "none", label: "None", icon: "─" },
  { value: "boxed", label: "Boxed", icon: "▢" },
  { value: "rounded", label: "Rounded", icon: "◎" },
  { value: "ghost", label: "Ghost", icon: "◇" },
  { value: "elevated", label: "Elevated", icon: "▣" },
];

const BORDER_STYLES: { value: BorderStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "hairline", label: "Hairline" },
  { value: "thick", label: "Thick" },
  { value: "dotted", label: "Dotted" },
  { value: "dashed", label: "Dashed" },
];

const SHADOW_LEVELS: { value: ShadowLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "soft", label: "Soft" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
];

const ACCENT_TREATMENTS: { value: AccentTreatment; label: string }[] = [
  { value: "none", label: "None" },
  { value: "sidebar-bar", label: "Sidebar Bar" },
  { value: "header-bar", label: "Header Bar" },
  { value: "corner-badge", label: "Corner Badge" },
  { value: "underline", label: "Underline" },
];

const SECTION_DIVIDERS: { value: SectionDivider; label: string }[] = [
  { value: "none", label: "None" },
  { value: "line", label: "Line" },
  { value: "double-line", label: "Double Line" },
  { value: "dots", label: "Dots" },
  { value: "gradient", label: "Gradient" },
];

// ─── Contrast Checker Utility ─────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance(r: number, g: number, b: number): number {
  const mapped = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * mapped[0]! + 0.7152 * mapped[1]! + 0.0722 * mapped[2]!;
}

function contrastRatio(hex1: string, hex2: string): number {
  try {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    const l1 = luminance(r1, g1, b1);
    const l2 = luminance(r2, g2, b2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 0;
  }
}

function ContrastBadge({ fg, bg }: { fg: string; bg: string }) {
  const ratio = contrastRatio(fg, bg);
  const pass = ratio >= 4.5;
  const aaLarge = ratio >= 3;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
        pass ? "bg-emerald-100 text-emerald-700" : aaLarge ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
      }`}
      title={`Contrast ratio: ${ratio.toFixed(2)}:1`}
    >
      {pass ? "AA ✓" : aaLarge ? "AA Large" : "Fail"} {ratio.toFixed(1)}:1
    </span>
  );
}

// ─── Color Input Row ──────────────────────────────────────
function ColorRow({
  label,
  value,
  onChange,
  contrastAgainst,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  contrastAgainst?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-7 cursor-pointer rounded border border-gray-300 p-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 rounded border border-gray-200 px-2 py-1 font-mono text-xs"
      />
      <span className="flex-1 text-xs text-gray-600">{label}</span>
      {contrastAgainst && <ContrastBadge fg={value} bg={contrastAgainst} />}
    </div>
  );
}

// ─── Option Grid ──────────────────────────────────────────
function OptionGrid<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: string }[];
  value: T;
  onChange: (val: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${
            value === opt.value
              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {opt.icon && <span className="mr-1">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────
export const ColorPanel = () => {
  const dispatch = useAppDispatch();
  const ts = useAppSelector(selectTemplateSettings);
  const { colors } = ts.design;

  const setColor = (field: string, value: string) => {
    dispatch(updateDesign({ colors: { ...colors, [field]: value } }));
  };

  const applyPalette = (palette: typeof COLOR_PALETTES[0]) => {
    dispatch(
      updateDesign({
        colors: {
          ...colors,
          primary: palette.colors.primary,
          secondary: palette.colors.secondary,
          accent: palette.colors.accent,
          background: palette.colors.background,
          text: palette.colors.text,
          muted: palette.colors.muted,
        },
      })
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ─── Quick Palettes ───────────────── */}
      <div>
        <InputGroupWrapper label="Color Palettes" />
        <div className="mt-1 grid grid-cols-4 gap-2">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.name}
              type="button"
              onClick={() => applyPalette(palette)}
              className="group flex flex-col items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 transition-all hover:border-gray-400 hover:shadow-md"
              title={palette.name}
            >
              <div className="flex gap-0.5">
                {[palette.colors.primary, palette.colors.secondary, palette.colors.accent].map((c, i) => (
                  <div key={i} className="h-4 w-4 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-800">{palette.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Core Colors ─────────────────── */}
      <div>
        <InputGroupWrapper label="Core Colors" />
        <div className="mt-1 flex flex-col gap-2">
          <ColorRow label="Primary" value={colors.primary} onChange={(v) => setColor("primary", v)} contrastAgainst={colors.background} />
          <ColorRow label="Text" value={colors.text} onChange={(v) => setColor("text", v)} contrastAgainst={colors.background} />
          <ColorRow label="Background" value={colors.background} onChange={(v) => setColor("background", v)} />
          <ColorRow label="Secondary" value={colors.secondary || "#0f766e"} onChange={(v) => setColor("secondary", v)} contrastAgainst={colors.background} />
          <ColorRow label="Accent" value={colors.accent || "#6366f1"} onChange={(v) => setColor("accent", v)} contrastAgainst={colors.background} />
          <ColorRow label="Muted" value={colors.muted || "#64748b"} onChange={(v) => setColor("muted", v)} contrastAgainst={colors.background} />
          <ColorRow label="Link" value={colors.link || "#0ea5e9"} onChange={(v) => setColor("link", v)} contrastAgainst={colors.background} />
        </div>
      </div>

      {/* ─── Sidebar & Header Colors ─────── */}
      <div>
        <InputGroupWrapper label="Sidebar & Header" />
        <div className="mt-1 flex flex-col gap-2">
          <ColorRow label="Sidebar BG" value={colors.sidebarBg || "#0f172a"} onChange={(v) => setColor("sidebarBg", v)} />
          <ColorRow label="Sidebar Text" value={colors.sidebarText || "#f8fafc"} onChange={(v) => setColor("sidebarText", v)} contrastAgainst={colors.sidebarBg || "#0f172a"} />
          <ColorRow label="Header BG" value={colors.headerBg || "#ffffff"} onChange={(v) => setColor("headerBg", v)} />
          <ColorRow label="Header Text" value={colors.headerText || "#0f172a"} onChange={(v) => setColor("headerText", v)} contrastAgainst={colors.headerBg || "#ffffff"} />
        </div>
      </div>

      {/* ─── Background Type ─────────────── */}
      <div>
        <InputGroupWrapper label="Background Style" />
        <OptionGrid<BackgroundType>
          options={[
            { value: "solid", label: "Solid" },
            { value: "gradient", label: "Gradient" },
            { value: "pattern", label: "Pattern" },
          ]}
          value={ts.design.background?.type || "solid"}
          onChange={(val) => dispatch(updateDesign({ background: { ...ts.design.background, type: val } }))}
        />
        {ts.design.background?.type === "gradient" && (
          <input
            type="text"
            value={ts.design.background?.gradient || ""}
            onChange={(e) => dispatch(updateDesign({ background: { ...ts.design.background, type: "gradient", gradient: e.target.value } }))}
            placeholder="linear-gradient(135deg, #f0f0f0, #ffffff)"
            className="mt-2 w-full rounded border border-gray-200 px-2 py-1.5 font-mono text-xs"
          />
        )}
      </div>

      {/* ─── Card Style ──────────────────── */}
      <div>
        <InputGroupWrapper label="Card Style" />
        <OptionGrid<CardStyle>
          options={CARD_STYLES}
          value={ts.design.cardStyle || "none"}
          onChange={(val) => dispatch(updateDesign({ cardStyle: val }))}
        />
      </div>

      {/* ─── Border Style ────────────────── */}
      <div>
        <InputGroupWrapper label="Border Style" />
        <OptionGrid<BorderStyle>
          options={BORDER_STYLES}
          value={ts.design.borderStyle || "hairline"}
          onChange={(val) => dispatch(updateDesign({ borderStyle: val }))}
        />
      </div>

      {/* ─── Shadow Level ────────────────── */}
      <div>
        <InputGroupWrapper label="Shadow" />
        <OptionGrid<ShadowLevel>
          options={SHADOW_LEVELS}
          value={ts.design.shadowLevel || "none"}
          onChange={(val) => dispatch(updateDesign({ shadowLevel: val }))}
        />
      </div>

      {/* ─── Accent Treatment ────────────── */}
      <div>
        <InputGroupWrapper label="Accent Treatment" />
        <OptionGrid<AccentTreatment>
          options={ACCENT_TREATMENTS}
          value={ts.design.accentTreatment || "underline"}
          onChange={(val) => dispatch(updateDesign({ accentTreatment: val }))}
        />
      </div>

      {/* ─── Section Divider ─────────────── */}
      <div>
        <InputGroupWrapper label="Section Divider" />
        <OptionGrid<SectionDivider>
          options={SECTION_DIVIDERS}
          value={ts.design.sectionDivider || "line"}
          onChange={(val) => dispatch(updateDesign({ sectionDivider: val }))}
        />
      </div>
    </div>
  );
};
