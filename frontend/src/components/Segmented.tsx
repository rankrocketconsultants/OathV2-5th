import { View, Pressable, Text, ScrollView } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import { useTheme } from "../design/ThemeProvider";

/**
 * Segmented (Single Active Pill)
 * - Track = transparent (hairline only)
 * - Only the selected option has an accent pill; others are plain text
 * - Centered container; equal-width tiles; 44pt min touch
 * - a11y: accessibilityState.selected on the active tile
 */
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

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 0 }}>
      <View
        style={{
          alignSelf: "center",
          flexDirection: "row",
          flex: 1,
          backgroundColor: "transparent",
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairline,
          borderRadius: t.radii.lg,
          padding: 4,
          minHeight: 44
        }}
      >
        {segments.map((s, idx) => {
          const active = s === value;
          return (
            <Pressable
              key={`${s}-${idx}`}
              onPress={() => onChange(s)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${s}`}
              accessibilityState={{ selected: active }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: t.radii.md,
                backgroundColor: active ? t.palette.accent : "transparent",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                borderWidth: active ? 0 : 0
              }}
            >
              <Text
                style={{
                  color: active ? t.palette.onAccent : (isDark ? t.palette.textSecondary : t.palette.textSecondary),
                  fontWeight: active ? "700" : "500"
                }}
              >
                {s}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}