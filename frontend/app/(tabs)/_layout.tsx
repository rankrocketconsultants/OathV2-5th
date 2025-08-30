import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme, View, StyleSheet } from "react-native";
import { tokens } from "../../src/design/tokens";
import { BlurView } from "expo-blur";

/**
 * GlassBar 2.1 — more visible, esp. in light:
 * - Stronger blur
 * - Icon-strip scrim (theme-aware), top hairline
 * - Active icon underline (2px rounded)
 * - Improved inactive tints
 */
function TabIcon({ name, color, focused }:{
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={name} size={26} color={color} />
      {focused ? (
        <View style={{ marginTop: 4, height: 2, width: 18, borderRadius: 999, backgroundColor: color }} />
      ) : null}
    </View>
  );
}

export default function TabsLayout() {
  const scheme = useColorScheme();
  const t = scheme === "dark" ? tokens.dark : tokens.light;

  const icon = (name: React.ComponentProps<typeof Ionicons>["name"]) =>
    ({ color, focused }: { color: string; focused: boolean }) =>
      <TabIcon name={name} color={focused ? t.accent : color} focused={focused} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: scheme === "dark" ? t.textSecondary : t.textSecondary,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopColor: t.hairlineColor,
          borderTopWidth: t.hairline,
          height: 64,
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          borderRadius: 20
        },
        tabBarItemStyle: { justifyContent: "center", alignItems: "center", paddingTop: 6 },
        tabBarBackground: () => (
          <View style={{ flex: 1, borderRadius: 20, overflow: "hidden" }}>
            <BlurView intensity={34} tint={scheme === "dark" ? "dark" : "light"} style={{ flex: 1 }} />
            {/* Scrim improves icon contrast (opacity stronger in light) */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: t.glass, opacity: scheme === "dark" ? 0.12 : 0.18 }]} />
          </View>
        )
      }}
    >
      <Tabs.Screen name="index"    options={{ tabBarIcon: icon("home-outline") }} />
      <Tabs.Screen name="calendar" options={{ tabBarIcon: icon("calendar-outline") }} />
      <Tabs.Screen name="sparks"   options={{ tabBarIcon: icon("sparkles-outline") }} />
      <Tabs.Screen name="ledger"   options={{ tabBarIcon: icon("stats-chart-outline") }} />
    </Tabs>
  );
}