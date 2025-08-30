import { useState } from "react";
import { View, Text, Pressable, TextInput, Linking, ScrollView } from "react-native";
import { useSafeTokens } from "../src/design/safeTokens";
import ScreenHeader from "../src/components/ScreenHeader";
import SideMenu from "../src/components/SideMenu";
import Segmented from "../src/components/Segmented";
import Card from "../src/components/base/Card";
import SettingsRow from "../src/components/settings/SettingsRow";
import { useSettings } from "../src/stores/settingsStore";

/** Normalize "HH:MM" input without new deps */
function normalizeHHMM(current: string, incoming: string) {
  const s = incoming.replace(/[^0-9]/g, "");
  if (s.length < 3) return current;
  const hh = Math.max(0, Math.min(23, parseInt(s.slice(0, s.length - 2), 10)));
  const mm = Math.max(0, Math.min(59, parseInt(s.slice(-2), 10)));
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export default function SettingsScreen() {
  const t = useSafeTokens();
  const { settings, set } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  // Inline editors for quiet hours
  const [editStart, setEditStart] = useState(false);
  const [editEnd, setEditEnd] = useState(false);
  const [tempStart, setTempStart] = useState(settings.quietHoursStart);
  const [tempEnd, setTempEnd] = useState(settings.quietHoursEnd);

  const BankBar = () => {
    const pct = Math.max(0, Math.min(1, settings.smsBank / (settings.smsBankMax || 1)));
    return (
      <View style={{ marginTop: t.spacing.xs }}>
        <Text style={{ color: t.palette.textTertiary, marginBottom: t.spacing.xs }}>
          SMS Bank {settings.smsBank} / {settings.smsBankMax} ({settings.plan})
        </Text>
        <View style={{ height: 8, borderRadius: 6, backgroundColor: t.palette.glass, overflow: "hidden" }}>
          <View style={{ width: `${pct * 100}%`, height: "100%", backgroundColor: t.palette.accent }} />
        </View>
        {/* Caption under the meter for clarity */}
        <Text style={{ color: t.palette.textTertiary, fontSize: t.type.caption.size, marginTop: t.spacing.xs }}>
          Pro/Elite include larger banks. Top-ups add +100.
        </Text>
      </View>
    );
  };

  // Inline editor row (revealed under a SettingsRow when editing)
  const InlineEditor = ({
    value,
    onChange,
    onSave,
    onCancel
  }: {
    value: string;
    onChange: (s: string) => void;
    onSave: () => void;
    onCancel: () => void;
  }) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: t.spacing.sm, marginTop: t.spacing.xs }}>
      <TextInput
        defaultValue={value}
        placeholder="HH:MM"
        placeholderTextColor={t.palette.textTertiary}
        onEndEditing={(e) => onChange(normalizeHHMM(value, e.nativeEvent.text.trim()))}
        style={{
          flexGrow: 1,
          minWidth: 120,
          color: t.palette.textPrimary,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairline,
          borderRadius: t.radii.md,
          paddingHorizontal: t.spacing.md,
          paddingVertical: t.spacing.sm,
          textAlign: "center"
        }}
      />
      <Pressable
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Cancel edit"
        style={{
          paddingHorizontal: t.spacing.md,
          paddingVertical: t.spacing.sm,
          minHeight: 44,
          borderRadius: t.radii.pill,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.hairline,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>Cancel</Text>
      </Pressable>
      <Pressable
        onPress={onSave}
        accessibilityRole="button"
        accessibilityLabel="Save time"
        style={{
          paddingHorizontal: t.spacing.md,
          paddingVertical: t.spacing.sm,
          minHeight: 44,
          borderRadius: t.radii.pill,
          backgroundColor: t.palette.accent,
          borderWidth: t.hairlineWidth,
          borderColor: t.palette.accent,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={{ color: t.palette.onAccent, fontWeight: "700" }}>Save</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Settings" onMenu={() => setMenuOpen(true)} />

      {/* SINGLE authoritative scroller */}
      <ScrollView
        contentContainerStyle={{ padding: t.spacing.lg, gap: t.spacing.lg, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intensity */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700", marginBottom: t.spacing.sm }}>Intensity</Text>
          <Segmented
            segments={["Gentle", "Standard", "Firm"]}
            value={settings.intensity}
            onChange={(v) => set({ intensity: v as any })}
          />
        </Card>

        {/* Quiet Hours with chevron rows + inline editors */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Quiet Hours</Text>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: t.spacing.sm }}>
            <Text style={{ color: t.palette.textSecondary }}>
              {settings.quietHoursEnabled ? `On · ${settings.quietHoursStart}–${settings.quietHoursEnd}` : "Off"}
            </Text>
            <Pressable
              onPress={() => set({ quietHoursEnabled: !settings.quietHoursEnabled })}
              style={{ paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, borderRadius: t.radii.pill, backgroundColor: t.palette.pillBg }}
            >
              <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>
                {settings.quietHoursEnabled ? "Disable" : "Enable"}
              </Text>
            </Pressable>
          </View>

          {settings.quietHoursEnabled && (
            <View style={{ marginTop: t.spacing.sm }}>
              <SettingsRow
                label="Start"
                value={settings.quietHoursStart}
                onPress={() => {
                  setTempStart(settings.quietHoursStart);
                  setEditStart((s) => !s);
                  setEditEnd(false);
                }}
              />
              {editStart && (
                <InlineEditor
                  value={tempStart}
                  onChange={(v) => setTempStart(v)}
                  onCancel={() => setEditStart(false)}
                  onSave={() => {
                    set({ quietHoursStart: tempStart });
                    setEditStart(false);
                  }}
                />
              )}

              <SettingsRow
                label="End"
                value={settings.quietHoursEnd}
                onPress={() => {
                  setTempEnd(settings.quietHoursEnd);
                  setEditEnd((s) => !s);
                  setEditStart(false);
                }}
              />
              {editEnd && (
                <InlineEditor
                  value={tempEnd}
                  onChange={(v) => setTempEnd(v)}
                  onCancel={() => setEditEnd(false)}
                  onSave={() => {
                    set({ quietHoursEnd: tempEnd });
                    setEditEnd(false);
                  }}
                />
              )}
            </View>
          )}
        </Card>

        {/* Channels & Bank with caption */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Channels</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: t.spacing.sm }}>
            <Text style={{ color: t.palette.textSecondary }}>Push</Text>
            <Pressable onPress={() => set({ channelsPush: !settings.channelsPush })} style={{ paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, borderRadius: t.radii.pill, backgroundColor: t.palette.pillBg }}>
              <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>{settings.channelsPush ? "On" : "Off"}</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: t.spacing.sm }}>
            <Text style={{ color: t.palette.textSecondary }}>SMS</Text>
            <Pressable onPress={() => set({ channelsSMS: !settings.channelsSMS })} style={{ paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, borderRadius: t.radii.pill, backgroundColor: t.palette.pillBg }}>
              <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>{settings.channelsSMS ? "On" : "Off"}</Text>
            </Pressable>
          </View>
          <BankBar />
        </Card>

        {/* Display */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Display</Text>
          <Text style={{ color: t.palette.textSecondary, marginTop: t.spacing.xs }}>Time Format</Text>
          <Segmented
            segments={["12h", "24h"]}
            value={settings.timeFormat24h ? "24h" : "12h"}
            onChange={(v) => set({ timeFormat24h: v === "24h" })}
          />
          <View style={{ height: t.spacing.md }} />
          <Text style={{ color: t.palette.textSecondary, marginBottom: t.spacing.xs }}>First day of week</Text>
          <Segmented
            segments={["Sun", "Mon"]}
            value={settings.firstDayMonday ? "Mon" : "Sun"}
            onChange={(v) => set({ firstDayMonday: v === "Mon" })}
          />
        </Card>

        {/* Theme — LIVE Light/Dark/System switch */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Theme</Text>
          <Segmented
            segments={["System", "Light", "Dark"]}
            value={settings.theme[0].toUpperCase() + settings.theme.slice(1)}
            onChange={(v) => set({ theme: v.toLowerCase() as "system" | "light" | "dark" })}
          />
          <Text style={{ color: t.palette.textTertiary, marginTop: t.spacing.xs }}>
            Changes apply immediately across the app.
          </Text>
        </Card>

        {/* Plan & Banks, Export/Import, Legal (unchanged content) */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Plan & Banks</Text>
          <Text style={{ color: t.palette.textSecondary, marginTop: t.spacing.xs }}>
            Current plan: {settings.plan}. Manage SMS bank and plan from the Channels section.
          </Text>
        </Card>

        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Export / Import</Text>
          <View style={{ flexDirection: "row", gap: t.spacing.sm, marginTop: t.spacing.sm }}>
            <Pressable style={{ paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, borderRadius: t.radii.pill, borderWidth: t.hairlineWidth, borderColor: t.palette.hairline }}>
              <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>Export (stub)</Text>
            </Pressable>
            <Pressable style={{ paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, borderRadius: t.radii.pill, borderWidth: t.hairlineWidth, borderColor: t.palette.hairline }}>
              <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>Import (stub)</Text>
            </Pressable>
          </View>
        </Card>

        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Legal</Text>
          <Pressable onPress={() => Linking.openURL("https://example.com/privacy")} style={{ marginTop: t.spacing.xs }}>
            <Text style={{ color: t.palette.textSecondary }}>Privacy Policy</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL("https://example.com/terms")} style={{ marginTop: t.spacing.xs }}>
            <Text style={{ color: t.palette.textSecondary }}>Terms of Service</Text>
          </Pressable>
        </Card>
      </ScrollView>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}