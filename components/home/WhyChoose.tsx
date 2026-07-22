import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";

const reasons = [
  "Experienced Professionals",
  "Affordable Pricing",
  "Fast Turnaround",
  "Dedicated Support",
  "Secure Documentation",
  "100% Online Process",
];

export default function WhyChoose() {
  return (
    <section className="bg-slate-50 py-24">
      <Container>

        <SectionHeader
          title="Why Choose FinClears?"
          subtitle="Trusted by thousands of startups and businesses."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-white p-8 shadow"
            >
              <h3 className="font-semibold text-lg">
                {item}
              </h3>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}
