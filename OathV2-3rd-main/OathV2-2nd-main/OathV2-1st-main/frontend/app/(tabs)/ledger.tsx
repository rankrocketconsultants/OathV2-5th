import { useMemo, useState } from "react";
import { View, Text } from "react-native";
import ScreenHeader from "../../src/components/ScreenHeader";
import SideMenu from "../../src/components/SideMenu";
import { useSafeTokens } from "../../src/design/safeTokens";
import { useItemsData, type Item } from "../../src/stores/itemsStore";
import HlsRing from "../../src/components/HlsRing";
import Segmented from "../../src/components/Segmented";
import GroupedList from "../../src/components/GroupedList";
import TaskRow from "../../src/components/TaskRow";
import { startOfDay } from "../../src/utils/datetime";

type Mode = "Weekly" | "Type" | "Clusters";
type Row = { kind: "header"; key: string; title: string } | { kind: "row"; key: string; item: Item };

function tokenize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length >= 4 &&
        ![
          "with","this","that","from","have","about","into","your","their","them","then","than",
          "some","more","less","time","week","days","done","make","take","plan","task","idea","note","prep","work"
        ].includes(w)
    );
}

export default function LedgerScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("Weekly");
  const { items, updateItem, deleteItem } = useItemsData();
  const t = useSafeTokens();

  // HLS proxy (done/total)
  const { hls, done, total } = useMemo(() => {
    const d = items.filter((i) => i.completed).length;
    const tot = items.length || 1;
    return {
      hls: Math.max(0, Math.min(100, Math.round((d / tot) * 100))),
      done: d,
      total: tot
    };
  }, [items]);

  // Anchor narrative: pick earliest upcoming "anchor" (or "time") within next 7 days
  const anchor = useMemo(() => {
    const now0 = startOfDay(new Date()).getTime();
    const weekEnd = now0 + 7 * 24 * 60 * 60 * 1000;
    const candidates = items
      .filter((i) => i.datetime && (i.type === "anchor" || i.type === "time"))
      .map((i) => ({ it: i, t: startOfDay(new Date(i.datetime!)).getTime() }))
      .filter(({ t }) => t >= now0 && t <= weekEnd)
      .sort((a, b) => a.t - b.t);
    return candidates.length ? candidates[0].it : null;
  }, [items]);

  // WEEKLY: Today / Yesterday / Earlier
  const rowsWeekly: Row[] = useMemo(() => {
    const today0 = startOfDay(new Date()).getTime();
    const yesterday0 = today0 - 24 * 60 * 60 * 1000;

    const today: Item[] = [];
    const yesterday: Item[] = [];
    const earlier: Item[] = [];

    for (const it of items) {
      const ts = it.datetime ? startOfDay(new Date(it.datetime)).getTime() : null;
      if (ts === null || ts < yesterday0) earlier.push(it);
      else if (ts === yesterday0) yesterday.push(it);
      else if (ts === today0) today.push(it);
      else earlier.push(it);
    }

    const flat: Row[] = [];
    const push = (title: string, arr: Item[], key: string) => {
      flat.push({ kind: "header", key: `hdr-${key}`, title });
      for (const it of arr) flat.push({ kind: "row", key: it.id, item: it });
    };
    push("Today", today, "today");
    push("Yesterday", yesterday, "yesterday");
    push("Earlier this week", earlier, "earlier");
    return flat;
  }, [items]);

  // TYPE: group by item.type
  const rowsType: Row[] = useMemo(() => {
    const groups: Record<string, Item[]> = { Action: [], Time: [], Anchor: [], Memory: [] };
    for (const it of items) {
      const k = (it.type || "action").toLowerCase();
      if (k === "time") groups.Time.push(it);
      else if (k === "anchor") groups.Anchor.push(it);
      else if (k === "memory") groups.Memory.push(it);
      else groups.Action.push(it);
    }
    const flat: Row[] = [];
    (["Action","Time","Anchor","Memory"] as const).forEach((label) => {
      flat.push({ kind: "header", key: `hdr-${label}`, title: label });
      for (const it of groups[label]) flat.push({ kind: "row", key: it.id, item: it });
    });
    return flat;
  }, [items]);

  // CLUSTERS: simple keyword-derived headers
  const rowsClusters: Row[] = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      const key = tokenize(it.title)[0] || (it.type || "action");
      const label = key[0].toUpperCase() + key.slice(1);
      map.set(label, [...(map.get(label) || []), it]);
    }
    const headers = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
    const flat: Row[] = [];
    for (const label of headers) {
      flat.push({ kind: "header", key: `hdr-${label}`, title: label });
      for (const it of map.get(label)!) flat.push({ kind: "row", key: it.id, item: it });
    }
    return flat;
  }, [items]);

  const rows = mode === "Weekly" ? rowsWeekly : mode === "Type" ? rowsType : rowsClusters;

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Ledger" onMenu={() => setMenuOpen(true)} />

      {/* Ring + narrative */}
      <View style={{ alignItems: "center", paddingTop: t.spacing.lg }}>
        <HlsRing value={hls} />
        <Text style={{ color: t.palette.textSecondary, marginTop: 8 }}>
          This week: honored {done} / {total}
        </Text>
        <Text style={{ color: t.palette.textTertiary, marginTop: 4 }}>
          {anchor ? `Anchor: ${anchor.title}` : "Anchor: —"}
        </Text>
      </View>

      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.lg, paddingBottom: 12 }}>
        <Segmented segments={["Weekly","Type","Clusters"]} value={mode} onChange={(v) => setMode(v as Mode)} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: t.spacing.lg }}>
        <GroupedList<Row>
          data={rows}
          keyExtractor={(r, i) => r.kind === "header" ? r.key : String(r.key || i)}
          renderItem={({ item }) => {
            if (item.kind === "header") {
              return (
                <View style={{ paddingHorizontal: t.spacing.lg, paddingVertical: 10, backgroundColor: t.palette.surface }}>
                  <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>{item.title}</Text>
                </View>
              );
            }
            return (
              <TaskRow
                item={item.item}
                onToggle={(it) => updateItem(String(it.id), { completed: !it.completed })}
                onDelete={(it) => deleteItem(String(it.id))}
              />
            );
          }}
        />
      </View>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}