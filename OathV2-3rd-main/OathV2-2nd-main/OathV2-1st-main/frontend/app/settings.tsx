import { View, Text, Pressable, TextInput, Linking, ScrollView } from "react-native";
import { useSafeTokens } from "../src/design/safeTokens";
import ScreenHeader from "../src/components/ScreenHeader";
import { useSettings } from "../src/stores/settingsStore";
import Segmented from "../src/components/Segmented";

function TimeField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useSafeTokens();
  const normalize = (s: string) => {
    const m = s.match(/^(\d{1,2}):?(\d{2})$/);
    if (!m) return value;
    let hh = Math.max(0, Math.min(23, parseInt(m[1], 10)));
    const mm = Math.max(0, Math.min(59, parseInt(m[2], 10)));
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
      <Text style={{ color: t.palette.textSecondary }}>{label}</Text>
      <TextInput
        defaultValue={value}
        placeholder="HH:MM"
        placeholderTextColor={t.palette.textTertiary}
        onEndEditing={(e) => onChange(normalize(e.nativeEvent.text.trim()))}
        style={{
          minWidth: 96,
          color: t.palette.textPrimary,
          borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.md, paddingHorizontal: 10, paddingVertical: 8, textAlign: "center"
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
      <View style={{ marginTop: 6 }}>
        <Text style={{ color: t.palette.textTertiary, marginBottom: 6 }}>
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

      <ScrollView contentContainerStyle={{ padding: t.spacing.lg, gap: t.spacing.lg, paddingBottom: 160 }}>
        {/* Intensity */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: t.spacing.sm
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Intensity</Text>
          <Segmented
            segments={["Gentle", "Standard", "Firm"]}
            value={settings.intensity}
            onChange={(v) => set({ intensity: v as any })}
          />
        </View>

        {/* Quiet Hours */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: 8
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Quiet Hours</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: t.palette.textSecondary }}>
              {settings.quietHoursEnabled ? `On · ${settings.quietHoursStart}–${settings.quietHoursEnd}` : "Off"}
            </Text>
            <Pressable
              onPress={() => set({ quietHoursEnabled: !settings.quietHoursEnabled })}
              style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: t.radii.pill, backgroundColor: t.palette.pillBg }}
            >
              <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>
                {settings.quietHoursEnabled ? "Disable" : "Enable"}
              </Text>
            </Pressable>
          </View>
          {settings.quietHoursEnabled && (
            <View style={{ marginTop: 8 }}>
              <TimeField label="Start" value={settings.quietHoursStart} onChange={(v) => set({ quietHoursStart: v })} />
              <TimeField label="End" value={settings.quietHoursEnd} onChange={(v) => set({ quietHoursEnd: v })} />
            </View>
          )}
        </View>

        {/* Channels & Bank */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: 10
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Channels</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: t.palette.textSecondary }}>Push</Text>
            <Pressable onPress={() => set({ channelsPush: !settings.channelsPush })} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: t.radii.pill, backgroundColor: t.palette.pillBg }}>
              <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>{settings.channelsPush ? "On" : "Off"}</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: t.palette.textSecondary }}>SMS</Text>
            <Pressable onPress={() => set({ channelsSMS: !settings.channelsSMS })} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: t.radii.pill, backgroundColor: t.palette.pillBg }}>
              <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>{settings.channelsSMS ? "On" : "Off"}</Text>
            </Pressable>
          </View>
          <BankBar />
          <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
            <Pressable
              onPress={() => set({ smsBank: Math.min(settings.smsBank + 100, settings.smsBankMax + 100), smsBankMax: settings.smsBankMax + 100 })}
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: t.radii.pill, backgroundColor: t.palette.accent }}
            >
              <Text style={{ color: t.palette.onAccent, fontWeight: "700" }}>Top up +100</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const next = settings.plan === "Free" ? "Pro" : settings.plan === "Pro" ? "Elite" : "Free";
                set({ plan: next });
              }}
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: t.radii.pill, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor }}
            >
              <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>Change Plan</Text>
            </Pressable>
          </View>
        </View>

        {/* Default time buckets */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: 8
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Default time buckets</Text>
          <TimeField label="Morning" value={settings.defaultTimes.morning} onChange={(v) => set({ defaultTimes: { ...settings.defaultTimes, morning: v } })} />
          <TimeField label="Afternoon" value={settings.defaultTimes.afternoon} onChange={(v) => set({ defaultTimes: { ...settings.defaultTimes, afternoon: v } })} />
          <TimeField label="Evening" value={settings.defaultTimes.evening} onChange={(v) => set({ defaultTimes: { ...settings.defaultTimes, evening: v } })} />
        </View>

        {/* Display */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: 10
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Display</Text>
          <Text style={{ color: t.palette.textSecondary }}>Time Format</Text>
          <Segmented
            segments={["12h", "24h"]}
            value={settings.timeFormat24h ? "24h" : "12h"}
            onChange={(v) => set({ timeFormat24h: v === "24h" })}
          />
          <View style={{ height: 12 }} />
          <Text style={{ color: t.palette.textSecondary }}>First Day of Week</Text>
          <Segmented
            segments={["Sun", "Mon"]}
            value={settings.firstDayMonday ? "Mon" : "Sun"}
            onChange={(v) => set({ firstDayMonday: v === "Mon" })}
          />
        </View>

        {/* Theme */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: 10
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Theme</Text>
          <Segmented
            segments={["System", "Light", "Dark"]}
            value={settings.theme[0].toUpperCase() + settings.theme.slice(1)}
            onChange={(v) => set({ theme: v.toLowerCase() as any })}
          />
          <Text style={{ color: t.palette.textTertiary, marginTop: 6 }}>
            Theme applies immediately across the app.
          </Text>
        </View>

        {/* Plan & Banks (stub controls above) */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: 8
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Plan & Banks</Text>
          <Text style={{ color: t.palette.textSecondary }}>
            Current plan: {settings.plan}. Manage SMS bank and plan from the Channels section.
          </Text>
        </View>

        {/* Export / Import (stubs) */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: 8
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Export / Import</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: t.radii.pill, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor }}>
              <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>Export (stub)</Text>
            </Pressable>
            <Pressable style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: t.radii.pill, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor }}>
              <Text style={{ color: t.palette.textSecondary, fontWeight: "700" }}>Import (stub)</Text>
            </Pressable>
          </View>
        </View>

        {/* Legal */}
        <View style={{
          backgroundColor: t.palette.surface, borderWidth: t.hairlineWidth, borderColor: t.palette.hairlineColor,
          borderRadius: t.radii.lg, padding: t.spacing.lg, gap: 8
        }}>
          <Text style={{ color: t.palette.textPrimary, fontWeight: "700" }}>Legal</Text>
          <Pressable onPress={() => Linking.openURL("https://example.com/privacy")}>
            <Text style={{ color: t.palette.textSecondary }}>Privacy Policy</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL("https://example.com/terms")}>
            <Text style={{ color: t.palette.textSecondary }}>Terms of Service</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}