import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Sikeres regisztráció, UID:", user.uid);

      // Alap profil adat elmentése
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        bio: "Üdv a NETGEN világában!",
        coins: 1000,
        faction: null,
        lastClaim: null,
        mineLog: [],
        lastClaim: null,
        mineLog: [],
        visited: [],
        completedMissions: [],
        introCompleted: false,
      });

      console.log("Sikeres adatmentés Firestore-ba");

      router.push("/profile");
    } catch (err: any) {
      console.error("Hiba a regisztrációnál:", err);
      setError(err.message || "Ismeretlen hiba");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Fiók létrehozása</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 rounded"
        >
          Regisztráció
        </button>
      </form>
    </div>
  );
}
