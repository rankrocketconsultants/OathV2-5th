import { View, Text, Pressable, TextInput, Linking, ScrollView } from "react-native";
import { useSafeTokens } from "../src/design/safeTokens";
import ScreenHeader from "../src/components/ScreenHeader";
import Segmented from "../src/components/Segmented";
import Card from "../src/components/base/Card";
import { useSettings } from "../src/stores/settingsStore";

function TimeField({
  label, value, onChange
}: { label: string; value: string; onChange: (v: string) => void }) {
  const t = useSafeTokens();
  // Normalize common inputs like "930" -> "09:30", clamp to 24h
  const normalize = (s: string) => {
    const raw = s.replace(/[^0-9]/g, "");
    if (raw.length < 3) return value;
    const hh = Math.max(0, Math.min(23, parseInt(raw.slice(0, raw.length - 2), 10)));
    const mm = Math.max(0, Math.min(59, parseInt(raw.slice(-2), 10)));
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: t.spacing.sm }}>
      <Text style={{ color: t.palette.textSecondary }}>{label}</Text>
      <TextInput
        defaultValue={value}
        placeholder="HH:MM"
        placeholderTextColor={t.palette.textTertiary}
        onEndEditing={(e) => onChange(normalize(e.nativeEvent.text.trim()))}
        style={{
          minWidth: 96,
          color: t.palette.textPrimary,
          borderWidth: t.hairlineWidth, borderColor: t.palette.hairline,
          borderRadius: t.radii.md, paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, textAlign: "center"
        }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const t = useSafeTokens();
  const { settings, set } = useSettings();

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
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.palette.bg }}>
      <ScreenHeader title="Settings" />

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

        {/* Quiet Hours */}
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
              <TimeField label="Start" value={settings.quietHoursStart} onChange={(v) => set({ quietHoursStart: v })} />
              <TimeField label="End" value={settings.quietHoursEnd} onChange={(v) => set({ quietHoursEnd: v })} />
            </View>
          )}
        </Card>

        {/* Channels & Bank */}
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
          <View style={{ flexDirection: "row", gap: t.spacing.sm, marginTop: t.spacing.sm }}>
            <Pressable
              onPress={() => set({ smsBank: Math.min(settings.smsBank + 100, settings.smsBankMax + 100), smsBankMax: settings.smsBankMax + 100 })}
              style={{ paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, borderRadius: t.radii.pill, backgroundColor: t.palette.accent }}
            >
              <Text style={{ color: t.palette.onAccent, fontWeight: "700" }}>Top up +100</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const next = settings.plan === "Free" ? "Pro" : settings.plan === "Pro" ? "Elite" : "Free";
                set({ plan: next });
              }}
              style={{ paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, borderRadius: t.radii.pill, borderWidth: t.hairlineWidth, borderColor: t.palette.hairline }}
            >
              <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>Change Plan</Text>
            </Pressable>
          </View>
        </Card>

        {/* Default time buckets */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Default time buckets</Text>
          <TimeField label="Morning"   value={settings.defaultTimes.morning}   onChange={(v) => set({ defaultTimes: { ...settings.defaultTimes, morning: v } })} />
          <TimeField label="Afternoon" value={settings.defaultTimes.afternoon} onChange={(v) => set({ defaultTimes: { ...settings.defaultTimes, afternoon: v } })} />
          <TimeField label="Evening"   value={settings.defaultTimes.evening}   onChange={(v) => set({ defaultTimes: { ...settings.defaultTimes, evening: v } })} />
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

        {/* Theme */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Theme</Text>
          <Segmented
            segments={["System", "Light", "Dark"]}
            value={settings.theme[0].toUpperCase() + settings.theme.slice(1)}
            onChange={(v) => set({ theme: v.toLowerCase() as any })}
          />
          <Text style={{ color: t.palette.textTertiary, marginTop: t.spacing.xs }}>
            Theme applies immediately across the app.
          </Text>
        </Card>

        {/* Plan & Banks (info stub) */}
        <Card>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Plan & Banks</Text>
          <Text style={{ color: t.palette.textSecondary, marginTop: t.spacing.xs }}>
            Current plan: {settings.plan}. Manage SMS bank and plan from the Channels section.
          </Text>
        </Card>

        {/* Export / Import (stubs) */}
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

        {/* Legal */}
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
    </View>
  );
}