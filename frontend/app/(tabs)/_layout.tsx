import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme, View } from "react-native";
import { tokens } from "../../src/design/tokens";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

/**
 * GlassBar 2.0
 * - Stronger blur
 * - Subtle icon-strip scrim for legibility in both themes
 * - Top hairline
 * - Accent underline under the active icon (2px, rounded)
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
        <View
          style={{
            marginTop: 4,
            height: 2,
            width: 18,
            borderRadius: 999,
            backgroundColor: color
          }}
        />
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
        tabBarInactiveTintColor: scheme === "dark" ? t.textSecondary : t.textTertiary,
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
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 6
        },
        // Background = Blur + scrim for icon legibility
        tabBarBackground: () => (
          <View style={{ flex: 1, borderRadius: 20, overflow: "hidden" }}>
            <BlurView
              intensity={32}
              tint={scheme === "dark" ? "dark" : "light"}
              style={{ flex: 1 }}
            />
            {/* scrim overlay uses token glass with small opacity to help icon legibility */}
            <View style={{ ...StyleSheet.absoluteFillObject as any, backgroundColor: t.glass, opacity: 0.12 }} />
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