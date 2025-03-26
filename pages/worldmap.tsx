import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import EnergyOverlay from "@/components/EnergyOverlay";
import ZoneTooltip from "@/components/ZoneTooltip";

type Zone = {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  event?: {
    type: string;
    active: boolean;
    label: string;
  };
};

export default function WorldMapPage() {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [discoveredZones, setDiscoveredZones] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setDiscoveredZones(userData.discoveredZones || []);
        }

        const zoneRef = collection(db, "zones");
        const zoneSnap = await getDocs(zoneRef);
        const zoneList = zoneSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setZones(zoneList);
      }
    });

    return () => unsub();
  }, []);

  if (!user) return <p className="text-white p-6">Betöltés...</p>;

  return (
    <div className="min-h-screen bg-black text-cyan-200 p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🧭 NETGEN Világtérkép
      </h1>

      <div
        className="relative w-full max-w-5xl mx-auto h-[700px] border border-cyan-700 rounded-xl overflow-hidden shadow-lg"
        style={{
          backgroundImage: "url('/map-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <EnergyOverlay />
        {zones.map((zone) => {
          const unlocked = discoveredZones.includes(zone.id);
          const hasEvent = zone.event?.active;

          return (
            <motion.div
              onMouseEnter={() => setHoveredZoneId(zone.id)}
              onMouseLeave={() => setHoveredZoneId(null)}
              key={zone.id}
              animate={{
                scale: unlocked ? [1, 1.08, 1] : 1,
                boxShadow: unlocked
                  ? [
                      "0 0 0px rgba(0,255,255,0)",
                      "0 0 12px rgba(0,255,255,0.6)",
                      "0 0 0px rgba(0,255,255,0)",
                    ]
                  : "none",
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className={`absolute p-2 rounded-full text-xs text-center cursor-pointer font-semibold
    ${unlocked ? "bg-cyan-300 text-black" : "bg-gray-800 text-gray-500"}
    ${hasEvent ? "ring-2 ring-cyan-400 ring-offset-2" : ""}
  `}
              style={{
                top: `${zone.y}%`,
                left: `${zone.x}%`,
                transform: "translate(-50%, -50%)",
                width: 100,
                textShadow: unlocked ? "0 0 6px rgba(0,255,255,0.6)" : "none",
              }}
              whileHover={unlocked ? { scale: 1.15 } : {}}
              onClick={() => {
                if (unlocked) alert(`Belépés: ${zone.name}`);
              }}
            >
              {unlocked ? zone.name : "🔒 ???"}
              {hoveredZoneId === zone.id && unlocked && (
                <ZoneTooltip name={zone.name} description={zone.description} />
              )}

              {hasEvent && (
                <div
                  className="absolute -top-1 -right-1 bg-black/70 text-red-400 rounded-full text-sm px-[6px] py-[2px] animate-pulse shadow-md z-20"
                  style={{ textShadow: "0 0 4px rgba(255,80,80,0.7)" }}
                >
                  {zone.event?.type === "alert" && "⚠️"}
                  {zone.event?.type === "signal" && "📡"}
                  {zone.event?.type === "loot" && "💰"}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
