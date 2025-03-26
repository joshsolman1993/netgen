export type StoryMission = {
    id: string;
    title: string;
    description: string;
    requirement: {
      type: "coins" | "faction" | "visit";
      value: number | string;
    };
    reward: {
      coins?: number;
    };
  };
  
  export const storyMissions: StoryMission[] = [
    {
      id: "intro-01",
      title: "Első lépések",
      description: "Gyűjts össze legalább 200 ₿-t. A jövőd alapja a tőke.",
      requirement: {
        type: "coins",
        value: 200,
      },
      reward: {
        coins: 100,
      },
    },
    {
      id: "intro-02",
      title: "Képviselet keresése",
      description: "Csatlakozz egy frakcióhoz.",
      requirement: {
        type: "faction",
        value: "ANY", // Bármelyik frakció elfogadott
      },
      reward: {
        coins: 150,
      },
    },
    {
      id: "intro-03",
      title: "Ismerd meg a gazdaságot",
      description: "Látogasd meg a Coin-kezelés oldalt.",
      requirement: {
        type: "visit",
        value: "/economy",
      },
      reward: {
        coins: 50,
      },
    },
  ];
  