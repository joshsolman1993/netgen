import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { RewardProvider } from "@/context/RewardContext";
import RewardPopup from "@/components/RewardPopup";
import { useReward } from "@/context/RewardContext";
import RewardPortal from "@/components/RewardPortal";

function RewardPortalWrapper() {
  const { reward, closeReward } = useReward();
  return <RewardPopup show={!!reward} reward={reward!} onClose={closeReward} />;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RewardProvider>
      <Navbar />
      <Component {...pageProps} />
      <RewardPortal />
    </RewardProvider>
  );
}
