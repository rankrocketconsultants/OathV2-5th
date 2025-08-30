import { View, Text } from "react-native";
import { tokens } from "../src/design/tokens";
import { useTheme } from "../src/design/ThemeProvider";

export default function TokensOK() {
  const { mode } = useTheme();
  const t = tokens[mode];

  const swatch: Array<[string, string]> = [
    ["accent", t.accent],
    ["onAccent", t.onAccent],
    ["bg", t.bg],
    ["surface", t.surface],
    ["surfaceElevated", t.surfaceElevated],
    ["text", t.text],
    ["textSecondary", t.textSecondary],
    ["textTertiary", t.textTertiary],
    ["hairlineColor", t.hairlineColor],
    ["timeChipBg", t.timeChipBg]
  ];

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, padding: 24, gap: 16 }}>
      <Text style={{ color: t.text, fontSize: 24, fontWeight: "700" }}>TOKENS_OK</Text>
      <Text style={{ color: t.textSecondary }}>
        If you can read this and see contrasting swatches below in both light and dark modes, tokens are wired correctly.
      </Text>
      <View style={{ gap: 12 }}>
        {swatch.map(([name, color]) => (
          <View
            key={name}
            style={{
              borderWidth: t.hairline,
              borderColor: t.hairlineColor,
              borderRadius: t.radii.lg,
              overflow: "hidden"
            }}
          >
            <View style={{ backgroundColor: color, height: 40 }} />
            <View style={{ padding: 8 }}>
              <Text style={{ color: t.text }}>{name}</Text>
              <Text style={{ color: t.textTertiary, fontSize: 12 }}>{String(color)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}