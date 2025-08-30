import { tokens, Mode } from "./tokens";
import { useTheme } from "./ThemeProvider";
export function useTokens() {
  const { mode } = useTheme();
  return tokens[(mode as Mode) ?? "light"];
}