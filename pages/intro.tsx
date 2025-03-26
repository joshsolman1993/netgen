import { useEffect, useState } from "react";
import StoryDialog from "@/components/StoryDialog";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function IntroPage() {
  const [skip, setSkip] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIntro = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.introCompleted) {
          setSkip(true);
          router.push("/dashboard");
        }
      }
    };

    checkIntro();
  }, []);

  const handleIntroEnd = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, { introCompleted: true });

    router.push("/dashboard");
  };

  if (skip) return null;

  return <StoryDialog onEnd={handleIntroEnd} />;
}
