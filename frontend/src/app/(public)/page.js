import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative flex min-h-[600px] flex-col justify-center overflow-hidden bg-[var(--primary)]/10 px-4 py-20 text-center md:px-8">
                <div className="container mx-auto max-w-4xl relative z-10">
                    <span className="mb-4 inline-block rounded-full bg-[var(--primary)]/20 px-4 py-1.5 text-sm font-semibold text-[var(--primary)]">
                        Organic & Fresh
                    </span>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-[var(--foreground)]">
                        Fresh Groceries Delivered <br />
                        <span className="text-[var(--primary)]">To Your Doorstep</span>
                    </h1>
                    <p className="mb-8 text-lg text-[var(--muted)] sm:text-xl">
                        Experience the best quality produce and essentials. Curated for your health and convenient for your lifestyle.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/bulk-order"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--primary)] px-8 text-sm font-medium text-white shadow transition-transform hover:scale-105"
                        >
                            Shop Bulk Orders <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <button className="inline-flex h-12 items-center justify-center rounded-md border border-[var(--border)] bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary)]/20 blur-3xl" />
                <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <Leaf className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">100% Organic</h3>
                            <p className="text-[var(--muted)]">Sourced directly from certified organic farms.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <Truck className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">Fast Delivery</h3>
                            <p className="text-[var(--muted)]">Same-day delivery for orders placed before noon.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">Quality Guarantee</h3>
                            <p className="text-[var(--muted)]">If you are not satisfied, we will refund your money.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}