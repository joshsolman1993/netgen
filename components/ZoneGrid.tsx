import { useState } from "react";
import { motion } from "framer-motion";
import ZoneModal from "./ZoneModal";

type Zone = {
  id: string;
  name: string;
  description: string;
};

type Props = {
  zones: Zone[];
  discoveredZones: string[];
};

export default function ZoneGrid({ zones, discoveredZones }: Props) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedZoneDiscovered, setSelectedZoneDiscovered] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {zones.map((zone) => {
          const unlocked = discoveredZones.includes(zone.id);
          return (
            <motion.div
              key={zone.id}
              className={`rounded-lg p-4 h-32 cursor-pointer transition-all shadow-md ${
                unlocked
                  ? "bg-cyan-800 hover:bg-cyan-700 text-white"
                  : "bg-gray-800 text-gray-500 hover:bg-gray-700"
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedZone(zone);
                setSelectedZoneDiscovered(unlocked);
              }}
            >
              <h2 className="text-lg font-bold mb-1">
                {unlocked ? zone.name : "🔒 Ismeretlen Zóna"}
              </h2>
              <p className="text-sm">
                {unlocked
                  ? zone.description
                  : "Zárva – fedezd fel küldetés vagy technológia által."}
              </p>
            </motion.div>
          );
        })}
      </div>

      {selectedZone && (
        <ZoneModal
          zone={selectedZone}
          discovered={selectedZoneDiscovered}
          onClose={() => setSelectedZone(null)}
        />
      )}
    </>
  );
}
