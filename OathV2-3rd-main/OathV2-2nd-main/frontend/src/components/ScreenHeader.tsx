import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeTokens } from "../design/safeTokens";

export default function ScreenHeader({ title, onMenu }: { title: string; onMenu?: () => void }) {
  const t = useSafeTokens();
  return (
    <View
      style={{
        paddingTop: t.spacing.xl,
        paddingBottom: t.spacing.md,
        paddingHorizontal: t.spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: t.palette.bg
      }}
    >
      <Text style={{ color: t.palette.text, fontSize: t.type.h1.size, fontWeight: "700" }}>{title}</Text>
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