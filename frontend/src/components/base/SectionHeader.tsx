import { View, Text, ViewProps } from "react-native";
import { ReactNode } from "react";
import { useSafeTokens } from "../../design/safeTokens";

/** Standard header row to be used inside Card containers (GroupedList, section cards, etc.) */
export default function SectionHeader({
  title,
  right,
  style,
  ...rest
}: ViewProps & { title: string; right?: ReactNode }) {
  const t = useSafeTokens();
  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: t.spacing.lg,
          paddingVertical: 10,
          backgroundColor: t.palette.surface
        },
        style
      ]}
    >
      <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>{title}</Text>
      {right ?? null}
    </View>
  );
}