"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      alert("Message Submitted Successfully.");
      setLoading(false);
    }, 1000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl bg-white p-8 shadow"
    >
      <input
        required
        placeholder="Full Name"
        className="w-full rounded-xl border p-4"
      />

      <input
        required
        type="email"
        placeholder="Email Address"
        className="w-full rounded-xl border p-4"
      />

      <input
        required
        placeholder="Mobile Number"
        className="w-full rounded-xl border p-4"
      />

      <textarea
        rows={5}
        placeholder="Your Message"
        className="w-full rounded-xl border p-4"
      />

      <Button
        type="submit"
        className="w-full"
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
