import type { Metadata } from "next";

import OTPForm from "@/components/auth/OTPForm";

export const metadata: Metadata = {
  title: "Verify OTP | FinClears",
  description:
    "Verify your account securely using the One-Time Password (OTP) sent to your registered mobile number.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OTPPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">

      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <header>

          <h1 className="text-3xl font-bold text-slate-900">
            Verify OTP
          </h1>

          <p className="mt-3 text-slate-600">
            Enter the One-Time Password (OTP) sent to your registered mobile number to continue.
          </p>

        </header>

        <div className="mt-8">

          <OTPForm />

        </div>

      </section>

    </main>
  );
}
