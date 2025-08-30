import { Pressable, Text, Animated, Easing, ViewProps } from "react-native";
import { useRef } from "react";
import { useSafeTokens } from "../../design/safeTokens";

type Kind = "primary" | "ghost";
type Props = ViewProps & {
  label: string;
  kind?: Kind;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export default function PillButton({ label, kind="primary", onPress, accessibilityLabel, style, ...rest }: Props){
  const t = useSafeTokens();
  const primary = kind === "primary";

  // Micro-lift for buttons (Convert/Archive)
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.timing(scale, { toValue: 0.98, duration: 90,  easing: Easing.out(Easing.quad),  useNativeDriver:true }).start();
  const pressOut = () => Animated.timing(scale, { toValue: 1,    duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver:true }).start();

  return (
    <Animated.View style={{ transform:[{ scale }] }}>
      <Pressable
        {...rest}
        onPressIn={pressIn}
        onPressOut={pressOut}
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
        <Text style={{ color: primary ? t.palette.onAccent : t.palette.textSecondary, fontWeight:"700" }}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}