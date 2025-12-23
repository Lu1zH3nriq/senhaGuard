import { db } from "@/src/lib/firebase";
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

export async function testFirestoreConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const col = collection(db, "__ping");
    const ref = await addDoc(col, { createdAt: serverTimestamp() });
    await deleteDoc(doc(db, "__ping", ref.id));
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e) };
  }
}
