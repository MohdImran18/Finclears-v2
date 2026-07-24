"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  name: string;
  role: string;
  avatar?: string | null;
  bio: string;
  articles: number;
  expertise: string[];
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export default function AuthorCard({
  name,
  role,
  avatar,
  bio,
  articles,
  expertise,
  linkedin,
  twitter,
  website,
}: Props) {
  return (
    <section className="mt-20">
      <div className="overflow-hidden rounded-[36px] border border-gray-200 bg-white shadow-xl">
        <div className="grid gap-10 p-10 lg:grid-cols-[220px_1fr]">

          {/* Avatar */}
          <div className="flex justify-center">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                width={208}
                height={208}
                className="h-52 w-52 rounded-3xl object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-52 w-52 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-6xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Article Author
            </span>

            <h2 className="mt-6 text-4xl font-bold text-gray-900">
              {name}
            </h2>

            <p className="mt-2 text-lg font-medium text-blue-600">
              {role}
            </p>

            <p className="mt-6 leading-8 text-gray-600">
              {bio}
            </p>

            {/* Stats */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-6">
                <h3 className="text-3xl font-bold text-blue-600">
                  {articles}+
                </h3>

                <p className="mt-2 text-gray-600">
                  Published Articles
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6">
                <h3 className="text-3xl font-bold text-green-600">
                  Expert
                </h3>

                <p className="mt-2 text-gray-600">
                  Business Compliance
                </p>
              </div>
            </div>

            {/* Expertise */}
            <div className="mt-10">
              <h3 className="text-xl font-bold">
                Areas of Expertise
              </h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {expertise.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10 flex flex-wrap gap-4">
              {linkedin && (
                <Link
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border px-5 py-3 transition hover:bg-blue-600 hover:text-white"
                >
                  LinkedIn
                </Link>
              )}

              {twitter && (
                <Link
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border px-5 py-3 transition hover:bg-black hover:text-white"
                >
                  X
                </Link>
              )}

              {website && (
                <Link
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border px-5 py-3 transition hover:bg-gray-900 hover:text-white"
                >
                  Website
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}