import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Link from "next/link";

type Zone = {
  id: string;
  name: string;
  description: string;
  event?: {
    type: string;
    active: boolean;
    label: string;
  };
};

export default function DashboardZoneWidget() {
  const [userId, setUserId] = useState<string | null>(null);
  const [latestZone, setLatestZone] = useState<Zone | null>(null);
  const [activeEvents, setActiveEvents] = useState<number>(0);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const discovered = userSnap.data()?.discoveredZones || [];

        const zonesSnap = await getDocs(collection(db, "zones"));
        const allZones: Zone[] = zonesSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        const discoveredZoneList = allZones.filter((z) =>
          discovered.includes(z.id)
        );

        const latest =
          discoveredZoneList[discoveredZoneList.length - 1] || null;
        setLatestZone(latest);

        const events = allZones.filter((z) => z.event?.active).length;
        setActiveEvents(events);
      }
    });
  }, []);

  return (
    <div className="mt-8 text-sm text-cyan-100 border-l border-cyan-800 pl-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-cyan-300 font-semibold flex items-center gap-1 text-base">
          🌐 Zónafigyelő
        </h3>
        <Link
          href="/worldmap"
          className="text-xs text-cyan-500 hover:underline"
        >
          térkép →
        </Link>
      </div>

      {latestZone ? (
        <>
          <p className="text-cyan-200 leading-tight">
            <span className="text-xs text-cyan-400">Legutóbbi felfedezés:</span>
            <br />
            <span className="font-semibold">{latestZone.name}</span>
          </p>
          <p className="italic text-cyan-500 text-xs mt-1 leading-snug">
            „{latestZone.description}”
          </p>
        </>
      ) : (
        <p className="italic text-cyan-600">Még nincs felfedezett zónád.</p>
      )}

      <p className="mt-3 text-cyan-300 text-xs">
        Aktív események:{" "}
        {activeEvents > 0 ? (
          <span className="text-orange-400 font-bold">{activeEvents}</span>
        ) : (
          <span className="text-cyan-500">nincs</span>
        )}
      </p>
    </div>
  );
}
