import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { View, Text, Animated, Easing } from "react-native";
import { useEffect, useMemo, useRef } from "react";
import { useSafeTokens } from "../design/safeTokens";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * HLS ring with visible tail fade:
 * - accent → accent2 gradient
 * - stopOpacity drops near the end to create a fading tail
 */
export default function HlsRing({
  value, size = 200, stroke = 18, duration = 600
}: { value:number; size?:number; stroke?:number; duration?:number; }){
  const t = useSafeTokens();
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;

  const anim = useRef(new Animated.Value(pct)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [pct, duration, anim]);

  const dashOffset = anim.interpolate({ inputRange: [0, 100], outputRange: [C, 0] });
  const gradId = useMemo(() => `hlsGrad-${size}-${stroke}`, [size, stroke]);

  return (
    <View style={{ width:size, alignItems:"center", justifyContent:"center" }}>
      <Svg width={size} height={size} style={{ transform:[{ rotate:"-90deg" }] }}>
        <Defs>
          {/* Tail fade: reduce opacity near 92–100% to create a soft end */}
          <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%"   stopColor={t.palette.accent} stopOpacity={1} />
            <Stop offset="70%"  stopColor={t.palette.accent} stopOpacity={1} />
            <Stop offset="92%"  stopColor={(t.palette as any).accent2 ?? t.palette.accent} stopOpacity={0.65} />
            <Stop offset="98%"  stopColor={(t.palette as any).accent2 ?? t.palette.accent} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={(t.palette as any).accent2 ?? t.palette.accent} stopOpacity={0.15} />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Circle cx={size/2} cy={size/2} r={r} stroke={t.palette.hairline} strokeWidth={stroke} fill="none" strokeLinecap="round" />

        {/* Progress with fading tail */}
        <AnimatedCircle
          cx={size/2} cy={size/2} r={r}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${C} ${C}`}
          strokeDashoffset={dashOffset as any}
          strokeLinecap="round"
        />
      </Svg>

      <View style={{ position:"absolute", alignItems:"center", justifyContent:"center" }}>
        <Text style={{ color:t.palette.textPrimary, fontWeight:"800", fontSize:28, letterSpacing:-0.3 }}>{Math.round(pct)}</Text>
        <Text style={{ color:t.palette.textSecondary }}>HLS</Text>
      </View>
    </View>
  );
}