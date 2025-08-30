import { StyleSheet } from "react-native";
import { useTokens } from "./useTokens";
export function useSafeTokens() {
  const t = useTokens();
  return {
    palette: {
      bg: t.bg,
      surface: t.surface,
      surfaceElevated: t.surfaceElevated,
      text: t.text,
      textPrimary: t.text,
      textSecondary: t.textSecondary,
      textTertiary: t.textTertiary,
      accent: t.accent,
      accent2: t.accent2,
      onAccent: t.onAccent,
      hairline: t.hairlineColor,
      hairlineColor: t.hairlineColor,
      glass: t.glass,
      pillBg: t.pillBg,
      backdrop: t.backdrop,
      timeChipBg: t.timeChipBg,
      statusHonoredBg: t.statusHonoredBg,
      statusHonoredText: t.statusHonoredText,
      statusMissedBg: t.statusMissedBg,
      statusMissedText: t.statusMissedText,
      statusRescheduledBg: t.statusRescheduledBg,
      statusRescheduledText: t.statusRescheduledText
    },
    hairlineWidth: StyleSheet.hairlineWidth,
    radii: t.radii,
    spacing: t.spacing,
    type: t.type
  };
}