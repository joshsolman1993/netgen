import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

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

// Map: melyik küldetés után mi jön
const questChain: Record<string, string> = {
  "quest-001": "quest-002",
  "quest-002": "quest-003",
  "quest-003": "quest-005", // kihagyjuk 004-et, direkt
};

(async () => {
  for (const [prerequisiteId, nextQuestId] of Object.entries(questChain)) {
    const ref = doc(db, "quests", nextQuestId);

    await updateDoc(ref, {
      prerequisite: prerequisiteId,
    });

    console.log(`🔗 ${nextQuestId} most követi: ${prerequisiteId}`);
  }
})();