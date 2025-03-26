import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import TypewriterText from "@/components/TypewriterText";
import RealtimeFeed from "@/components/RealtimeFeed";
import DashboardZoneWidget from "@/components/DashboardZoneWidget";

export default function Dashboard2() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });

    return () => unsub();
  }, []);

  if (!userData) return <p className="text-white p-6">Betöltés...</p>;

  const classType = userData.class || "Ismeretlen";
  const coins = userData.coins || 0;
  const missions = userData.completedMissions?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-cyan-300 flex">
      {/* 🧬 Bal panel */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-64 p-6 border-r border-cyan-800 bg-gray-950/80 backdrop-blur-md hidden md:block"
      >
        <h2 className="text-xl font-bold mb-4">🧬 Profil</h2>
        <div className="space-y-2">
          <p>
            <span className="text-gray-400">Class:</span> {classType}
          </p>
          <p>
            <span className="text-gray-400">Frakció:</span>{" "}
            {userData.faction || "–"}
          </p>
          <p>
            <span className="text-gray-400">Küldetések:</span> {missions}
          </p>
        </div>

        {/* 🧬 Tech Tree Tracker */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">🧬 Tech Tree Tracker</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { id: "crypto-mining", name: "Crypto Mining" },
              { id: "zero-identity", name: "Zero Identity" },
              { id: "block-harvest", name: "Block Harvest" },
              { id: "quantum-firewall", name: "Quantum Firewall" },
              { id: "node-synthesis", name: "Node Synthesis" },
              { id: "datalink-vault", name: "Datalink Vault" },
            ].map((tech) => {
              const unlocked = userData.unlockedTechs?.includes(tech.id);
              return (
                <div
                  key={tech.id}
                  className={`p-2 rounded border ${
                    unlocked
                      ? "border-cyan-500 bg-cyan-900 text-cyan-100"
                      : "border-gray-700 bg-gray-800 text-gray-500"
                  }`}
                >
                  {unlocked ? "✔︎" : "☒"} {tech.name}
                </div>
              );
            })}
          </div>
        </div>
        {/* 🛰️ Frakció-háború állapot */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">🛰️ Frakció-háború állapot</h2>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { name: "NOVA", power: 64, color: "text-cyan-400" },
              { name: "CRYON", power: 22, color: "text-fuchsia-400" },
              { name: "DAWN", power: 14, color: "text-yellow-300" },
            ].map((f) => (
              <div key={f.name} className="flex items-center gap-2">
                <div className="w-full bg-gray-800 h-3 rounded overflow-hidden">
                  <div
                    className={`h-full ${f.color} bg-opacity-70`}
                    style={{ width: `${f.power}%` }}
                  ></div>
                </div>
                <span className={`${f.color} font-bold`}>{f.name}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-red-400 mt-3">
            ⚠️ Aktív háborús állapot – feszültség extrém
          </p>
        </div>
      </motion.aside>

      {/* 💰 Közép panel */}
      <main className="flex-1 p-6 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900 border border-cyan-700 p-6 rounded-lg shadow-xl"
        >
          <h1 className="text-3xl font-extrabold mb-2">
            NETGEN // DASHBOARD 2.0
          </h1>
          <p className="text-gray-400">Digitális dominanciád központja</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {/* 💰 Coin panel */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-black border border-green-500 rounded-lg p-4 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">💰 Coin egyenleg</h2>
            <p className="text-3xl font-mono text-green-400">{coins} ₿</p>
            <p className="text-sm text-gray-500 mt-1">Napi +5% passzív hozam</p>
          </motion.div>

          {/* 💹 Coin trend modul */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black border border-cyan-800 rounded-lg p-4 shadow-md col-span-1 md:col-span-3"
          >
            <h2 className="text-xl font-bold mb-2">
              💹 Coin trend (7 friss adat)
            </h2>
            <div className="flex items-end gap-2 h-32">
              {[1020, 1050, 1030, 1100, 1120, 1150, 1200].map((val, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-xs text-cyan-400"
                >
                  <div
                    className="w-2 rounded-t bg-cyan-500"
                    style={{ height: `${(val - 1000) / 2}px` }}
                  ></div>
                  <span className="text-[10px] mt-1">{val}₿</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-green-400 mt-2">📈 +17.6% növekedés</p>
          </motion.div>

          {/* 📈 Coin statisztika modul */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 border border-cyan-700 rounded-lg p-4 shadow-md col-span-1 md:col-span-2"
          >
            <h2 className="text-xl font-bold mb-2">📊 Napi coin-statisztika</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black p-3 rounded border border-green-600">
                <p className="text-green-400">⛏️ Bányászat</p>
                <p className="text-lg font-mono">+320 ₿</p>
              </div>
              <div className="bg-black p-3 rounded border border-cyan-600">
                <p className="text-cyan-400">🎁 Jutalom</p>
                <p className="text-lg font-mono">+100 ₿</p>
              </div>
              <div className="bg-black p-3 rounded border border-yellow-600">
                <p className="text-yellow-300">💸 Vásárlás</p>
                <p className="text-lg font-mono">−50 ₿</p>
              </div>
              <div className="bg-black p-3 rounded border border-fuchsia-600">
                <p className="text-fuchsia-400">📈 Napi változás</p>
                <p className="text-lg font-mono">+370 ₿</p>
              </div>
            </div>
          </motion.div>

          {/* 🎮 Quick actions */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-gray-800 border border-cyan-600 rounded-lg p-4"
          >
            <h2 className="text-xl font-bold mb-2">🎮 Gyors műveletek</h2>
            <div className="flex flex-col gap-2">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded">
                ⛏️ Bányászat
              </button>
              <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded">
                🧪 Technológia
              </button>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded">
                📈 Piac
              </button>
            </div>
          </motion.div>

          {/* 📜 Küldetések */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-gray-800 border border-cyan-600 rounded-lg p-4"
          >
            <h2 className="text-xl font-bold mb-2">📜 Küldetések</h2>
            <p>{missions} story küldetés teljesítve</p>
            <button className="mt-2 text-cyan-400 underline hover:text-cyan-300">
              → Küldetésnapló
            </button>
          </motion.div>
        </motion.div>
        {/* 💬 NPC Konzol modul */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-950 border border-cyan-700 p-4 rounded-lg shadow-lg mt-6 font-mono text-sm text-cyan-200"
        >
          <h2 className="text-lg font-bold mb-2">🧠 AI Konzol</h2>
          <TypewriterText
            texts={[
              `Figyelem, ${userData.class} típusú entitás azonosítva...`,
              "Szinkronizálás folyamatban...",
              "Friss piaci analízis betöltve. Elérhető coin-hozam: +5.14%",
            ]}
            speed={40}
          />
        </motion.div>
      </main>

      {/* 🌐 Jobb panel */}
      <motion.aside
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-72 p-6 border-l border-cyan-800 bg-gray-950/80 backdrop-blur-md hidden lg:block"
      >
        <h2 className="text-xl font-bold mb-4">🌐 Hálózati hírek</h2>
        {/* 📡 Valós idejű feed Firestore-ból */}
        <RealtimeFeed />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">📦 Piaci szkenner</h3>
          <p className="text-green-400 font-mono">[STABLE] COIN: 1.0025 DCC</p>
          <p className="text-yellow-300 font-mono">[FLUX] RIFT: 0.88 ↘</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* ... korábbi modulok */}
          <DashboardZoneWidget />
        </div>
      </motion.aside>
    </div>
  );
}
