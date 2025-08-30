import { View, Text, Pressable, ViewProps } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeTokens } from "../../design/safeTokens";

/** Standard Settings row with label, right-aligned value, and chevron */
export default function SettingsRow({
  label,
  value,
  onPress,
  style,
  ...rest
}: ViewProps & { label: string; value: string; onPress?: () => void }) {
  const t = useSafeTokens();
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} ${value}`}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 12
        },
        style
      ]}
    >
      <Text style={{ color: t.palette.textSecondary }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: t.spacing.sm }}>
        <Text style={{ color: t.palette.textPrimary }}>{value}</Text>
        <Ionicons name="chevron-forward" size={18} color={t.palette.textTertiary} />
      </View>
    </Pressable>
  );
}