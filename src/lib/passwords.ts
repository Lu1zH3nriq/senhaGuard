import { auth, db } from "@/src/lib/firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import * as React from "react";

export type PasswordItem = {
  id: string;
  titulo: string;
  usuario: string;
  senha?: string;
  url?: string;
};

let items: PasswordItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function getPasswords(): PasswordItem[] {
  return items;
}

export function setPasswords(next: PasswordItem[]) {
  items = next;
  emit();
}

export function addPassword(item: PasswordItem) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  items = [...items, item];
  emit();
  const ref = doc(collection(db, "users", uid, "passwords"), item.id);
  return setDoc(ref, item as any);
}

export function updatePassword(id: string, partial: Partial<PasswordItem>) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  items = items.map((it) => (it.id === id ? { ...it, ...partial } : it));
  emit();
  const ref = doc(collection(db, "users", uid, "passwords"), id);
  return updateDoc(ref, partial as any);
}

export function removePassword(id: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  items = items.filter((it) => it.id !== id);
  emit();
  const ref = doc(collection(db, "users", uid, "passwords"), id);
  return deleteDoc(ref);
}

export function getPasswordById(id: string): PasswordItem | undefined {
  return items.find((it) => it.id === id);
}

export function clearPasswords() {
  items = [];
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePasswords(): PasswordItem[] {
  return React.useSyncExternalStore(subscribe, getPasswords, getPasswords);
}

export async function loadPasswordsOnce(): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    setPasswords([]);
    return;
  }
  const q = query(collection(db, "users", uid, "passwords"), orderBy("titulo", "asc"));
  const snap = await getDocs(q);
  const list: PasswordItem[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  setPasswords(list);
}

export function startRealtimeSync(): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    setPasswords([]);
    return () => {};
  }
  const q = query(collection(db, "users", uid, "passwords"), orderBy("titulo", "asc"));
  const unsub = onSnapshot(q, (snap) => {
    const list: PasswordItem[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    setPasswords(list);
  });
  return unsub;
}
