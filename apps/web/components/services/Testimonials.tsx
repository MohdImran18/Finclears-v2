"use client";

import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  image: string;
  rating: number;
  review: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    designation: "Founder",
    company: "TechNova Solutions",
    image: "/images/testimonials/user-1.webp",
    rating: 5,
    review:
      "FinClears completed our Private Limited Company registration quickly. The process was smooth, transparent, and completely online.",
  },
  {
    id: 2,
    name: "Priya Gupta",
    designation: "Director",
    company: "Gupta Enterprises",
    image: "/images/testimonials/user-2.webp",
    rating: 5,
    review:
      "Their GST registration and compliance support saved us a lot of time. The team was knowledgeable and responsive throughout.",
  },
  {
    id: 3,
    name: "Amit Verma",
    designation: "CEO",
    company: "AV Technologies",
    image: "/images/testimonials/user-3.webp",
    rating: 5,
    review:
      "Professional service with excellent communication. Trademark registration was completed without any hassle.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Testimonials
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            What Our Clients Say
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Thousands of startups, entrepreneurs and
            businesses trust FinClears for registration,
            taxation and compliance services.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/avatar-placeholder.webp";
                  }}
                />

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.designation}
                  </p>

                  <p className="text-sm font-medium text-blue-600">
                    {item.company}
                  </p>

                </div>

              </div>

              <div className="mt-6 flex gap-1">

                {Array.from({
                  length: item.rating,
                }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="mt-6 leading-8 text-slate-600">
                "{item.review}"
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}