"use client";

import { useState } from "react";

const comments = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "/images/avatar/avatar-1.jpg",
    role: "Business Owner",
    comment:
      "This article made the company registration process very easy to understand. Thank you!",
    date: "2 days ago",
    likes: 12,
    author: false,
  },
  {
    id: 2,
    name: "FinClears Team",
    avatar: "/images/logo/icon.png",
    role: "Author",
    comment:
      "Thank you for your feedback. We're glad the guide helped you. Feel free to contact us if you need assistance.",
    date: "1 day ago",
    likes: 8,
    author: true,
  },
];

export default function Comments() {
  const [message, setMessage] =
    useState("");

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    alert(
      "Comment submitted successfully."
    );

    setMessage("");
  }

  return (
    <section className="mt-24">

      <div className="border-t pt-20">

        <div className="mb-14">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Discussion

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Comments

          </h2>

          <p className="mt-6 text-lg text-gray-600">

            Join the conversation and share
            your thoughts.

          </p>

        </div>

        {/* Comment Form */}

        <div className="rounded-[32px] border bg-white p-8 shadow-lg">

          <h3 className="text-2xl font-bold">

            Leave a Comment

          </h3>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <input
              placeholder="Your Name"
              required
              className="w-full rounded-xl border px-5 py-4"
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full rounded-xl border px-5 py-4"
            />

            <textarea
              rows={6}
              required
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              placeholder="Write your comment..."
              className="w-full rounded-xl border px-5 py-4"
            />

            <button
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"
            >

              Post Comment

            </button>

          </form>

        </div>

        {/* Comments */}

        <div className="mt-12 space-y-8">

          {comments.map((comment) => (

            <div
              key={comment.id}
              className="rounded-[28px] border bg-white p-8 shadow"
            >

              <div className="flex gap-5">

                <img
                  src={comment.avatar}
                  alt={comment.name}
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="text-xl font-bold">

                      {comment.name}

                    </h3>

                    {comment.author && (

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                        Author

                      </span>

                    )}

                  </div>

                  <p className="text-sm text-gray-500">

                    {comment.role} • {comment.date}

                  </p>

                  <p className="mt-5 leading-8 text-gray-700">

                    {comment.comment}

                  </p>

                  <div className="mt-6 flex gap-6">

                    <button className="text-sm font-medium text-gray-500 hover:text-blue-600">

                      👍 {comment.likes}

                    </button>

                    <button className="text-sm font-medium text-gray-500 hover:text-blue-600">

                      Reply

                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Pagination */}

        <div className="mt-14 flex justify-center gap-3">

          <button className="rounded-xl border px-5 py-3 hover:bg-gray-100">

            Previous

          </button>

          <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">

            1

          </button>

          <button className="rounded-xl border px-5 py-3 hover:bg-gray-100">

            Next

          </button>

        </div>

      </div>

    </section>
  );
}
