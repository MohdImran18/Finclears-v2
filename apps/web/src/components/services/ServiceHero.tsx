import Link from "next/link";
import { ArrowRight, Clock3, IndianRupee, CheckCircle2 } from "lucide-react";
import type { Service } from "@/types/service";

export default function ServiceHero({ service }: { service: Service }) {
    return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-8">
                <div>
                    <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-300">
                        {service.category?.name || "Professional Service"}
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        {service.title}
                    </h1>

                    {service.short_description && (
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                            {service.short_description}
                        </p>
                    )}

                    <div className="mt-8 flex flex-wrap gap-4">
                        {service.starting_price && (
                            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3">
                                <IndianRupee className="h-5 w-5" />
                                <span>
                                    {service.price_label || "Starting From"}{" "}
                                    <strong>
                                        {Number(service.starting_price).toLocaleString("en-IN")}
                                    </strong>
                                </span>
                            </div>
                        )}

                        {service.processing_days && (
                            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3">
                                <Clock3 className="h-5 w-5" />
                                <span>{service.processing_days} working days</span>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/contact"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
                    >
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                    {service.banner_image || service.featured_image ? (
                        <img
                            src={service.banner_image || service.featured_image || ""}
                            alt={service.title}
                            className="h-[360px] w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-[360px] items-center justify-center">
                            <div className="text-center">
                                <CheckCircle2 className="mx-auto h-16 w-16 text-slate-400" />
                                <p className="mt-4 text-slate-400">
                                    FinClears Professional Service
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
