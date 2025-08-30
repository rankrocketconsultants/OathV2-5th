import { View, Text, Pressable } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import type { Spark } from "../stores/sparksStore";

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

  const PillButton = ({
    label,
    kind,
    onPress
  }: {
    label: string;
    kind: "primary" | "ghost";
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        paddingHorizontal: t.spacing.md,
        paddingVertical: t.spacing.sm,
        minHeight: 44,
        borderRadius: t.radii.pill,
        backgroundColor: kind === "primary" ? t.palette.accent : "transparent",
        borderWidth: t.hairlineWidth,
        borderColor: kind === "primary" ? t.palette.accent : t.palette.hairline,
        marginLeft: t.spacing.sm,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text style={{ color: kind === "primary" ? t.palette.onAccent : t.palette.textSecondary, fontWeight: "700" }}>
        {label}
      </Text>
    </Pressable>
  );

  return (
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

      {/* Two visible pill actions */}
      <PillButton label="Archive" kind="ghost" onPress={() => onArchive(spark.id)} />
      <PillButton label="Convert" kind="primary" onPress={() => onConvert(spark.id)} />
    </View>
  );
}