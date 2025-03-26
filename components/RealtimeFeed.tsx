import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RealtimeFeed() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "networkFeed"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(items);
    });
    return () => unsub();
  }, []);

  return (
    <ul className="text-sm space-y-3 max-h-60 overflow-y-auto pr-1">
      {entries.length === 0 && (
        <li className="text-gray-500">Nincs friss híred.</li>
      )}
      {entries.map((entry) => (
        <li key={entry.id} className="text-cyan-300">
          {entry.text}
        </li>
      ))}
    </ul>
  );
}
