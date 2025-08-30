import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ScreenHeader from "../../src/components/ScreenHeader";
import SideMenu from "../../src/components/SideMenu";
import { useSafeTokens } from "../../src/design/safeTokens";
import { useItemsData, type Item } from "../../src/stores/itemsStore";
import Segmented from "../../src/components/Segmented";
import Card from "../../src/components/base/Card";
import SectionHeader from "../../src/components/base/SectionHeader";
import HlsRing from "../../src/components/HlsRing";
import TaskRow from "../../src/components/TaskRow";
import { startOfDay } from "../../src/utils/datetime";

type Mode = "Weekly" | "Type" | "Clusters";

export default function LedgerScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("Weekly");
  const { items, updateItem, deleteItem } = useItemsData();
  const t = useSafeTokens();

  // HLS proxy
  const { hls, done, total } = useMemo(() => {
    const d = items.filter((i) => i.completed).length;
    const tot = items.length || 1;
    return { hls: Math.max(0, Math.min(100, Math.round((d / tot) * 100))), done: d, total: tot };
  }, [items]);

  // Basic groupers
  const today0 = startOfDay(new Date()).getTime();
  const yesterday0 = today0 - 24 * 60 * 60 * 1000;
  const weeklyGroups: Record<string, Item[]> = { Today: [], Yesterday: [], "Earlier this week": [] };
  for (const it of items) {
    const ts = it.datetime ? startOfDay(new Date(it.datetime)).getTime() : null;
    if (ts === today0) weeklyGroups["Today"].push(it);
    else if (ts === yesterday0) weeklyGroups["Yesterday"].push(it);
    else weeklyGroups["Earlier this week"].push(it);
  }
  const typeGroups: Record<string, Item[]> = { Action: [], Time: [], Anchor: [], Memory: [] };
  for (const it of items) {
    const k = (it.type || "action").toLowerCase();
    if (k === "time") typeGroups.Time.push(it);
    else if (k === "anchor") typeGroups.Anchor.push(it);
    else if (k === "memory") typeGroups.Memory.push(it);
    else typeGroups.Action.push(it);
  }
  const stop = new Set(["with","this","that","from","have","about","into","your","their","them","then","than","some","more","less","time","week","days","done","make","take","plan","task","idea","note","prep","work"]);
  const clusterGroups = (() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      const token = (it.title.toLowerCase().match(/[a-z0-9]{4,}/g) || []).find(w => !stop.has(w)) || (it.type || "action");
      const label = token[0].toUpperCase() + token.slice(1);
      map.set(label, [...(map.get(label) || []), it]);
    }
    return Object.fromEntries(Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0])));
  })();

  const groupsForMode = (): Array<[string, Item[]]> => {
    if (mode === "Weekly") return Object.entries(weeklyGroups);
    if (mode === "Type")   return Object.entries(typeGroups);
    return Object.entries(clusterGroups);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Ledger" onMenu={() => setMenuOpen(true)} />

      {/* Ring card (as implemented in previous steps) */}
      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.lg }}>
        <Card padded elevated style={{ alignItems: "center" }}>
          <HlsRing value={hls} />
          <View style={{ width: 200, alignItems: "center" }}>
            <Text style={{ color: t.palette.textSecondary, marginTop: t.spacing.sm }}>
              This week: honored {done} / {total}
            </Text>
            <Text style={{ color: t.palette.textTertiary, marginTop: t.spacing.xs }}>
              {/* Anchor line (kept if previously implemented) */}
            </Text>
          </View>
        </Card>
      </View>

      {/* Segmented (single-pill style from FINAL-A) */}
      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.md, paddingBottom: t.spacing.md }}>
        <Segmented segments={["Weekly","Type","Clusters"]} value={mode} onChange={(v) => setMode(v as Mode)} />
      </View>

      {/* Section cards with rows — time chip only, no status chips */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: t.spacing.lg, paddingBottom: t.spacing.xl }} showsVerticalScrollIndicator={false}>
        {groupsForMode().map(([label, rows]) => (
          <Card key={label} padded style={{ marginBottom: t.spacing.lg }}>
            <SectionHeader title={label} />
            <View style={{ borderTopWidth: t.hairlineWidth, borderTopColor: t.palette.hairline }}>
              {rows.length === 0 ? (
                <View style={{ paddingVertical: t.spacing.md }}>
                  <Text style={{ color: t.palette.textTertiary }}>No items</Text>
                </View>
              ) : (
                rows.map((it, idx) => (
                  <View key={it.id}>
                    <TaskRow
                      item={it}
                      onToggle={(i) => updateItem(String(i.id), { completed: !i.completed })}
                      onDelete={(i) => deleteItem(String(i.id))}
                      showStatus={false}   
                    />
                    {idx < rows.length - 1 ? <View style={{ height: t.hairlineWidth, backgroundColor: t.palette.hairline }} /> : null}
                  </View>
                ))
              )}
            </View>
          </Card>
        ))}
      </ScrollView>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}