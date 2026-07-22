"use client";

import { Check } from "lucide-react";
import { Button } from "./button";
import GlassCard from "./GlassCard";

interface Props {
  title: string;
  price: string;
  features: string[];
  featured?: boolean;
}

export default function PricingCard({
  title,
  price,
  features,
  featured = false,
}: Props) {
  return (
    <GlassCard
      className={`p-10 ${
        featured
          ? "border-blue-600"
          : ""
      }`}
    >
      <h3 className="text-3xl font-bold">

        {title}

      </h3>

      <div className="mt-6 text-5xl font-black">

        {price}

      </div>

      <div className="mt-10 space-y-5">

        {features.map((item) => (

          <div
            key={item}
            className="flex items-center gap-3"
          >

            <Check className="text-blue-600" />

            {item}

          </div>

        ))}

      </div>

      <Button
        className="mt-10 w-full"
        variant="gradient"
      >
        Get Started
      </Button>

    </GlassCard>
  );
}
