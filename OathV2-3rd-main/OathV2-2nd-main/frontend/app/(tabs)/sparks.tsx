import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import ScreenHeader from "../../src/components/ScreenHeader";
import SideMenu from "../../src/components/SideMenu";
import Segmented from "../../src/components/Segmented";
import GroupedList from "../../src/components/GroupedList";
import Card from "../../src/components/base/Card";
import SparkRow from "../../src/components/SparkRow";
import { useSparksData } from "../../src/stores/sparksStore";
import { useSafeTokens } from "../../src/design/safeTokens";

const segments = ["Sparks", "Type", "Clusters"] as const;

type RowHeader = { kind: "header"; key: string; title: string; ids?: string[]; actions?: "convertAll" };
type RowSpark  = { kind: "row"; key: string; id: string };
type FlatRow   = RowHeader | RowSpark;

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

export default function SparksScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [seg, setSeg] = useState<(typeof segments)[number]>("Sparks");
  const { sparks, convertSpark, archiveSpark, convertMany } = useSparksData();
  const t = useSafeTokens();

  // Build sectioned data based on the active segment
  const flat: FlatRow[] = useMemo(() => {
    if (seg === "Sparks") {
      return sparks.map((s) => ({ kind: "row", key: s.id, id: s.id }));
    }

    if (seg === "Type") {
      const map = new Map<string, string[]>();
      for (const s of sparks) {
        const k = (s.category || "General").trim();
        map.set(k, [...(map.get(k) || []), s.id]);
      }
      const headers = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
      const rows: FlatRow[] = [];
      for (const h of headers) {
        rows.push({ kind: "header", key: `hdr-${h}`, title: h });
        for (const id of map.get(h)!) rows.push({ kind: "row", key: id, id });
      }
      return rows;
    }

    // Clusters
    const cmap = new Map<string, string[]>();
    for (const s of sparks) {
      const tokens = tokenize(s.title);
      const key = tokens[0] || s.category || "General";
      const label = key[0].toUpperCase() + key.slice(1);
      cmap.set(label, [...(cmap.get(label) || []), s.id]);
    }
    const headers = Array.from(cmap.keys()).sort((a, b) => a.localeCompare(b));
    const rows: FlatRow[] = [];
    for (const h of headers) {
      const ids = cmap.get(h)!;
      rows.push({ kind: "header", key: `hdr-${h}`, title: h, actions: "convertAll", ids });
      for (const id of ids) rows.push({ kind: "row", key: id, id });
    }
    return rows;
  }, [sparks, seg]);

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Sparks" onMenu={() => setMenuOpen(true)} />

      {/* Centered connected-pill segmented */}
      <View style={{ paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.sm, paddingBottom: t.spacing.md }}>
        <Segmented segments={[...segments]} value={seg} onChange={(v) => setSeg(v as any)} />
      </View>

      {/* Single authoritative scroller inside a Card via GroupedList */}
      <View style={{ flex: 1, paddingHorizontal: t.spacing.lg }}>
        <GroupedList<FlatRow>
          data={flat}
          keyExtractor={(row, idx) => String(row.key || idx)}
          renderItem={({ item }) => {
            if (item.kind === "header") {
              return (
                <View
                  style={{
                    paddingHorizontal: t.spacing.lg,
                    paddingVertical: 10,
                    backgroundColor: t.palette.surface,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>{item.title}</Text>
                  {item.actions === "convertAll" ? (
                    <Pressable
                      onPress={() => convertMany(item.ids || [])}
                      accessibilityRole="button"
                      accessibilityLabel={`Convert all in ${item.title}`}
                      style={{
                        paddingHorizontal: t.spacing.md,
                        paddingVertical: t.spacing.sm,
                        minHeight: 44,
                        borderRadius: t.radii.pill,
                        backgroundColor: t.palette.accent,
                        borderWidth: t.hairlineWidth,
                        borderColor: t.palette.accent
                      }}
                    >
                      <Text style={{ color: t.palette.onAccent, fontWeight: "700" }}>Convert All</Text>
                    </Pressable>
                  ) : null}
                </View>
              );
            }
            const s = sparks.find(z => z.id === item.id)!;
            return (
              <SparkRow
                spark={s}
                onConvert={(id) => convertSpark(id)}
                onArchive={(id) => archiveSpark(id)}
              />
            );
          }}
          // GroupedList renders inside a Card and hides scrollbars by default
        />
      </View>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}