import { View, Pressable, Text, ScrollView } from "react-native";
import { useSafeTokens } from "../design/safeTokens";

/**
 * Connected pill Segmented control:
 * - Centered row
 * - Equal-width tiles (flex:1)
 * - Active = ACCENT-FILLED + onAccent text
 * - Inactive = OUTLINED pill on glass track
 * - ≥44pt hit target
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

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 0, flexGrow: 1 }}
    >
      <View
        style={{
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
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: t.radii.md,
                backgroundColor: active ? t.palette.accent : "transparent",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                borderWidth: active ? 0 : t.hairlineWidth,
                borderColor: active ? "transparent" : t.palette.hairline
              }}
              accessibilityRole="button"
              accessibilityLabel={`Select ${s}`}
              accessibilityState={{ selected: active }}
            >
              <Text
                style={{
                  color: active ? t.palette.onAccent : t.palette.textSecondary,
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