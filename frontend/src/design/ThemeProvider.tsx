import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import type { Mode } from "./tokens";
import { useSettings } from "../stores/settingsStore";

type ThemeCtx = { mode: Mode };
const Ctx = createContext<ThemeCtx>({ mode: "light" });

export function ThemeProvider({ scheme, children }: { scheme: string | null | undefined; children: React.ReactNode }) {
  const device = useColorScheme();
  const { settings } = useSettings();
  const chosen: Mode =
    settings.theme === "system"
      ? (device === "dark" ? "dark" : "light")
      : (settings.theme === "dark" ? "dark" : "light");

  const value = useMemo(() => ({ mode: chosen }), [chosen]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() { return useContext(Ctx); }