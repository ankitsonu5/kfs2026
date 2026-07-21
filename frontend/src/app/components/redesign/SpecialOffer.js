"use client";

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SpecialOffer({ data }) {
    const features = data?.features?.length > 0 ? data.features : [
      { title: "Natural Products", description: "It is a long established fact that a reader will be distracted." },
      { title: "Best Food For Health", description: "The standard chunk of Lorem Ipsum used since the 1500s." }
    ];

    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          {/* Left Images */}
          <div className="flex-1 grid grid-cols-2 gap-4 w-full h-[400px] lg:h-[500px]">
            <div className="relative h-full rounded-2xl overflow-hidden mt-8 shadow-xl">
              <Image
                src={data?.image1 ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${data.image1}` : "/aboutus/aboutus1.webp"}
                alt="Shopping"
                fill
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative h-full rounded-2xl overflow-hidden mb-8 shadow-xl">
              <Image
                src={data?.image2 ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/aboutus/${data.image2}` : "/aboutus/aboutus2.webp"}
                alt="Planning"
                fill
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 space-y-8">
            <span className="text-orange-500 font-semibold uppercase tracking-wide text-sm">
              {data?.subtitle || "Quality Org"}
            </span>
            <h2 className="text-4xl font-bold text-gray-900">
              {data?.title || "Special Offers For You"}
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {data?.description || "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour."}
            </p>

            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle className="text-green-500 shrink-0" size={24} />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {f.title}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href={data?.buttonLink || "/shop"} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-green-200 transition-all inline-block mt-4">
              {data?.buttonText || "Read More"}
            </Link>
          </div>
        </div>
      </section>
    );
}
