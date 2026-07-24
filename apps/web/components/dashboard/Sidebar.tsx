"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useNavigation } from "@/hooks/useNavigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = useNavigation();

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-white">

      <div className="border-b px-6 py-6">

        <h2 className="text-2xl font-bold text-blue-600">
          FinClears
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Customer Portal
        </p>

      </div>

      <nav className="flex-1 space-y-2 p-4">

        {navigation.map((item) => {

          const active =
            pathname === item.href;

          return (

            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-blue-600 font-semibold text-white"
                  : "text-gray-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>

          );

        })}

      </nav>

    </aside>
  );
}