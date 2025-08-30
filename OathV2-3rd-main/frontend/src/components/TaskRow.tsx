import { View, Text, Pressable, Animated, Easing } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler";
import { useRef } from "react";
import { useSafeTokens } from "../design/safeTokens";
import type { Item } from "../stores/itemsStore";
import { useSettings } from "../stores/settingsStore";
import { formatHM } from "../utils/datetime";
import Chip from "./base/Chip";

export type RowItem = Item;

export default function TaskRow({
  item, onToggle, onDelete, onPress
}:{ item: RowItem; onToggle?:(it:RowItem)=>void; onDelete?:(it:RowItem)=>void; onPress?:(it:RowItem)=>void; }){
  const t = useSafeTokens();
  const { settings } = useSettings();
  const completed = !!item.completed;
  const use24h = !!settings.timeFormat24h;

  const timeLabel = item.datetime ? formatHM(new Date(item.datetime), use24h) : null;
  const statusKind = item.status === "honored" ? "honored" : item.status === "missed" ? "missed" : item.status === "rescheduled" ? "rescheduled" : "neutral";
  const statusLabel = item.status ? (item.status[0].toUpperCase()+item.status.slice(1)) : null;

  // Micro-lift animation
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.timing(scale, { toValue: 0.99, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scale, { toValue: 1, duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();

  const RightActions = () => (
    <View style={{ flexDirection:"row", alignItems:"center", paddingRight:t.spacing.sm, backgroundColor:t.palette.surface }}>
      <Pressable onPress={()=>onDelete?.(item)} accessibilityRole="button" accessibilityLabel={`Delete ${item.title}`}
        style={{ paddingHorizontal:t.spacing.md+2, paddingVertical:t.spacing.sm+2, minHeight:44, borderRadius:t.radii.pill, backgroundColor:t.palette.accent, alignItems:"center", justifyContent:"center" }}>
        <Text style={{ color:t.palette.onAccent, fontWeight:"700" }}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <Swipeable renderRightActions={RightActions} overshootRight={false}>
      <Animated.View style={{ transform:[{ scale }] }}>
        <Pressable
          onPress={()=>onPress?.(item)}
          onLongPress={()=>onToggle?.(item)}
          onPressIn={pressIn}
          onPressOut={pressOut}
          accessibilityRole="button"
          accessibilityLabel={`Open ${item.title}`}
          style={{ paddingHorizontal:t.spacing.lg, paddingVertical:t.spacing.md, backgroundColor:t.palette.surface }}
        >
          <View style={{ flexDirection:"row", alignItems:"center" }}>
            <Pressable onPress={()=>onToggle?.(item)} accessibilityRole="button" accessibilityLabel={`Toggle ${item.title}`} style={{ marginRight:t.spacing.md, minHeight:44, justifyContent:"center" }}>
              <Ionicons name={completed ? "checkmark-circle" : "ellipse-outline"} size={22} color={completed ? t.palette.accent : t.palette.textTertiary}/>
            </Pressable>

            <View style={{ flex:1 }}>
              <Text style={{ color: completed ? t.palette.textSecondary : t.palette.textPrimary, fontWeight:"700", fontSize:t.type.body.size, textDecorationLine: completed ? "line-through" : "none" }}>
                {item.title}
              </Text>
              {!!item.subtitle && <Text style={{ color:t.palette.textTertiary, marginTop:t.spacing.xs, fontSize:t.type.sub.size }}>{item.subtitle}</Text>}
            </View>

            {timeLabel && <Chip kind="time" label={timeLabel}/>}
            {statusLabel && <Chip kind={statusKind as any} label={statusLabel} style={{ marginLeft:t.spacing.sm }}/>}
          </View>
        </Pressable>
      </Animated.View>
    </Swipeable>
  );
}