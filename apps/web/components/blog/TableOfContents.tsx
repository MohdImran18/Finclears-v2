"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  title: string;
}

interface Props {
  headings: Heading[];
}

export default function TableOfContents({
  headings,
}: Props) {
  const [active, setActive] =
    useState("");

  useEffect(() => {
    function onScroll() {
      let current = "";

      headings.forEach((heading) => {
        const element =
          document.getElementById(
            heading.id
          );

        if (!element) return;

        const top =
          element.getBoundingClientRect()
            .top;

        if (top <= 120) {
          current = heading.id;
        }
      });

      setActive(current);
    }

    window.addEventListener(
      "scroll",
      onScroll
    );

    onScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, [headings]);

  if (!headings.length) {
    return null;
  }

  return (
    <aside className="sticky top-24 rounded-[28px] border border-gray-200 bg-white p-8 shadow-lg">

      <h3 className="mb-6 text-xl font-bold text-gray-900">

        Table of Contents

      </h3>

      <nav>

        <ul className="space-y-3">

          {headings.map((heading) => (

            <li key={heading.id}>

              <a
                href={`#${heading.id}`}
                className={`block rounded-lg px-4 py-3 text-sm transition ${
                  active === heading.id
                    ? "bg-blue-600 font-semibold text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >

                {heading.title}

              </a>

            </li>

          ))}

        </ul>

      </nav>

      <div className="mt-8 border-t pt-6">

        <div className="rounded-2xl bg-blue-50 p-5">

          <h4 className="font-semibold text-blue-700">

            💡 Expert Tip

          </h4>

          <p className="mt-2 text-sm leading-6 text-gray-600">

            Bookmark this article so you can
            quickly return whenever you need
            guidance on this topic.

          </p>

        </div>

      </div>

    </aside>
  );
}
