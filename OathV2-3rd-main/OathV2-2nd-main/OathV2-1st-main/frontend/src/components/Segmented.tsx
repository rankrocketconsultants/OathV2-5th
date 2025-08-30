import { View, Pressable, Text, ScrollView, Animated, Easing } from "react-native";
import { useMemo } from "react";
import { useSafeTokens } from "../design/safeTokens";
import { useTheme } from "../design/ThemeProvider";

export default function Segmented({
  segments,
  value,
  onChange
}: {
  segments: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useSafeTokens();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const activeBg = isDark ? t.palette.bg : t.palette.surfaceElevated;

  // Stable Animated.Value per segment
  const scales = useMemo(
    () => Object.fromEntries(segments.map(s => [s, new Animated.Value(1)])) as Record<string, Animated.Value>,
    [segments]
  );

  const pressIn = (s: string) => {
    Animated.timing(scales[s], {
      toValue: 0.97,
      duration: 90,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
  };

  const pressOut = (s: string) => {
    Animated.timing(scales[s], {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  };

  const handlePress = (s: string) => {
    if (s !== value) onChange(s);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 0 }}>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          backgroundColor: t.palette.glass,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg,
          padding: t.spacing.xs,
          minHeight: 44
        }}
      >
        {segments.map((s, idx) => {
          const active = s === value;
          return (
            <Animated.View key={`${s}-${idx}`} style={{ flex: 1, transform: [{ scale: scales[s] }] }}>
              <Pressable
                onPressIn={() => pressIn(s)}
                onPressOut={() => pressOut(s)}
                onPress={() => handlePress(s)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${s}`}
                style={{
                  flex: 1,
                  paddingVertical: t.spacing.sm,
                  paddingHorizontal: t.spacing.md,
                  borderRadius: t.radii.md,
                  backgroundColor: active ? activeBg : "transparent",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{ color: active ? t.palette.text : t.palette.textSecondary, fontWeight: active ? "700" : "500" }}>
                  {s}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
}