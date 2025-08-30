import { useSyncExternalStore } from "react";

export type ItemStatus = "honored" | "missed" | "rescheduled";
export type Item = {
  id: string;
  title: string;
  subtitle?: string;
  datetime?: string | null; // ISO or null for unscheduled
  completed?: boolean;
  type?: "action" | "time" | "anchor" | "memory";
  status?: ItemStatus;
};

type Listener = () => void;
let listeners = new Set<Listener>();

// Seed demo items to show groups & chips
function isoAt(hours: number, minutes = 0, dayOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

let _items: Item[] = [
  // Today
  { id: "i1", title: "Finish ECON reading", subtitle: "Ch. 6–7", datetime: isoAt(9, 0, 0), completed: false, type: "time", status: "honored" },
  { id: "i2", title: "Call dentist", subtitle: "Reschedule cleaning", datetime: isoAt(15, 30, 0), completed: false, type: "action" },
  // Upcoming (tomorrow / later)
  { id: "i3", title: "Gym: push day", datetime: isoAt(18, 0, 1), completed: false, type: "anchor", status: "rescheduled" },
  { id: "i4", title: "Submit internship app", datetime: isoAt(11, 0, 2), completed: false, type: "time" },
  // Later (unscheduled or past)
  { id: "i5", title: "Declutter notes", completed: false, type: "action" },
  { id: "i6", title: "Idea: launch study group", completed: false, type: "memory" },
  { id: "i7", title: "Email Prof. Petryshyn", datetime: isoAt(10, 0, -1), completed: false, type: "action", status: "missed" }
];

function emit() { for (const l of listeners) l(); }

export function useItemsData() {
  const subscribe = (l: Listener) => { listeners.add(l); return () => listeners.delete(l); };
  const get = () => _items;
  const items = useSyncExternalStore(subscribe, get, get);
  return { items, addItem, updateItem, deleteItem };
}

export function addItem(title: string, meta: Partial<Item> = {}) {
  const id = Math.random().toString(36).slice(2);
  const it: Item = {
    id,
    title: title.trim(),
    subtitle: meta.subtitle ?? "",
    datetime: meta.datetime ?? null,
    completed: !!meta.completed,
    type: meta.type ?? "action",
    status: meta.status
  };
  _items = [it, ..._items];
  emit();
  return id;
}

export function updateItem(id: string, patch: Partial<Item>) {
  _items = _items.map(it => (it.id === id ? { ...it, ...patch } : it));
  emit();
}

export function deleteItem(id: string) {
  _items = _items.filter(it => it.id !== id);
  emit();
}