"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-2xl lg:hidden">

      <div className="grid grid-cols-2">

        <Link
          href="tel:+919873247695"
          className="flex h-16 items-center justify-center gap-2 font-semibold text-slate-900"
        >
          <Phone size={18} />

          Call Now
        </Link>

        <Link
          href="https://wa.me/919873247695"
          target="_blank"
          className="flex h-16 items-center justify-center gap-2 bg-green-500 font-semibold text-white"
        >
          <MessageCircle size={18} />

          WhatsApp
        </Link>

      </div>

    </div>
  );
}
