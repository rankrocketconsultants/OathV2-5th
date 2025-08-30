import { Modal, Pressable, View, Text } from "react-native";
import { useSafeTokens } from "../design/safeTokens";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useSafeTokens();

  const NavRow = ({ icon, label, to }: { icon: any; label: string; to: string }) => (
    <Pressable
      onPress={() => { router.navigate(to as any); onClose(); }}
      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12 }}
    >
      <Ionicons name={icon} size={20} color={t.palette.textSecondary} />
      <Text style={{ color: t.palette.textPrimary, marginLeft: 10 }}>{label}</Text>
    </Pressable>
  );

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ position: "absolute", top:0, bottom:0, left:0, right:0, backgroundColor: t.palette.backdrop }} />
      <View style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: 300,
        backgroundColor: t.palette.surface, padding: 18, borderLeftWidth: t.hairlineWidth, borderColor: t.palette.hairline
      }}>
        <Text style={{ color: t.palette.textSecondary, marginBottom: 12 }}>Account</Text>
        <View style={{ height: 1, backgroundColor: t.palette.hairline, opacity: 0.6 }} />
        <View style={{ marginTop: 14 }}>
          <NavRow icon="home-outline" label="Home" to="/(tabs)" />
          <NavRow icon="calendar-outline" label="Calendar" to="/(tabs)/calendar" />
          <NavRow icon="sparkles-outline" label="Sparks" to="/(tabs)/sparks" />
          <NavRow icon="stats-chart-outline" label="Ledger" to="/(tabs)/ledger" />
          <View style={{ height: 8 }} />
          <NavRow icon="settings-outline" label="Settings" to="/settings" />
        </View>
      </View>
    </Modal>
  );
}