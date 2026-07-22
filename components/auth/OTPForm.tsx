"use client";

import { useState } from "react";

export default function OTPForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      /*
       * TODO:
       * Connect Laravel API
       *
       * POST /api/v1/auth/verify-otp
       *
       * Example:
       *
       * await fetch("/api/v1/auth/verify-otp", {
       *   method: "POST",
       *   headers: {
       *     "Content-Type": "application/json",
       *   },
       *   body: JSON.stringify({
       *     otp,
       *   }),
       * });
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      alert("OTP verified successfully.");

      setOtp("");

    } catch (error) {
      console.error(error);

      alert("Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>

        <label
          htmlFor="otp"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          One-Time Password
        </label>

        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={otp}
          onChange={(e) =>
            setOtp(
              e.target.value.replace(/\D/g, "")
            )
          }
          placeholder="Enter 6-digit OTP"
          className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Verifying..."
          : "Verify OTP"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Didn't receive the OTP?{" "}
        <button
          type="button"
          className="font-medium text-blue-600 hover:underline"
        >
          Resend OTP
        </button>
      </p>
    </form>
  );
}
