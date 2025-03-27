import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

/**
 * AI memóriába ment egy értéket a játékoshoz.
 * @param key Például: "intent", "attitude", "factionInterest"
 * @param value Például: "power", "neutral", "shadow"
 */
export async function saveAIMemory(key: string, value: string) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    [`aiMemory.${key}`]: value,
  });
}
