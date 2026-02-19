"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  Package,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import Header from "../../../components/header";
import Navbar from "../../../components/redesign/Navbar";
import Footer from "../../../components/redesign/Footer";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        );
        if (res.data.success) {
          setProduct(res.data.product);
          if (res.data.product.images?.length > 0) {
            setMainImage(res.data.product.images[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartAndWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest Cart
        const guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const count = guestCart.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setCartCount(count);
      } else {
        try {
          // Fetch Cart
          const cartRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/cart`,
            {
              headers: { Authorization: token },
            },
          );
          if (cartRes.data && cartRes.data.items) {
            const count = cartRes.data.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            setCartCount(count);
          }

          // Fetch Wishlist to check if product is in it
          const wishlistRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
            {
              headers: { Authorization: token },
            },
          );
          if (wishlistRes.data && wishlistRes.data.items) {
            const exists = wishlistRes.data.items.some(
              (item) => item.productId === id,
            );
            setIsInWishlist(exists);
          }
        } catch (error) {
          console.error("Error fetching cart/wishlist:", error);
        }
      }
    };

    if (id) {
      fetchProduct();
      fetchCartAndWishlist();
    }
  }, [id]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to wishlist");
      router.push("/login");
      return;
    }

    try {
      if (isInWishlist) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlist/remove/${id}`,
          {
            headers: { Authorization: token },
          },
        );
        setIsInWishlist(false);
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlist/add`,
          {
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "",
          },
          { headers: { Authorization: token } },
        );
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const index = guestCart.items.findIndex(
          (i) => i.productId === product._id,
        );
        if (index > -1) {
          guestCart.items[index].quantity += quantity;
        } else {
          guestCart.items.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "",
            quantity: quantity,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartCount((prev) => prev + quantity);
      } else {
        for (let i = 0; i < quantity; i++) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/add-cart`,
            {
              productId: product._id,
              title: product.title,
              price: product.price,
              image: product.images?.[0] || "",
            },
            {
              headers: { Authorization: token },
            },
          );
        }
        setCartCount((prev) => prev + quantity);
      }
      alert("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header cartCount={cartCount} />
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header cartCount={cartCount} />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Package size={64} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            Product Not Found
          </h2>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-green-600 font-semibold hover:underline">
            Back to Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header cartCount={cartCount} />
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-green-600 mb-6 transition-colors font-medium">
          <ChevronLeft size={18} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images Section */}
          <div className="flex flex-col md:flex-row gap-6 relative">
            {/* Thumbnails Column (Left on desktop, hidden on very small mobile if preferred, but here responsive) */}
            <div className="hidden md:flex flex-col gap-3 overflow-y-auto no-scrollbar py-2 w-24">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    mainImage === img
                      ? "border-green-600 shadow-lg"
                      : "border-gray-100 opacity-70 hover:opacity-100"
                  }`}>
                  <img
                    src={`http://localhost:8080/uploads/${img}`}
                    alt={`pic-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image View / Mobile Slider */}
            <div className="flex-1 relative group">
              {/* Desktop Main Image */}
              <div className="hidden md:flex bg-gray-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center border border-gray-100 shadow-sm relative">
                <img
                  src={`http://localhost:8080/uploads/${mainImage}`}
                  alt={product.title}
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={toggleWishlist}
                    className={`bg-white/90 backdrop-blur p-3 rounded-full shadow-lg transition-colors ${isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
                    <Heart
                      size={20}
                      fill={isInWishlist ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>

              {/* Mobile Slider (Horizontal Scroll with Snap) */}
              <div className="md:hidden">
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar bg-gray-50 rounded-3xl border border-gray-100 aspect-square">
                  {product.images?.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-full h-full snap-center flex items-center justify-center">
                      <img
                        src={`http://localhost:8080/uploads/${img}`}
                        alt={`slide-${idx}`}
                        className="w-full h-full object-contain p-6"
                      />
                    </div>
                  ))}
                </div>
                {/* Wishlist Button for Mobile Slider */}
                <div className="absolute top-4 right-4 z-10 md:hidden">
                  <button
                    onClick={toggleWishlist}
                    className={`bg-white/90 backdrop-blur p-3 rounded-full shadow-lg transition-colors ${isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
                    <Heart
                      size={20}
                      fill={isInWishlist ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {product.images?.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        mainImage === product.images[idx]
                          ? "w-6 bg-green-600"
                          : "w-1.5 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-sm font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full mb-3 inline-block">
                In Stock
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-black text-green-700">
                  ₹{product.price}
                </p>
                <p className="text-gray-400 line-through">
                  ₹{product.price + 100}
                </p>
                <p className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                  SAVE ₹100
                </p>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-tight text-xs">
                Product Description
              </h4>
              <p className="leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">
                  Quantity
                </span>
                <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-1.5 border border-gray-200 shadow-inner">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-white text-green-700 font-bold flex items-center justify-center hover:bg-green-50 transition shadow-sm border border-gray-200">
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-lg w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-xl bg-white text-green-700 font-bold flex items-center justify-center hover:bg-green-50 transition shadow-sm border border-gray-200">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-green-600 text-green-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition shadow-lg shadow-green-600/5 active:scale-95">
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition shadow-xl shadow-green-600/20 active:scale-95">
                  Buy Now
                </button>
              </div>

              {/* <button className="w-full flex items-center justify-center gap-2 text-gray-500 font-semibold hover:text-red-500 transition-colors uppercase tracking-widest text-xs py-2">
                <Heart size={16} /> Add to Wishlist
              </button> */}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <Truck size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold">Fast Delivery</p>
                  <p className="text-[10px] opacity-70">2-3 Business Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <RotateCcw size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold">7 Days Return</p>
                  <p className="text-[10px] opacity-70">Easy replacement</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <ShieldCheck size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold">Quality Assured</p>
                  <p className="text-[10px] opacity-70">100% Genuine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
