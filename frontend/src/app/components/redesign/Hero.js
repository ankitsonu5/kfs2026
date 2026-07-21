"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Hero({ data }) {
    return (
        <section className="relative bg-gray-50 py-16 lg:py-24 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12">
                {/* Text Content */}
                <div className="flex-1 space-y-6 z-10">
                    <span className="text-orange-500 font-semibold tracking-wide uppercase text-sm">{data?.subtitle || "Welcome to kFS24x7"}</span>
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        {data?.title || "Fresh Grocery Delivered to Your Door"}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-lg whitespace-pre-wrap">
                        {data?.description || "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                            <span className="bg-green-100 text-green-700 p-1 rounded font-bold text-xs">100%</span>
                            <span className="text-sm font-semibold text-gray-800">Natural</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                            <span className="bg-green-100 text-green-700 p-1 rounded font-bold text-xs">100%</span>
                            <span className="text-sm font-semibold text-gray-800">Quality</span>
                        </div>
                    </div>

                    <Link href={data?.buttonLink || "/shop"} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors mt-6 shadow-lg shadow-green-200 inline-block">
                        {data?.buttonText || "Shop Now"}
                    </Link>
                </div>

                {/* Image Content */}
                <div className="flex-1 relative w-full h-[300px] lg:h-[500px]">
                    {/* Placeholder for Hero Image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-orange-50 overflow-hidden">
                        <Image
                            src={data?.image ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${data.image}` : "/aboutus/aboutsideimage.webp"}
                            alt="Hero Image"
                            className="w-full h-full object-cover mix-blend-multiply opacity-90"
                            width={500}
                            height={500}
                        />
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                    <div className="absolute top-10 right-10 w-32 h-32 bg-green-400 rounded-full blur-3xl opacity-30"></div>
                </div>
            </div>
        </section>
    );
}
