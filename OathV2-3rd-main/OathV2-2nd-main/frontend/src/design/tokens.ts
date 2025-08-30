export type Mode = "light" | "dark";

type TypeScale = {
  h1: { size: number };     // Large Title
  h2: { size: number };     // Section Title
  body: { size: number };   // Primary text
  sub: { size: number };    // Secondary text
  caption: { size: number };// Tertiary/captions
};

type Palette = {
  // surfaces & text
  bg: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;

  // brand
  accent: string;
  accent2: string;   // equals accent for gradient APIs (unify brand)
  onAccent: string;

  // borders, effects
  hairline: number;
  hairlineColor: string;
  glass: string;
  pillBg: string;
  backdrop: string;

  // chips
  timeChipBg: string;

  // optional status chip colors (used elsewhere, harmless baseline)
  statusHonoredBg: string;
  statusHonoredText: string;
  statusMissedBg: string;
  statusMissedText: string;
  statusRescheduledBg: string;
  statusRescheduledText: string;

  // shape/spacing/shadow
  radii: { sm: number; md: number; lg: number; xl: number; "2xl": number; pill: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  shadowOpacity: number;
  shadowColor: string;

  // type scale
  type: TypeScale;
};

export const tokens: Record<Mode, Palette> = {
  light: {
    bg: "#FFFFFF",
    surface: "#FAFAFB",
    surfaceElevated: "#FFFFFF",
    text: "#0A0A0B",
    textSecondary: "#3C3D40",
    textTertiary: "#6B6E73",
    accent: "#00C896",
    accent2: "#00C896",
    onAccent: "#FFFFFF",
    hairline: 1,
    hairlineColor: "#E5E7EB",
    glass: "rgba(255,255,255,0.66)",
    pillBg: "rgba(0,0,0,0.04)",
    backdrop: "rgba(0,0,0,0.35)",
    timeChipBg: "rgba(0, 200, 150, 0.10)",
    statusHonoredBg: "rgba(0, 200, 150, 0.12)",
    statusHonoredText: "#00C896",
    statusMissedBg: "rgba(255, 59, 48, 0.12)",
    statusMissedText: "#FF3B30",
    statusRescheduledBg: "rgba(0, 122, 255, 0.12)",
    statusRescheduledText: "#007AFF",
    radii: { sm: 8, md: 12, lg: 16, xl: 20, "2xl": 24, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
    shadowOpacity: 0.08,
    shadowColor: "#000000",
    type: { h1: { size: 28 }, h2: { size: 22 }, body: { size: 16 }, sub: { size: 14 }, caption: { size: 12 } }
  },
  dark: {
    bg: "#0C0F10",
    surface: "#111416",
    surfaceElevated: "#15181A",
    text: "#F5F6F7",          // brighter for readability
    textSecondary: "#C7CBD1",
    textTertiary: "#9AA0A6",
    accent: "#00C896",
    accent2: "#00C896",
    onAccent: "#001B14",
    hairline: 1,
    hairlineColor: "#23282C", // slightly brighter hairlines on dark
    glass: "rgba(21,24,26,0.72)", // a bit stronger tint in dark
    pillBg: "rgba(255,255,255,0.06)",
    backdrop: "rgba(0,0,0,0.45)",
    timeChipBg: "rgba(0, 200, 150, 0.16)",
    statusHonoredBg: "rgba(0, 200, 150, 0.22)",
    statusHonoredText: "#00C896",
    statusMissedBg: "rgba(255, 69, 58, 0.22)",
    statusMissedText: "#FF453A",
    statusRescheduledBg: "rgba(10, 132, 255, 0.22)",
    statusRescheduledText: "#0A84FF",
    radii: { sm: 8, md: 12, lg: 16, xl: 20, "2xl": 24, pill: 999 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
    shadowOpacity: 0.08,
    shadowColor: "#000000",
    type: { h1: { size: 28 }, h2: { size: 22 }, body: { size: 16 }, sub: { size: 14 }, caption: { size: 12 } }
  }
};