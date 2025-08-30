import { Modal, Pressable, View, Text, TextInput } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSafeTokens } from "../design/safeTokens";
import Card from "./base/Card";
import GroupedList from "./GroupedList";
import TaskRow, { type RowItem } from "./TaskRow";
import { addItem } from "../stores/itemsStore";
import { useSettings } from "../stores/settingsStore";

/**
 * DaySheet overlay:
 * - Rounded, elevated sheet with side margins (overlay card look)
 * - Inline quick-add (field + Add button)
 * - Tasks list inside a Card with hairline separators
 * - Receives ISO date (start-of-day) via `dateISO`
 */
export default function DaySheet({
  visible,
  dateISO,
  items,
  onClose,
  onToggle,
  onDelete
}: {
  visible: boolean;
  dateISO: string;
  items: RowItem[];
  onClose: () => void;
  onToggle: (it: RowItem) => void;
  onDelete: (it: RowItem) => void;
}) {
  const t = useSafeTokens();
  const { settings } = useSettings();

  const selected = useMemo(() => {
    const d = new Date(dateISO);
    if (isNaN(d.getTime())) return new Date();
    return d;
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
    const def = (settings as any)?.defaultTimes?.morning || (settings as any)?.defaultReminderTime || "09:00";
    const { hh, mm } = parseHHMM(def);
    base.setHours(hh, mm, 0, 0);
    addItem(v, { datetime: base, type: "time" });
    setTitle("");
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable onPress={onClose} style={{ position:"absolute", top:0, bottom:0, left:0, right:0, backgroundColor: t.palette.backdrop }} />

      {/* Sheet container */}
      <View style={{ position:"absolute", left: 12, right: 12, bottom: 12 }}>
        <Card padded elevated style={{ maxHeight: "72%" }}>
          {/* Header */}
          <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom: t.spacing.md }}>
            <Text style={{ color: t.palette.textPrimary, fontSize: t.type.h2.size, fontWeight: "700" }}>
              {selected.toDateString()}
            </Text>
            <Pressable onPress={onClose}><Text style={{ color: t.palette.textSecondary }}>Close</Text></Pressable>
          </View>

          {/* Quick add */}
          <View style={{ flexDirection:"row", alignItems:"center", marginBottom: t.spacing.md }}>
            <TextInput
              ref={inputRef}
              value={title}
              onChangeText={setTitle}
              placeholder="Add an oath for this day…"
              placeholderTextColor={t.palette.textTertiary}
              style={{
                flex:1, color: t.palette.textPrimary,
                borderColor: t.palette.hairline, borderWidth: t.hairlineWidth,
                borderRadius: t.radii.md, paddingHorizontal: t.spacing.md, paddingVertical: 10
              }}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <Pressable
              onPress={submit}
              style={{
                marginLeft: t.spacing.sm, paddingHorizontal: t.spacing.md, paddingVertical: 10,
                borderRadius: t.radii.md, backgroundColor: t.palette.accent
              }}
            >
              <Text style={{ color: t.palette.onAccent, fontWeight: "700" }}>Add</Text>
            </Pressable>
          </View>

          {/* Day list inside a Card */}
          <Card padded={false} style={{ flex: 1 }}>
            <GroupedList<RowItem>
              data={items}
              keyExtractor={(it, i) => String(it.id ?? i)}
              renderItem={({ item }) => <TaskRow item={item} onToggle={onToggle} onDelete={onDelete} />}
              style={{ flex: 1 }}
            />
          </Card>
        </Card>
      </View>
    </Modal>
  );
}