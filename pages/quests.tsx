import { useEffect, useState } from "react";
import { storyMissions } from "@/data/storyMissions";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function QuestsPage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);

      const docRef = doc(db, "users", u.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setCompleted(data.completedMissions || []);
      }
    });

    return () => unsub();
  }, []);

  const checkMissionCompletion = (mission: any) => {
    if (!userData) return false;

    switch (mission.requirement.type) {
      case "coins":
        return userData.coins >= mission.requirement.value;
      case "faction":
        return userData.faction !== null;
      case "visit":
        return userData.visited?.includes(mission.requirement.value);
      default:
        return false;
    }
  };

  const handleComplete = async (missionId: string, reward: any) => {
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    const newCoins = userData.coins + (reward.coins || 0);

    const updatedMissions = [...completed, missionId];
    await updateDoc(docRef, {
      coins: newCoins,
      completedMissions: updatedMissions,
    });

    setCompleted(updatedMissions);
    setUserData((prev: any) => ({
      ...prev,
      coins: newCoins,
      completedMissions: updatedMissions,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-cyan-300 p-6">
      <h1 className="text-3xl font-bold mb-4">📜 Küldetések</h1>
      <p className="mb-6 text-gray-400">
        Story-alapú feladatok, amelyek előreviszik a világodat.
      </p>

      <div className="space-y-6">
        {storyMissions.map((mission, index) => {
          const isUnlocked =
            index === 0 || completed.includes(storyMissions[index - 1].id);
          const isDone = completed.includes(mission.id);
          const ready = checkMissionCompletion(mission);

          return (
            <div
              key={mission.id}
              className={`p-4 rounded-lg border ${
                isDone
                  ? "border-green-500 bg-gray-800"
                  : isUnlocked
                  ? "border-cyan-500 bg-gray-900"
                  : "border-gray-700 bg-gray-800 opacity-50"
              }`}
            >
              <h2 className="text-xl font-semibold">{mission.title}</h2>
              <p className="text-sm text-gray-400 mb-2">
                {mission.description}
              </p>

              <p className="text-sm mb-2">
                Jutalom:{" "}
                <span className="text-green-400">{mission.reward.coins} ₿</span>
              </p>

              {isDone ? (
                <p className="text-green-500">✅ Teljesítve</p>
              ) : isUnlocked && ready ? (
                <button
                  onClick={() => handleComplete(mission.id, mission.reward)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded font-bold"
                >
                  🎯 Teljesítés
                </button>
              ) : isUnlocked ? (
                <p className="text-yellow-400">🔒 Még nem teljesíthető</p>
              ) : (
                <p className="text-gray-500 italic">
                  🔒 Előző küldetés szükséges
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
