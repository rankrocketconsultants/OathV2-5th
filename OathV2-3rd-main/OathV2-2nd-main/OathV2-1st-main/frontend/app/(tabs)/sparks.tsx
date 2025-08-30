import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import ScreenHeader from "../../src/components/ScreenHeader";
import SideMenu from "../../src/components/SideMenu";
import Segmented from "../../src/components/Segmented";
import GroupedList from "../../src/components/GroupedList";
import SparkRow from "../../src/components/SparkRow";
import { useSparksData } from "../../src/stores/sparksStore";
import { useSafeTokens } from "../../src/design/safeTokens";

const segments = ["Sparks", "Type", "Clusters"] as const;

type RowHeader = { kind: "header"; key: string; title: string; actions?: "convertAll"; ids?: string[]; collapsed?: boolean };
type RowSpark  = { kind: "row"; key: string; id: string };
type FlatRow   = RowHeader | RowSpark;

export default function SparksScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [seg, setSeg] = useState<(typeof segments)[number]>("Sparks");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { sparks, convertSpark, archiveSpark } = useSparksData();
  const t = useSafeTokens();

  // Helpers
  const byCategory = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of sparks) {
      const k = (s.category || "General").trim();
      map.set(k, [...(map.get(k) || []), s.id]);
    }
    return map;
  }, [sparks]);

  const tokenize = (s: string) =>
    s.toLowerCase()
     .replace(/[^a-z0-9\s]/g, " ")
     .split(/\s+/)
     .filter(w => w.length >= 4 && !["with","this","that","from","have","about","into","your","their","them","then","than","some","more","less","time","week","days","done","make","take","plan","task","idea","note","prep","work"].includes(w));

  // Derive simple clusters: top token of each spark title (fallback to category / "General").
  const clusters = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of sparks) {
      const tokens = tokenize(s.title);
      const key = tokens[0] || s.category || "General";
      const label = key[0].toUpperCase() + key.slice(1);
      map.set(label, [...(map.get(label) || []), s.id]);
    }
    return map;
  }, [sparks]);

  const flat: FlatRow[] = useMemo(() => {
    if (seg === "Sparks") {
      return sparks.map(s => ({ kind: "row", key: s.id, id: s.id }));
    }

    const source = seg === "Type" ? byCategory : clusters;
    const rows: FlatRow[] = [];
    for (const [label, ids] of source.entries()) {
      rows.push({ kind: "header", key: `hdr-${label}`, title: label, actions: seg === "Clusters" ? "convertAll" : undefined, ids });
      if (collapsed[label]) continue;
      for (const id of ids) rows.push({ kind: "row", key: id, id });
    }
    // Stable sort headers alphabetically; keep rows in insertion order
    const headers = rows.filter(r => r.kind === "header") as RowHeader[];
    const items   = rows.filter(r => r.kind === "row") as RowSpark[];
    headers.sort((a, b) => a.title.localeCompare(b.title));
    return [...headers, ...items];
  }, [sparks, seg, byCategory, clusters, collapsed]);

  const toggleCollapse = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const convertAll = (ids: string[] | undefined) => {
    if (!ids || ids.length === 0) return;
    // Copy IDs first to avoid mutation-while-iterating issues
    const toConvert = [...ids];
    for (const id of toConvert) convertSpark(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Sparks" onMenu={() => setMenuOpen(true)} />

      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: 8, paddingBottom: 12 }}>
        <Segmented segments={[...segments]} value={seg} onChange={(v) => setSeg(v as any)} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: t.spacing.lg }}>
        <GroupedList<FlatRow>
          data={flat}
          keyExtractor={(row, idx) => String(row.key || idx)}
          renderItem={({ item }) => {
            if (item.kind === "header") {
              const label = item.title;
              const isCollapsed = !!collapsed[label];
              return (
                <View style={{
                  paddingHorizontal: t.spacing.lg, paddingVertical: 10,
                  backgroundColor: t.palette.surface, flexDirection: "row",
                  alignItems: "center", justifyContent: "space-between"
                }}>
                  <Pressable onPress={() => toggleCollapse(label)} accessibilityRole="button" accessibilityLabel={`Toggle ${label}`}>
                    <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>
                      {label} {isCollapsed ? "▸" : "▾"}
                    </Text>
                  </Pressable>
                  {item.actions === "convertAll" && !isCollapsed ? (
                    <Pressable
                      onPress={() => convertAll(item.ids)}
                      accessibilityRole="button"
                      accessibilityLabel={`Convert all in ${label}`}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 6,
                        borderRadius: t.radii.pill, backgroundColor: t.palette.accent
                      }}
                    >
                      <Text style={{ color: t.palette.onAccent, fontWeight: "700" }}>Convert All</Text>
                    </Pressable>
                  ) : null}
                </View>
              );
            }

            // Row
            const s = sparks.find(z => z.id === item.id)!;
            return (
              <SparkRow
                spark={s}
                onConvert={(id) => convertSpark(id)}
                onArchive={(id) => archiveSpark(id)}
              />
            );
          }}
        />
      </View>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}