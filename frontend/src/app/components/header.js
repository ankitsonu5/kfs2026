"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import Link from "next/link";
import MobileBottomNav from "./MobileBottomNav";

export default function Header({ cartCount }) {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [profileOpen, setProfileOpen] = React.useState(false);

  // Check if user is logged in
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm md:h-20 flex items-center py-3 md:py-0">
        <div className="container mx-auto px-4 flex items-center justify-between gap-x-8 md:gap-x-4">
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
          <div className="flex-1 max-w-xl md:order-2 relative md:px-0">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-xs md:text-base text-black"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>
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
                  Hi, {user.fullName}
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
                    <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
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
