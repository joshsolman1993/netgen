import { motion } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import ZoneDiscoverEffect from "./ZoneDiscoverEffect";
import ZoneNarrativeModal from "./ZoneNarrativeModal";

type Zone = {
  id: string;
  name: string;
  description: string;
  loot?: string[];
  unlockAt?: { seconds: number }; // Firestore timestamp (unix formában)
  narrative?: string;
};

type Props = {
  zone: Zone;
  discovered: boolean;
  onClose: () => void;
};

export default function ZoneModal({ zone, discovered, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const now = Date.now();
  const unlockTimestamp = zone.unlockAt?.seconds
    ? zone.unlockAt.seconds * 1000
    : 0;

  const [showNarrative, setShowNarrative] = useState(false);

  const isUnlockable = !zone.unlockAt || unlockTimestamp <= now;
  const unlockDateStr = zone.unlockAt
    ? new Date(unlockTimestamp).toLocaleString()
    : "";

  const handleDiscover = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      discoveredZones: arrayUnion(zone.id),
    });

    setTimeout(() => {
      setShowEffect(false);
      if (zone.narrative) {
        setShowNarrative(true); // 💬 narratíva aktiválása
      } else {
        onClose(); // ha nincs narratíva, akkor sima bezárás
      }
    }, 2000);
  };

  const [showEffect, setShowEffect] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 text-cyan-200 border border-cyan-700 rounded-lg p-6 w-full max-w-md shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-cyan-400 hover:text-cyan-200 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {discovered ? zone.name : "🔒 Ismeretlen Zóna"}
        </h2>

        <p className="text-sm mb-4">
          {discovered
            ? zone.description
            : "Zárva – fedezd fel egy küldetéssel vagy technológiával."}
        </p>

        {/* 🎁 Loot preview */}
        {zone.loot && (
          <div className="mb-4">
            <h3 className="text-cyan-400 font-semibold mb-1">
              🎁 Lehetséges loot:
            </h3>
            <ul className="list-disc list-inside text-sm">
              {zone.loot.map((item, i) => (
                <li
                  key={i}
                  className={discovered ? "" : "blur-sm text-gray-500"}
                >
                  {discovered ? item : "???"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ⏳ Felfedezési idő logika */}
        {!discovered && !isUnlockable && (
          <p className="text-yellow-500 mb-4">
            ⏳ Ez a zóna jelenleg zárolva van.
            <br />
            Feloldás ideje: <strong>{unlockDateStr}</strong>
          </p>
        )}

        {/* 🔓 Felfedezés gomb */}
        {discovered ? (
          <p className="text-green-400">✅ Már felfedezted ezt a zónát.</p>
        ) : isUnlockable ? (
          <>
            <p className="text-yellow-400 mb-4">
              🧪 Felfedezés még nem történt meg.
            </p>
            <button
              onClick={handleDiscover}
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded"
            >
              {loading ? "Feldolgozás..." : "🔓 Felfedezem"}
            </button>
          </>
        ) : null}
      </motion.div>
      <ZoneDiscoverEffect visible={showEffect} />
      {showNarrative && zone.narrative && (
        <ZoneNarrativeModal
          text={zone.narrative}
          onClose={() => {
            setShowNarrative(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}
