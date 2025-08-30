import { Pressable, Text, Animated, Easing, ViewProps } from "react-native";
import { useRef } from "react";
import { useSafeTokens } from "../../design/safeTokens";

type Kind = "primary" | "ghost";
type Size = "default" | "compact";
type Props = ViewProps & {
  label: string;
  kind?: Kind;
  size?: Size;              // NEW: compact makes button smaller/skinnier
  onPress?: () => void;
  accessibilityLabel?: string;
};

export default function PillButton({ label, kind="primary", size="default", onPress, accessibilityLabel, style, ...rest }: Props){
  const t = useSafeTokens();
  const primary = kind === "primary";

  // Micro-lift
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.timing(scale, { toValue: 0.98, duration: 90,  easing: Easing.out(Easing.quad),  useNativeDriver:true }).start();
  const pressOut = () => Animated.timing(scale, { toValue: 1,    duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver:true }).start();

  const pv = size === "compact" ? t.spacing.xs : t.spacing.sm;           // 4 vs 8
  const ph = size === "compact" ? t.spacing.sm : t.spacing.md;           // 8 vs 16
  const minH = size === "compact" ? 36 : 44;

  return (
    <Animated.View style={{ transform:[{ scale }] }}>
      <Pressable
        {...rest}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        hitSlop={{ top: Math.max(0, 44 - minH)/2, bottom: Math.max(0, 44 - minH)/2, left: 4, right: 4 }}
        style={[
          {
            paddingHorizontal: ph,
            paddingVertical: pv,
            minHeight: minH,
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