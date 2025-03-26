import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { showReward } from "@/lib/rewardUtils";

export async function completeQuest(questId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Nincs bejelentkezett felhasználó.");

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const active = userData?.activeQuests || [];
  const completed = userData?.completedQuests || [];

  if (!active.includes(questId)) {
    console.warn("A küldetés nem aktív.");
    return;
  }

  // 1. Távolítsuk el az aktív küldetések közül
  const newActive = active.filter((q: string) => q !== questId);

  // 2. Tegyük a teljesítettek közé, ha még nincs ott
  const newCompleted = completed.includes(questId)
    ? completed
    : [...completed, questId];

  // 3. Megnézzük, van-e küldetés, ami ezt követi
  const allQuestsSnap = await getDocs(collection(db, "quests"));
  const allQuests = allQuestsSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as any),
  }));

  const nextQuests = allQuests.filter(
    (q) =>
      q.prerequisite === questId &&
      !newActive.includes(q.id) &&
      !newCompleted.includes(q.id)
  );

  // 4. Automatikusan aktiváljuk a következő(ke)t
  const newActiveWithNext = [...newActive, ...nextQuests.map((q) => q.id)];

  // 5. Lekérjük a teljesített küldetést (és annak rewardját)
  const questRef = doc(db, "quests", questId);
  const questSnap = await getDoc(questRef);
  const quest = questSnap.data();

  await updateDoc(userRef, {
    activeQuests: newActiveWithNext,
    completedQuests: newCompleted,
  });

  console.log(`✅ Küldetés teljesítve: ${questId}`);
  if (nextQuests.length > 0) {
    console.log(`🔓 Aktiválva: ${nextQuests.map((q) => q.id).join(", ")}`);
  }

  // 🎁 Jutalom popup meghívása, ha van reward
  if (quest?.reward) {
    showReward(quest.reward);
  }
}
