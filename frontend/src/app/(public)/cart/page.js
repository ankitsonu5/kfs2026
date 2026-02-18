"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ShoppingCart,
  ArrowLeft,
  MoveRight,
  Package,
  Plus,
  Minus,
  Trash2,
  Lock,
} from "lucide-react";

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Load from guest cart
        const guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[], "totalAmount": 0}',
        );
        // Calculate total if not already there or to be safe
        const total = guestCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        setCart({ items: guestCart.items, totalAmount: total });
        setLoading(false);
        return;
      }
      const res = await axios.get("http://localhost:8080/cart", {
        headers: { Authorization: token },
      });
      setCart(res.data);
    } catch (error) {
      console.log("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async (item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest Increment
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const index = guestCart.items.findIndex(
          (i) => i.productId === item.productId,
        );
        if (index > -1) {
          guestCart.items[index].quantity += 1;
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));

        const updatedItems = cart.items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
        const updatedTotal = updatedItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0,
        );
        setCart({ items: updatedItems, totalAmount: updatedTotal });
        return;
      }
      await axios.post(
        "http://localhost:8080/add-cart",
        {
          productId: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
        },
        { headers: { Authorization: token } },
      );

      const updatedItems = cart.items.map((i) =>
        i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i,
      );
      const updatedTotal = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
      setCart({ items: updatedItems, totalAmount: updatedTotal });
    } catch (error) {
      console.log("Increment error:", error);
    }
  };

  const handleDecrement = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const item = cart.items.find((i) => i.productId === productId);
      if (!item) return;

      if (!token) {
        // Guest Decrement
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        const index = guestCart.items.findIndex(
          (i) => i.productId === productId,
        );
        if (index > -1) {
          if (guestCart.items[index].quantity > 1) {
            guestCart.items[index].quantity -= 1;
            localStorage.setItem("guestCart", JSON.stringify(guestCart));
            const updatedItems = cart.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            );
            const updatedTotal = updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0,
            );
            setCart({ items: updatedItems, totalAmount: updatedTotal });
          } else {
            handleRemove(productId);
          }
        }
        return;
      }

      if (item.quantity <= 1) {
        handleRemove(productId);
        return;
      }

      await axios.put(
        `http://localhost:8080/cart/decrement/${productId}`,
        {},
        { headers: { Authorization: token } },
      );

      const updatedItems = cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
      );
      const updatedTotal = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
      setCart({ items: updatedItems, totalAmount: updatedTotal });
    } catch (error) {
      console.log("Decrement error:", error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest Remove
        let guestCart = JSON.parse(
          localStorage.getItem("guestCart") || '{"items":[]}',
        );
        guestCart.items = guestCart.items.filter(
          (i) => i.productId !== productId,
        );
        localStorage.setItem("guestCart", JSON.stringify(guestCart));

        const updatedItems = cart.items.filter(
          (item) => item.productId !== productId,
        );
        const updatedTotal = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        setCart({ items: updatedItems, totalAmount: updatedTotal });
        return;
      }
      await axios.delete(`http://localhost:8080/cart/${productId}`, {
        headers: { Authorization: token },
      });
      const updatedItems = cart.items.filter(
        (item) => item.productId !== productId,
      );
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      setCart({ items: updatedItems, totalAmount: updatedTotal });
    } catch (error) {
      console.log("Remove error:", error);
      alert("Remove failed!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-green-600 transition p-2 hover:bg-gray-100 rounded-full cursor-pointer">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">My Cart</h1>
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-green-600 font-semibold hover:underline flex items-center gap-2 cursor-pointer">
            Continue Shopping <MoveRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {cart.items.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven&apos;t added anything yet!
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg cursor-pointer">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Cart Items ({cart.items.length})
              </h2>

              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={`http://localhost:8080/uploads/${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-10 h-10 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.title}
                    </h3>
                    <p className="text-green-600 font-bold text-lg">
                      ₹{item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => handleDecrement(item.productId)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-green-600 hover:text-green-600 transition cursor-pointer">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-700 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-green-600 hover:text-green-600 transition cursor-pointer">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-800 text-lg">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-500 text-sm font-semibold hover:text-red-700 transition mt-1 cursor-pointer flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>₹{cart.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-800 text-lg">
                    <span>Total</span>
                    <span>₹{cart.totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg cursor-pointer">
                  Proceed to Checkout
                </button>

                <p className="text-center text-gray-400 text-xs mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secure checkout powered by KFS
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
