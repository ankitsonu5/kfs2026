"use client";

import React from "react";
import { PhoneCall, Facebook, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="bg-green-600 text-white overflow-x-auto no-scrollbar hidden md:block">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-4 md:gap-8 py-2 md:py-3 text-xs md:text-sm font-medium whitespace-nowrap">
          <li
            onClick={() => router.push("/aboutus")}
            className="hover:text-green-100 cursor-pointer">
            ABOUT US
          </li>
          <li
            onClick={() => router.push("/dealstoday")}
            className="hover:text-green-100 cursor-pointer">
            DEALS TODAY
          </li>
          <li
            onClick={() => router.push("/shop")}
            className="hover:text-green-100 cursor-pointer">
            SHOP
          </li>
          <li
            onClick={() => router.push("/contact")}
            className="hover:text-green-100 cursor-pointer">
            CONTACT
          </li>
          <li
            onClick={() => router.push("/bulk-order")}
            className="hover:text-green-100 cursor-pointer">
            BULK ORDER
          </li>
          <li className="ml-auto flex items-center gap-4 text-[10px] md:text-sm font-bold tracking-wider hidden sm:flex">
            <a
              href="tel:+918800145844"
              className="flex items-center gap-2 hover:text-green-100 transition-colors group">
              <PhoneCall
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Call +91 8800145844</span>
            </a>
            <span className="opacity-40 font-light px-1 min-h-full">|</span>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-100 transition-colors">
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-100 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
