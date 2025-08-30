import { Pressable, Text, ViewProps } from "react-native";
import { useSafeTokens } from "../../design/safeTokens";

type Kind = "primary" | "ghost";
type Props = ViewProps & {
  label: string;
  kind?: Kind;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export default function PillButton({ label, kind = "primary", onPress, accessibilityLabel, style, ...rest }: Props) {
  const t = useSafeTokens();
  const primary = kind === "primary";
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={[
        {
          paddingHorizontal: t.spacing.md,
          paddingVertical: t.spacing.sm,
          minHeight: 44,
          borderRadius: t.radii.pill,
          backgroundColor: primary ? t.palette.accent : "transparent",
          borderWidth: t.hairlineWidth,
          borderColor: primary ? t.palette.accent : t.palette.hairline,
          alignItems: "center",
          justifyContent: "center"
        },
        style
      ]}
    >
      <Text style={{ color: primary ? t.palette.onAccent : t.palette.textSecondary, fontWeight: "700" }}>
        {label}
      </Text>
    </Pressable>
  );
}