"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  Search,
  UserPlus,
  LogIn,
  ShoppingCart,
  UserCircle,
  Pencil,
  Settings,
  ShoppingBag,
  LogOut,
  Heart,
  X,
} from "lucide-react";
import Link from "next/link";
import MobileBottomNav from "./MobileBottomNav";

export default function Header({ cartCount }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    products: [],
    categories: [],
  });
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Check if user is logged in
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        if (!token) return;
        
        const hasSessionCookie = document.cookie.split('; ').some(row => row.startsWith('token='));
        if (role === 'admin' && !hasSessionCookie) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setUser(null);
          return;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/profile`,
          {
            headers: { Authorization: token },
          },
        );
        setUser(res.data.user);
      } catch (error) {
        console.log("User fetch error:", error);
      }
    };
    fetchUser();
  }, []);

  // Search logic with debouncing
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/search?q=${searchQuery}`,
          );
          if (res.data.success) {
            setSearchResults({
              products: res.data.products || [],
              categories: res.data.categories || [],
            });
            setShowResults(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setSearchResults({ products: [], categories: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close search results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[60] bg-white shadow-sm h-16 md:h-20 flex items-center py-0">
        <div className="container mx-auto px-2 md:px-4 flex items-center justify-between gap-x-2 md:gap-x-4">
          {/* Logo - Left on Desktop, Left on Mobile */}
          <div className="flex-shrink-0 md:flex-1 md:order-1">
            <Link
              href="/"
              className="flex items-center hover:scale-105 transition-transform"
              title="Back to Home">
              <div className="w-20 sm:w-32 md:w-48">
                <Image
                  src="/kfslogo.webp"
                  alt="logo"
                  width={200}
                  height={60}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Search Bar - Center on Desktop, Inline on Mobile */}
          <div
            className="flex-1 max-w-xl md:order-2 relative px-0"
            ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-3 pr-10 py-2 md:pl-4 md:pr-12 md:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-[11px] md:text-sm text-black shadow-sm transition-all"
                onFocus={() => setShowResults(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-9 md:right-11 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 text-gray-400 group-focus-within:text-green-600 hover:text-green-700 transition-colors"
                title="Search">
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>
            {/* Search Results Dropdown */}
            {showResults &&
              (searchResults.products.length > 0 ||
                searchResults.categories.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-[70vh] overflow-y-auto">
                  {searchResults.categories.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-bold text-gray-500 px-2 py-1 uppercase tracking-wider">
                        Categories
                      </h3>
                      {searchResults.categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          onClick={() => {
                            setSearchQuery("");
                            setShowResults(false);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md transition-colors group">
                          {cat.image && (
                            <div className="w-8 h-8 relative rounded overflow-hidden flex-shrink-0 border border-gray-100">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categories/${cat.image}`}
                                alt={cat.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.products.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <h3 className="text-xs font-bold text-gray-500 px-2 py-1 uppercase tracking-wider">
                        Products
                      </h3>
                      {searchResults.products.map((prod) => (
                        <Link
                          key={prod._id}
                          href={`/product/${prod._id}`}
                          onClick={() => {
                            setSearchQuery("");
                            setShowResults(false);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md transition-colors group">
                          {prod.images && prod.images.length > 0 && (
                            <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0 border border-gray-100">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${prod.images[0]}`}
                                alt={prod.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium line-clamp-1">
                              {prod.title}
                            </span>
                            <span className="text-xs text-green-600 font-bold">
                              ₹{prod.discountPrice || prod.price}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Icons - Right on Desktop, Hidden on Mobile (moved to bottom nav) */}
          <div className="hidden md:flex md:flex-1 md:order-3 justify-end items-center gap-3 sm:gap-6">
            {!user ? (
              <button
                className="flex flex-col items-center text-gray-600 hover:text-green-600"
                onClick={handleLogin}
                style={{ cursor: "pointer" }}>
                <LogIn className="w-6 h-6" />
                <span className="text-[10px] md:text-xs">Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                  Hi, {user.role === 'admin' ? 'Admin' : user.fullName}
                </span>

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex flex-col items-center text-gray-600 hover:text-green-600"
                    style={{ cursor: "pointer" }}>
                    <UserCircle className="w-6 h-6" />
                    <span className="text-[10px] md:text-xs">Account</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-[70] overflow-hidden">
                      {user.role === "admin" ? (
                        <button
                          onClick={() => {
                            router.push("/admindashboard");
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 text-sm font-medium border-b border-gray-100 transition-colors">
                          <Settings className="w-4 h-4 text-green-600" />
                          Admin Dashboard
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              router.push("/user-profile");
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 text-sm font-medium border-b border-gray-100 transition-colors">
                            <Pencil className="w-4 h-4 text-green-600" />
                            Edit Profile
                          </button>
                          <button
                            onClick={() => {
                              router.push("/user-settings");
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 text-sm font-medium border-b border-gray-100 transition-colors">
                            <Settings className="w-4 h-4 text-green-600" />
                            Settings
                          </button>
                          <button
                            onClick={() => {
                              router.push("/my-orders");
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 text-sm font-medium border-b border-gray-100 transition-colors">
                            <ShoppingBag className="w-4 h-4 text-green-600" />
                            My Orders
                          </button>
                          <button
                            onClick={() => {
                              router.push("/wishlist");
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 text-sm font-medium border-b border-gray-100 transition-colors">
                            <Heart className="w-4 h-4 text-green-600" />
                            My Wishlist
                          </button>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 text-sm font-medium transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              className="flex flex-col items-center text-gray-600 hover:text-green-600 relative"
              onClick={() => router.push("/cart")}
              style={{ cursor: "pointer" }}>
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[10px] md:text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileBottomNav
        user={user}
        cartCount={cartCount}
        handleLogout={handleLogout}
      />
    </>
  );
}
