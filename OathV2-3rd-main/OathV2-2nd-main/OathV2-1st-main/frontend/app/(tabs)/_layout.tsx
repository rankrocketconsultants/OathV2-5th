import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import { tokens } from "../../src/design/tokens";
import { BlurView } from "expo-blur";

export default function TabsLayout() {
  const scheme = useColorScheme();
  const t = scheme === "dark" ? tokens.dark : tokens.light;

  const icon = (name: React.ComponentProps<typeof Ionicons>["name"]) =>
    ({ color }: { color: string }) => <Ionicons name={name} size={26} color={color} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.textTertiary,
        // Glass tab bar with top hairline and centered icons
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopColor: t.hairlineColor,
          borderTopWidth: t.hairline,
          height: 64,
          position: "absolute"
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 6
        },
        tabBarBackground: () => (
          <BlurView
            intensity={28}
            tint={scheme === "dark" ? "dark" : "light"}
            style={{ flex: 1 }}
          />
        )
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: icon("home-outline") }} />
      <Tabs.Screen name="calendar" options={{ tabBarIcon: icon("calendar-outline") }} />
      <Tabs.Screen name="sparks" options={{ tabBarIcon: icon("sparkles-outline") }} />
      <Tabs.Screen name="ledger" options={{ tabBarIcon: icon("stats-chart-outline") }} />
    </Tabs>
  );
}