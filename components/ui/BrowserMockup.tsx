"use client";

export default function BrowserMockup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border bg-white shadow-2xl">

      <div className="flex items-center gap-2 border-b bg-slate-100 p-4">

        <div className="h-3 w-3 rounded-full bg-red-400" />

        <div className="h-3 w-3 rounded-full bg-yellow-400" />

        <div className="h-3 w-3 rounded-full bg-green-400" />

      </div>

      {children}

    </div>
  );
}
