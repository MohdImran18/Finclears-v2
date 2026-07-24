import type { Metadata } from "next";

import VerifyEmail from "@/components/auth/VerifyEmail";


export const metadata: Metadata = {

  title: "Verify Email | FinClears",

  description:
    "Verify your email address to activate your FinClears account.",

};



export default function VerifyEmailPage() {

  return (

    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">


        <h1 className="text-3xl font-bold text-gray-900">
          Verify Email
        </h1>


        <p className="mt-3 text-gray-600">
          Please verify your email address to continue.
        </p>


        <div className="mt-8">

          <VerifyEmail />

        </div>


      </div>

    </main>

  );

}
