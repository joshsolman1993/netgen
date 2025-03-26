import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const introSteps = [
  {
    id: 1,
    speaker: "AI Konzol",
    text: "…Online kapcsolat helyreállítva. Üdvözöllek a protokoll túlélője.",
  },
  {
    id: 2,
    speaker: "AI Konzol",
    text: "A világ, amit ismertél, összeomlott. Egy új rendszer született: decentralizált, kódolt, veszélyes.",
  },
  {
    id: 3,
    speaker: "AI Konzol",
    text: "Fel akarod venni a kapcsolatot más túlélőkkel… vagy inkább rejtve maradsz?",
    options: [
      { text: "🔓 Nyissam a hálót", response: "Hozzáférés megadva." },
      {
        text: "🕶️ Egyedül mozgok tovább",
        response: "Ismeretlen út választva.",
      },
    ],
  },
];

export default function IntroDialogue() {
  const [step, setStep] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchIntroState = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.data();
      if (data?.introCompleted) {
        setCompleted(true);
      }
    };
    fetchIntroState();
  }, []);

  const next = async () => {
    if (step === introSteps.length - 1) {
      // végére értünk
      const user = auth.currentUser;
      if (user) {
        const ref = doc(db, "users", user.uid);
        await updateDoc(ref, { introCompleted: true });
      }
      setCompleted(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleOptionClick = async (response: string) => {
    setShowOptions(false);
    setTimeout(() => {
      introSteps.push({
        id: 999,
        speaker: "AI Konzol",
        text: response,
      });
      next();
    }, 500);
  };

  if (completed) return null;

  const current = introSteps[step];

  return (
    <div className="p-6 bg-black text-cyan-200 max-w-2xl mx-auto rounded-xl shadow-md border border-cyan-700 mt-8">
      <p className="text-sm text-cyan-500 mb-1">{current.speaker}</p>
      <div className="text-lg font-mono mb-4">{current.text}</div>

      {current.options ? (
        <div className="space-y-2">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt.response)}
              className="block w-full text-left bg-cyan-800 hover:bg-cyan-600 px-4 py-2 rounded text-white font-semibold"
            >
              {opt.text}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={next}
          className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-400 rounded text-black font-bold"
        >
          Tovább
        </button>
      )}
    </div>
  );
}
