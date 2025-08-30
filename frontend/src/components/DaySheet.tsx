import { Modal, Pressable, View, Text, TextInput, Animated, Easing } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSafeTokens } from "../design/safeTokens";
import Card from "./base/Card";
import GroupedList from "./GroupedList";
import TaskRow, { type RowItem } from "./TaskRow";
import { addItem } from "../stores/itemsStore";
import { useSettings } from "../stores/settingsStore";

/** DaySheet with settle shadow animation (shadowRadius 4→8, opacity up) */
export default function DaySheet({
  visible, dateISO, items, onClose, onToggle, onDelete
}:{ visible:boolean; dateISO:string; items:RowItem[]; onClose:()=>void; onToggle:(it:RowItem)=>void; onDelete:(it:RowItem)=>void; }){
  const t = useSafeTokens();
  const { settings } = useSettings();

  const selected = useMemo(()=>{ const d = new Date(dateISO); return isNaN(d.getTime()) ? new Date() : d; },[dateISO]);

  const [title, setTitle] = useState("");
  const inputRef = useRef<TextInput>(null);
  useEffect(()=>{ if(visible) setTimeout(()=>inputRef.current?.focus(),60); },[visible]);

  // Backdrop + translate already handled elsewhere? Add settle shadow anim here.
  const shadowRadius = useRef(new Animated.Value(4)).current;
  const shadowOpacity = useRef(new Animated.Value(0.06)).current;

  useEffect(()=>{
    if(visible){
      Animated.parallel([
        Animated.timing(shadowRadius,{ toValue: 8, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver:false }),
        Animated.timing(shadowOpacity,{ toValue: t.shadowOpacity ?? 0.08, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver:false })
      ]).start();
    }else{
      Animated.parallel([
        Animated.timing(shadowRadius,{ toValue: 4, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver:false }),
        Animated.timing(shadowOpacity,{ toValue: 0.06, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver:false })
      ]).start();
    }
  },[visible, shadowRadius, shadowOpacity, t.shadowOpacity]);

  const parseHHMM = (s:string) => {
    const [hh, mm] = s.split(":").map(x => parseInt(x,10));
    return { hh: isNaN(hh)?9:hh, mm: isNaN(mm)?0:mm };
  };
  const submit = () => {
    const v = title.trim(); if(!v) return;
    const base = new Date(selected);
    const def = (settings as any)?.defaultTimes?.morning || (settings as any)?.defaultReminderTime || "09:00";
    const { hh, mm } = parseHHMM(def);
    base.setHours(hh, mm, 0, 0);
    addItem(v, { datetime: base, type: "time" });
    setTitle(""); setTimeout(()=>inputRef.current?.focus(),30);
  };

  if(!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop tap to close */}
      <Pressable onPress={onClose} style={{ position:"absolute", top:0, bottom:0, left:0, right:0, backgroundColor:t.palette.backdrop }}/>
      {/* Sheet container */}
      <View style={{ position:"absolute", left:12, right:12, bottom:12 }}>
        <Animated.View style={{ shadowRadius, shadowOpacity }}>
          <Card padded elevated style={{ maxHeight:"72%" }}>
            {/* Header */}
            <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:t.spacing.md }}>
              <Text style={{ color:t.palette.textPrimary, fontSize:t.type.h2.size, fontWeight:"700" }}>{selected.toDateString()}</Text>
              <Pressable onPress={onClose}><Text style={{ color:t.palette.textSecondary }}>Close</Text></Pressable>
            </View>
            {/* Quick add */}
            <View style={{ flexDirection:"row", alignItems:"center", marginBottom:t.spacing.md }}>
              <TextInput ref={inputRef} value={title} onChangeText={setTitle} placeholder="Add an oath for this day…" placeholderTextColor={t.palette.textTertiary}
                style={{ flex:1, color:t.palette.textPrimary, borderColor:t.palette.hairline, borderWidth:t.hairlineWidth, borderRadius:t.radii.md, paddingHorizontal:t.spacing.md, paddingVertical:10 }}
                returnKeyType="done" onSubmitEditing={submit}/>
              <Pressable onPress={submit} style={{ marginLeft:t.spacing.sm, paddingHorizontal:t.spacing.md, paddingVertical:10, borderRadius:t.radii.md, backgroundColor:t.palette.accent }}>
                <Text style={{ color:t.palette.onAccent, fontWeight:"700" }}>Add</Text>
              </Pressable>
            </View>
            {/* Day list */}
            <View style={{ flex:1 }}>
              <GroupedList<RowItem>
                data={items}
                keyExtractor={(it,i)=>String(it.id ?? i)}
                renderItem={({ item }) => <TaskRow item={item} onToggle={onToggle} onDelete={onDelete} />}
              />
            </View>
          </Card>
        </Animated.View>
      </View>
    </Modal>
  );
}