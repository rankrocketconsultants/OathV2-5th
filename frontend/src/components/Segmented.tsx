import { View, Pressable, Text, ScrollView } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import { useTheme } from "../design/ThemeProvider";

/**
 * Segmented (Single Active Pill, Centered)
 * - Track = transparent, hairline outline only
 * - Only selected option is accent-pill; others = plain text
 * - Centered container; no full-width stretch
 * - 44pt min; a11y selected state; hitSlop
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
    <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 12 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "transparent",
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairline,
          borderRadius: t.radii.lg,
          padding: 4,
          minHeight: 44
        }}
      >
        {segments.map((s) => {
          const active = s === value;
          return (
            <Pressable
              key={s}
              onPress={() => onChange(s)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${s}`}
              accessibilityState={{ selected: active }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: t.radii.md,
                backgroundColor: active ? t.palette.accent : "transparent",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                marginHorizontal: 2
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
    </View>
  );
}