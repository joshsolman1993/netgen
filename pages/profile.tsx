import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userData) return <p className="text-white">Betöltés...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Profil</h1>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>BIO:</strong> {userData.bio}
        </p>
        <p>
          <strong>Coin egyenleg:</strong> {userData.coins}
        </p>
        <button
          onClick={() => {
            signOut(auth);
            router.push("/");
          }}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Kijelentkezés
        </button>
      </div>
    </div>
  );
}
