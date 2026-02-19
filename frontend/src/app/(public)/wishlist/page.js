"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Heart,
  Trash2,
  ShoppingCart,
  ChevronLeft,
  Package,
  ShoppingBag,
} from "lucide-react";
import Header from "../../components/header";
import Navbar from "../../components/redesign/Navbar";
import Footer from "../../components/redesign/Footer";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view your wishlist");
        router.push("/login");
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
          {
            headers: { Authorization: token },
          },
        );
        setWishlistItems(res.data.items || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartCount = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        const guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const count = guestCart.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setCartCount(count);
      } else {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            headers: { Authorization: token },
          })
          .then((res) => {
            if (res.data && res.data.items) {
              const count = res.data.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );
              setCartCount(count);
            }
          });
      }
    };

    fetchWishlist();
    fetchCartCount();
  }, [router]);

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/remove/${productId}`,
        {
          headers: { Authorization: token },
        },
      );
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-cart`,
        {
          productId: product.productId,
          title: product.title,
          price: product.price,
          image: product.image,
        },
        { headers: { Authorization: token } },
      );
      setCartCount((prev) => prev + 1);
      alert("Added to Cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={cartCount} />
        <Navbar />
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartCount={cartCount} />
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors font-medium">
            <ChevronLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Heart className="text-red-500 fill-current" size={24} />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Wishlist
            </h1>
          </div>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven't added any products to your wishlist yet. Explore our
              products and save your favorites!
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 active:scale-95">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300 group">
                <div
                  onClick={() => router.push(`/product/${item.productId}`)}
                  className="h-48 bg-gray-50 relative flex items-center justify-center p-4 cursor-pointer overflow-hidden">
                  <img
                    src={`http://localhost:8080/uploads/${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.productId);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-4">
                  <h3
                    onClick={() => router.push(`/product/${item.productId}`)}
                    className="font-bold text-gray-800 mb-1 hover:text-green-600 cursor-pointer truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-600/10 active:scale-95">
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
