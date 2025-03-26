import { useReward } from "@/context/RewardContext";

let _showReward: ((reward: any) => void) | null = null;

export function registerRewardHandler(showFn: (reward: any) => void) {
  _showReward = showFn;
}

export function showReward(reward: any) {
  if (_showReward) {
    _showReward(reward);
  }
}
