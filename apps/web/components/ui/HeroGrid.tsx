"use client";

export default function HeroGrid() {
  return (
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(#2563eb 1px, transparent 1px),linear-gradient(90deg,#2563eb 1px,transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    />
  );
}
