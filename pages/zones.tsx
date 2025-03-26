import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ZoneGrid from "@/components/ZoneGrid";

type Zone = {
  id: string;
  name: string;
  description: string;
};

export default function ZonesPage() {
  const [user, setUser] = useState<any>(null);
  const [discoveredZones, setDiscoveredZones] = useState<string[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Játékos zónaadatok lekérése
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setDiscoveredZones(userData.discoveredZones || []);
        }

        // Összes zóna lekérése
        const zoneRef = collection(db, "zones");
        const zoneSnap = await getDocs(zoneRef);
        const zoneList: Zone[] = zoneSnap.docs.map((doc) => ({
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
    <div className="min-h-screen bg-black text-cyan-200 p-6">
      <h1 className="text-3xl font-bold mb-4">🗺️ Felfedezhető Zónák</h1>
      <ZoneGrid zones={zones} discoveredZones={discoveredZones} />
    </div>
  );
}
