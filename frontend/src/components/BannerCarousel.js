"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerCarousel({ fallback = null }) {
    const [banners, setBanners] = useState([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback((emblaApi) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    const defaultBanners = [
        {
            _id: "default-1",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
            title: "Fresh Organic Grocery Delivery",
            subtitle: "Get flat 30% off on your first order. Use code: FRESH30",
            isDefault: true
        },
        {
            _id: "default-2",
            image: "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=1000",
            title: "Healthy Farm Picked Fruits",
            subtitle: "100% natural and pesticide free.",
            isDefault: true
        },
        {
            _id: "default-3",
            image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=1000",
            title: "Daily Essentials at Best Prices",
            subtitle: "Shop your daily needs now.",
            isDefault: true
        }
    ];

    useEffect(() => {
        if (!emblaApi) return;
        onSelect(emblaApi);
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/banners", {
                    validateStatus: function (status) {
                        return status >= 200 && status < 600; // Resolve even on 500
                    }
                });

                if (res.status === 200 && res.data && res.data.length > 0) {
                    setBanners(res.data);
                } else {
                    console.log("API returned non-200 or empty data, using defaults. Status:", res.status);
                    setBanners(defaultBanners);
                }
            } catch (error) {
                console.error("Error fetching banners, using defaults:", error.message);
                setBanners(defaultBanners);
            }
        };
        fetchBanners();
    }, [defaultBanners]);

    const displayBanners = banners.length > 0 ? banners : defaultBanners;

    return (
        <div className="relative w-full group">
            <div className="overflow-hidden rounded-2xl shadow-lg" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {displayBanners.map((banner) => (
                        <div className="relative flex-[0_0_100%] min-w-0 h-[250px] sm:h-[350px] md:h-[450px]" key={banner._id}>
                            <img
                                src={banner.isDefault ? banner.image : `http://localhost:8080${banner.image}`}
                                alt={banner.title || "Banner"}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Content */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex items-center px-8 md:px-16">
                                <div className="max-w-xl text-white">
                                    <span className="inline-block px-3 py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full mb-2 sm:mb-4">
                                        WEEKEND SALE
                                    </span>
                                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 leading-tight">
                                        {banner.title}
                                    </h2>
                                    {banner.subtitle && (
                                        <p className="text-gray-200 mb-4 sm:mb-8 text-sm sm:text-lg hidden sm:block">
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    <button className="bg-green-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg text-sm sm:text-base">
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-green-600 p-2 sm:p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 hidden sm:flex items-center justify-center"
                onClick={scrollPrev}
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-green-600 p-2 sm:p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 hidden sm:flex items-center justify-center"
                onClick={scrollNext}
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
                {displayBanners.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex
                            ? "bg-green-500 w-6 sm:w-8"
                            : "bg-white/60 hover:bg-white/90 w-2 sm:w-2.5"
                            }`}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
