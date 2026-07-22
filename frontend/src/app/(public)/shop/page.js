"use client";

import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Plus,
  X,
  ChevronRight,
  Filter,
  Search,
  ArrowLeft,
  Minus,
  ArrowUpDown,
  Check,
  LayoutGrid,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Header from "../../components/header";
import Navbar from "../../components/redesign/Navbar";
import Footer from "../../components/redesign/Footer";
import { safePush } from "@/lib/safe-navigation";

const SidebarContent = ({ categories, categoryFilter, flagFilter, router, setIsSidebarOpen, isMobileSidebar = false }) => (
  <div className={`bg-white ${isMobileSidebar ? 'p-1.5 border-r border-gray-200' : 'p-6 md:rounded-2xl md:shadow-sm md:border md:border-gray-100'} h-full overflow-y-auto no-scrollbar`}>
    {!isMobileSidebar && (
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg md:text-base">
          <Filter className="w-5 h-5 md:w-4 md:h-4 text-green-600" />
          Categories
        </h3>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    )}
    <ul className={`space-y-4 ${isMobileSidebar ? 'flex flex-col items-center pt-2' : ''}`}>
      <li
        className={`cursor-pointer transition-all flex flex-col items-center justify-center text-center
          ${isMobileSidebar ? 'w-full py-2 px-1 rounded-lg' : 'text-sm hover:bg-green-50 px-3 py-2.5 rounded-xl'}
          ${!categoryFilter && !flagFilter ? "bg-green-50 text-green-600 font-bold" : "text-gray-600 font-medium"}`}
        onClick={() => {
          let url = "/shop";
          if (flagFilter) url += `?flag=${flagFilter}`;
          safePush(router, url);
          if(setIsSidebarOpen) setIsSidebarOpen(false);
        }}>
        <div className={`bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-1 shadow-sm
          ${isMobileSidebar ? 'w-12 h-12' : 'hidden'}`}>
          <LayoutGrid className="w-6 h-6" />
        </div>
        <span className={isMobileSidebar ? "text-[10px] font-bold leading-tight" : ""}>{isMobileSidebar ? "All" : "All Categories"}</span>
      </li>
      {categories.map((cat) => (
        <li
          key={cat._id}
          className={`cursor-pointer transition-all flex flex-col items-center justify-center text-center
            ${isMobileSidebar ? 'w-full py-2 px-1 rounded-lg' : 'text-sm hover:bg-green-50 px-3 py-2.5 rounded-xl'}
            ${categoryFilter?.trim() === cat.name.trim() ? "text-green-600 font-bold" : "text-gray-600 font-medium"}`}
          onClick={() => {
            let url = `/shop?category=${encodeURIComponent(cat.name.trim())}`;
            if (flagFilter) url += `&flag=${flagFilter}`;
            safePush(router, url);
            if(setIsSidebarOpen) setIsSidebarOpen(false);
          }}>
          <div className={`${isMobileSidebar ? 'w-12 h-12' : 'hidden'} rounded-full overflow-hidden mb-1 border-2 ${categoryFilter?.trim() === cat.name.trim() ? 'border-green-500 shadow-md' : 'border-gray-100'} bg-white flex items-center justify-center flex-shrink-0 transition-all`}>
             {cat.image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categories/${cat.image}`}
                  alt={cat.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <LayoutGrid className="w-6 h-6 text-gray-300" />
              )}
          </div>
          <span className={isMobileSidebar ? "text-[10px] font-bold leading-tight line-clamp-2 px-0.5" : ""}>{cat.name}</span>
        </li>
      ))}
    </ul>
  </div>
);

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFilter = searchParams.get("category");
  const flagFilter = searchParams.get("flag");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [miniCart, setMiniCart] = useState(null);
  
  // New States for mobile UI and Sorting
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 40;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };
    fetchData();

    const fetchCart = async () => {
      try {
        await Promise.resolve(); // Defers the synchronous branch execution to avoid "setState during effect" warning
        const token = localStorage.getItem("token");
        if (!token) {
          const guestCart = JSON.parse(
            localStorage.getItem("guestCart") || '{"items":[]}',
          );
          const qtyMap = {};
          guestCart.items.forEach((item) => {
            qtyMap[item.productId] = item.quantity;
          });
          setCartItems(qtyMap);
          return;
        }
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: { Authorization: token },
        });
        if (res.data && res.data.items) {
          const qtyMap = {};
          res.data.items.forEach((item) => {
            qtyMap[item.productId] = item.quantity;
          });
          setCartItems(qtyMap);
        }
      } catch (error) {
        console.log("Cart fetch error:", error);
      }
    };
    fetchCart();
  }, []);

  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Search Filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category Filter
    if (categoryFilter) {
      const category = categories.find(
        (c) => c.name.trim().toLowerCase() === categoryFilter.trim().toLowerCase(),
      );
      if (category) {
        filtered = filtered.filter((p) => {
          if (Array.isArray(p.category)) {
            return p.category.some((id) => id === category._id || id?._id === category._id);
          }
          return p.category === category._id || p.category?._id === category._id;
        });
      } else {
        filtered = [];
      }
    }

    // Flag Filter
    if (flagFilter) {
      filtered = filtered.filter((p) => p[flagFilter] === true);
    }

    // Sorting Logic
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-za":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
      default:
        filtered.reverse();
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, flagFilter, searchQuery, sortOption]);


  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (categoryFilter) return categoryFilter;
    if (flagFilter) {
      const titles = {
        isDealsOfDay: "Deals of the Day",
        isTopSellingProducts: "Top Selling Products",
        isRice: "Rice & Grains",
        isAttaAndFlour: "Atta & Flour",
        isDryFruites: "Dry Fruits",
        isDalAndPulses: "Dal & Pulses",
        isMasala: "Masala",
        isNamkeenAndSnacks: "Snacks & Namkeen",
      };
      return titles[flagFilter] || "All Products";
    }
    return "All Products";
  };

  const openMiniCart = (product) => {
    setMiniCart({
      product: {
        _id: product._id,
        title: product.title,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0] || "",
        stock: product.stock ?? 999,
      },
      qty: 1,
    });
  };

  const confirmMiniCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest Add to Cart logic
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const index = guestCart.items.findIndex(
          (i) => i.productId === miniCart.product._id,
        );

        const currentQtyInCart = index > -1 ? guestCart.items[index].quantity : 0;
        const totalRequestedQty = currentQtyInCart + miniCart.qty;
        const availableStock = miniCart.product.stock;

        if (totalRequestedQty > availableStock) {
          alert(`Only ${availableStock} items available in stock. You already have ${currentQtyInCart} in cart.`);
          return;
        }

        if (index > -1) {
          guestCart.items[index].quantity += miniCart.qty;
        } else {
          guestCart.items.push({
            productId: miniCart.product._id,
            title: miniCart.product.title,
            price: miniCart.product.price,
            discountPrice: miniCart.product.discountPrice,
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
        setMiniCart(null);
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-cart`,
        { 
          productId: miniCart.product._id, 
          title: miniCart.product.title, 
          price: miniCart.product.price, 
          discountPrice: miniCart.product.discountPrice, 
          image: miniCart.product.image 
        },
        { headers: { Authorization: token } },
      );
      setCartItems((prev) => ({
        ...prev,
        [miniCart.product._id]:
          (prev[miniCart.product._id] || 0) + miniCart.qty,
      }));
      setMiniCart(null);
    } catch (error) {
      console.log(error);
    }
  };

  const sortOptions = [
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Name: A to Z", value: "name-az" },
    { label: "Name: Z to A", value: "name-za" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cartCount={Object.values(cartItems).reduce((a, b) => a + b, 0)} />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-4 md:py-8 overflow-hidden">
        <div className="flex flex-row md:flex-row gap-2 md:gap-8 relative h-[calc(100vh-140px)] md:h-auto overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 space-y-8">
            <SidebarContent 
              categories={categories} 
              categoryFilter={categoryFilter}
              flagFilter={flagFilter}
              router={router}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </aside>

          {/* Mobile Left Sidebar (Persistent Category List) */}
          <aside className="md:hidden w-24 flex-shrink-0 h-full overflow-y-auto no-scrollbar order-1 -ml-4">
            <SidebarContent 
              categories={categories} 
              categoryFilter={categoryFilter}
              flagFilter={flagFilter}
              router={router}
              setIsSidebarOpen={null}
              isMobileSidebar={true}
            />
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 order-2 pl-2 h-full overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  {getPageTitle()}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {filteredProducts.length} items found
                </p>
              </div>
              
              {/* Mobile Sort Button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsSortOpen(true)}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-black text-gray-800 shadow-sm active:scale-95 transition-all"
                >
                  <ArrowUpDown className="w-4 h-4 text-green-600" />
                  Sort
                </button>
              </div>

              {/* Desktop Sort Dropdown */}
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-500 font-medium">Sort by:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm cursor-pointer"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white border border-gray-100 rounded-3xl p-3 md:p-4 hover:shadow-xl transition-all group relative animate-in fade-in zoom-in duration-300 flex flex-col h-full">
                      <div
                        onClick={() => safePush(router, `/product/${product._id}`)}
                        className="aspect-square flex items-center justify-center bg-gray-50 rounded-2xl mb-4 overflow-hidden cursor-pointer relative flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.images[0]}`}
                            alt={product.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-500"
                            width={300}
                            height={300}
                          />
                        ) : (
                          <Package className="w-10 h-10 text-gray-300" />
                        )}
                        {product.discountPrice > product.price && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                              SAVE ₹{Number((product.discountPrice - product.price).toFixed(2))}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3
                          onClick={() => safePush(router, `/product/${product._id}`)}
                          className="text-xs md:text-base font-semibold md:font-bold text-gray-800 mb-1 hover:text-green-600 cursor-pointer line-clamp-2 min-h-[3rem] leading-tight break-words">
                          {product.title}
                        </h3>
                      </div>
                      <div className="mt-auto pt-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-baseline gap-1">
                            <span className="font-extrabold text-base md:text-lg text-gray-900">
                              ₹{product.price}
                            </span>
                            {product.discountPrice > product.price && (
                              <span className="text-gray-400 line-through text-[10px] font-semibold">
                                ₹{product.discountPrice}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => openMiniCart(product)}
                            className={`w-full py-2 border-2 text-[11px] md:text-sm font-bold rounded-xl transition flex items-center justify-center gap-1 ${
                              cartItems[product._id]
                                ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-100"
                                : "border-green-600 text-green-600 bg-white hover:bg-green-600 hover:text-white"
                            }`}
                            style={{ cursor: "pointer" }}>
                            {cartItems[product._id] ? (
                              <>
                                <span>Added</span>
                                <span className="bg-white text-green-600 px-1.5 py-0.5 rounded-full text-[9px] font-black">
                                  {cartItems[product._id]}
                                </span>
                              </>
                            ) : (
                              "Add to Cart"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2 pb-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-lg bg-white text-gray-700 disabled:opacity-50 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="flex items-center gap-1 flex-wrap">
                    {(() => {
                      let start = Math.max(currentPage - 1, 1);
                      let end = start + 2;
                      if (end > totalPages) {
                        end = totalPages;
                        start = Math.max(end - 2, 1);
                      }
                      const pages = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
                      return pages.map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                            currentPage === page
                              ? "bg-green-600 text-white shadow-md shadow-green-100"
                              : "bg-white text-gray-600 border border-gray-200 hover:bg-green-50 hover:text-green-600"
                          }`}
                        >
                          {page}
                        </button>
                      ));
                    })()}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-lg bg-white text-gray-700 disabled:opacity-50 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-800 font-bold mb-1">No products found</p>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => safePush(router, "/shop")}
                  className="bg-green-600 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Sort Bottom Sheet */}
      {isSortOpen && (
        <div className="fixed inset-0 z-[150] md:hidden flex items-end">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSortOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-[2.5rem] p-6 pb-12 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">Sort By</h3>
              <button 
                onClick={() => setIsSortOpen(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortOption(opt.value);
                    setIsSortOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 px-5 rounded-2xl text-left font-bold transition-all ${
                    sortOption === opt.value 
                      ? "bg-green-50 text-green-600 ring-1 ring-green-100" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                  {sortOption === opt.value && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mini Cart Bottom Sheet / Modal */}
      {miniCart && (
        <>
          <div
            onClick={() => setMiniCart(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[160]"
          />
          <div className="fixed bottom-0 md:top-1/2 md:left-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md bg-white rounded-t-[2.5rem] md:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[170] overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 border-t md:border border-gray-100">
            {/* Handle for Mobile */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div className="bg-white md:bg-green-600 text-gray-900 md:text-white px-6 py-4 flex items-center justify-between border-b md:border-none">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-green-600 md:text-white" />
                <span className="font-extrabold text-lg tracking-tight">Add to Cart</span>
              </div>
              <button
                onClick={() => setMiniCart(null)}
                className="p-1 hover:bg-gray-100 md:hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400 md:text-white" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-blue-50/50">
                  {miniCart.product.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${miniCart.product.image}`}
                      alt={miniCart.product.title}
                      className="w-full h-full object-contain"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <Package className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold md:font-extrabold text-gray-800 text-base md:text-lg leading-tight mb-2 line-clamp-2">
                    {miniCart.product.title}
                  </h4>
                  <p className="text-green-600 font-black text-xl md:text-2xl">
                    ₹{miniCart.product.price}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50/80 rounded-[2rem] p-4 flex items-center justify-between mb-8 border border-gray-100/50">
                <span className="text-[11px] font-black text-gray-400 pl-4 uppercase tracking-[0.2em]">
                  Quantity
                </span>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() =>
                      setMiniCart((p) => ({
                        ...p,
                        qty: Math.max(1, p.qty - 1),
                      }))
                    }
                    className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white text-green-700 font-bold flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-90 border border-gray-100">
                    <Minus className="w-5 h-5 md:w-5 md:h-5" />
                  </button>
                  <span className="font-black text-xl md:text-2xl text-gray-900 w-8 md:w-10 text-center">
                    {miniCart.qty}
                  </span>
                  <button
                    onClick={() =>
                      setMiniCart((p) => {
                        const nextQty = p.qty + 1;
                        const available = p.product.stock ?? 999;
                        if (nextQty > available) {
                          alert(`Only ${available} items available in stock.`);
                          return p;
                        }
                        return { ...p, qty: nextQty };
                      })
                    }
                    className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-green-600 text-white font-bold flex items-center justify-center shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-90">
                    <Plus className="w-5 h-5 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 px-2">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                <span className="text-xl md:text-2xl text-gray-900 font-black">
                  ₹{miniCart.product.price * miniCart.qty}
                </span>
              </div>

              <button
                onClick={confirmMiniCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] transition-all shadow-xl shadow-green-100 active:scale-[0.98] text-base md:text-lg uppercase tracking-widest">
                Add to Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center font-bold text-green-600">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
