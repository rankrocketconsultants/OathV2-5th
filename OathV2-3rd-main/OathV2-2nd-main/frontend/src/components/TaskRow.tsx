import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler";
import { useSafeTokens } from "../design/safeTokens";
import type { Item } from "../stores/itemsStore";
import { useSettings } from "../stores/settingsStore";
import { formatHM } from "../utils/datetime";

export type RowItem = Item;

/**
 * Task row with:
 * - Left toggle icon
 * - Title + optional subtitle
 * - RIGHT chips (time, status) aligned; NO persistent trash icon
 * - Swipe right actions: Delete
 * - Long-press row: toggle complete
 */
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
  const statusLabel = item.status ? item.status[0].toUpperCase() + item.status.slice(1) : null;

  const Chip = ({ label, variant = "neutral" as "neutral" | "accent" }) => (
    <View
      style={{
        paddingHorizontal: t.spacing.sm + 2,
        paddingVertical: t.spacing.xs,
        borderRadius: t.radii.pill,
        backgroundColor: variant === "accent" ? t.palette.accent : t.palette.timeChipBg,
        borderWidth: t.hairlineWidth,
        borderColor: variant === "accent" ? t.palette.accent : t.palette.hairline,
        marginLeft: t.spacing.sm,
        minHeight: 24,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text style={{ color: variant === "accent" ? t.palette.onAccent : t.palette.accent, fontWeight: "700" }}>
        {label}
      </Text>
    </View>
  );

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
        onLongPress={() => onToggle?.(item)} // secondary action
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
                color: t.palette.textPrimary,
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

          {/* RIGHT chips */}
          {timeLabel && <Chip label={timeLabel} variant="neutral" />}
          {statusLabel && <Chip label={statusLabel} variant="neutral" />}
        </View>
      </Pressable>
    </Swipeable>
  );
}