"use client";

import BlurCircle from "./BlurCircle";
import GridPattern from "./GridPattern";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      <GridPattern />

      <BlurCircle className="-left-40 -top-32 h-[500px] w-[500px]" />

      <BlurCircle className="right-0 top-20 h-[450px] w-[450px] bg-cyan-500/10" />

      <BlurCircle className="bottom-0 left-1/2 h-[600px] w-[600px] bg-blue-600/10" />

    </div>
  );
}
