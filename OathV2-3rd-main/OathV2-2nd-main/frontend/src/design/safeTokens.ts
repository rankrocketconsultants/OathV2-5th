import { StyleSheet } from "react-native";
import { useTokens } from "./useTokens";
export function useSafeTokens() {
  const t = useTokens();
  return {
    palette: {
      bg: t.bg,
      surface: t.surface,
      surfaceElevated: t.surfaceElevated,
      textPrimary: t.text,
      textSecondary: t.textSecondary,
      textTertiary: t.textTertiary,
      accent: t.accent,
      onAccent: t.onAccent,
      hairline: t.hairlineColor,
      glass: t.glass,
      pillBg: t.pillBg,
      backdrop: t.backdrop,
      timeChipBg: t.timeChipBg,
      statusHonoredBg: (t as any).statusHonoredBg,
      statusHonoredText: (t as any).statusHonoredText,
      statusMissedBg: (t as any).statusMissedBg,
      statusMissedText: (t as any).statusMissedText,
      statusRescheduledBg: (t as any).statusRescheduledBg,
      statusRescheduledText: (t as any).statusRescheduledText
    },
    hairlineWidth: StyleSheet.hairlineWidth,
    radii: t.radii,
    spacing: t.spacing,
    type: t.type,
    shadowOpacity: t.shadowOpacity,
    shadowColor: (t as any).shadowColor
  };
}