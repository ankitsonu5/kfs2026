"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  UserPlus,
  LogIn,
  ShoppingCart,
  UserCircle,
  Pencil,
  Settings,
  ShoppingBag,
  LogOut,
  X,
} from "lucide-react";

export default function Header({ cartCount }) {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Check if user is logged in
  React.useEffect(() => {
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

  return (
    <>
      {/* Sidebar / Drawer for Mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="w-32">
              <Image src="/kfslogo.webp" alt="logo" width={120} height={40} />
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 hover:text-red-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Sidebar Nav */}
          <nav className="flex-1 overflow-y-auto no-scrollbar">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Categories
            </h3>
            <ul className="space-y-1">
              {[
                { label: "ABOUT US", path: "/aboutus" },
                { label: "DEALS TODAY", path: "/dealstoday" },
                { label: "SHOP", path: "/shop" },
                { label: "CONTACT", path: "/contact" },
                { label: "BULK ORDER", path: "/bulk-order" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="px-4 py-2.5 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all font-medium text-sm cursor-pointer"
                  onClick={() => {
                    router.push(item.path);
                    setIsSidebarOpen(false);
                  }}>
                  {item.label}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-600 hover:text-green-600 transition-colors cursor-pointer">
              <Menu className="w-6 h-6" />
            </button>

            <a
              href="/"
              className="flex items-center hover:scale-105 transition-transform"
              title="Back to Home">
              <div className="w-24 sm:w-32 md:w-48">
                <Image
                  src="/kfslogo.webp"
                  alt="logo"
                  width={200}
                  height={60}
                  priority
                />
              </div>
            </a>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8 relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {!user ? (
              <>
                <button
                  className="flex flex-col items-center text-gray-600 hover:text-green-600"
                  onClick={handleSignup}
                  style={{ cursor: "pointer" }}>
                  <UserPlus className="w-6 h-6" />
                  <span className="text-[10px] md:text-xs">Signup</span>
                </button>
                <button
                  className="flex flex-col items-center text-gray-600 hover:text-green-600"
                  onClick={handleLogin}
                  style={{ cursor: "pointer" }}>
                  <LogIn className="w-6 h-6" />
                  <span className="text-[10px] md:text-xs">Login</span>
                </button>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                Hi, {user.fullName}
              </span>
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

            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex flex-col items-center text-gray-600 hover:text-green-600"
                  style={{ cursor: "pointer" }}>
                  <UserCircle className="w-6 h-6" />
                  <span className="text-[10px] md:text-xs">Profile</span>
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
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 text-sm font-medium transition-colors">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
