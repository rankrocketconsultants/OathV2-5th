import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { tokens } from "../../src/design/tokens";
import { BlurView } from "expo-blur";

function AnimatedTabIcon({ name, color, focused }:{
  name: React.ComponentProps<typeof Ionicons>["name"]; color: string; focused: boolean;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.96)).current;
  useEffect(() => {
    Animated.timing(scale, { toValue: focused ? 1 : 0.96, duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [focused, scale]);
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={26} color={color} />
    </Animated.View>
  );
}

export default function TabsLayout(){
  const scheme = useColorScheme();
  const t = scheme === "dark" ? tokens.dark : tokens.light;

  const icon = (name: React.ComponentProps<typeof Ionicons>["name"]) =>
    ({ color, focused }: { color: string; focused: boolean }) =>
      <AnimatedTabIcon name={name} color={color} focused={focused} />;

  return (
    <Tabs
      screenOptions={{
        headerShown:false,
        tabBarShowLabel:false,
        tabBarHideOnKeyboard:true,
        tabBarActiveTintColor:t.accent,
        tabBarInactiveTintColor:t.textTertiary,
        tabBarStyle:{ backgroundColor:"transparent", borderTopColor:t.hairlineColor, borderTopWidth:t.hairline, height:64, position:"absolute", left:12, right:12, bottom:12, borderRadius:20 },
        tabBarItemStyle:{ justifyContent:"center", alignItems:"center", paddingTop:6 },
        tabBarBackground:()=>( <BlurView intensity={32} tint={scheme==="dark"?"dark":"light"} style={{ flex:1, borderRadius:20, overflow:"hidden" }}/> )
      }}
    >
      <Tabs.Screen name="index"    options={{ tabBarIcon: icon("home-outline") }}/>
      <Tabs.Screen name="calendar" options={{ tabBarIcon: icon("calendar-outline") }}/>
      <Tabs.Screen name="sparks"   options={{ tabBarIcon: icon("sparkles-outline") }}/>
      <Tabs.Screen name="ledger"   options={{ tabBarIcon: icon("stats-chart-outline") }}/>
    </Tabs>
  );
}