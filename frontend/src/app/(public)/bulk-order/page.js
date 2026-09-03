"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import Header from "../../components/header";
import Navbar from "../../components/redesign/Navbar";
import Footer from "../../components/redesign/Footer";
import {
  Search,
  Package,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Layers,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BulkOrder() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingAll, setAddingAll] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Pagination state (20 products per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Map of { [productId]: quantity }
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Close category dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data || []);
      updateCartCount();
    } catch (error) {
      console.error("Failed to load bulk order data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || '{"items":[]}');
        const count = guestCart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
        return;
      }
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: token }
      });
      if (res.data && res.data.items) {
        const count = res.data.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      }
    } catch (err) {
      console.error("Cart count error:", err);
    }
  };

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, onlyInStock]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const matchesCat =
        selectedCategory === "all" ||
        (Array.isArray(p.category)
          ? p.category.some((c) =>
              typeof c === "object"
                ? c._id === selectedCategory || c.name?.toLowerCase() === selectedCategory.toLowerCase()
                : c === selectedCategory
            )
          : p.category === selectedCategory);

      // Search query
      const matchesSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

      // In-stock filter
      const matchesStock = !onlyInStock || Number(p.stock) > 0;

      return matchesCat && matchesSearch && matchesStock;
    });
  }, [products, selectedCategory, searchQuery, onlyInStock]);

  // Paginated products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Handle quantity changes with strict min / max stock bounds
  const handleQuantityChange = (productId, newQty, product) => {
    const stock = Number(product.stock) || 0;
    if (stock <= 0) return;

    let validQty = Number(newQty);
    if (isNaN(validQty) || validQty < 0) validQty = 0;

    // Cap at available stock
    if (validQty > stock) {
      validQty = stock;
    }

    setQuantities((prev) => ({
      ...prev,
      [productId]: validQty
    }));
  };

  const incrementQty = (product) => {
    const current = quantities[product._id] || 0;
    const minQty = product.bulkMinQty && product.bulkMinQty > 1 ? product.bulkMinQty : 1;
    const nextQty = current === 0 ? minQty : current + 1;
    handleQuantityChange(product._id, nextQty, product);
  };

  const decrementQty = (product) => {
    const current = quantities[product._id] || 0;
    const minQty = product.bulkMinQty && product.bulkMinQty > 1 ? product.bulkMinQty : 1;
    if (current <= minQty) {
      handleQuantityChange(product._id, 0, product);
    } else {
      handleQuantityChange(product._id, current - 1, product);
    }
  };

  const handleSetMinQty = (product) => {
    const minQty = product.bulkMinQty && product.bulkMinQty > 1 ? product.bulkMinQty : 1;
    handleQuantityChange(product._id, minQty, product);
  };

  const handleClearAll = () => {
    setQuantities({});
  };

  // Helper calculation for individual product
  const getProductPricing = (product, qty) => {
    const hasBulkRate = product.bulkPrice > 0 && product.bulkPrice < product.price;
    const minQty = product.bulkMinQty || 1;
    const isBulkUnlocked = hasBulkRate && qty >= minQty;
    const unitPrice = isBulkUnlocked ? product.bulkPrice : product.price;
    const rowTotal = qty * unitPrice;
    const regularTotal = qty * product.price;
    const savings = Math.max(0, regularTotal - rowTotal);

    return {
      hasBulkRate,
      minQty,
      isBulkUnlocked,
      unitPrice,
      rowTotal,
      savings
    };
  };

  // Summary of all selected items across all pages
  const summary = useMemo(() => {
    let totalItems = 0;
    let totalUnits = 0;
    let totalAmount = 0;
    let totalSavings = 0;
    const itemsToAdd = [];

    products.forEach((p) => {
      const qty = quantities[p._id] || 0;
      if (qty > 0) {
        totalItems += 1;
        totalUnits += qty;
        const { unitPrice, rowTotal, savings } = getProductPricing(p, qty);
        totalAmount += rowTotal;
        totalSavings += savings;

        itemsToAdd.push({
          productId: p._id,
          title: p.title,
          price: unitPrice,
          discountPrice: p.discountPrice || p.price,
          image: p.images?.[0] || "",
          quantity: qty,
          stock: p.stock
        });
      }
    });

    return {
      totalItems,
      totalUnits,
      totalAmount,
      totalSavings,
      itemsToAdd
    };
  }, [quantities, products]);

  // Add individual product row to cart
  const handleAddSingleToCart = async (product) => {
    const qty = quantities[product._id] || (product.bulkMinQty || 1);
    const { unitPrice } = getProductPricing(product, qty);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || '{"items":[]}');
        const idx = guestCart.items.findIndex((i) => i.productId === product._id);
        if (idx > -1) {
          guestCart.items[idx].quantity = Math.min(guestCart.items[idx].quantity + qty, product.stock);
          guestCart.items[idx].price = unitPrice;
        } else {
          guestCart.items.push({
            productId: product._id,
            title: product.title,
            price: unitPrice,
            discountPrice: product.discountPrice || product.price,
            image: product.images?.[0] || "",
            quantity: qty
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        updateCartCount();
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-cart`,
        {
          productId: product._id,
          title: product.title,
          price: unitPrice,
          discountPrice: product.discountPrice,
          image: product.images?.[0] || "",
          quantity: qty
        },
        { headers: { Authorization: token } }
      );
      updateCartCount();
    } catch (err) {
      console.error("Add single to cart error:", err);
      alert(err.response?.data?.message || "Failed to add item to cart.");
    }
  };

  // Add all selected products to cart in bulk
  const handleAddAllToCart = async () => {
    if (summary.itemsToAdd.length === 0) return;

    setAddingAll(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // Guest Bulk Add
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || '{"items":[]}');

        summary.itemsToAdd.forEach((item) => {
          const idx = guestCart.items.findIndex((i) => i.productId === item.productId);
          if (idx > -1) {
            guestCart.items[idx].quantity = Math.min(guestCart.items[idx].quantity + item.quantity, item.stock);
            guestCart.items[idx].price = item.price;
          } else {
            guestCart.items.push({
              productId: item.productId,
              title: item.title,
              price: item.price,
              discountPrice: item.discountPrice,
              image: item.image,
              quantity: item.quantity
            });
          }
        });

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      } else {
        // User Bulk Merge
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/merge`,
          { items: summary.itemsToAdd },
          { headers: { Authorization: token } }
        );
      }

      await updateCartCount();
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
      setQuantities({});
    } catch (err) {
      console.error("Failed to add bulk items to cart:", err);
      alert(err.response?.data?.message || "Failed to add items to cart.");
    } finally {
      setAddingAll(false);
    }
  };

  // Selected Category Name helper
  const selectedCategoryName = useMemo(() => {
    if (selectedCategory === "all") return "All Categories";
    const found = categories.find((c) => c._id === selectedCategory || c.name === selectedCategory);
    return found ? found.name : "All Categories";
  }, [selectedCategory, categories]);

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans">
      <Header cartCount={cartCount} />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
              <Sparkles size={14} className="text-emerald-600" /> B2B & Wholesale Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Quick Sheet / Bulk Order
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter quantities for multiple products directly and order with wholesale rates in one click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/cart")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer">
              <ShoppingCart size={18} className="text-green-600" /> View Cart ({cartCount})
            </button>
          </div>
        </div>

        {/* FILTER & SEARCH BAR */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-900 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Styled Custom Category Dropdown */}
            <div className="relative md:col-span-4" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer">
                <div className="flex items-center gap-2 truncate">
                  <Layers className="text-emerald-600 w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{selectedCategoryName}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    isCategoryOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-72 overflow-y-auto no-scrollbar py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    <span>All Categories</span>
                    {selectedCategory === "all" && <Check size={16} className="text-emerald-600" />}
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat._id || selectedCategory === cat.name;
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat._id);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 text-emerald-700 font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}>
                        <span className="truncate pr-2">{cat.name}</span>
                        {isSelected && <Check size={16} className="text-emerald-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* In-Stock Toggle */}
            <div className="md:col-span-2 flex items-center justify-between md:justify-end">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
                In Stock Only
              </label>
            </div>
          </div>
        </div>

        {/* BATCH ACTION & SUMMARY BANNER */}
        {summary.totalItems > 0 && (
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4 md:p-5 rounded-2xl shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300 sticky top-16 md:top-20 z-30 border border-emerald-500/30">
            <div className="flex flex-wrap items-center gap-4 md:gap-8">
              <div>
                <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Selected Products</p>
                <p className="text-xl md:text-2xl font-black">
                  {summary.totalItems} Items <span className="text-xs font-normal text-gray-300">({summary.totalUnits} Units)</span>
                </p>
              </div>
              <div className="border-l border-emerald-700/50 pl-4 md:pl-8">
                <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Total Bulk Value</p>
                <p className="text-xl md:text-2xl font-black text-emerald-400">₹{summary.totalAmount.toFixed(2)}</p>
              </div>
              {summary.totalSavings > 0 && (
                <div className="hidden lg:block border-l border-emerald-700/50 pl-8">
                  <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">You Save in Bulk</p>
                  <p className="text-lg font-bold text-emerald-200">₹{summary.totalSavings.toFixed(2)}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2.5 rounded-xl border border-gray-600 hover:bg-white/10 text-xs font-bold text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer">
                <RotateCcw size={14} /> Reset
              </button>
              <button
                type="button"
                onClick={handleAddAllToCart}
                disabled={addingAll}
                className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50">
                {addingAll ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add All Selected to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS NOTIFICATION */}
        {addedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl mb-6 flex items-center justify-between animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 text-sm font-bold">
              <CheckCircle2 size={18} className="text-emerald-600" /> All selected products have been added to your cart successfully!
            </div>
            <button
              onClick={() => router.push("/cart")}
              className="text-xs font-black text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1">
              Go to Cart <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* QUICK ORDER TABLE / MATRIX */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm font-medium">Loading wholesale catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <Package size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-gray-700">No products found</p>
              <p className="text-xs text-gray-400 mt-1">Try changing your search term or category filter.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-black uppercase text-gray-500 tracking-wider">
                      <th className="py-3.5 px-4">Product Details</th>
                      <th className="py-3.5 px-4 text-center">Stock Status</th>
                      <th className="py-3.5 px-4 text-right">Regular Price</th>
                      <th className="py-3.5 px-4 text-right">Wholesale / Bulk Price</th>
                      <th className="py-3.5 px-4 text-center">Order Quantity</th>
                      <th className="py-3.5 px-4 text-right">Subtotal</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedProducts.map((p) => {
                      const stock = Number(p.stock) || 0;
                      const isOutOfStock = stock <= 0;
                      const qty = quantities[p._id] || 0;
                      const { hasBulkRate, minQty, isBulkUnlocked, unitPrice, rowTotal, savings } = getProductPricing(p, qty);

                      return (
                        <tr
                          key={p._id}
                          className={`transition-colors hover:bg-emerald-50/30 ${qty > 0 ? "bg-emerald-50/50" : ""}`}>
                          {/* 1. PRODUCT DETAILS */}
                          <td className="py-3.5 px-4 min-w-[240px]">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                {p.images && p.images.length > 0 ? (
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${p.images[0]}`}
                                    alt={p.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <Package size={20} className="text-gray-300" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 hover:text-emerald-600 transition-colors">
                                  {p.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                    {typeof p.category === "object" && p.category?.name ? p.category.name : "Grocery"}
                                  </span>
                                  {hasBulkRate && (
                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                      MOQ: {minQty}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. STOCK STATUS */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                                <AlertCircle size={12} /> Out of Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <Check size={12} /> {stock} in stock
                              </span>
                            )}
                          </td>

                          {/* 3. REGULAR PRICE */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <span className={`font-bold text-xs sm:text-sm ${hasBulkRate && isBulkUnlocked ? "line-through text-gray-400 text-xs" : "text-gray-800"}`}>
                              ₹{p.price}
                            </span>
                          </td>

                          {/* 4. WHOLESALE / BULK PRICE */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            {hasBulkRate ? (
                              <div>
                                <span className="font-black text-xs sm:text-sm text-emerald-600">
                                  ₹{p.bulkPrice}
                                </span>
                                <p className="text-[10px] text-gray-400 font-medium">
                                  (For ≥ {minQty} pcs)
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs italic">
                                Same as retail
                              </span>
                            )}
                          </td>

                          {/* 5. ORDER QUANTITY STEPPER */}
                          <td className="py-3.5 px-4 text-center min-w-[150px]">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => decrementQty(p)}
                                disabled={isOutOfStock || qty <= 0}
                                className="w-7 h-7 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95 cursor-pointer">
                                <Minus size={13} />
                              </button>

                              <input
                                type="number"
                                min="0"
                                max={stock}
                                disabled={isOutOfStock}
                                value={qty === 0 ? "" : qty}
                                onChange={(e) => handleQuantityChange(p._id, e.target.value, p)}
                                placeholder="0"
                                className="w-14 text-center py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                              />

                              <button
                                type="button"
                                onClick={() => incrementQty(p)}
                                disabled={isOutOfStock || qty >= stock}
                                className="w-7 h-7 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95 cursor-pointer">
                                <Plus size={13} />
                              </button>
                            </div>

                            {/* Quick Min MOQ shortcut */}
                            {hasBulkRate && qty < minQty && !isOutOfStock && (
                              <button
                                type="button"
                                onClick={() => handleSetMinQty(p)}
                                className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold mt-1 underline block mx-auto cursor-pointer">
                                Set Min ({minQty})
                              </button>
                            )}
                          </td>

                          {/* 6. ROW SUBTOTAL */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <p className={`font-black text-xs sm:text-sm ${qty > 0 ? "text-gray-900" : "text-gray-300"}`}>
                              ₹{rowTotal.toFixed(2)}
                            </p>
                            {savings > 0 && (
                              <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                                <TrendingDown size={11} /> Save ₹{savings.toFixed(2)}
                              </p>
                            )}
                          </td>

                          {/* 7. QUICK ADD ACTION */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleAddSingleToCart(p)}
                              disabled={isOutOfStock}
                              title="Add this item to cart"
                              className="p-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-lg border border-emerald-200 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                              <ShoppingCart size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="p-4 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs font-medium text-gray-500">
                    Showing <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-bold text-gray-800">
                      {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                    </span>{" "}
                    of <span className="font-bold text-gray-800">{filteredProducts.length}</span> Products
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* First Page */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600">
                      <ChevronsLeft size={16} />
                    </button>

                    {/* Prev Page */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600">
                      <ChevronLeft size={16} />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, idx, arr) => {
                        const prevPage = arr[idx - 1];
                        return (
                          <React.Fragment key={page}>
                            {prevPage && page - prevPage > 1 && (
                              <span className="px-2 text-gray-400 text-xs">...</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handlePageChange(page)}
                              className={`min-w-[36px] h-9 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                currentPage === page
                                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                              }`}>
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    {/* Next Page */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600">
                      <ChevronRight size={16} />
                    </button>

                    {/* Last Page */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600">
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
