"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  UserCircle,
  Package,
  Search,
  X,
  Tag,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Soup,
  Plus,
  Minus,
  GlassWater,
  Droplets,
  Sprout,
  Box,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import Navbar from "../components/redesign/Navbar";
import Footer from "../components/redesign/Footer";
import axios from "axios";
import Image from "next/image";

export default function GroceryRedesign() {
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [miniCart, setMiniCart] = useState(null);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const categoryScrollRef = useRef(null);
  const router = useRouter();

  // Fetch cart items on load (to show quantities)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Load from guest cart
          const guestCart = JSON.parse(
            localStorage.getItem("guestCart") || '{"items":[]}',
          );
          const qtyMap = {};
          let total = 0;
          guestCart.items.forEach((item) => {
            qtyMap[item.productId] = item.quantity;
            total += item.quantity;
          });
          setCartItems(qtyMap);
          setCartCount(total);
          return;
        }
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cart`,
          {
            headers: { Authorization: token },
          },
        );
        if (res.data && res.data.items) {
          const qtyMap = {};
          let total = 0;
          res.data.items.forEach((item) => {
            qtyMap[item.productId] = item.quantity;
            total += item.quantity;
          });
          setCartItems(qtyMap);
          setCartCount(total);
        }
      } catch (error) {
        console.log("Cart fetch error:", error);
      }
    };
    fetchCart();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest Add to Cart
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const index = guestCart.items.findIndex(
          (i) => i.productId === product._id,
        );
        if (index > -1) {
          guestCart.items[index].quantity += 1;
        } else {
          guestCart.items.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "",
            quantity: 1,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartItems((prev) => ({
          ...prev,
          [product._id]: (prev[product._id] || 0) + 1,
        }));
        setCartCount((c) => c + 1);
        return;
      }
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
      setCartItems((prev) => ({
        ...prev,
        [product._id]: (prev[product._id] || 0) + 1,
      }));
      setCartCount((c) => c + 1);
    } catch (error) {
      console.log("Add to cart error:", error);
      alert("Failed to add to cart!");
    }
  };

  const handleDecrement = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest Decrement
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const index = guestCart.items.findIndex(
          (i) => i.productId === product._id,
        );
        if (index > -1) {
          if (guestCart.items[index].quantity > 1) {
            guestCart.items[index].quantity -= 1;
          } else {
            guestCart.items.splice(index, 1);
          }
          localStorage.setItem("guestCart", JSON.stringify(guestCart));
          setCartItems((prev) => {
            const newQty = (prev[product._id] || 1) - 1;
            const updated = { ...prev };
            if (newQty <= 0) {
              delete updated[product._id];
            } else {
              updated[product._id] = newQty;
            }
            return updated;
          });
          setCartCount((c) => Math.max(0, c - 1));
        }
        return;
      }
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/decrement/${product._id}`,
        {},
        { headers: { Authorization: token } },
      );
      setCartItems((prev) => {
        const newQty = (prev[product._id] || 1) - 1;
        const updated = { ...prev };
        if (newQty <= 0) {
          delete updated[product._id];
        } else {
          updated[product._id] = newQty;
        }
        return updated;
      });
      setCartCount((c) => Math.max(0, c - 1));
    } catch (error) {
      console.log("Decrement error:", error);
    }
  };

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Open mini cart popup
  const openMiniCart = (product) => {
    setMiniCart({
      product: {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || "",
      },
      qty: 1,
    });
  };

  // Confirm add from mini cart popup
  const confirmMiniCart = async () => {
    if (!miniCart) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest Confirm Mini Cart
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const index = guestCart.items.findIndex(
          (i) => i.productId === miniCart.product._id,
        );
        if (index > -1) {
          guestCart.items[index].quantity += miniCart.qty;
        } else {
          guestCart.items.push({
            productId: miniCart.product._id,
            title: miniCart.product.title,
            price: miniCart.product.price,
            image: miniCart.product.image,
            quantity: miniCart.qty,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartItems((prev) => ({
          ...prev,
          [miniCart.product._id]:
            (prev[miniCart.product._id] || 0) + miniCart.qty,
        }));
        setCartCount((c) => c + miniCart.qty);
        setMiniCart(null);
        return;
      }
      for (let i = 0; i < miniCart.qty; i++) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/add-cart`,
          {
            productId: miniCart.product._id,
            title: miniCart.product.title,
            price: miniCart.product.price,
            image: miniCart.product.image,
          },
          { headers: { Authorization: token } },
        );
      }
      setCartItems((prev) => ({
        ...prev,
        [miniCart.product._id]:
          (prev[miniCart.product._id] || 0) + miniCart.qty,
      }));
      setCartCount((c) => c + miniCart.qty);
      setMiniCart(null);
    } catch (error) {
      console.log("Mini cart error:", error);
      alert("Failed to add to cart!");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
        );
        setProducts(res.data.products || []);
      } catch (error) {
        console.log("Products fetch error:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );
        setCategories(res.data || []);
      } catch (error) {
        console.log("Categories fetch error:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/banners/active`,
        );
        setBanners(response.data);
      } catch (error) {
        console.log("Fetch banners error:", error);
      }
    };
    fetchBanners();
  }, []);

  // Helper to get products by boolean flag (e.g., isDealsOfDay)
  const getProductsByFlag = (flag) => {
    return products.filter((p) => p[flag] === true);
  };

  // Simple auto-slider for banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header cartCount={cartCount} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[calc(100vh-140px)] overflow-hidden bg-gray-100">
        {banners.length > 0 ? (
          <div className="w-full h-full relative flex items-center transition-all duration-700">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={`http://localhost:8080/uploads/${banners[currentBannerIndex].image}`}
                alt={banners[currentBannerIndex].title}
                className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="container mx-auto px-6 md:px-12 z-10 relative pointer-events-none">
              <div className="max-w-xl animate-in fade-in slide-in-from-left duration-700 pointer-events-auto">
                <span className="inline-block px-4 py-1 bg-green-200 text-green-800 text-xs md:text-sm font-bold rounded-full mb-4 uppercase tracking-widest">
                  Special Offer
                </span>
                <h1 className="text-3xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
                  {banners[currentBannerIndex].title}
                </h1>
                <p className="text-sm md:text-xl text-gray-700 mb-8 opacity-90 font-medium max-w-md">
                  {banners[currentBannerIndex].subtitle}
                </p>
                {banners[currentBannerIndex].link && (
                  <button
                    onClick={() =>
                      router.push(banners[currentBannerIndex].link)
                    }
                    className="bg-green-600 text-white px-10 py-4 rounded-xl text-sm md:text-lg font-extrabold hover:bg-green-700 transition shadow-2xl shadow-green-600/30 active:scale-95">
                    Shop Now
                  </button>
                )}
              </div>
            </div>

            {/* Banner Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentBannerIndex ? "w-10 bg-green-600" : "w-3 bg-green-300"}`}
                  />
                ))}
              </div>
            )}

            {/* Scroll Indicator */}
            <div
              onClick={() =>
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="absolute bottom-6 right-12 z-20 animate-bounce hidden md:block cursor-pointer pointer-events-auto">
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-lr]">
                  Scroll
                </span>
                <ChevronRight className="rotate-90 w-5 h-5" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-green-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="container mx-auto px-4 py-16 md:py-24 relative group">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Shop by Category
          </h2>
        </div>

        <div className="relative group">
          {/* Left Navigation Arrow */}
          {categories.length > 6 && (
            <button
              onClick={() => scrollCategories("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 transition-all hidden md:flex">
              <ChevronLeft size={24} strokeWidth={1} />
            </button>
          )}

          {/* Right Navigation Arrow */}
          {categories.length > 6 && (
            <button
              onClick={() => scrollCategories("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 transition-all hidden md:flex">
              <ChevronRight size={24} strokeWidth={1} />
            </button>
          )}

          <div
            ref={categoryScrollRef}
            className="flex overflow-x-auto no-scrollbar gap-5 pb-4 snap-x snap-mandatory scroll-smooth px-2">
            {categories.map((category, idx) => {
              // Count products for each category (local filtering)
              const count = products.filter((p) => {
                if (Array.isArray(p.category)) {
                  return p.category.some((id) => id === category._id);
                }
                return p.category === category._id;
              }).length;

              return (
                <div
                  key={category._id}
                  onClick={() => router.push(`/shop?category=${category.name}`)}
                  className="min-w-[150px] md:min-w-[200px] p-6 rounded-2xl bg-white border border-gray-50 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-green-100 transition transform hover:-translate-y-1 gap-3 snap-start">
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center overflow-hidden mb-2">
                    {category.image ? (
                      <img
                        src={`http://localhost:8080/uploads/${category.image}`}
                        alt={category.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-green-700 text-sm md:text-base uppercase tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {count} products
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8 bg-white rounded-3xl my-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Top Selling Products
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Top picked products for this week
            </p>
          </div>
          <button
            onClick={() => router.push("/shop?flag=isTopSellingProducts")}
            className="text-green-600 font-semibold hover:underline"
            style={{ cursor: "pointer" }}>
            View All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {getProductsByFlag("isTopSellingProducts").length > 0 ? (
            getProductsByFlag("isTopSellingProducts")
              .slice(0, 8)
              .map((product) => (
                <div
                  key={product._id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-lg transition bg-white relative group">
                  <div
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="h-56 flex items-center justify-center bg-gray-50 rounded-lg mb-4 overflow-hidden cursor-pointer">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`http://localhost:8080/uploads/${product.images[0]}`}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-gray-300" />
                    )}
                  </div>
                  <h3
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="font-semibold text-gray-800 mb-1 cursor-pointer hover:text-green-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-bold text-lg text-gray-900">
                      ₹{product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => openMiniCart(product)}
                    className={`w-full py-2 border-2 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
                      cartItems[product._id]
                        ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
                        : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    }`}
                    style={{ cursor: "pointer" }}>
                    {cartItems[product._id] ? (
                      <>
                        <span>Add to Cart</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {cartItems[product._id]}
                        </span>
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              Check back soon for our top picks!
            </div>
          )}
        </div>
      </section>

      {/* Discount Banner */}
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <Image
            src="/herobanner.webp"
            alt="Banner"
            fill
            className="object-cover"
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start your day with tasty organic veggies
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Get 10% off on your first order
            </p>
            <button
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
              style={{ cursor: "pointer" }}>
              Shop Now
            </button>
          </div>
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>

      {/* Features / Trust Badges */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {[
            {
              icon: Tag,
              title: "Best Prices",
              desc: "Save more every day",
            },
            {
              icon: Truck,
              title: "Free Delivery",
              desc: "On orders ₹500+",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              desc: "7 days policy",
            },
            {
              icon: ShieldCheck,
              title: "100% Quality",
              desc: "Quality guarantee",
            },
            {
              icon: Soup,
              title: "Great Choice",
              desc: "5000+ products",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-2 group cursor-default">
              <div className="w-16 h-16 bg-green-50 text-green-600 flex items-center justify-center rounded-full mb-2 group-hover:bg-green-100 transition">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm">
                {feature.title}
              </h3>
              <p className="text-xs text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deals of Day Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Deals of Day</h2>
          <button
            onClick={() => router.push("/shop?flag=isDealsOfDay")}
            className="text-green-600 font-semibold hover:underline">
            View All &rarr;
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {getProductsByFlag("isDealsOfDay").length > 0 ? (
            getProductsByFlag("isDealsOfDay")
              .slice(0, 8)
              .map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group relative">
                  <div
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-4 overflow-hidden cursor-pointer">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`http://localhost:8080/uploads/${product.images[0]}`}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <h3
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="font-semibold text-gray-800 mb-1 truncate hover:text-green-600 cursor-pointer">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-green-700">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={() => openMiniCart(product)}
                      className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No deals available today.
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Sections Loop */}
      {[
        { title: "Rice & Grains", flag: "isRice" },
        { title: "Atta & Flour", flag: "isAttaAndFlour" },
        { title: "Dry Fruits", flag: "isDryFruites" },
        { title: "Dal & Pulses", flag: "isDalAndPulses" },
        { title: "Premium Masala", flag: "isMasala" },
        { title: "Snacks & Namkeen", flag: "isNamkeenAndSnacks" },
      ].map((section) => {
        const sectionProducts = getProductsByFlag(section.flag);
        if (sectionProducts.length === 0) return null;

        return (
          <section
            key={section.flag}
            className="container mx-auto px-4 py-8 mb-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {section.title}
              </h2>
              <button
                onClick={() => router.push(`/shop?flag=${section.flag}`)}
                className="text-green-600 font-semibold hover:underline">
                View All &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {sectionProducts.slice(0, 8).map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group relative">
                  <div
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-4 overflow-hidden cursor-pointer">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`http://localhost:8080/uploads/${product.images[0]}`}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <h3
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="font-semibold text-gray-800 mb-1 truncate hover:text-green-600 cursor-pointer">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-green-700">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={() => openMiniCart(product)}
                      className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Footer */}

      <Footer />

      {/* Mini Cart Popup */}
      {miniCart && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMiniCart(null)}
            className="fixed inset-0 bg-black/30 z-50"
          />
          {/* Popup */}
          <div className="fixed top-4 right-4 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 animate-in">
            {/* Header */}
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="font-bold text-sm">Add to Cart</span>
              </div>
              <button
                onClick={() => setMiniCart(null)}
                className="text-white hover:text-green-200 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {miniCart.product.image ? (
                    <img
                      src={`http://localhost:8080/uploads/${miniCart.product.image}`}
                      alt={miniCart.product.title}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">
                    {miniCart.product.title}
                  </h4>
                  <p className="text-green-600 font-bold">
                    ₹{miniCart.product.price}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setMiniCart((prev) => ({
                        ...prev,
                        qty: Math.max(1, prev.qty - 1),
                      }))
                    }
                    className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center hover:bg-green-200 transition cursor-pointer">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg text-gray-800 w-8 text-center">
                    {miniCart.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMiniCart((prev) => ({ ...prev, qty: prev.qty + 1 }))
                    }
                    className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center hover:bg-green-200 transition cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-sm text-gray-500">Total</span>
                <span className="font-bold text-lg text-gray-800">
                  ₹{miniCart.product.price * miniCart.qty}
                </span>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={confirmMiniCart}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg cursor-pointer flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
