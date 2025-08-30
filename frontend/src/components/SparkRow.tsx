import { View, Text } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import type { Spark } from "../stores/sparksStore";
import PillButton from "./base/PillButton";

/**
 * Sparks row — premium hierarchy:
 * - Title first (bold)
 * - Category badge becomes a ghost tag under the title (start of line 2); note follows
 * - Right side: Archive (ghost) + Convert (accent), both ≥44pt, micro-lift via PillButton
 */
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
        backgroundColor: "transparent",
        borderWidth: t.hairlineWidth,
        borderColor: t.palette.hairline,
        alignSelf: "flex-start"
      }}
    >
      <Text style={{ color: t.palette.textSecondary, fontSize: t.type.caption.size, fontWeight: "700" }}>{label}</Text>
    </View>
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
      {/* LEFT: content */}
      <View style={{ flex: 1, paddingRight: t.spacing.sm }}>
        <Text style={{ color: t.palette.textPrimary, fontWeight: "700", fontSize: t.type.body.size }}>
          {spark.title}
        </Text>

        {/* line 2: badge + optional note */}
        <View style={{ flexDirection:"row", alignItems:"center", gap: t.spacing.sm, marginTop: t.spacing.xs }}>
          {spark.category ? <Badge label={spark.category} /> : null}
          {!!spark.note && (
            <Text style={{ color: t.palette.textTertiary, fontSize: t.type.sub.size }}>
              {spark.note}
            </Text>
          )}
        </View>
      </View>

      {/* RIGHT: actions (ghost + accent), both ≥44pt */}
      <PillButton
        label="Archive"
        kind="ghost"
        accessibilityLabel={`Archive ${spark.title}`}
        onPress={() => onArchive(spark.id)}
        style={{ marginRight: t.spacing.sm }}
      />
      <PillButton
        label="Convert"
        kind="primary"
        accessibilityLabel={`Convert ${spark.title}`}
        onPress={() => onConvert(spark.id)}
      />
    </View>
  );
}