"use client";

const team = [
  {
    name: "Abhishek Gupta",
    role: "Founder & CEO",
    image: "/images/team/founder.jpg",
    description:
      "Leading FinClears with a vision to simplify business registration and compliance across India.",
  },
  {
    name: "Chartered Accountant",
    role: "Head of Tax & Compliance",
    image: "/images/team/ca.jpg",
    description:
      "Specialist in GST, Income Tax, ROC Compliance and financial advisory services.",
  },
  {
    name: "Company Secretary",
    role: "Corporate Compliance",
    image: "/images/team/cs.jpg",
    description:
      "Expert in company incorporation, MCA filings and corporate governance.",
  },
  {
    name: "Legal Advisor",
    role: "Trademark & Legal",
    image: "/images/team/legal.jpg",
    description:
      "Helping businesses protect their brands through trademarks and legal compliance.",
  },
];

export default function Team() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Leadership Team

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Meet The Experts Behind FinClears

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Our experienced professionals help entrepreneurs,
            startups and enterprises navigate business registration,
            taxation and compliance with confidence.

          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {team.map((member) => (

            <div
              key={member.name}
              className="overflow-hidden rounded-[32px] bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="h-72 bg-slate-100">

                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />

              </div>

              <div className="p-8">

                <h3 className="text-2xl font-bold text-gray-900">

                  {member.name}

                </h3>

                <p className="mt-2 font-semibold text-blue-600">

                  {member.role}

                </p>

                <p className="mt-5 leading-7 text-gray-600">

                  {member.description}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
