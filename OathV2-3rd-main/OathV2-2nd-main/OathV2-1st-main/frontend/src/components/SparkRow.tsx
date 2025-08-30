import { View, Text, Pressable } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import type { Spark } from "../stores/sparksStore";
import { Swipeable } from "react-native-gesture-handler";

export default function SparkRow({
  spark,
  onConvert,
  onArchive
}: {
  spark: Spark;
  onConvert: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const t = useSafeTokens();

  const Badge = ({ label }: { label: string }) => (
    <View
      style={{
        paddingHorizontal: t.spacing.sm,
        paddingVertical: t.spacing.xs,
        borderRadius: t.radii.pill,
        backgroundColor: t.palette.pillBg,
        borderWidth: t.hairlineWidth,
        borderColor: t.palette.hairlineColor,
        marginRight: t.spacing.sm
      }}
    >
      <Text style={{ color: t.palette.textSecondary, fontSize: t.type.caption.size, fontWeight: "700" }}>{label}</Text>
    </View>
  );

  const RightActions = () => (
    <View style={{ flexDirection: "row", alignItems: "center", paddingRight: t.spacing.sm, backgroundColor: t.palette.surface }}>
      <Pressable
        onPress={() => onArchive(spark.id)}
        accessibilityRole="button"
        accessibilityLabel="Archive"
        style={{
          paddingHorizontal: t.spacing.md + 2,
          paddingVertical: t.spacing.sm + 2,
          borderRadius: t.radii.pill,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairlineColor
        }}
      >
        <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>Archive</Text>
      </Pressable>
    </View>
  );

  return (
    <Swipeable renderRightActions={RightActions} overshootRight={false}>
      <View
        style={{
          paddingHorizontal: t.spacing.lg,
          paddingVertical: t.spacing.md,
          backgroundColor: t.palette.surface,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View style={{ flex: 1, paddingRight: t.spacing.sm }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spark.category ? t.spacing.xs : 0 }}>
            {spark.category ? <Badge label={spark.category} /> : null}
            <Text style={{ color: t.palette.text, fontWeight: "700", fontSize: t.type.body.size }}>{spark.title}</Text>
          </View>
          {!!spark.note && <Text style={{ color: t.palette.textTertiary, marginTop: t.spacing.xs, fontSize: t.type.sub.size }}>{spark.note}</Text>}
        </View>

        <Pressable
          onPress={() => onConvert(spark.id)}
          accessibilityRole="button"
          accessibilityLabel="Convert"
          style={{
            paddingHorizontal: t.spacing.md,
            paddingVertical: t.spacing.sm,
            borderRadius: t.radii.pill,
            backgroundColor: t.palette.accent
          }}
        >
          <Text style={{ color: t.palette.onAccent, fontWeight: "700", fontSize: t.type.body.size }}>Convert</Text>
        </Pressable>
      </View>
    </Swipeable>
  );
}