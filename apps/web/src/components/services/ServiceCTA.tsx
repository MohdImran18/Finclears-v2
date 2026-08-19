import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ServiceCTA() {
    return (
        <section className="bg-slate-950 px-6 py-16 text-white lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                <div>
                    <h2 className="text-3xl font-bold">Ready to get started?</h2>
                    <p className="mt-2 text-slate-300">
                        Get professional assistance from FinClears experts.
                    </p>
                </div>

                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-slate-200"
                >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}
