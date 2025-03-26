import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

type Quest = {
  id: string;
  title: string;
  description: string;
  reward: {
    coin?: number;
    item?: string;
  };
};

export default function QuestLogPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const data = snap.data();
        setCompleted(data?.completedQuests || []);

        const allQuestsSnap = await getDocs(collection(db, "quests"));
        const all = allQuestsSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        setQuests(all);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const completedQuests = quests.filter((q) => completed.includes(q.id));
  const activeQuests = quests.filter((q) => !completed.includes(q.id));

  return (
    <div className="min-h-screen bg-black text-cyan-300 p-6">
      <h1 className="text-3xl font-bold mb-4">📘 Küldetésnapló</h1>

      {loading ? (
        <p className="text-cyan-500">⏳ Betöltés...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ✅ Aktív küldetések */}
          <div>
            <h2 className="text-xl font-semibold mb-3">📌 Aktív küldetések</h2>
            {activeQuests.length === 0 ? (
              <p className="text-gray-500 italic">Nincs aktív küldetés.</p>
            ) : (
              activeQuests.map((q) => (
                <div
                  key={q.id}
                  className="mb-4 p-4 bg-gray-900 border border-cyan-700 rounded-lg shadow"
                >
                  <h3 className="font-bold text-lg">{q.title}</h3>
                  <p className="text-sm text-gray-400 mb-1">{q.description}</p>
                  <p className="text-xs text-cyan-300">
                    🎁 Jutalom:{" "}
                    {q.reward.coin && (
                      <span className="text-green-400 mr-2">
                        {q.reward.coin} ₿
                      </span>
                    )}
                    {q.reward.item && (
                      <span className="text-yellow-300">{q.reward.item}</span>
                    )}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* ✅ Teljesített küldetések */}
          <div>
            <h2 className="text-xl font-semibold mb-3">✅ Teljesített</h2>
            {completedQuests.length === 0 ? (
              <p className="text-gray-500 italic">
                Még nem teljesítettél semmit.
              </p>
            ) : (
              completedQuests.map((q) => (
                <div
                  key={q.id}
                  className="mb-4 p-4 bg-gray-800 border border-green-600 rounded-lg shadow-sm"
                >
                  <h3 className="font-bold text-lg">{q.title}</h3>
                  <p className="text-sm text-gray-400">{q.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
