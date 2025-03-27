export type DialogueStep = {
    id: string;
    ai: string;
    options: {
      text: string;
      nextId?: string;
      reward?: {
        coin?: number;
        item?: string;
      };
    }[];
  };
  
  export const dialogueTree: DialogueStep[] = [
    {
      id: "start",
      ai: "Mit keresel a NETGEN konzolnál?",
      options: [
        { text: "🧠 Tudást", nextId: "knowledge" },
        { text: "💼 Lehetőséget", nextId: "opportunity" },
        { text: "💀 Határtalan erőt", nextId: "power" },
      ],
    },
    {
      id: "knowledge",
      ai: "A tudás ára az információ. Oszd meg velem, mi hajt igazán?",
      options: [
        { text: "🔍 Az igazság", nextId: "truth" },
        { text: "📡 A megfigyelés hatalma", nextId: "surveillance" },
      ],
    },
    {
      id: "opportunity",
      ai: "A lehetőség gyakran álruhát visel. Készen állsz vállalni a kockázatot?",
      options: [
        { text: "🎲 Igen", nextId: "risk", reward: { coin: 200 } },
        { text: "⛔ Nem", nextId: "coward" },
      ],
    },
    {
      id: "power",
      ai: "A hatalom rombol, ha nincs célod. Mi a te célod?",
      options: [
        { text: "🛡️ Védelem", nextId: "protector" },
        { text: "⚔️ Uralom", nextId: "domination", reward: { coin: 300 } },
      ],
    },
    {
      id: "truth",
      ai: "Az igazság... torzított, digitális visszhang. De talán mégis megtalálhatod.",
      options: [],
    },
    {
      id: "surveillance",
      ai: "Aki figyel, azt is figyelik. Emlékezz erre.",
      options: [],
    },
    {
      id: "risk",
      ai: "Kockázat vállalva. Algoritmikus megerősítés jóváírva.",
      options: [],
    },
    {
      id: "coward",
      ai: "Nem mindenki születik játékosnak.",
      options: [],
    },
    {
      id: "protector",
      ai: "A védelmező ritka, de fontos láncszem a hálózatban.",
      options: [],
    },
    {
      id: "domination",
      ai: "Uralomhoz stratégia kell – úgy tűnik, rendelkezel vele.",
      options: [],
    },
  ];
  