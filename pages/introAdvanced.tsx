// pages/introAdvanced.tsx
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const QUESTIONS = [
  {
    id: "q1",
    text: "Mi az első reakciód, amikor a világ összeomlik és minden pénz eltűnik?",
    answers: [
      {
        text: "Megkeresem, ki maradt életben, és összefogok velük.",
        adds: { tactics: 1 },
      },
      {
        text: "Elkezdtem feltörni régi adatbankokat információkért.",
        adds: { tech: 1 },
      },
      {
        text: "Azonnal árnyékba húzódom, és megfigyelek.",
        adds: { stealth: 1 },
      },
      {
        text: "Új valutát alkotok és bevezetem a túlélők között.",
        adds: { economy: 1 },
      },
    ],
  },
  {
    id: "q2",
    text: "Egy frakció meg akar venni magának. Mit teszel?",
    answers: [
      { text: "Elfogadom, de belülről bomlasszam őket.", adds: { tactics: 1 } },
      { text: "Elutasítom, és feltöröm a rendszerüket.", adds: { tech: 1 } },
      {
        text: "Láthatatlanul követem őket, és adatokat gyűjtök.",
        adds: { stealth: 1 },
      },
      { text: "Tárgyalok: árverésre bocsátom magam.", adds: { economy: 1 } },
    ],
  },
  {
    id: "q3",
    text: "Egy digitális piacon egy sötét ajánlatot kapsz. Elfogadod?",
    answers: [
      {
        text: "Igen, de csak hogy manipuláljam a kínálati oldalt.",
        adds: { tactics: 1 },
      },
      { text: "Csak ha dekódolhatom az ajánlat forrását.", adds: { tech: 1 } },
      { text: "Követem az ajánlatkérőt és megfigyelem.", adds: { stealth: 1 } },
      {
        text: "Elfogadom, és profitálok belőle a maximumon.",
        adds: { economy: 1 },
      },
    ],
  },
  {
    id: "q4",
    text: "Mi a hosszútávú célod ebben az új világban?",
    answers: [
      {
        text: "Egy szövetség létrehozása és stratégiai uralom.",
        adds: { tactics: 1 },
      },
      { text: "Technológiai szingularitás elérése.", adds: { tech: 1 } },
      {
        text: "Láthatatlanná válni a rendszerek számára.",
        adds: { stealth: 1 },
      },
      { text: "Minden valuta forrásának birtoklása.", adds: { economy: 1 } },
    ],
  },
];

const calculateClass = (stats: any) => {
  const max = Math.max(stats.tactics, stats.tech, stats.stealth, stats.economy);
  if (stats.tactics === max) return "Taktikus";
  if (stats.tech === max) return "Hacktivista";
  if (stats.stealth === max) return "Árnyjelenlét";
  return "Piaci Zsarnok";
};

export default function IntroAdvanced() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [stats, setStats] = useState({
    tactics: 0,
    tech: 0,
    stealth: 0,
    economy: 0,
  });
  const router = useRouter();

  const handleAnswer = async (index: number) => {
    const add = QUESTIONS[current].answers[index].adds;
    const updatedStats = {
      ...stats,
      ...Object.fromEntries(
        Object.entries(add).map(([k, v]) => [
          k,
          stats[k as keyof typeof stats] + v,
        ])
      ),
    };
    setAnswers([...answers, index]);
    setStats(updatedStats);

    if (current + 1 < QUESTIONS.length) {
      setCurrent(current + 1);
    } else {
      const user = auth.currentUser;
      if (!user) return;
      const finalClass = calculateClass(updatedStats);
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        introCompleted: true,
        introAnswers: answers,
        introStats: updatedStats,
        class: finalClass,
        coins: 1200,
      });
      router.push("/dashboard");
    }
  };

  const q = QUESTIONS[current];
  return (
    <div className="min-h-screen bg-black text-cyan-300 flex flex-col justify-center items-center p-6">
      <div className="max-w-xl bg-gray-900 p-6 rounded-lg border border-cyan-600 shadow-lg">
        <h2 className="text-lg font-bold mb-4">{q.text}</h2>
        <div className="space-y-2">
          {q.answers.map((a, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="block w-full bg-cyan-600 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded"
            >
              {a.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
