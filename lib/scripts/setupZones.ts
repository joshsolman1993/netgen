// scripts/setupZones.ts
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAeqeB6siZIWytvBYzW6WGMF9jxlaJMOjA",
    authDomain: "netgen-5b8be.firebaseapp.com",
    projectId: "netgen-5b8be",
    storageBucket: "netgen-5b8be.firebasestorage.app",
    messagingSenderId: "949609725188",
    appId: "1:949609725188:web:dc71a1c327a564aeb02451"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const now = new Date();
const in5min = new Date(now.getTime() + 5 * 60000);
const in10min = new Date(now.getTime() + 10 * 60000);

const zones = [
  {
    id: "zone-1",
    name: "Shadow Nexus",
    description: "Rejtett hálózati csomópont, titkos adatokkal.",
    loot: ["Encrypted Key", "Nano Trace", "Ghost Packet"],
    narrative: "Az adatcsatorna fekete. A csend zúg, és valami rád néz a sötétből.",
    x: 20,
    y: 25,
    unlockAt: Timestamp.fromDate(now),
    event: {
      type: "signal",
      active: true,
      label: "📡 Interferencia aktív"
    }
  },
  {
    id: "zone-2",
    name: "Iron Grid",
    description: "Régi ipari szektor, kriptobányák romjaival.",
    loot: ["Crypto Dust", "Iron Chip", "Scrap Token"],
    narrative: "A vasrácsos térben minden kong.",
    x: 40,
    y: 35,
    unlockAt: Timestamp.fromDate(now)
  },
  {
    id: "zone-3",
    name: "Delta Core",
    description: "A NOVA frakció belső adatmagja.",
    loot: ["Fractal Node", "Datalink x1", "Firewall Key"],
    narrative: "A rendszer itt él. Lélegzik.",
    x: 65,
    y: 20,
    unlockAt: Timestamp.fromDate(in5min),
    event: {
      type: "alert",
      active: true,
      label: "⚠️ Frakciótevékenység"
    }
  },
  {
    id: "zone-4",
    name: "Rusted Verge",
    description: "Feltört infrastruktúra.",
    loot: ["Corrupted Byte", "Junkcoin"],
    narrative: "Minden adat itt szétfolyt.",
    x: 35,
    y: 60,
    unlockAt: Timestamp.fromDate(now)
  },
  {
    id: "zone-5",
    name: "Ether Gate",
    description: "Decentralizált átjáró.",
    loot: ["Gate Fragment", "Quantum Drift"],
    narrative: "Köréd tekeredik a valóság.",
    x: 80,
    y: 50,
    unlockAt: Timestamp.fromDate(in10min)
  },
  {
    id: "zone-6",
    name: "Pulsebank",
    description: "Kriptoenergia-tározó.",
    loot: ["Pulse Fragment", "Overload Chip"],
    narrative: "A tér pulzál.",
    x: 50,
    y: 75,
    unlockAt: Timestamp.fromDate(now),
    event: {
      type: "loot",
      active: true,
      label: "💰 Ritka loot!"
    }
  },
  {
    id: "zone-7",
    name: "Ghostchain",
    description: "Elhagyott blokklánc-sáv.",
    loot: ["Infected Token"],
    narrative: "A lánc figyel.",
    x: 10,
    y: 50,
    unlockAt: Timestamp.fromDate(in5min)
  }
];

(async () => {
  for (const zone of zones) {
    const ref = doc(db, "zones", zone.id);
    await setDoc(ref, zone, { merge: true });
    console.log(`✅ Feltöltve: ${zone.id}`);
  }
})();