"use client";

import React from "react";
import {
  Home,
  LayoutGrid,
  User,
  ShoppingCart,
  LogIn,
  Pencil,
  Settings,
  ShoppingBag,
  Heart,
  LogOut,
  X,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function MobileBottomNav({ user, cartCount, handleLogout }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Category", icon: LayoutGrid, path: "/shop" },
    {
      label: user ? "Account" : "Login",
      icon: user ? User : LogIn,
      path: user ? null : "/login",
      onClick: user ? () => setIsProfileMenuOpen(true) : null,
    },
    { label: "Cart", icon: ShoppingCart, path: "/cart", showBadge: true },
  ];

  const profileOptions = [
    { label: "Edit Profile", icon: Pencil, path: "/user-profile" },
    { label: "Settings", icon: Settings, path: "/user-settings" },
    { label: "My Orders", icon: ShoppingBag, path: "/my-orders" },
    { label: "My Wishlist", icon: Heart, path: "/wishlist" },
  ];

  return (
    <>
      {/* Profile Menu Popup for Mobile */}
      {isProfileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[110] flex items-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsProfileMenuOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">My Account</h3>
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {profileOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    router.push(option.path);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 text-gray-700 font-medium transition-colors border border-transparent hover:border-green-100">
                  <div className="w-10 h-10 bg-green-50 text-green-600 flex items-center justify-center rounded-full">
                    <option.icon className="w-5 h-5" />
                  </div>
                  <span>{option.label}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 text-red-500 font-medium transition-colors border border-transparent hover:border-red-100">
                <div className="w-10 h-10 bg-red-50 text-red-500 flex items-center justify-center rounded-full">
                  <LogOut className="w-5 h-5" />
                </div>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-[100] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-16">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={
                  item.onClick || (() => item.path && router.push(item.path))
                }
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                  isActive
                    ? "text-green-600 scale-110"
                    : "text-black hover:text-green-500"
                }`}>
                <div className="relative">
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "fill-green-50" : ""}`}
                  />
                  {item.showBadge && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
