"use client";

export default function GradientCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white shadow-2xl">

      {children}

    </div>
  );
}
