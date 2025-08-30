import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeTokens } from "../design/safeTokens";

/**
 * ScreenHeader — single source of truth for page headers
 * Rhythm:
 *   - paddingTop: 24 (xl)
 *   - paddingBottom: 16 (md)
 *   - paddingHorizontal: lg
 * Title:
 *   - tokens.type.h1.size, weight 700
 * Affordances:
 *   - Right "hamburger" is 44×44, centered, pill background
 */
export default function ScreenHeader({
  title,
  onMenu
}: {
  title: string;
  onMenu?: () => void;
}) {
  const t = useSafeTokens();

  return (
    <View
      style={{
        paddingTop: t.spacing.xl,         // 24
        paddingBottom: t.spacing.md,      // 16
        paddingHorizontal: t.spacing.lg,  // side rhythm
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: t.palette.bg
      }}
    >
      {/* Large Title (baseline anchor) */}
      <Text
        style={{
          color: t.palette.textPrimary,
          fontSize: t.type.h1.size,
          fontWeight: "700"
        }}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Right affordance (44×44), keep layout even when absent */}
      {onMenu ? (
        <Pressable
          onPress={onMenu}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          style={{
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: t.radii.pill,
            backgroundColor: t.palette.pillBg
          }}
        >
          <Ionicons name="menu-outline" size={22} color={t.palette.textSecondary} />
        </Pressable>
      ) : (
        <View style={{ width: 44, height: 44 }} />
      )}
    </View>
  );
}