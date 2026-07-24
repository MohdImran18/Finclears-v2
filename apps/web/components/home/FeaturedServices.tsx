import {
  Building2,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import FeatureCard from "@/components/common/FeatureCard";

export default function FeaturedServices() {
  return (
    <section className="py-24">
      <Container>

        <SectionHeader
          title="Popular Services"
          subtitle="Everything you need to start and manage your business."
        />

        <div className="grid gap-8 lg:grid-cols-3">

          <FeatureCard
            icon={<Building2 size={40} />}
            title="Company Registration"
            description="Private Limited, LLP, OPC & Startup Registration."
          />

          <FeatureCard
            icon={<FileCheck size={40} />}
            title="GST Services"
            description="GST Registration, Filing and Compliance."
          />

          <FeatureCard
            icon={<ShieldCheck size={40} />}
            title="Trademark"
            description="Trademark Registration & Brand Protection."
          />

        </div>

      </Container>
    </section>
  );
}
