"use client";

import { useState } from "react";

import { Mail, ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // TODO:
    // Integrate API here

    console.log(email);

    setEmail("");
  };

  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white p-10 shadow-xl md:p-16">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

              <Mail
                size={38}
                className="text-blue-600"
              />

            </div>

            <h2 className="mt-8 text-4xl font-bold text-slate-900 md:text-5xl">
              Stay Updated
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Subscribe to receive the latest updates on Company
              Registration, GST, Trademark, ROC Compliance,
              Income Tax and other business services.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 flex max-w-3xl flex-col gap-4 md:flex-row"
          >

            <input
              type="email"
              required
              value={email}
              placeholder="Enter your email address"
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="h-14 flex-1 rounded-xl border border-slate-300 px-5 text-lg outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 text-lg font-semibold text-white transition hover:bg-blue-700"
            >

              Subscribe

              <ArrowRight
                size={20}
                className="ml-2"
              />

            </button>

          </form>

          <div className="mt-14 grid gap-8 text-center md:grid-cols-3">

            <div>

              <h3 className="text-3xl font-bold text-blue-600">
                Weekly
              </h3>

              <p className="mt-2 text-slate-600">
                Business Updates
              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold text-blue-600">
                100+
              </h3>

              <p className="mt-2 text-slate-600">
                Expert Articles
              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold text-blue-600">
                Free
              </h3>

              <p className="mt-2 text-slate-600">
                Compliance Tips
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}