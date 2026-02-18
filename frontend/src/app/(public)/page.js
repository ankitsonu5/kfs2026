"use client";

import React, { useState, useEffect } from "react";
import { MdOutlineLogin } from "react-icons/md";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import BannerCarousel from "@/components/BannerCarousel";

export default function GroceryRedesign() {
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [miniCart, setMiniCart] = useState(null);
  const router = useRouter();

  // Fetch cart items on load (to show quantities)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
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

  // Check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:8080/profile", {
          headers: { Authorization: token },
        });
        setUser(res.data.user);
      } catch (error) {
        console.log("User fetch error:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        router.push("/login");
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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      router.push("/login");
      return;
    }
    setMiniCart({ product, qty: 1 });
  };

  // Confirm add from mini cart popup
  const confirmMiniCart = async () => {
    if (!miniCart) return;
    try {
      const token = localStorage.getItem("token");
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-gray-500 hover:text-green-600 transition-colors"
              title="Back to Home">
              ←
            </a>
            <span className="text-2xl font-bold text-green-600">
              GroceryStore
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
              🔍
            </button>
          </div>

          <div className="flex items-center gap-6">
            {!user ? (
              /* Guest - show Login & Signup */
              <>
                <button
                  className="flex flex-col items-center text-gray-600 hover:text-green-600"
                  onClick={handleSignup}
                  style={{ cursor: "pointer" }}>
                  <span className="text-xl">
                    <SiGnuprivacyguard />
                  </span>
                  <span className="text-xs">Signup</span>
                </button>
                <button
                  className="flex flex-col items-center text-gray-600 hover:text-green-600"
                  onClick={handleLogin}
                  style={{ cursor: "pointer" }}>
                  <span className="text-xl">
                    <MdOutlineLogin />
                  </span>
                  <span className="text-xs">Login</span>
                </button>
              </>
            ) : (
              /* Logged in - show name */
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                Hi, {user.fullName}
              </span>
            )}

            {/* Cart - always visible */}
            <button
              className="flex flex-col items-center text-gray-600 hover:text-green-600 relative"
              onClick={() => router.push("/cart")}
              style={{ cursor: "pointer" }}>
              <span className="text-xl">🛒</span>
              <span className="text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile dropdown - only when logged in */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex flex-col items-center text-gray-600 hover:text-green-600"
                  style={{ cursor: "pointer" }}>
                  <FaUserCircle className="text-2xl" />
                  <span className="text-xs">Profile</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <p
                      onClick={() => {
                        router.push("/user-profile");
                        setProfileOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-green-50 cursor-pointer text-gray-700 text-sm font-medium border-b border-gray-100">
                      ✏️ Edit Profile
                    </p>
                    <p
                      onClick={() => {
                        router.push("/user-settings");
                        setProfileOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-green-50 cursor-pointer text-gray-700 text-sm font-medium border-b border-gray-100">
                      ⚙️ Settings
                    </p>
                    <p
                      onClick={() => {
                        router.push("/my-orders");
                        setProfileOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-green-50 cursor-pointer text-gray-700 text-sm font-medium border-b border-gray-100">
                      🛍️ My Orders
                    </p>
                    <p
                      onClick={handleLogout}
                      className="px-4 py-3 hover:bg-red-50 cursor-pointer text-red-500 text-sm font-medium">
                      🚪 Logout
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="bg-green-600 text-white overflow-x-auto">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-8 py-3 text-sm font-medium whitespace-nowrap">
              <li className="hover:text-green-100 cursor-pointer">Shop All</li>
              <li className="hover:text-green-100 cursor-pointer">
                Fruits & Vegetables
              </li>
              <li className="hover:text-green-100 cursor-pointer">
                Dairy & Bakery
              </li>
              <li className="hover:text-green-100 cursor-pointer">
                Atta, Rice & Dal
              </li>
              <li className="hover:text-green-100 cursor-pointer">
                Snacks & Biscuits
              </li>
              <li className="ml-auto bg-green-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                Lowest Prices
              </li>
            </ul>
          </div>
        </nav>
      </header>



      {/* Hero Section / Banner Carousel */}
      <section className="container mx-auto px-4 py-6">
        <BannerCarousel
          fallback={
            <div className="rounded-2xl overflow-hidden shadow-lg relative h-[300px] bg-gradient-to-r from-green-100 to-emerald-50 flex items-center">
              <div className="w-1/2 px-12 z-10">
                <span className="inline-block px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full mb-4">
                  WEEKEND SALE
                </span>
                <h1 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
                  Fresh Organic <br />{" "}
                  <span className="text-green-600">Grocery Delivery</span>
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Get flat 30% off on your first order. Use code: FRESH30
                </p>
                <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-green-500/30">
                  Shop Now
                </button>
              </div>
              <div className="absolute right-0 bottom-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-80 mask-image-linear-to-l">
                {/* Image Placeholder */}
                <div className="w-full h-full bg-gradient-to-l from-transparent to-green-100/50"></div>
              </div>
            </div>
          }
        />
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <span className="text-4xl">📦</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <span className="text-6xl">📦</span>
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
                className={`w-full py-2 border-2 font-semibold rounded-lg transition flex items-center justify-center gap-2 ${cartItems[product._id]
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
              icon: "🏷️",
              title: "Best Prices & Offers",
              desc: "Cheaper than market",
            },
            {
              icon: "🚛",
              title: "Free Delivery",
              desc: "On orders above ₹500",
            },
            { icon: "↩️", title: "Easy Returns", desc: "No questions asked" },
            {
              icon: "🛡️",
              title: "100% Satisfaction",
              desc: "Quality guarantee",
            },
            {
              icon: "🥣",
              title: "Wide Assortment",
              desc: "Choose from 5000+ products",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-2 group cursor-default">
              <div className="w-16 h-16 bg-green-50 text-3xl flex items-center justify-center rounded-full mb-2 group-hover:bg-green-100 transition">
                {feature.icon}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { name: "Fortune Oil", price: "₹145", image: "🛢️" },
            { name: "Aashirvaad Atta", price: "₹340", image: "🌾" },
            { name: "Basmati Rice", price: "₹850", image: "🍚" },
            { name: "Toor Dal", price: "₹120", image: "🥣" },
            { name: "Sugar", price: "₹45", image: "⬜" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group">
              <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition">
                {item.image}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-green-700">
                  {item.price}
                </span>
                <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                  +
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Potato Chips", price: "₹20", image: "🥔" },
            { name: "Orange Juice", price: "₹110", image: "🍊" },
            { name: "Cola Can", price: "₹40", image: "🥤" },
            { name: "Chocolate Cookies", price: "₹60", image: "🍪" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group">
              <div className="h-32 bg-red-50 rounded-lg flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition">
                {item.image}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-green-700">
                  {item.price}
                </span>
                <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-2xl font-bold text-green-500 mb-4">
              GroceryStore
            </div>
            <p className="text-gray-400 mb-4">
              Fresh quality products delivered directly to your doorstep with
              love and care.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
              <li className="hover:text-white cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer">
                Fruits & Vegetables
              </li>
              <li className="hover:text-white cursor-pointer">
                Dairy & Bakery
              </li>
              <li className="hover:text-white cursor-pointer">Staples</li>
              <li className="hover:text-white cursor-pointer">Snacks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none w-full border border-gray-700 focus:border-green-500"
              />
              <button className="bg-green-600 px-4 py-2 rounded-lg font-bold hover:bg-green-700">
                Go
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          &copy; 2026 GroceryStore. All rights reserved.
        </div>
      </footer>

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
              <span className="font-bold text-sm">🛒 Add to Cart</span>
              <button
                onClick={() => setMiniCart(null)}
                className="text-white hover:text-green-200 text-lg cursor-pointer font-bold">
                ✕
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
                    <span className="text-3xl">📦</span>
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
                    onClick={() =>
                      setMiniCart((prev) => ({
                        ...prev,
                        qty: Math.max(1, prev.qty - 1),
                      }))
                    }
                    className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center hover:bg-green-200 transition cursor-pointer">
                    −
                  </button>
                  <span className="font-bold text-lg text-gray-800 w-8 text-center">
                    {miniCart.qty}
                  </span>
                  <button
                    onClick={() =>
                      setMiniCart((prev) => ({ ...prev, qty: prev.qty + 1 }))
                    }
                    className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center hover:bg-green-200 transition cursor-pointer">
                    +
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
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg cursor-pointer">
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
