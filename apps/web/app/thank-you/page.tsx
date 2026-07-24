import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Thank You | FinClears",
  description: "Your enquiry has been submitted successfully.",
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-xl text-center">

        <div className="flex justify-center">

          <CheckCircle2
            className="h-20 w-20 text-green-500"
          />

        </div>

        <h1 className="mt-6 text-4xl font-bold text-gray-900">
          Thank You!
        </h1>

        <p className="mt-4 text-lg text-gray-600 leading-8">

          Your enquiry has been submitted successfully.

          <br />

          One of our business experts will contact you shortly.

        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Home
          </Link>

          <Link
            href="/services"
            className="rounded-xl border border-gray-300 px-6 py-4 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Explore Services
          </Link>

        </div>

      </div>

    </main>
  );
}