import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

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

const activeQuestIds = ["quest-001", "quest-002"]; // ide írhatod az induló küldetések ID-jait

(async () => {
  const usersSnap = await getDocs(collection(db, "users"));

  for (const userDoc of usersSnap.docs) {
    const ref = doc(db, "users", userDoc.id);
    await updateDoc(ref, {
      activeQuests: activeQuestIds,
    });

    console.log(`✅ Beállítva: ${userDoc.id}`);
  }
})();