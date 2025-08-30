import { View, Pressable, Text, ScrollView } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import { useTheme } from "../design/ThemeProvider";

/**
 * Connected pill Segmented control (global):
 * - Centered track (alignSelf: "center")
 * - Equal-width tiles (flex:1)
 * - Metrics: track p=4; tile pv=10, ph=14; tile radius md=12
 * - Active = ACCENT-FILLED + onAccent text + weight 700
 * - Inactive = OUTLINED (hairline) on glass track
 * - Min tile height 44pt; a11y selected state; hitSlop for ease of tap
 * - No external props added; API remains {segments, value, onChange}
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
  // In dark mode, active bg = bg (darker) for contrast per spec; light uses elevated surface
  const activeBg = isDark ? t.palette.bg : t.palette.surfaceElevated;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      <View
        style={{
          alignSelf: "center",                  // center the whole control
          flexDirection: "row",
          flex: 1,
          backgroundColor: t.palette.glass,
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
                borderRadius: t.radii.md,       // tile radius = md (12)
                backgroundColor: active ? activeBg : "transparent",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                borderWidth: active ? 0 : t.hairlineWidth,
                borderColor: active ? "transparent" : t.palette.hairline
              }}
            >
              <Text
                style={{
                  color: active ? t.palette.textPrimary : t.palette.textSecondary,
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