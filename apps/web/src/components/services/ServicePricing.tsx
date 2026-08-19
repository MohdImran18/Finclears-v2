import { IndianRupee, Check } from "lucide-react";
import type { Service } from "@/types/service";

function features(value: NonNullable<Service["pricing"]>[number]["features"]) {
    if (Array.isArray(value)) return value.map(String);
    return [];
}

export default function ServicePricing({ pricing }: { pricing?: Service["pricing"] }) {
    const items = pricing?.filter((item) => item.status) || [];
    if (!items.length) return null;

    return (
        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                    Pricing
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    Choose your plan
                </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`relative rounded-3xl border p-7 ${
                            item.is_popular || item.is_recommended
                                ? "border-slate-900 shadow-xl"
                                : "border-slate-200"
                        }`}
                    >
                        {item.is_popular && (
                            <span className="absolute right-5 top-5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                Popular
                            </span>
                        )}

                        <h3 className="text-xl font-bold text-slate-900">{item.plan_name}</h3>

                        <div className="mt-5 flex items-center text-3xl font-bold text-slate-900">
                            <IndianRupee className="h-6 w-6" />
                            {Number(item.price).toLocaleString("en-IN")}
                        </div>

                        {item.original_price && (
                            <p className="mt-1 text-sm text-slate-400 line-through">
                                ₹{Number(item.original_price).toLocaleString("en-IN")}
                            </p>
                        )}

                        <div className="mt-6 space-y-3">
                            {features(item.features).map((feature, index) => (
                                <div key={index} className="flex gap-2 text-sm text-slate-600">
                                    <Check className="h-4 w-4 shrink-0 text-slate-900" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
