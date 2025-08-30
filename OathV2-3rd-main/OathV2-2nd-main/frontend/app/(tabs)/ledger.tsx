import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ScreenHeader from "../../src/components/ScreenHeader";
import SideMenu from "../../src/components/SideMenu";
import { useSafeTokens } from "../../src/design/safeTokens";
import { useItemsData, type Item } from "../../src/stores/itemsStore";
import Segmented from "../../src/components/Segmented";
import Card from "../../src/components/base/Card";
import HlsRing from "../../src/components/HlsRing";
import TaskRow from "../../src/components/TaskRow";
import { startOfDay } from "../../src/utils/datetime";

type Mode = "Weekly" | "Type" | "Clusters";

export default function LedgerScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("Weekly");
  const { items, updateItem, deleteItem } = useItemsData();
  const t = useSafeTokens();

  // HLS proxy (done/total)
  const { hls, done, total } = useMemo(() => {
    const d = items.filter((i) => i.completed).length;
    const tot = items.length || 1;
    return { hls: Math.max(0, Math.min(100, Math.round((d / tot) * 100))), done: d, total: tot };
  }, [items]);

  // Narrative "anchor": earliest upcoming "anchor" (or "time") within 7 days
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

  // WEEKLY groups: Today / Yesterday / Earlier
  const weeklyGroups = useMemo(() => {
    const today0 = startOfDay(new Date()).getTime();
    const yesterday0 = today0 - 24 * 60 * 60 * 1000;
    const groups: Record<"Today" | "Yesterday" | "Earlier this week", Item[]> = {
      "Today": [], "Yesterday": [], "Earlier this week": []
    };
    for (const it of items) {
      const ts = it.datetime ? startOfDay(new Date(it.datetime)).getTime() : null;
      if (ts === today0) groups["Today"].push(it);
      else if (ts === yesterday0) groups["Yesterday"].push(it);
      else groups["Earlier this week"].push(it);
    }
    return groups;
  }, [items]);

  // TYPE groups
  const typeGroups = useMemo(() => {
    const groups: Record<"Action" | "Time" | "Anchor" | "Memory", Item[]> = {
      "Action": [], "Time": [], "Anchor": [], "Memory": []
    };
    for (const it of items) {
      const k = (it.type || "action").toLowerCase();
      if (k === "time") groups.Time.push(it);
      else if (k === "anchor") groups.Anchor.push(it);
      else if (k === "memory") groups.Memory.push(it);
      else groups.Action.push(it);
    }
    return groups;
  }, [items]);

  // CLUSTERS (simple keyword heuristic on title)
  const clusterGroups = useMemo(() => {
    const stop = new Set(["with","this","that","from","have","about","into","your","their","them","then","than","some","more","less","time","week","days","done","make","take","plan","task","idea","note","prep","work"]);
    const map = new Map<string, Item[]>();
    for (const it of items) {
      const token = (it.title.toLowerCase().match(/[a-z0-9]{4,}/g) || []).find(w => !stop.has(w)) || (it.type || "action");
      const label = token[0].toUpperCase() + token.slice(1);
      map.set(label, [...(map.get(label) || []), it]);
    }
    const sorted = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return Object.fromEntries(sorted) as Record<string, Item[]>;
  }, [items]);

  // Helper: render a section card with header + rows (NO inner scrolling)
  const SectionCard = ({ title, rows }: { title: string; rows: Item[] }) => (
    <Card padded style={{ marginBottom: t.spacing.lg }}>
      <Text style={{ color: t.palette.textSecondary, fontWeight: "700", marginBottom: t.spacing.sm }}>{title}</Text>
      <View style={{ borderTopWidth: t.hairlineWidth, borderTopColor: t.palette.hairline }}>
        {rows.map((it, idx) => (
          <View key={it.id}>
            <TaskRow
              item={it}
              onToggle={(i) => updateItem(String(i.id), { completed: !i.completed })}
              onDelete={(i) => deleteItem(String(i.id))}
            />
            {idx < rows.length - 1 ? <View style={{ height: t.hairlineWidth, backgroundColor: t.palette.hairline }} /> : null}
          </View>
        ))}
        {rows.length === 0 && (
          <View style={{ paddingVertical: t.spacing.md }}>
            <Text style={{ color: t.palette.textTertiary }}>No items</Text>
          </View>
        )}
      </View>
    </Card>
  );

  // Choose groups based on mode
  const groupsForMode = (): Array<[string, Item[]]> => {
    if (mode === "Weekly") return Object.entries(weeklyGroups);
    if (mode === "Type")   return [["Action", typeGroups.Action], ["Time", typeGroups.Time], ["Anchor", typeGroups.Anchor], ["Memory", typeGroups.Memory]];
    return Object.entries(clusterGroups); // Clusters
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Ledger" onMenu={() => setMenuOpen(true)} />

      {/* Ring in its own Card */}
      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.lg }}>
        <Card padded elevated style={{ alignItems: "center" }}>
          <HlsRing value={hls} />
          <Text style={{ color: t.palette.textSecondary, marginTop: t.spacing.sm }}>
            This week: honored {done} / {total}
          </Text>
          <Text style={{ color: t.palette.textTertiary, marginTop: t.spacing.xs }}>
            {anchor ? `Anchor: ${anchor.title}` : "Anchor: —"}
          </Text>
        </Card>
      </View>

      {/* Centered connected-pill Segmented */}
      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.md, paddingBottom: t.spacing.md }}>
        <Segmented segments={["Weekly","Type","Clusters"]} value={mode} onChange={(v) => setMode(v as Mode)} />
      </View>

      {/* SINGLE authoritative scroller with Section Cards (no nested scrolls) */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: t.spacing.lg, paddingBottom: t.spacing.xl }} showsVerticalScrollIndicator={false}>
        {groupsForMode().map(([label, rows]) => (
          <SectionCard key={label} title={label} rows={rows} />
        ))}
      </ScrollView>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}