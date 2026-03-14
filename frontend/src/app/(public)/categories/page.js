"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import Header from "../../components/header";
import Navbar from "../../components/redesign/Navbar";
import Footer from "../../components/redesign/Footer";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Header />
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Categories Grid */}
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <LayoutGrid className="w-8 h-8 text-green-600" />
              Shop by Category
            </h1>
            <p className="text-gray-500 mt-2">Browse our wide selection of products</p>
          </div>

          {loading ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-6">
              {/* All Products Card */}
              <button
                onClick={() => router.push("/shop")}
                className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all group aspect-square">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 text-center leading-tight">All Products</h3>
              </button>

              {/* Specific Categories */}
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => router.push(`/shop?category=${encodeURIComponent(category.name)}`)}
                  className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-start gap-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all group aspect-square">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-gray-100">
                    {category.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categories/${category.image}`}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 text-center leading-tight line-clamp-2">
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}
