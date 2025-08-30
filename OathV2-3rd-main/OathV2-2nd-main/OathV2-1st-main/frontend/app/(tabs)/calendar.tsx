import { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import ScreenHeader from "../../src/components/ScreenHeader";
import SideMenu from "../../src/components/SideMenu";
import Segmented from "../../src/components/Segmented";
import { useSafeTokens } from "../../src/design/safeTokens";
import { useItemsData, type Item } from "../../src/stores/itemsStore";
import { useSettings } from "../../src/stores/settingsStore";
import { startOfDay } from "../../src/utils/datetime";
import DaySheet from "../../src/components/DaySheet";

type Mode = "Week" | "Month" | "3 mo";

export default function CalendarScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("Month");
  const t = useSafeTokens();
  const { settings } = useSettings();
  const firstMon = !!settings.firstDayMonday;

  const { items, updateItem, deleteItem } = useItemsData();

  const today = startOfDay(new Date());
  const [selected, setSelected] = useState<Date>(today);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Helper: YYYY-MM-DD key
  const keyOf = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // Count items by day for mini bars
  const countsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      if (!it.datetime) continue;
      const d = startOfDay(new Date(it.datetime));
      map.set(keyOf(d), (map.get(keyOf(d)) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const itemsForDay = useMemo(() => {
    return (d: Date) => {
      const d0 = startOfDay(d).getTime();
      return items.filter(
        (it) => it.datetime && startOfDay(new Date(it.datetime)).getTime() === d0
      );
    };
  }, [items]);

  // Week strip (7 days around selected week, respecting first day)
  const weekStrip = useMemo(() => {
    const sel = startOfDay(selected);
    const dow = sel.getDay(); // 0=Sun
    const offset = firstMon ? ((dow + 6) % 7) : dow;
    const weekStart = new Date(sel);
    weekStart.setDate(sel.getDate() - offset);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [selected, firstMon]);

  // Month grid (6 rows × 7 cols; stable layout)
  const monthGrid = useMemo(() => {
    const first = new Date(selected.getFullYear(), selected.getMonth(), 1);
    const start = new Date(first);
    const firstDow = first.getDay();
    const delta = firstMon ? ((firstDow + 6) % 7) : firstDow;
    start.setDate(first.getDate() - delta);
    return Array.from({ length: 42 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selected, firstMon]);

  // 3-month shell: current + next two
  const threeMonths = useMemo(() => {
    const mk = (m: number) => {
      const first = new Date(selected.getFullYear(), m, 1);
      const start = new Date(first);
      const firstDow = first.getDay();
      const delta = firstMon ? ((firstDow + 6) % 7) : firstDow;
      start.setDate(first.getDate() - delta);
      const grid = Array.from({ length: 42 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });
      const label = first.toLocaleString([], { month: "long", year: "numeric" });
      return { label, grid };
    };
    const baseM = selected.getMonth();
    return [mk(baseM), mk((baseM + 1) % 12), mk((baseM + 2) % 12)];
  }, [selected, firstMon]);

  const openDay = (d: Date) => {
    setSelected(startOfDay(d));
    setSheetOpen(true);
  };

  const inMonth = (d: Date) => d.getMonth() === selected.getMonth();
  const isToday = (d: Date) =>
    startOfDay(d).getTime() === startOfDay(new Date()).getTime();

  const weekdayLabels = () => {
    const base = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    if (firstMon) return [...base.slice(1), "Sun"];
    return base;
    };

  const DayCell = ({ d }: { d: Date }) => {
    const count = countsByDay.get(keyOf(d)) ?? 0;
    const bars = Math.max(0, Math.min(3, count));
    const muted = !inMonth(d);

    return (
      <Pressable onPress={() => openDay(d)} style={{ width: "14.2857%", paddingVertical: 8, paddingHorizontal: 6 }}>
        <View style={{
          borderRadius: t.radii.md,
          paddingVertical: 8, paddingHorizontal: 8,
          backgroundColor: "transparent",
          borderWidth: isToday(d) ? t.hairlineWidth : 0,
          borderColor: isToday(d) ? t.palette.hairline : "transparent"
        }}>
          <Text style={{ color: muted ? t.palette.textTertiary : t.palette.textPrimary, fontWeight: "700" }}>
            {d.getDate()}
          </Text>
          {/* Mini bars (<=3) */}
          <View style={{ flexDirection: "row", marginTop: 6, gap: 3 }}>
            {Array.from({ length: bars }).map((_, i) => (
              <View key={i} style={{ height: 4, width: 8, borderRadius: 2, backgroundColor: t.palette.accent }} />
            ))}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Calendar" onMenu={() => setMenuOpen(true)} />

      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: 8, paddingBottom: 12 }}>
        <Segmented segments={["Week","Month","3 mo"]} value={mode} onChange={(v) => setMode(v as Mode)} />
      </View>

      {mode === "Week" && (
        <View style={{ paddingHorizontal: t.spacing.lg }}>
          <View style={{
            backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairline,
            borderRadius: t.radii.lg, paddingVertical: 8, paddingHorizontal: 6
          }}>
            <View style={{ flexDirection: "row" }}>
              {weekStrip.map((d) => (
                <Pressable
                  key={d.toISOString()}
                  onPress={() => setSelected(startOfDay(d))}
                  onLongPress={() => openDay(d)}
                  style={{ width: "14.2857%", alignItems: "center", paddingVertical: 10 }}
                >
                  <Text style={{ color: t.palette.textPrimary, fontWeight: isToday(d) ? "800" : "700" }}>
                    {d.getDate()}
                  </Text>
                  {/* Minimal dot/bars indication */}
                  <View style={{ flexDirection: "row", marginTop: 4, gap: 2 }}>
                    {Array.from({ length: Math.min(3, countsByDay.get(keyOf(d)) ?? 0) }).map((_, i) => (
                      <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: t.palette.accent }} />
                    ))}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {mode === "Month" && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: t.spacing.lg, paddingBottom: 140 }}>
          <View style={{
            backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairline,
            borderRadius: t.radii.lg, overflow: "hidden", paddingVertical: 6, paddingHorizontal: 6
          }}>
            {/* Weekday labels */}
            <View style={{ flexDirection: "row", paddingHorizontal: 6, paddingBottom: 4 }}>
              {weekdayLabels().map((w) => (
                <View key={w} style={{ width: "14.2857%", alignItems: "center" }}>
                  <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>{w}</Text>
                </View>
              ))}
            </View>
            {/* 6 rows */}
            {Array.from({ length: 6 }).map((_, row) => (
              <View key={row} style={{ flexDirection: "row" }}>
                {monthGrid.slice(row * 7, row * 7 + 7).map((d) => (
                  <DayCell key={d.toISOString()} d={d} />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {mode === "3 mo" && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: t.spacing.lg, paddingBottom: 140, gap: t.spacing.lg }}>
          {threeMonths.map(({ label, grid }) => (
            <View key={label} style={{
              backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairline,
              borderRadius: t.radii.lg, overflow: "hidden", paddingVertical: 6, paddingHorizontal: 6
            }}>
              <View style={{ alignItems: "center", paddingVertical: 6 }}>
                <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>{label}</Text>
              </View>
              {/* Weekday labels (compact) */}
              <View style={{ flexDirection: "row", paddingHorizontal: 6, paddingBottom: 4 }}>
                {weekdayLabels().map((w) => (
                  <View key={w} style={{ width: "14.2857%", alignItems: "center" }}>
                    <Text style={{ color: t.palette.textTertiary, fontSize: 12 }}>{w}</Text>
                  </View>
                ))}
              </View>
              {Array.from({ length: 6 }).map((_, row) => (
                <View key={row} style={{ flexDirection: "row" }}>
                  {grid.slice(row * 7, row * 7 + 7).map((d) => (
                    <Pressable key={d.toISOString()} onPress={() => setSelected(startOfDay(d))} style={{ width: "14.2857%", paddingVertical: 6, alignItems: "center" }}>
                      <Text style={{ color: t.palette.textSecondary }}>{d.getDate()}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* DaySheet — pass ISO for selected */}
      <DaySheet
        visible={sheetOpen}
        dateISO={startOfDay(selected).toISOString()}
        items={itemsForDay(selected) as Item[]}
        onClose={() => setSheetOpen(false)}
        onToggle={(it) => updateItem(String(it.id), { completed: !it.completed })}
        onDelete={(it) => deleteItem(String(it.id))}
      />

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}