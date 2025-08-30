import { useSyncExternalStore } from "react";

export type Settings = {
  firstDayMonday: boolean;
  timeFormat24h: boolean;
  intensity: "Gentle" | "Standard" | "Firm";
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string;   // "07:00"
  channelsPush: boolean;
  channelsSMS: boolean;
  smsBank: number;
  smsBankMax: number;
  defaultTimes: { morning: string; afternoon: string; evening: string }; // "HH:mm"
  theme: "system" | "light" | "dark";
  plan: "Free" | "Pro" | "Elite";
};

type Listener = () => void;
let listeners = new Set<Listener>();

let _settings: Settings = {
  firstDayMonday: false,
  timeFormat24h: false,
  intensity: "Standard",
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  channelsPush: true,
  channelsSMS: false,
  smsBank: 40,
  smsBankMax: 40,
  defaultTimes: { morning: "09:00", afternoon: "13:00", evening: "18:00" },
  theme: "system",
  plan: "Pro"
};

function emit() { for (const l of listeners) l(); }

export function useSettings() {
  const subscribe = (l: Listener) => { listeners.add(l); return () => listeners.delete(l); };
  const get = () => _settings;
  const settings = useSyncExternalStore(subscribe, get, get);
  const set = (patch: Partial<Settings>) => { _settings = { ..._settings, ...patch }; emit(); };
  return { settings, set };
}