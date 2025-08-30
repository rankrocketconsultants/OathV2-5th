import { Text, View, ViewProps } from "react-native";
import { useSafeTokens } from "../../design/safeTokens";

type Variant = "accent" | "neutral" | "outline";
type Props = ViewProps & {
  text: string;
  variant?: Variant;
};

export default function PillChip({ text, variant = "neutral", style, ...rest }: Props) {
  const t = useSafeTokens();
  const stylesByVariant = {
    accent: {
      bg: t.palette.accent,
      fg: t.palette.onAccent,
      borderColor: t.palette.accent
    },
    neutral: {
      bg: t.palette.timeChipBg,
      fg: t.palette.accent,
      borderColor: t.palette.hairline
    },
    outline: {
      bg: "transparent" as const,
      fg: t.palette.textSecondary,
      borderColor: t.palette.hairline
    }
  }[variant];

  return (
    <View
      {...rest}
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: t.radii.pill,
          backgroundColor: stylesByVariant.bg,
          borderWidth: t.hairlineWidth,
          borderColor: stylesByVariant.borderColor,
          alignSelf: "flex-start",
          minHeight: 24
        },
        style
      ]}
    >
      <Text style={{ color: stylesByVariant.fg, fontWeight: "700" }}>{text}</Text>
    </View>
  );
}