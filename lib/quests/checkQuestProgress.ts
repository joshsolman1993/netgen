import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { completeQuest } from "./completeQuest";

export async function checkQuestProgress(
  type: string,
  data: any
): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const activeQuests: string[] = userData?.activeQuests || [];
  const completedQuests: string[] = userData?.completedQuests || [];

  const questsSnap = await getDocs(collection(db, "quests"));
  const allQuests = questsSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as any),
  }));

  const activeQuestObjs = allQuests.filter((q) =>
    activeQuests.includes(q.id)
  );

  for (const quest of activeQuestObjs) {
    if (quest.type !== type) continue;
    const target = quest.target;

    let isComplete = false;

    switch (type) {
      case "collect":
        if (
          target.resource === data.resource &&
          data.amount >= target.amount
        ) {
          isComplete = true;
        }
        break;

      case "spend":
        if (
          target.resource === data.resource &&
          data.amount >= target.amount
        ) {
          isComplete = true;
        }
        break;

      case "zone":
        if (data.zoneId === target) {
          isComplete = true;
        }
        break;

      case "wait":
        // időalapú küldetéshez külön logika jöhet
        break;

      case "interact":
        if (data.key === target) {
          isComplete = true;
        }
        break;
    }

    if (isComplete) {
      await completeQuest(quest.id);
    }
  }
}
