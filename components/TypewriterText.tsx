import { useEffect, useState } from "react";

type Props = {
  texts: string[];
  speed?: number;
};

export default function TypewriterText({ texts, speed = 50 }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (index >= texts.length) return;
    if (charIndex < texts[index].length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + texts[index][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setIndex((prev) => prev + 1);
        setDisplayed((prev) => prev + "\n");
        setCharIndex(0);
      }, 800);
      return () => clearTimeout(pause);
    }
  }, [charIndex, index]);

  return (
    <pre className="whitespace-pre-line leading-snug tracking-wide">
      {displayed}
    </pre>
  );
}
