import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SpecialOffer() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
                {/* Left Images */}
                <div className="flex-1 grid grid-cols-2 gap-4 w-full h-[400px] lg:h-[500px]">
                    <div className="relative h-full rounded-2xl overflow-hidden mt-8 shadow-xl">
                        <img src="https://placehold.co/400x600/fecaca/991b1b?text=Fresh+Meat" alt="Shopping" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="relative h-full rounded-2xl overflow-hidden mb-8 shadow-xl">
                        <img src="https://placehold.co/400x600/bbf7d0/166534?text=Vegetables" alt="Planning" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 space-y-8">
                    <span className="text-orange-500 font-semibold uppercase tracking-wide text-sm">Quality Org</span>
                    <h2 className="text-4xl font-bold text-gray-900">Special Offers For You</h2>
                    <p className="text-gray-600 leading-relaxed">
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <CheckCircle className="text-green-500 shrink-0" size={24} />
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">Natural Products</h4>
                                <p className="text-gray-500 text-sm">It is a long established fact that a reader will be distracted.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <CheckCircle className="text-green-500 shrink-0" size={24} />
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">Best Food For Health</h4>
                                <p className="text-gray-500 text-sm">The standard chunk of Lorem Ipsum used since the 1500s.</p>
                            </div>
                        </div>
                    </div>

                    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-green-200 transition-all">
                        Read More
                    </button>
                </div>
            </div>
        </section>
    );
}
