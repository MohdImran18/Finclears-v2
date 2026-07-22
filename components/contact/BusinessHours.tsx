"use client";

const schedule = [
  {
    day: "Monday",
    time: "9:00 AM - 7:00 PM",
  },
  {
    day: "Tuesday",
    time: "9:00 AM - 7:00 PM",
  },
  {
    day: "Wednesday",
    time: "9:00 AM - 7:00 PM",
  },
  {
    day: "Thursday",
    time: "9:00 AM - 7:00 PM",
  },
  {
    day: "Friday",
    time: "9:00 AM - 7:00 PM",
  },
  {
    day: "Saturday",
    time: "9:00 AM - 5:00 PM",
  },
  {
    day: "Sunday",
    time: "Closed",
  },
];

export default function BusinessHours() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Business Hours

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            We're Here When You Need Us

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Contact our experts during business hours or
            leave a message anytime. We'll respond quickly.

          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Schedule */}

          <div className="rounded-[32px] bg-white p-10 shadow-xl">

            <h3 className="text-3xl font-bold text-gray-900">

              Weekly Schedule

            </h3>

            <div className="mt-8 divide-y">

              {schedule.map((item) => (

                <div
                  key={item.day}
                  className="flex items-center justify-between py-5"
                >

                  <span className="font-medium text-gray-700">

                    {item.day}

                  </span>

                  <span
                    className={
                      item.time === "Closed"
                        ? "font-semibold text-red-600"
                        : "font-semibold text-green-600"
                    }
                  >
                    {item.time}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Support */}

          <div className="rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-10 text-white shadow-2xl">

            <h3 className="text-3xl font-bold">

              Support Information

            </h3>

            <div className="mt-8 space-y-8">

              <div className="flex gap-4">

                <div className="text-4xl">
                  📞
                </div>

                <div>

                  <h4 className="text-xl font-semibold">

                    Phone Support

                  </h4>

                  <p className="mt-2 text-blue-100">

                    Monday - Saturday

                  </p>

                  <p className="font-semibold">

                    9:00 AM - 7:00 PM

                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="text-4xl">
                  💬
                </div>

                <div>

                  <h4 className="text-xl font-semibold">

                    WhatsApp Support

                  </h4>

                  <p className="mt-2 text-blue-100">

                    Fastest Response

                  </p>

                  <p className="font-semibold">

                    9:00 AM - 9:00 PM

                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="text-4xl">
                  ✉️
                </div>

                <div>

                  <h4 className="text-xl font-semibold">

                    Email Support

                  </h4>

                  <p className="mt-2 text-blue-100">

                    Available 24×7

                  </p>

                  <p className="font-semibold">

                    Reply within 24 Hours

                  </p>

                </div>

              </div>

            </div>

            <div className="mt-10 rounded-2xl bg-white/10 p-6">

              <h4 className="text-xl font-bold">

                Emergency Business Support

              </h4>

              <p className="mt-3 leading-7 text-blue-100">

                For urgent business registrations,
                GST deadlines or compliance issues,
                our experts will prioritize your request.

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
