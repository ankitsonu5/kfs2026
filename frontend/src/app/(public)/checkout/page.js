"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await fetch("http://localhost:8080/cart", {
          headers: { Authorization: token },
        });
        const data = await res.json();
        setCart(data);
        if (!data || data.items.length === 0) {
          alert("Cart is empty! Add items first.");
          router.push("/");
        }
      } catch (error) {
        console.log("Cart fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Auto-fill saved address from settings + profile
  useEffect(() => {
    const fetchSavedAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [profileRes, settingsRes] = await Promise.all([
          fetch("http://localhost:8080/profile", {
            headers: { Authorization: token },
          }),
          fetch("http://localhost:8080/user-settings", {
            headers: { Authorization: token },
          }),
        ]);

        const profileData = await profileRes.json();
        const settingsData = await settingsRes.json();

        const user = profileData.user;
        const saved = settingsData.settings;

        setForm((prev) => ({
          ...prev,
          fullName: prev.fullName || user?.fullName || "",
          phone: prev.phone || saved?.phone || "",
          address: prev.address || saved?.address || "",
          city: prev.city || saved?.city || "",
          pincode: prev.pincode || saved?.pincode || "",
        }));
      } catch (error) {
        console.log("Auto-fill error:", error);
      }
    };
    fetchSavedAddress();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      alert("Please fill all delivery details!");
      return;
    }

    setPlacing(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            pincode: form.pincode,
          },
          paymentMethod: form.paymentMethod,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("🎉 Order placed successfully! Thank you for shopping with us.");
        router.push("/my-orders");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-green-600 transition text-xl cursor-pointer">
              ←
            </button>
            <h1 className="text-2xl font-bold text-green-600">📋 Checkout</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Details Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📍 Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House no, Street, Landmark..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  💳 Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-gray-500">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={form.paymentMethod === "upi"}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">UPI Payment</p>
                      <p className="text-sm text-gray-500">
                        Pay via Google Pay, PhonePe, Paytm
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === "card"}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Credit/Debit Card
                      </p>
                      <p className="text-sm text-gray-500">
                        Visa, Mastercard, RuPay accepted
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Place Order Button (mobile) */}
              <button
                type="submit"
                disabled={placing}
                className="lg:hidden w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer">
                {placing
                  ? "Placing Order..."
                  : `Place Order — ₹${cart.totalAmount}`}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                🧾 Order Summary
              </h3>

              {/* Items list */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={`http://localhost:8080/uploads/${item.image}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>₹{cart.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span className="text-green-600">₹{cart.totalAmount}</span>
                </div>
              </div>

              {/* Place Order Button (desktop) */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="hidden lg:block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer">
                {placing ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-center text-gray-400 text-xs mt-3">
                🔒 100% Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
