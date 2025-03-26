export type StoryLine = {
    id: string;
    speaker: string;
    text: string;
    choices?: { text: string; nextId: string }[];
    nextId?: string;
  };
  
  export const introStory: StoryLine[] = [
    {
      id: "start",
      speaker: "Rendszer",
      text: "Üdvözlünk a Sötét Hálóban. A világ, amit ismertél, elbukott.",
      nextId: "sys-1",
    },
    {
      id: "sys-1",
      speaker: "Rendszer",
      text: "A hagyományos pénzügyi rendszerek megsemmisültek. Most minden a kriptovalutákon múlik.",
      nextId: "npc-1",
    },
    {
      id: "npc-1",
      speaker: "Ismeretlen Hang",
      text: "Figyelj. Ha túl akarsz élni itt, gyorsan kell tanulnod... és még gyorsabban döntened.",
      choices: [
        { text: "Ki vagy te?", nextId: "npc-2" },
        { text: "Mit kell tennem?", nextId: "npc-3" },
      ],
    },
    {
      id: "npc-2",
      speaker: "Ismeretlen Hang",
      text: "A nevem nem számít. Egy vagyok azok közül, akik már régóta figyelnek.",
      nextId: "npc-3",
    },
    {
      id: "npc-3",
      speaker: "Ismeretlen Hang",
      text: "Először szerezz tőkét. A coin minden. Nélküle csak adat vagy.",
      nextId: "end",
    },
    {
      id: "end",
      speaker: "Rendszer",
      text: "A kapcsolat megszakadt. Kezdetét veszi utad a NETGEN világában.",
    },
  ];
  