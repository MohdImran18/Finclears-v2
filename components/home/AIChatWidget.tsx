"use client";

import { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const suggestions = [
  "Company Registration",
  "GST Registration",
  "Trademark",
  "ITR Filing",
];

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-28 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl transition hover:scale-110"
      >
        {open ? <X size={28} /> : <Bot size={28} />}
      </button>

      {/* Chat Window */}

      {open && (
        <div className="fixed bottom-48 right-6 z-50 w-[380px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(0,0,0,.15)]">

          {/* Header */}

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-white/20 p-3">
                <Sparkles size={22} />
              </div>

              <div>
                <h3 className="font-bold">
                  FinClears AI
                </h3>

                <p className="text-sm text-blue-100">
                  Online • Ask anything
                </p>
              </div>

            </div>

          </div>

          {/* Body */}

          <div className="space-y-5 p-6">

            <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-7">
              👋 Hello! I'm FinClears AI.

              <br /><br />

              How can I help you today?
            </div>

            <div className="grid gap-3">

              {suggestions.map((item) => (

                <button
                  key={item}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-blue-600 hover:bg-blue-50"
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

          {/* Input */}

          <div className="border-t p-4">

            <div className="flex items-center gap-3 rounded-xl border px-4">

              <input
                placeholder="Ask your question..."
                className="h-12 flex-1 outline-none"
              />

              <button className="text-blue-600">

                <Send size={20} />

              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}
