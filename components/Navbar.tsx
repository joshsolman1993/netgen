import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 text-cyan-300 px-4 py-3 flex justify-between items-center shadow-md border-b border-cyan-800">
      <div className="font-bold text-xl">
        <Link href="/">NETGEN</Link>
      </div>
      <div className="flex gap-4 text-sm">
        {user && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/quests">Küldetések</Link>
            <Link href="/console" className="hover:text-cyan-400">
              🤖 Konzol
            </Link>
            <Link href="/zones">Zónák</Link>
            <Link href="/worldmap">Világtérkép</Link>
            <Link href="/economy">Coin-kezelés</Link>
            <Link href="/profile">Profil</Link>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300"
            >
              Kijelentkezés
            </button>
          </>
        )}
        {!user && (
          <>
            <Link href="/auth/login">Belépés</Link>
            <Link href="/auth/register">Regisztráció</Link>
          </>
        )}
      </div>
    </nav>
  );
}
