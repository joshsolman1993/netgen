import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import usePlayerQuests from "@/hooks/usePlayerQuests";
import { completeQuest } from "@/lib/quests/completeQuest";

export default function QuestsPage() {
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const { quests, loading } = usePlayerQuests();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setCompletedQuests(userData?.completedQuests || []);
      }
    });

    return () => unsub();
  }, []);

  const handleComplete = async (questId: string) => {
    await completeQuest(questId);
    setCompletedQuests((prev) => [...prev, questId]);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-300 p-6">
      <h1 className="text-3xl font-bold mb-4">📜 Küldetések</h1>
      <p className="mb-6 text-gray-400">
        Aktív küldetések, amelyek előreviszik a világod történetét.
      </p>

      {loading ? (
        <p className="text-cyan-500">⏳ Betöltés...</p>
      ) : quests.length === 0 ? (
        <p className="text-gray-500 italic">Nincsenek aktív küldetéseid.</p>
      ) : (
        <div className="space-y-6">
          {quests.map((quest) => {
            const isDone = completedQuests.includes(quest.id);

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-lg border ${
                  isDone
                    ? "border-green-500 bg-gray-800"
                    : "border-cyan-500 bg-gray-900"
                }`}
              >
                <h2 className="text-xl font-semibold">{quest.title}</h2>
                <p className="text-sm text-gray-400 mb-2">
                  {quest.description}
                </p>

                <p className="text-sm mb-2">
                  Jutalom:{" "}
                  {quest.reward.coin && (
                    <span className="text-green-400 mr-2">
                      {quest.reward.coin} ₿
                    </span>
                  )}
                  {quest.reward.item && (
                    <span className="text-yellow-300">
                      🎁 {quest.reward.item}
                    </span>
                  )}
                </p>

                {isDone ? (
                  <p className="text-green-500">✅ Teljesítve</p>
                ) : (
                  <button
                    onClick={() => handleComplete(quest.id)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded font-bold"
                  >
                    🎯 Teljesítés
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
