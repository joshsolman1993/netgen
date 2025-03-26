import { useState } from "react";
import { introStory, StoryLine } from "@/data/introStory";

const storyMap: Record<string, StoryLine> = Object.fromEntries(
  introStory.map((s) => [s.id, s])
);

export default function StoryDialog({ onEnd }: { onEnd: () => void }) {
  const [currentId, setCurrentId] = useState("start");

  const current = storyMap[currentId];

  const handleNext = (nextId?: string) => {
    if (nextId) setCurrentId(nextId);
    else if (current.nextId) setCurrentId(current.nextId);
    else onEnd();
  };

  return (
    <div className="bg-black text-cyan-300 p-6 min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-xl bg-gray-900 p-6 rounded-lg border border-cyan-700 shadow-xl">
        <h2 className="text-lg font-bold mb-2">{current.speaker}</h2>
        <p className="mb-4 text-gray-200">{current.text}</p>

        {current.choices ? (
          <div className="space-y-2">
            {current.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleNext(choice.nextId)}
                className="block w-full bg-cyan-600 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded"
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => handleNext()}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded"
          >
            ➤ Tovább
          </button>
        )}
      </div>
    </div>
  );
}
