import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

const quests = [
  {
    id: "quest-001",
    title: "🧭 Feltárás kezdete",
    description: "Fedezz fel egy új zónát a világban.",
    type: "zone",
    target: "zone-1",
    reward: {
      coin: 250,
      item: "Data Fragment",
    },
  },
  {
    id: "quest-002",
    title: "🪙 Coin-bányász",
    description: "Gyűjts be legalább 1000 coin-t.",
    type: "collect",
    target: {
      resource: "coin",
      amount: 1000,
    },
    reward: {
      coin: 200,
    },
  },
  {
    id: "quest-003",
    title: "💸 Fejlesztési költség",
    description: "Költs el legalább 500 coin-t bármire.",
    type: "spend",
    target: {
      resource: "coin",
      amount: 500,
    },
    reward: {
      item: "Upgrade Chip",
    },
  },
  {
    id: "quest-004",
    title: "⏳ Hálózati várakozás",
    description: "Légy bejelentkezve legalább 10 percig.",
    type: "wait",
    target: {
      durationMinutes: 10,
    },
    reward: {
      coin: 100,
    },
  },
  {
    id: "quest-005",
    title: "🤖 AI Konzultáció",
    description: "Beszélgess a Mesterséges Intelligencia Konzollal.",
    type: "interact",
    target: "ai-console",
    reward: {
      item: "Encrypted Insight",
    },
  },
  {
    id: "quest-999",
    title: "🧪 Tesztküldetés",
    description: "Nyomd meg a tesztgombot a rendszer ellenőrzéséhez.",
    type: "interact",
    target: "test-button",
    reward: {
      coin: 99,
    },
  }
];

(async () => {
  for (const quest of quests) {
    const ref = doc(db, "quests", quest.id);
    await setDoc(ref, quest);
    console.log(`✅ Küldetés feltöltve: ${quest.id}`);
  }
})();