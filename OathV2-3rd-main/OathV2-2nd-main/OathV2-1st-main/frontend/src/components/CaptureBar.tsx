import { useState } from "react";
import { View, TextInput, Pressable, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeTokens } from "../design/safeTokens";

export default function CaptureBar({
  placeholder,
  onSubmit
}: {
  placeholder: string;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const t = useSafeTokens();

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    onSubmit(v);
    setText("");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: t.palette.surface,
        borderWidth: t.hairlineWidth,
        borderColor: t.palette.hairlineColor,
        borderRadius: t.radii.xl,
        paddingHorizontal: t.spacing.md,
        paddingVertical: t.spacing.md
      }}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={t.palette.textTertiary}
        style={{
          flex: 1,
          color: t.palette.text,
          fontSize: t.type.body.size,
          paddingVertical: Platform.OS === "web" ? t.spacing.xs : 0
        }}
        onSubmitEditing={submit}
        blurOnSubmit
      />
      <Pressable
        onPress={submit}
        accessibilityRole="button"
        accessibilityLabel="Submit"
        style={{
          width: 44,
          height: 44,
          marginLeft: t.spacing.sm,
          borderRadius: t.radii.pill,
          backgroundColor: t.palette.accent,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Ionicons name="mic-outline" size={22} color={t.palette.onAccent} />
      </Pressable>
    </View>
  );
}