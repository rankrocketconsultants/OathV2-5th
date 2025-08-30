// Ensure gesture-handler is initialized before anything else.
import "react-native-gesture-handler";

import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import { ThemeProvider } from "../src/design/ThemeProvider";
import { tokens } from "../src/design/tokens";

export default function RootLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return (
    <ThemeProvider scheme={scheme ?? "light"}>
      <View style={{ flex: 1, backgroundColor: isDark ? tokens.dark.bg : tokens.light.bg }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Slot />
      </View>
    </ThemeProvider>
  );
}