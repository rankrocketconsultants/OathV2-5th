import { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../../src/components/ScreenHeader";
import SideMenu from "../../src/components/SideMenu";
import Segmented from "../../src/components/Segmented";
import Card from "../../src/components/base/Card";
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
  const inset = useSafeAreaInsets();
  const { settings } = useSettings();
  const firstMon = !!settings.firstDayMonday;
  const { items, updateItem, deleteItem } = useItemsData();

  const today = startOfDay(new Date());
  const [selected, setSelected] = useState<Date>(today);
  const [sheetOpen, setSheetOpen] = useState(false);

  const keyOf = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

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
      return items.filter(it => it.datetime && startOfDay(new Date(it.datetime)).getTime() === d0);
    };
  }, [items]);

  const weekStrip = useMemo(() => {
    const sel = startOfDay(selected);
    const dow = sel.getDay();
    const offset = firstMon ? ((dow + 6) % 7) : dow;
    const weekStart = new Date(sel);
    weekStart.setDate(sel.getDate() - offset);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [selected, firstMon]);

  const monthGrid = useMemo(() => {
    const first = new Date(selected.getFullYear(), selected.getMonth(), 1);
    const start = new Date(first);
    const firstDow = first.getDay();
    const delta = firstMon ? ((firstDow + 6) % 7) : firstDow;
    start.setDate(first.getDate() - delta);
    return Array.from({ length: 42 }).map((_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      return d;
    });
  }, [selected, firstMon]);

  const threeMonths = useMemo(() => {
    const mk = (m: number) => {
      const first = new Date(selected.getFullYear(), m, 1);
      const start = new Date(first);
      const firstDow = first.getDay();
      const delta = firstMon ? ((firstDow + 6) % 7) : firstDow;
      start.setDate(first.getDate() - delta);
      const grid = Array.from({ length: 42 }).map((_, i) => {
        const d = new Date(start); d.setDate(start.getDate() + i); return d;
      });
      const label = first.toLocaleString([], { month: "long", year: "numeric" });
      return { label, grid };
    };
    const base = selected.getMonth();
    return [mk(base), mk((base + 1) % 12), mk((base + 2) % 12)];
  }, [selected, firstMon]);

  const openDay = (d: Date) => {
    setSelected(startOfDay(d));
    setSheetOpen(true);
  };

  const inMonth = (d: Date) => d.getMonth() === selected.getMonth();
  const isToday = (d: Date) => startOfDay(d).getTime() === startOfDay(new Date()).getTime();

  const weekdayLabels = () => {
    const base = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return firstMon ? [...base.slice(1), "Sun"] : base;
  };

  const DayCell = ({ d }: { d: Date }) => {
    const bars = Math.min(3, countsByDay.get(keyOf(d)) ?? 0);
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
          <View style={{ flexDirection: "row", marginTop: 6, gap: 3 }}>
            {Array.from({ length: bars }).map((_, i) => (
              <View key={i} style={{ height: 4, width: 8, borderRadius: 2, backgroundColor: t.palette.accent }} />
            ))}
          </View>
        </View>
      </Pressable>
    );
  };

  const bottomPad = 100 + inset.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Calendar" onMenu={() => setMenuOpen(true)} />

      {/* Centered single-pill segmented */}
      <Segmented segments={["Week","Month","3 mo"]} value={mode} onChange={(v) => setMode(v as Mode)} />

      {/* Page scroller (only scroller) */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: t.spacing.lg, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        {mode === "Week" && (
          <Card padded elevated>
            <View style={{ flexDirection: "row" }}>
              {weekStrip.map((d) => (
                <Pressable
                  key={d.toISOString()}
                  onPress={() => setSelected(startOfDay(d))}
                  onLongPress={() => openDay(d)}
                  style={{ width: "14.2857%", alignItems: "center", paddingVertical: 10 }}
                >
                  <Text style={{ color: t.palette.textPrimary, fontWeight: isToday(d) ? "800" : "700" }}>{d.getDate()}</Text>
                  <View style={{ flexDirection: "row", marginTop: 4, gap: 2 }}>
                    {Array.from({ length: Math.min(3, countsByDay.get(keyOf(d)) ?? 0) }).map((_, i) => (
                      <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: t.palette.accent }} />
                    ))}
                  </View>
                </Pressable>
              ))}
            </View>
          </Card>
        )}

        {mode === "Month" && (
          <Card padded={false} elevated>
            <View style={{ flexDirection: "row", paddingHorizontal: 6, paddingVertical: 6 }}>
              {weekdayLabels().map((w) => (
                <View key={w} style={{ width: "14.2857%", alignItems: "center" }}>
                  <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>{w}</Text>
                </View>
              ))}
            </View>
            {Array.from({ length: 6 }).map((_, row) => (
              <View key={row} style={{ flexDirection: "row" }}>
                {monthGrid.slice(row * 7, row * 7 + 7).map((d) => <DayCell key={d.toISOString()} d={d} />)}
              </View>
            ))}
          </Card>
        )}

        {mode === "3 mo" && (
          <View style={{ gap: t.spacing.lg }}>
            {threeMonths.map(({ label, grid }) => (
              <Card key={label} padded={false} elevated>
                <View style={{ alignItems: "center", paddingVertical: 6 }}>
                  <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>{label}</Text>
                </View>
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
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

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