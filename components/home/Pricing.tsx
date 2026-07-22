import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";

const plans = [
  {
    title: "Startup",
    price: "₹999",
    features: ["Business Registration", "Email Support", "Basic Consultation"],
  },
  {
    title: "Business",
    price: "₹4,999",
    features: ["GST", "Trademark", "Priority Support"],
  },
  {
    title: "Enterprise",
    price: "Custom",
    features: ["Dedicated CA", "Compliance", "Account Manager"],
  },
];

export default function Pricing() {
  return (
    <section className="bg-slate-50 py-24">
      <Container>

        <SectionHeader
          title="Simple Pricing"
          subtitle="Choose the plan that fits your business."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.title} className="rounded-3xl bg-white p-8 shadow">

              <h3 className="text-2xl font-bold">{plan.title}</h3>

              <div className="my-6 text-5xl font-bold">
                {plan.price}
              </div>

              <ul className="space-y-3">
                {plan.features.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>

              <Button className="mt-8 w-full">
                Get Started
              </Button>

            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}
