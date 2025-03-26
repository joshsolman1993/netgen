import { useEffect } from "react";
import { useReward } from "@/context/RewardContext";
import RewardPopup from "./RewardPopup";
import { registerRewardHandler } from "@/lib/rewardUtils";

export default function RewardPortal() {
  const { reward, closeReward, showReward } = useReward();

  useEffect(() => {
    registerRewardHandler(showReward);
  }, [showReward]);

  return <RewardPopup show={!!reward} reward={reward!} onClose={closeReward} />;
}
