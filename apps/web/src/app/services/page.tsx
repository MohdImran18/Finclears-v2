import type { Metadata } from "next";
import ServiceGrid from "@/components/services/ServiceGrid";
import { ServiceApi } from "@/lib/api/services";

export const metadata: Metadata = {
    title: "Business & Tax Services | FinClears",
    description:
        "Explore company registration, GST, income tax, ROC, trademark and other professional business services from FinClears.",
};

export default async function ServicesPage() {
    const services = await ServiceApi.getAll();

    return (
        <main className="min-h-screen bg-slate-50">
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            FinClears Services
                        </p>

                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                            Professional Business & Tax Services
                        </h1>

                        <p className="mt-5 text-lg leading-8 text-slate-600">
                            Get reliable support for company registration, GST,
                            income tax, compliance, trademark and other business
                            requirements.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <ServiceGrid services={services} />
            </section>
        </main>
    );
}
