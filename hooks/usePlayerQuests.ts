import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

type Quest = {
  id: string;
  title: string;
  description: string;
  type: string;
  target: any;
  reward: {
    coin?: number;
    item?: string;
  };
};

export default function usePlayerQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);

      onSnapshot(userRef, async (snap) => {
        const userData = snap.data();
        const activeQuestIds: string[] = userData?.activeQuests || [];
        const completedQuestIds: string[] = userData?.completedQuests || [];

        if (activeQuestIds.length === 0) {
          setQuests([]);
          setLoading(false);
          return;
        }

        const allQuestsSnap = await getDocs(collection(db, "quests"));
        const allQuests = allQuestsSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        const filtered = allQuests.filter((q) =>
          activeQuestIds.includes(q.id)
        );

        const active = allQuests.filter((q) => activeQuestIds.includes(q.id));
        const completed = allQuests.filter((q) => completedQuestIds.includes(q.id));

        setQuests(filtered);
        setQuests(active);
        setQuests(completed);
        setLoading(false);
      });
    });

    return () => unsub();
  }, []);

  return { quests, loading };
}
