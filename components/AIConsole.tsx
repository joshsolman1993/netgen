import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { dialogueTree, DialogueStep } from "@/lib/ai/dialogueTree";
import { saveAIMemory } from "@/lib/ai/aiMemory";

type Message = {
  sender: "ai" | "player";
  text: string;
};

export default function AIConsole() {
  const [userData, setUserData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<DialogueStep | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      setUserData(userSnap.data());

      // 👾 Kezdő dialógus
      const startStep = dialogueTree.find((s) => s.id === "start");
      if (startStep) {
        setCurrentStep(startStep);
        setMessages([{ sender: "ai", text: startStep.ai }]);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);

          const startStep = dialogueTree.find((s) => s.id === "start");

          const mem = data.aiMemory?.intent;
          const memoryLine = mem
            ? {
                sender: "ai",
                text: `Korábban azt mondtad, a célod: ${mem}. Megjegyeztem.`,
              }
            : null;

          if (startStep) {
            setCurrentStep(startStep);
            const introMessages: Message[] = [
              { sender: "ai", text: startStep.ai },
            ];
            if (memoryLine) {
              introMessages.push({
                sender: "ai",
                text: memoryLine.text,
              });
            }
            setMessages(introMessages);
          }
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleOption = async (option: any) => {
    if (!currentStep) return;

    const playerMessage: Message = {
      sender: "player",
      text: option.text,
    };

    const nextStep = dialogueTree.find((s) => s.id === option.nextId);

    const newMessages = [
      playerMessage,
      ...(nextStep ? [{ sender: "ai", text: nextStep.ai }] : []),
    ] as Message[];

    setMessages((prev) => [...prev, ...newMessages]);

    // 🧠 AI emlékezet mentés (akkor is, ha nincs reward)
    if (option.nextId === "power") {
      await saveAIMemory("intent", "power");
    } else if (option.nextId === "knowledge") {
      await saveAIMemory("intent", "knowledge");
    } else if (option.nextId === "opportunity") {
      await saveAIMemory("intent", "opportunity");
    }

    // 🎁 Jutalom jóváírás, ha van
    if (option.reward && userData) {
      const docRef = doc(db, "users", auth.currentUser!.uid);
      const newCoins = (userData.coins || 0) + (option.reward.coin || 0);

      await updateDoc(docRef, {
        coins: newCoins,
      });

      setUserData((prev: any) => ({
        ...prev,
        coins: newCoins,
      }));
    }
    setCurrentStep(nextStep || null);
  };

  if (loading) return <p className="text-white p-6">Betöltés...</p>;

  return (
    <div className="min-h-screen bg-black text-cyan-300 p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🤖 NETGEN AI Konzol
      </h1>

      {/* 💬 Üzenetpanel */}
      <div className="bg-gray-900 border border-cyan-700 rounded-lg p-4 space-y-3 max-w-3xl mx-auto mb-8 shadow-lg">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`${
              msg.sender === "ai"
                ? "text-cyan-300"
                : "text-green-400 text-right"
            }`}
          >
            {msg.text}
          </p>
        ))}
      </div>

      {/* 🎛️ Válaszgombok */}
      {currentStep && currentStep.options.length > 0 && (
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {currentStep.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOption(option)}
              className="bg-cyan-800 hover:bg-cyan-600 text-white px-4 py-2 rounded"
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
