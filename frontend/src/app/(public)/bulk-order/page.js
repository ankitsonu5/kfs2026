"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header";
import Navbar from "../../components/redesign/Navbar";
import Footer from "../../components/redesign/Footer";
import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  ShoppingCart,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import Image from "next/image";

export default function BulkOrder() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [resultsPerPage, setResultsPerPage] = useState(15);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    initializeCart();
  }, []);

  const initializeCart = () => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
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
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
      );
      const fetchedProducts = res.data.products || [];
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      );
      setCategories(res.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.category === selectedCategory ||
          (p.category && p.category.name === selectedCategory),
      );
    }

    // Sorting
    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    // Pagination
    if (resultsPerPage !== "all") {
      result = result.slice(0, resultsPerPage);
    }

    setFilteredProducts(result);
  }, [selectedCategory, sortOption, products, resultsPerPage]);

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
        { headers: { Authorization: token } },
      );
      setCartItems((prev) => ({
        ...prev,
        [product._id]: (prev[product._id] || 0) + 1,
      }));
      setCartCount((c) => c + 1);
    } catch (error) {
      console.log("Add to cart error:", error);
    }
  };

  return (
    <div className="bg-[#f6f7fb] min-h-screen">
      <Header cartCount={cartCount} />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDEBAR - CATEGORIES */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                <h2 className="font-bold text-gray-800 tracking-wide uppercase text-sm">
                  All Categories
                </h2>
              </div>
              <ul className="py-2">
                <li
                  onClick={() => setSelectedCategory("all")}
                  className={`px-6 py-3 cursor-pointer transition-colors flex items-center justify-between text-sm font-medium ${
                    selectedCategory === "all"
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  All Products
                  {selectedCategory === "all" && (
                    <ChevronDown size={14} className="-rotate-90" />
                  )}
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-6 py-3 cursor-pointer transition-colors flex items-center justify-between text-sm font-medium ${
                      selectedCategory === cat.name
                        ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}>
                    {cat.name}
                    {selectedCategory === cat.name && (
                      <ChevronDown size={14} className="-rotate-90" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1">
            {/* TOOLBAR */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="default">Default sorting</option>
                  <option value="price-low">Price Low to High</option>
                  <option value="price-high">Price High to Low</option>
                </select>

                <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-white text-green-600 shadow-sm" : "text-gray-400"}`}>
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-white text-green-600 shadow-sm" : "text-gray-400"}`}>
                    <List size={18} />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500 font-medium flex items-center gap-3">
                Show
                <select
                  value={resultsPerPage}
                  onChange={(e) =>
                    setResultsPerPage(
                      e.target.value === "all" ? "all" : Number(e.target.value),
                    )
                  }
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 mx-1">
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={35}>35</option>
                  <option value="all">All</option>
                </select>
                Results
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div
              className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" : "grid-cols-1"} gap-6`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex ${viewMode === "list" ? "flex-row p-4" : "flex-col"}`}>
                    {/* Image Area */}
                    <div
                      onClick={() => router.push(`/product/${p._id}`)}
                      className={`relative bg-gray-50 flex items-center justify-center cursor-pointer ${viewMode === "list" ? "w-48 h-48 rounded-lg" : "h-52 sm:h-64"}`}>
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={`http://localhost:8080/uploads/${p.images[0]}`}
                          alt={p.title}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-gray-300" />
                      )}

                      {/* Discount Badge */}
                      {p.discountPrice && (
                        <div className="absolute top-3 left-3 bg-[#be1e2d] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                          YOU SAVE{" "}
                          {Math.round(
                            ((p.price - p.discountPrice) / p.price) * 100,
                          )}
                          %
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div
                      className={`p-4 flex flex-col justify-between ${viewMode === "list" ? "flex-1 pl-8" : ""}`}>
                      <div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-1 line-clamp-1">
                          Bulk Order,{" "}
                          {typeof p.category === "object"
                            ? p.category.name
                            : p.category}
                          , Groceries
                        </div>
                        <h3
                          onClick={() => router.push(`/product/${p._id}`)}
                          className="font-bold text-gray-800 text-sm sm:text-[15px] line-clamp-2 leading-tight group-hover:text-green-600 transition-colors mb-2 h-10 sm:h-11 cursor-pointer">
                          {p.title}
                        </h3>

                        <div className="flex items-center gap-3 mt-1 mb-3">
                          <span className="text-base sm:text-lg font-black text-green-600">
                            ₹{p.price}
                          </span>
                          {p.discountPrice && (
                            <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                              ₹{p.discountPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        className={`w-full py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                          cartItems[p._id]
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        }`}>
                        {cartItems[p._id] ? (
                          <>
                            <ShoppingCart size={14} />
                            <span>Added ({cartItems[p._id]})</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                  <Package
                    size={64}
                    strokeWidth={1}
                    className="mb-4 opacity-20"
                  />
                  <p className="text-lg font-medium">
                    No products found for this selection
                  </p>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="mt-4 text-green-600 font-bold hover:underline">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
