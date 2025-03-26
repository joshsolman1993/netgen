import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { checkQuestProgress } from "@/lib/quests/checkQuestProgress";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function EconomyPage() {
  const [userData, setUserData] = useState<any>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({ ...data, uid: user.uid });

        const lastClaim = data.lastClaim?.toDate?.() || new Date(0);
        const now = new Date();
        const hoursPassed =
          (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
        setCanClaim(hoursPassed >= 24);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleClaim = async () => {
    if (!userData || !canClaim) return;

    const docRef = doc(db, "users", userData.uid);
    const newBalance = userData.coins + 100;

    await updateDoc(docRef, {
      coins: newBalance,
      lastClaim: serverTimestamp(),
    });

    // 🔄 Küldetésellenőrzés
    await checkQuestProgress("collect", {
      resource: "coin",
      amount: newBalance,
    });

    setUserData((prev: any) => ({
      ...prev,
      coins: newBalance,
      lastClaim: new Date(),
    }));

    setStatusMsg("✅ Sikeresen igényelted a napi 100 ₿ jutalmat!");
    setCanClaim(false);
  };

  const handleMine = async () => {
    if (!userData) return;

    const minedAmount = Math.floor(Math.random() * 1000) + 1000;
    const docRef = doc(db, "users", userData.uid);
    const newBalance = userData.coins + minedAmount;

    await updateDoc(docRef, {
      coins: newBalance,
      mineLog: arrayUnion({
        amount: minedAmount,
        time: Timestamp.now(),
      }),
    });

    // 🔄 Küldetésellenőrzés
    await checkQuestProgress("collect", {
      resource: "coin",
      amount: newBalance,
    });

    setUserData((prev: any) => ({
      ...prev,
      coins: newBalance,
      mineLog: [
        ...(prev.mineLog || []),
        { amount: minedAmount, time: new Date() },
      ],
    }));

    setStatusMsg(`⛏️ Sikeresen bányásztál: ${minedAmount} ₿`);
  };

  if (loading) return <p className="text-white p-6">Betöltés...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-cyan-300 p-6">
      <h1 className="text-3xl font-extrabold mb-8">💱 Coin-kezelés</h1>

      {statusMsg && <p className="text-yellow-400 mb-6">{statusMsg}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Egyenleg panel */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-cyan-700">
          <h2 className="text-xl font-bold mb-2">🪙 Egyenleged</h2>
          <p className="text-4xl text-green-400 font-mono">
            {userData.coins} ₿
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Jelenlegi token egyenleged
          </p>
        </div>

        {/* Műveletek */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleClaim}
            disabled={!canClaim}
            className={`w-full px-6 py-3 rounded font-bold ${
              canClaim
                ? "bg-cyan-500 hover:bg-cyan-600 text-black"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {canClaim
              ? "🎁 Napi jutalom igénylése (100 ₿)"
              : "⏳ Már igényelted ma"}
          </button>

          <button
            onClick={handleMine}
            className="w-full px-6 py-3 rounded font-bold bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
          >
            ⛏️ Bányászat – véletlen coin (10–59 ₿)
          </button>
        </div>
      </div>

      {/* Előzmények */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-2">⛏️ Bányászat előzményeid</h2>
        <ul className="bg-gray-800 p-4 rounded border border-gray-700 text-sm space-y-2 max-h-60 overflow-y-auto">
          {(userData.mineLog || [])
            .slice()
            .reverse()
            .map((log: any, index: number) => (
              <li key={index} className="flex justify-between">
                <span>{log.amount} ₿</span>
                <span className="text-gray-400">
                  {new Date(log.time?.seconds * 1000).toLocaleString()}
                </span>
              </li>
            ))}
          {(userData.mineLog || []).length === 0 && (
            <li className="text-gray-500">Nincs bányászati előzményed</li>
          )}
        </ul>
      </div>
    </div>
  );
}
