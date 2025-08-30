import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { View, Text, Animated, Easing } from "react-native";
import { useEffect, useMemo, useRef } from "react";
import { useSafeTokens } from "../design/safeTokens";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * HLS ring — Follow-tail fade:
 * - Base arc: solid accent progress
 * - Tail overlay: short arc at the end with accent→transparent gradient
 * - Track remains hairline, visible under transparent fade
 */
export default function HlsRing({
  value,
  size = 200,
  stroke = 18,
  duration = 600,
  tailFrac = 0.10  // fraction of circumference used for the fade tail (10% default)
}: {
  value: number;
  size?: number;
  stroke?: number;
  duration?: number;
  tailFrac?: number;
}) {
  const t = useSafeTokens();
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;

  // Animate progress 0..100
  const animPct = useRef(new Animated.Value(pct)).current;
  useEffect(() => {
    Animated.timing(animPct, {
      toValue: pct,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [pct, duration, animPct]);

  // Derived animated values
  // L = progress length; dashOffset = C - L  (with our -90° rotation start)
  const L = animPct.interpolate({ inputRange: [0, 100], outputRange: [0, C] });
  const dashOffset = Animated.subtract(C, L) as unknown as number;

  // Tail length: min(L, C*tailFrac) so it never exceeds the arc length at low values
  const tailLen = animPct.interpolate({
    inputRange: [0, 100],
    outputRange: [0, C * tailFrac]
  });

  // We want a single visible dash whose START = L - tailLen (i.e., the tail segment),
  // so the SVG dash pattern is: [tailLen, C] and its offset is C - (L - tailLen).
  const tailOffset = Animated.add(Animated.subtract(C, L), tailLen) as unknown as number;

  const gradTailId = useMemo(() => `hlsTailGrad-${size}-${stroke}`, [size, stroke]);

  return (
    <View style={{ width: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          {/* Tail gradient: accent → transparent (reveals hairline track) */}
          <LinearGradient id={gradTailId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={t.palette.accent} stopOpacity={1} />
            <Stop offset="100%" stopColor={t.palette.accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Track (blank target) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={t.palette.hairline}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />

        {/* Base progress arc (solid accent) */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={t.palette.accent}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${C} ${C}`}
          strokeDashoffset={dashOffset as any}
          strokeLinecap="round"
        />

        {/* Tail overlay: short dash positioned at arc end, fading to transparent */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gradTailId})`}
          strokeWidth={stroke}
          fill="none"
          // Single visible dash of length tailLen; the rest is gap
          // dasharray expects numbers, Animated accepts string; Animated.toString handled by RNSVG
          strokeDasharray={[
            // RNSVG will stringify; ensure tailLen never becomes negative/NaN
            // @ts-ignore
            tailLen, C
          ] as any}
          // Place the tail so its end matches the live arc end:
          // offset = C - (L - tailLen) = C - L + tailLen
          strokeDashoffset={tailOffset as any}
          strokeLinecap="round"
        />
      </Svg>

      {/* Center numeral */}
      <View style={{ position: "absolute", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: t.palette.textPrimary, fontWeight: "800", fontSize: 28, letterSpacing: -0.3 }}>
          {Math.round(pct)}
        </Text>
        <Text style={{ color: t.palette.textSecondary }}>HLS</Text>
      </View>
    </View>
  );
}