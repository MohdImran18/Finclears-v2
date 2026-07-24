"use client";

export default function GlowBorder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[34px] bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 p-[1px]">

      <div className="rounded-[33px] bg-white">

        {children}

      </div>

    </div>
  );
}
