import { View, Text } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import type { Spark } from "../stores/sparksStore";
import PillButton from "./base/PillButton";

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
        borderColor: t.palette.hairline,
        marginRight: t.spacing.sm,
        minHeight: 22,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text style={{ color: t.palette.textSecondary, fontSize: t.type.caption.size, fontWeight: "700" }}>{label}</Text>
    </View>
  );

  return (
    <View style={{
      paddingHorizontal: t.spacing.lg,
      paddingVertical: t.spacing.md,
      backgroundColor: t.palette.surface,
      flexDirection: "row",
      alignItems: "center"
    }}>
      <View style={{ flex: 1, paddingRight: t.spacing.sm }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spark.category ? t.spacing.xs : 0 }}>
          {spark.category ? <Badge label={spark.category} /> : null}
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700", fontSize: t.type.body.size }}>
            {spark.title}
          </Text>
        </View>
        {!!spark.note && (
          <Text style={{ color: t.palette.textTertiary, marginTop: t.spacing.xs, fontSize: t.type.sub.size }}>
            {spark.note}
          </Text>
        )}
      </View>

      {/* 44pt pill actions with explicit a11y labels */}
      <PillButton label="Archive" kind="ghost" onPress={() => onArchive(spark.id)} accessibilityLabel={`Archive ${spark.title}`} style={{ marginRight: t.spacing.sm }} />
      <PillButton label="Convert" kind="primary" onPress={() => onConvert(spark.id)} accessibilityLabel={`Convert ${spark.title}`} />
    </View>
  );
}