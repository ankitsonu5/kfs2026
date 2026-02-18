"use client";

import React, { useState, useEffect } from "react";
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
        const res = await axios.get("http://localhost:8080/cart", {
          headers: { Authorization: token },
        });
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
            image: product.image,
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
        "http://localhost:8080/add-cart",
        {
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
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
        `http://localhost:8080/cart/decrement/${product._id}`,
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

  // Open mini cart popup
  const openMiniCart = (product) => {
    setMiniCart({ product, qty: 1 });
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
          "http://localhost:8080/add-cart",
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
        const res = await axios.get("http://localhost:8080/products");
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
        const res = await axios.get("http://localhost:8080/categories");
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
          "http://localhost:8080/banners/active",
        );
        setBanners(response.data);
      } catch (error) {
        console.log("Fetch banners error:", error);
      }
    };
    fetchBanners();
  }, []);

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
      <section className="container mx-auto px-4 py-3 md:py-6">
        {banners.length > 0 ? (
          <div className="rounded-2xl overflow-hidden shadow-lg relative h-[220px] md:h-[350px] bg-gradient-to-r from-green-100 to-emerald-50 flex items-center transition-all duration-700">
            <div className="w-full md:w-1/2 px-6 md:px-12 z-10 animate-in fade-in slide-in-from-left duration-700">
              <span className="inline-block px-3 py-0.5 bg-green-200 text-green-800 text-[10px] md:text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
                Special Offer
              </span>
              <h1 className="text-2xl md:text-5xl font-extrabold text-gray-800 mb-2 leading-tight">
                {banners[currentBannerIndex].title}
              </h1>
              <p className="text-sm md:text-lg text-gray-600 mb-6 opacity-90 font-medium">
                {banners[currentBannerIndex].subtitle}
              </p>
              {banners[currentBannerIndex].link && (
                <button
                  onClick={() => router.push(banners[currentBannerIndex].link)}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl text-sm md:text-base font-bold hover:bg-green-700 transition shadow-xl hover:shadow-green-500/30 active:scale-95">
                  Shop Now
                </button>
              )}
            </div>
            <div className="absolute right-0 bottom-0 h-full w-full md:w-[60%] overflow-hidden">
              <img
                src={`http://localhost:8080/uploads/${banners[currentBannerIndex].image}`}
                alt={banners[currentBannerIndex].title}
                className="w-full h-full object-cover md:object-center animate-in fade-in zoom-in duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-green-100/40 to-transparent md:block hidden"></div>
            </div>

            {/* Banner Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBannerIndex ? "w-8 bg-green-600" : "w-2 bg-green-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow-lg relative h-[190px] md:h-[230px] bg-gradient-to-r from-green-100 to-emerald-50 flex items-center">
            <div className="w-full md:w-1/2 px-6 md:px-12 z-10">
              <span className="inline-block px-3 py-0.5 bg-green-200 text-green-800 text-[10px] md:text-xs font-bold rounded-full mb-2">
                WEEKEND SALE
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">
                Fresh Organic <br className="hidden md:block" />{" "}
                <span className="text-green-600">Grocery Delivery</span>
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-4 opacity-90">
                Flat 30% off. Use code:{" "}
                <span className="font-bold text-green-700">FRESH30</span>
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-green-500/30">
                Shop Now
              </button>
            </div>
            <div className="hidden md:block absolute right-0 bottom-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-80">
              <div className="w-full h-full bg-gradient-to-l from-transparent to-green-100/50"></div>
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-4 md:py-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category, idx) => {
            const colors = [
              "bg-green-100",
              "bg-yellow-100",
              "bg-orange-100",
              "bg-red-100",
              "bg-blue-100",
              "bg-purple-100",
            ];
            return (
              <div
                key={category._id}
                className={`${colors[idx % colors.length]} p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition transform hover:-translate-y-1 gap-3 border border-transparent hover:border-gray-200`}>
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                  {category.image ? (
                    <img
                      src={`http://localhost:8080/uploads/${category.image}`}
                      alt={category.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8 bg-white rounded-3xl my-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Best Sellers</h2>
            <p className="text-gray-500 text-sm mt-1">
              Top picked products for this week
            </p>
          </div>
          <button
            className="text-green-600 font-semibold hover:underline"
            style={{ cursor: "pointer" }}>
            View All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-100 rounded-xl p-4 hover:shadow-lg transition bg-white relative group">
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-4 overflow-hidden">
                {product.image ? (
                  <img
                    src={`http://localhost:8080/uploads/${product.image}`}
                    alt={product.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <Package className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
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
          ))}
        </div>
      </section>

      {/* Discount Banner */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-orange-500 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Super Deal of the Week
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Save fast on all your favorite snacks and beverages.
            </p>
            <button
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
              style={{ cursor: "pointer" }}>
              Grab Deal Now
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

      {/* Daily Staples Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Daily Staples</h2>
          <button className="text-green-600 font-semibold hover:underline">
            View All &rarr;
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { name: "Oil", price: "₹145", icon: Droplets },
            { name: "Atta", price: "₹340", icon: Sprout },
            { name: "Rice", price: "₹850", icon: Sprout },
            { name: "Dal", price: "₹120", icon: Soup },
            { name: "Sugar", price: "₹45", icon: Box },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group">
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <item.icon className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-green-700">
                  {item.price}
                </span>
                <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Snacks & Beverages Section */}
      <section className="container mx-auto px-4 py-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Snacks & Beverages
          </h2>
          <button className="text-green-600 font-semibold hover:underline">
            View All &rarr;
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: "Chips", price: "₹20", icon: Package },
            { name: "Juice", price: "₹110", icon: GlassWater },
            { name: "Cola", price: "₹40", icon: GlassWater },
            { name: "Cookies", price: "₹60", icon: Sparkles },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group">
              <div className="h-32 bg-orange-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <item.icon className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-green-700">
                  {item.price}
                </span>
                <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
