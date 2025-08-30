import { View, Text, ViewProps } from "react-native";
import { useSafeTokens } from "../../design/safeTokens";

export type ChipKind = "time" | "honored" | "missed" | "rescheduled" | "neutral";

type Props = ViewProps & {
  kind: ChipKind;
  label: string;
};

export default function Chip({ kind, label, style, ...rest }: Props) {
  const t = useSafeTokens();

  const palette = (() => {
    switch (kind) {
      case "time":
        return { bg: t.palette.timeChipBg, fg: t.palette.accent };
      case "honored":
        return { bg: (t.palette as any).statusHonoredBg, fg: (t.palette as any).statusHonoredText };
      case "missed":
        return { bg: (t.palette as any).statusMissedBg, fg: (t.palette as any).statusMissedText };
      case "rescheduled":
        return { bg: (t.palette as any).statusRescheduledBg, fg: (t.palette as any).statusRescheduledText };
      default:
        return { bg: t.palette.timeChipBg, fg: t.palette.textSecondary };
    }
  })();

  return (
    <View
      {...rest}
      accessibilityRole="text"
      style={[
        {
          paddingHorizontal: 10,
          paddingVertical: 4,
          minHeight: 24,
          borderRadius: t.radii.pill,
          backgroundColor: palette.bg,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairline,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "flex-start"
        },
        style
      ]}
    >
      <Text style={{ color: palette.fg, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}