import dynamic from "next/dynamic";
import Head from "next/head";

// 💡 Dinamikusan importáljuk az AI konzolt (csak kliens oldalon fusson)
const AIConsole = dynamic(() => import("@/components/AIConsole"), {
  ssr: false,
});

export default function ConsolePage() {
  return (
    <>
      <Head>
        <title>AI Konzol | NETGEN</title>
      </Head>
      <AIConsole />
    </>
  );
}
