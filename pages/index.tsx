import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-cyan-300 flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Neon háttér effekt */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-cyan-800/10 to-fuchsia-800/10 blur-3xl z-0" />

      <h1
        className="text-5xl md:text-6xl font-extrabold mb-6 z-10 glitch"
        data-text="NETGEN // AZ ÚJ VILÁGBANK"
      >
        NETGEN // AZ ÚJ VILÁGBANK
      </h1>

      <p className="max-w-xl text-lg md:text-xl text-center text-gray-300 mb-8 z-10">
        A világ összeomlott. A gazdaságot most a digitális valuták uralják.
        Építsd fel saját kripto-birodalmad, szövetkezz vagy pusztíts.
      </p>

      <div className="flex gap-4 z-10">
        <Link href="/auth/register">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded shadow-md hover:shadow-cyan-500/50 transition">
            Regisztráció
          </button>
        </Link>
        <Link href="/auth/login">
          <button className="bg-transparent border border-cyan-500 hover:bg-cyan-700 hover:text-white text-cyan-300 font-bold py-2 px-6 rounded transition">
            Belépés
          </button>
        </Link>
      </div>

      <p className="mt-10 text-sm text-gray-500 z-10">
        © 2025 NETGEN Corporation. Minden jog fenntartva.
      </p>
    </div>
  );
}
