import { useMemo, useState } from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../../src/components/ScreenHeader";
import SideMenu from "../../src/components/SideMenu";
import CaptureBar from "../../src/components/CaptureBar";
import Segmented from "../../src/components/Segmented";
import GroupedList from "../../src/components/GroupedList";
import SectionHeader from "../../src/components/base/SectionHeader";
import TaskRow, { RowItem } from "../../src/components/TaskRow";
import { useItemsData } from "../../src/stores/itemsStore";
import { useSafeTokens } from "../../src/design/safeTokens";
import { startOfDay } from "../../src/utils/datetime";

const filters = ["All", "Action", "Time", "Anchor", "Memory"] as const;

type HeaderRow = { kind: "header"; key: string; title: string };
type DataRow = { kind: "row"; key: string; item: RowItem };
type FlatRow = HeaderRow | DataRow;

export default function HomeScreen() {
  const { items, updateItem, deleteItem, addItem } = useItemsData();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useSafeTokens();
  const inset = useSafeAreaInsets();

  const byFilter = useMemo(() => {
    if (filter === "All") return items;
    return items.filter(it => (it.type ?? "action").toLowerCase() === filter.toLowerCase());
  }, [items, filter]);

  const today = startOfDay(new Date()).getTime();

  const sections = useMemo(() => {
    const todayArr: RowItem[] = [];
    const upcomingArr: RowItem[] = [];
    const laterArr: RowItem[] = [];
    for (const it of byFilter) {
      const dt = it.datetime ? new Date(it.datetime).getTime() : null;
      if (dt !== null) {
        const d0 = startOfDay(new Date(dt)).getTime();
        if (d0 === today) todayArr.push(it);
        else if (d0 > today) upcomingArr.push(it);
        else laterArr.push(it);
      } else {
        laterArr.push(it);
      }
    }
    const flat: FlatRow[] = [];
    const pushSection = (title: string, arr: RowItem[], key: string) => {
      flat.push({ kind: "header", key: `hdr-${key}`, title });
      if (arr.length === 0) {
        flat.push({ kind: "row", key: `empty-${key}`, item: { id: `empty-${key}`, title: "No items yet.", subtitle: "", completed: false } as any });
      } else {
        for (const it of arr) flat.push({ kind: "row", key: it.id, item: it });
      }
    };
    pushSection("Today", todayArr, "today");
    pushSection("Upcoming", upcomingArr, "upcoming");
    pushSection("Later", laterArr, "later");
    return flat;
  }, [byFilter, today]);

  const onSubmit = (text: string) => {
    if (!text.trim()) return;
    addItem(text.trim(), { type: "action" });
  };

  // THE ONLY SCROLLER on Home: GroupedList's FlatList.
  const bottomPad = 100 + inset.bottom; // clear the floating bar comfortably

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Home" onMenu={() => setMenuOpen(true)} />

      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.sm, paddingBottom: t.spacing.sm }}>
        <CaptureBar placeholder="State the oath… I'll make it happen." onSubmit={onSubmit} />
      </View>

      <View style={{ paddingHorizontal: t.spacing.lg, paddingBottom: t.spacing.md }}>
        <Segmented segments={[...filters]} value={filter} onChange={(v) => setFilter(v as any)} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: t.spacing.lg }}>
        <GroupedList<FlatRow>
          data={sections}
          keyExtractor={(row, idx) => row.kind === "header" ? row.key : String(row.key || idx)}
          renderItem={({ item }) => {
            if (item.kind === "header") return <SectionHeader title={item.title} />;
            return (
              <TaskRow
                item={item.item}
                onToggle={(it) => updateItem(String(it.id), { completed: !it.completed })}
                onDelete={(it) => deleteItem(String(it.id))}
              />
            );
          }}
          style={{ marginBottom: 0 }}
        />
        {/* pad the bottom so the last item never hides behind the floating bar */}
        <View style={{ height: bottomPad }} />
      </View>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}