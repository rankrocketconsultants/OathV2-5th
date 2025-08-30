import { useSyncExternalStore } from "react";
import { addItem } from "./itemsStore";

export type Spark = {
  id: string;
  title: string;
  note?: string;
  category?: string;
};

type Listener = () => void;
let listeners = new Set<Listener>();

let _sparks: Spark[] = [
  { id: "s1", title: "Deep-dive on habit loops", category: "Learning" },
  { id: "s2", title: "Try 20–20–20 study cadence", note: "Focus blocks", category: "Study" },
  { id: "s3", title: "Sketch logo variants", category: "Project" },
  { id: "s4", title: "Meal prep Sundays", category: "Lifestyle" },
  { id: "s5", title: "Run 5k Saturday", category: "Fitness" },
  { id: "s6", title: "Pitch deck revision", category: "Project" },
  { id: "s7", title: "Inbox zero sprint", category: "Workflow" },
  { id: "s8", title: "Mentor check-in email", category: "Networking" }
];

function emit() { for (const l of listeners) l(); }

export function useSparksData() {
  const subscribe = (l: Listener) => { listeners.add(l); return () => listeners.delete(l); };
  const get = () => _sparks;
  const sparks = useSyncExternalStore(subscribe, get, get);
  return { sparks, convertSpark, archiveSpark };
}

export function convertSpark(id: string) {
  const sp = _sparks.find(s => s.id === id);
  if (!sp) return;
  // Convert to an actionable item (unscheduled)
  addItem(sp.title, { subtitle: sp.note ?? "", type: "action" });
  _sparks = _sparks.filter(s => s.id !== id);
  emit();
}

export function archiveSpark(id: string) {
  _sparks = _sparks.filter(s => s.id !== id);
  emit();
}