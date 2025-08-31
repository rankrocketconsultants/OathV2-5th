import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { View, Text, Animated, Easing } from "react-native";
import { useEffect, useMemo, useRef } from "react";
import { useSafeTokens } from "../design/safeTokens";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * HLS ring — solid GREY track + ACCENT progress + FOLLOWING tail (ACCENT → GREY)
 */
export default function HlsRing({
  value,
  size = 200,
  stroke = 18,
  duration = 600,
  tailFrac = 0.10 // last 10% fades from accent to hairline grey
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

  // Animate 0..100
  const animPct = useRef(new Animated.Value(pct)).current;
  useEffect(() => {
    Animated.timing(animPct, {
      toValue: pct,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [pct, duration, animPct]);

  // fraction 0..1
  const frac = animPct.interpolate({ inputRange: [0, 100], outputRange: [0, 1] });

  // progress length & base offset
  const progressLen = Animated.multiply(C, frac);
  const baseOffset  = Animated.subtract(C, progressLen) as unknown as number;

  // tail length scales with progress (0 at 0%, up to C * tailFrac)
  const tailLen = animPct.interpolate({
    inputRange: [0, 100],
    outputRange: [0, C * tailFrac]
  });

  // place tail so its END matches the live end:
  // tail offset = C - (progressLen - tailLen) = C - progressLen + tailLen
  const tailOffset = Animated.add(Animated.subtract(C, progressLen), tailLen) as unknown as number;

  const gradTailId = useMemo(() => `hlsTailGrad-${size}-${stroke}`, [size, stroke]);

  return (
    <View style={{ width: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          {/* Tail gradient: ACCENT → HAIRLINE (no transparency), so the end visually blends into the GREY track */}
          <LinearGradient id={gradTailId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%"   stopColor={t.palette.accent} />
            <Stop offset="100%" stopColor={t.palette.hairline} />
          </LinearGradient>
        </Defs>

        {/* TRACK: solid grey (blank) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={t.palette.hairline}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />

        {/* BASE PROGRESS: solid ACCENT arc (animated dash) */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={t.palette.accent}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={[C, C] as any}    // numeric array avoids full-stroke artifacts
          strokeDashoffset={baseOffset as any} // C - progressLen
          strokeLinecap="round"
        />

        {/* TAIL OVERLAY: short dash at the arc end with gradient ACCENT → HAIRLINE */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gradTailId})`}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={[tailLen as unknown as number, C] as any}
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