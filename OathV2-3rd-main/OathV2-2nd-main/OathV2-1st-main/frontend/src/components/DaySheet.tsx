import { Modal, View, Text, TextInput, Pressable, Animated, Easing } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSafeTokens } from "../design/safeTokens";
import GroupedList from "./GroupedList";
import TaskRow, { type RowItem } from "./TaskRow";
import { addItem } from "../stores/itemsStore";
import { useSettings } from "../stores/settingsStore";

export default function DaySheet({
  visible,
  dateISO,
  items,
  onClose,
  onToggle,
  onDelete
}: {
  visible: boolean;
  dateISO: string;     // ISO of start-of-day
  items: RowItem[];
  onClose: () => void;
  onToggle: (it: RowItem) => void;
  onDelete: (it: RowItem) => void;
}) {
  const t = useSafeTokens();
  const { settings } = useSettings();

  // Keep mounted while animating out
  const [mounted, setMounted] = useState(visible);
  useEffect(() => { if (visible) setMounted(true); }, [visible]);

  const backdrop = useRef(new Animated.Value(0)).current;   // 0..1
  const translate = useRef(new Animated.Value(24)).current; // px

  useEffect(() => {
    if (visible) {
      // Animate IN
      Animated.parallel([
        Animated.timing(backdrop, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(translate, { toValue: 0, damping: 14, stiffness: 180, mass: 0.8, useNativeDriver: true })
      ]).start();
    } else if (mounted) {
      // Animate OUT, then unmount
      Animated.parallel([
        Animated.timing(backdrop, { toValue: 0, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(translate, { toValue: 24, duration: 140, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ]).start(({ finished }) => finished && setMounted(false));
    }
  }, [visible, mounted, backdrop, translate]);

  const selected = useMemo(() => {
    const d = new Date(dateISO);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [dateISO]);

  const [title, setTitle] = useState("");
  const inputRef = useRef<TextInput>(null);
  useEffect(() => { if (visible) setTimeout(() => inputRef.current?.focus(), 60); }, [visible]);

  const parseHHMM = (s: string) => {
    const [hh, mm] = s.split(":").map((x) => parseInt(x, 10));
    return { hh: isNaN(hh) ? 9 : hh, mm: isNaN(mm) ? 0 : mm };
  };

  const submit = () => {
    const v = title.trim();
    if (!v) return;
    const base = new Date(selected);
    const def = (settings as any)?.defaultReminderTime || (settings as any)?.defaultTimes?.morning || "09:00";
    const { hh, mm } = parseHHMM(def);
    base.setHours(hh, mm, 0, 0);
    addItem(v, { datetime: base.toISOString(), type: "time" });
    setTitle("");
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  if (!mounted) return null;

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop (animated opacity) */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0, bottom: 0, left: 0, right: 0,
          backgroundColor: t.palette.backdrop,
          opacity: backdrop
        }}
      >
        <Pressable onPress={onClose} style={{ flex: 1 }} accessibilityRole="button" accessibilityLabel="Close DaySheet" />
      </Animated.View>

      {/* Sheet (animated translateY) */}
      <Animated.View
        style={{
          position: "absolute",
          left: t.spacing.md, right: t.spacing.md, bottom: t.spacing.md,
          transform: [{ translateY: translate }]
        }}
      >
        <View
          style={{
            backgroundColor: t.palette.surface,
            borderColor: t.palette.hairlineColor, borderWidth: t.hairlineWidth,
            borderRadius: t.radii["2xl"], padding: t.spacing.lg, maxHeight: "70%"
          }}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: t.spacing.md }}>
            <Text style={{ color: t.palette.text, fontSize: t.type.h2.size, fontWeight: "700" }}>
              {selected.toDateString()}
            </Text>
            <Pressable onPress={onClose}><Text style={{ color: t.palette.textSecondary, fontSize: t.type.body.size }}>Close</Text></Pressable>
          </View>

          {/* Quick add */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: t.spacing.md }}>
            <TextInput
              ref={inputRef}
              value={title}
              onChangeText={setTitle}
              placeholder="Add an oath for this day…"
              placeholderTextColor={t.palette.textTertiary}
              style={{
                flex: 1, color: t.palette.text, fontSize: t.type.body.size,
                borderColor: t.palette.hairlineColor, borderWidth: t.hairlineWidth,
                borderRadius: t.radii.md, paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm
              }}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <Pressable
              onPress={submit}
              style={{
                marginLeft: t.spacing.sm,
                paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm,
                borderRadius: t.radii.md, backgroundColor: t.palette.accent
              }}
            >
              <Text style={{ color: t.palette.onAccent, fontWeight: "700", fontSize: t.type.body.size }}>Add</Text>
            </Pressable>
          </View>

          {/* Day list */}
          <View style={{ flex: 1 }}>
            <GroupedList<RowItem>
              data={items}
              keyExtractor={(it, i) => String(it.id ?? i)}
              renderItem={({ item }) => <TaskRow item={item} onToggle={onToggle} onDelete={onDelete} />}
            />
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}