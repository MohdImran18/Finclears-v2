"use client";

import { useState } from "react";

interface Props {
  title: string;
  url: string;
}

export default function ShareButtons({
  title,
  url,
}: Props) {
  const [copied, setCopied] =
    useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(
      url
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      2000
    );
  }

  const encodedTitle =
    encodeURIComponent(title);

  const encodedUrl =
    encodeURIComponent(url);

  const links = [
    {
      name: "LinkedIn",
      icon: "💼",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color:
        "hover:bg-blue-700",
    },

    {
      name: "X",
      icon: "𝕏",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color:
        "hover:bg-black",
    },

    {
      name: "Facebook",
      icon: "📘",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color:
        "hover:bg-blue-600",
    },

    {
      name: "WhatsApp",
      icon: "💬",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color:
        "hover:bg-green-600",
    },

    {
      name: "Email",
      icon: "✉️",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color:
        "hover:bg-gray-700",
    },
  ];

  return (
    <aside className="sticky top-24">

      <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-xl">

        <h3 className="mb-6 text-lg font-bold text-gray-900">

          Share Article

        </h3>

        <div className="space-y-3">

          {links.map((item) => (

            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 rounded-xl border border-gray-200 px-5 py-4 transition ${item.color}`}
            >

              <span className="text-2xl">

                {item.icon}

              </span>

              <span className="font-medium">

                {item.name}

              </span>

            </a>

          ))}

          <button
            onClick={copyLink}
            className="flex w-full items-center gap-4 rounded-xl border border-gray-200 px-5 py-4 transition hover:bg-blue-600 hover:text-white"
          >

            <span className="text-2xl">

              🔗

            </span>

            <span className="font-medium">

              {copied
                ? "Copied!"
                : "Copy Link"}

            </span>

          </button>

        </div>

        <div className="mt-8 border-t pt-6">

          <div className="rounded-2xl bg-slate-50 p-5 text-center">

            <h4 className="text-3xl font-bold text-blue-600">

              5K+

            </h4>

            <p className="mt-2 text-sm text-gray-600">

              Readers This Month

            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}
