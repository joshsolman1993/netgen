import { createContext, useContext, useState } from "react";

type Reward = { coin?: number; item?: string } | null;

type RewardContextType = {
  reward: Reward;
  showReward: (reward: Reward) => void;
  closeReward: () => void;
};

const RewardContext = createContext<RewardContextType | undefined>(undefined);

export function RewardProvider({ children }: { children: React.ReactNode }) {
  const [reward, setReward] = useState<Reward>(null);

  const showReward = (r: Reward) => setReward(r);
  const closeReward = () => setReward(null);

  return (
    <RewardContext.Provider value={{ reward, showReward, closeReward }}>
      {children}
    </RewardContext.Provider>
  );
}

export function useReward() {
  const ctx = useContext(RewardContext);
  if (!ctx) throw new Error("useReward must be used within RewardProvider");
  return ctx;
}
