import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeTokens } from "../design/safeTokens";
import type { Item } from "../stores/itemsStore";
import { useSettings } from "../stores/settingsStore";
import { formatHM } from "../utils/datetime";
import { Swipeable } from "react-native-gesture-handler";

export type RowItem = Item;

export default function TaskRow({
  item,
  onToggle,
  onDelete,
  onPress
}: {
  item: RowItem;
  onToggle?: (it: RowItem) => void;
  onDelete?: (it: RowItem) => void;
  onPress?: (it: RowItem) => void;
}) {
  const t = useSafeTokens();
  const { settings } = useSettings();
  const completed = !!item.completed;
  const use24h = !!settings.timeFormat24h;

  const timeLabel = item.datetime ? formatHM(new Date(item.datetime), use24h) : null;

  const chipStylesForStatus = () => {
    switch (item.status) {
      case "honored":
        return { bg: t.palette.statusHonoredBg, fg: t.palette.statusHonoredText };
      case "missed":
        return { bg: t.palette.statusMissedBg, fg: t.palette.statusMissedText };
      case "rescheduled":
        return { bg: t.palette.statusRescheduledBg, fg: t.palette.statusRescheduledText };
      default:
        return { bg: t.palette.timeChipBg, fg: t.palette.accent };
    }
  };

  const Chip = ({ label, kind }: { label: string; kind: "time" | "status" }) => {
    const { bg, fg } = kind === "status" ? chipStylesForStatus() : { bg: t.palette.timeChipBg, fg: t.palette.accent };
    return (
      <View
        style={{
          paddingHorizontal: t.spacing.sm + 2,
          paddingVertical: t.spacing.xs,
          borderRadius: t.radii.pill,
          backgroundColor: bg,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairlineColor,
          marginLeft: t.spacing.sm
        }}
      >
        <Text style={{ color: fg, fontWeight: "700", fontSize: t.type.caption.size }}>{label}</Text>
      </View>
    );
  };

  const RightActions = () => (
    <View style={{ flexDirection: "row", alignItems: "center", paddingRight: t.spacing.sm, backgroundColor: t.palette.surface }}>
      <Pressable
        onPress={() => onDelete?.(item)}
        accessibilityRole="button"
        accessibilityLabel="Delete"
        style={{
          paddingHorizontal: t.spacing.md + 2,
          paddingVertical: t.spacing.sm + 2,
          borderRadius: t.radii.pill,
          backgroundColor: t.palette.accent
        }}
      >
        <Text style={{ color: t.palette.onAccent, fontWeight: "700" }}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <Swipeable renderRightActions={RightActions} overshootRight={false}>
      <Pressable
        onPress={() => onPress?.(item)}
        onLongPress={() => onToggle?.(item)}
        style={{ paddingHorizontal: t.spacing.lg, paddingVertical: t.spacing.md, backgroundColor: t.palette.surface }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => onToggle?.(item)} style={{ marginRight: t.spacing.md }}>
            <Ionicons
              name={completed ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={completed ? t.palette.accent : t.palette.textTertiary}
            />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: t.palette.text,
                fontWeight: "700",
                fontSize: t.type.body.size,
                textDecorationLine: completed ? "line-through" : "none",
                opacity: completed ? 0.6 : 1
              }}
            >
              {item.title}
            </Text>
            {!!item.subtitle && (
              <Text style={{ color: t.palette.textTertiary, marginTop: t.spacing.xs, fontSize: t.type.sub.size }}>
                {item.subtitle}
              </Text>
            )}
          </View>

          {timeLabel && <Chip label={timeLabel} kind="time" />}
          {item.status && <Chip label={item.status[0].toUpperCase() + item.status.slice(1)} kind="status" />}
        </View>
      </Pressable>
    </Swipeable>
  );
}