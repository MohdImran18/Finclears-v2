"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scroll = () => {
      const total =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const current = window.scrollY;

      setProgress((current / total) * 100);
    };

    window.addEventListener("scroll", scroll);

    return () =>
      window.removeEventListener("scroll", scroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-[9999] h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500"
      style={{
        width: `${progress}%`,
      }}
    />
  );
}
