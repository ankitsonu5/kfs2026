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
import Image from "next/image";
import Header from "../../components/header";
import Navbar from "../../components/redesign/Navbar";
import Footer from "../../components/redesign/Footer";

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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: token },
      });
      if (res.data && res.data.items) {
        res.data.items = res.data.items.filter(item => item.productId !== null);
      }
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
        // For guest, we need to fetch product to check stock
        const productId = item.productId?._id || item.productId;
        try {
          const prodRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
          const product = prodRes.data.product;
          const currentQty = item.quantity;
          const availableStock = product.stock ?? 999;

          if (currentQty + 1 > availableStock) {
            alert(`Only ${availableStock} items available in stock.`);
            return;
          }

          let guestCart = JSON.parse(
            localStorage.getItem("guestCart") || '{"items":[]}',
          );
          const index = guestCart.items.findIndex(
            (i) => (i.productId?._id || i.productId) === productId,
          );
          if (index > -1) {
            guestCart.items[index].quantity += 1;
            localStorage.setItem("guestCart", JSON.stringify(guestCart));

            const updatedItems = cart.items.map((i) => {
              const i_id = i.productId?._id || i.productId;
              return i_id === productId
                ? { ...i, quantity: i.quantity + 1 }
                : i;
            });
            const updatedTotal = updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0,
            );
            setCart({ items: updatedItems, totalAmount: updatedTotal });
          }
        } catch (err) {
          console.log("Guest increment stock check error:", err);
        }
        return;
      }
      const stock = item.productId?.stock ?? 999;
      if (item.quantity + 1 > stock) {
        alert(`Only ${stock} items available in stock`);
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-cart`,
        {
          productId: item.productId._id || item.productId, // Handle populated or unpopulated
          title: item.title,
          price: item.price,
          discountPrice: item.discountPrice,
          image: item.image,
          quantity: 1
        },
        { headers: { Authorization: token } },
      );

      const updatedItems = cart.items.map((i) => {
        const i_id = i.productId?._id || i.productId;
        const item_id = item.productId?._id || item.productId;
        return i_id === item_id ? { ...i, quantity: i.quantity + 1 } : i;
      });
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
      const item = cart.items.find((i) => {
        const i_id = i.productId?._id || i.productId;
        return i_id === productId;
      });
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
            const updatedItems = cart.items.map((i) => {
              const i_id = i.productId?._id || i.productId;
              return i_id === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i;
            });
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
        `${process.env.NEXT_PUBLIC_API_URL}/cart/decrement/${productId}`,
        {},
        { headers: { Authorization: token } },
      );

      const updatedItems = cart.items.map((i) => {
        const i_id = i.productId?._id || i.productId;
        return i_id === productId ? { ...i, quantity: i.quantity - 1 } : i;
      });
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
        guestCart.items = guestCart.items.filter((i) => {
          const i_id = i.productId?._id || i.productId;
          return i_id !== productId;
        });
        localStorage.setItem("guestCart", JSON.stringify(guestCart));

        const updatedItems = cart.items.filter((item) => {
          const item_id = item.productId?._id || item.productId;
          return item_id !== productId;
        });
        const updatedTotal = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        setCart({ items: updatedItems, totalAmount: updatedTotal });
        return;
      }
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`,
        {
          headers: { Authorization: token },
        },
      );
      const updatedItems = cart.items.filter((item) => {
        const item_id = item.productId?._id || item.productId;
        return item_id !== productId;
      });
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

  const getUpdatedItemsAfterDecrement = (productId) => {
    return cart.items.map((i) => {
      const i_id = i.productId?._id || i.productId;
      return i_id === productId ? { ...i, quantity: i.quantity - 1 } : i;
    });
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

  const subtotal = cart.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const totalMrp = cart.items.reduce((sum, item) => {
    const p = Number(item.price);
    const dp = Number(item.discountPrice);
    const mrp = (dp && dp > p) ? dp : p;
    return sum + (mrp * item.quantity);
  }, 0);
  const totalSavings = totalMrp - subtotal;
  const deliveryCharge = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + deliveryCharge;

  return (
    <>
    <Header />
    <Navbar />
    <div className="min-h-screen bg-gray-50">
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

              {cart.items.map((item) => {
                const productId = item.productId?._id || item.productId;
                return (
                  <div
                    key={productId}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.image}`}
                        alt={item.title}
                        width={100}
                        height={100}
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
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-green-600 font-bold text-lg">
                        ₹{item.price}
                      </p>
                      {item.discountPrice && item.discountPrice > item.price && (
                        <div className="flex items-center gap-2">
                          <p className="text-gray-400 line-through text-sm">
                            ₹{item.discountPrice}
                          </p>
                          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Save {Math.round(((item.discountPrice - item.price) / item.discountPrice) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => handleDecrement(productId)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-green-600 hover:text-green-600 transition cursor-pointer">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-gray-700 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        disabled={item.quantity >= (item.productId?.stock ?? 999)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 transition ${item.quantity >= (item.productId?.stock ?? 999) ? "opacity-50 cursor-not-allowed" : "hover:border-green-600 hover:text-green-600 cursor-pointer"}`}>
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-800 text-lg">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemove(productId)}
                      className="text-red-500 text-sm font-semibold hover:text-red-700 transition mt-1 cursor-pointer flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-[80px] md:top-[140px]">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Total MRP ({cart.items.length} items)</span>
                    <span className="line-through text-gray-400">₹{totalMrp}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Selling Price</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-gray-600 font-semibold">
                      <span>You Save</span>
                      <span>-₹{totalSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges <span className="text-xs text-gray-400">(Free above ₹1000)</span></span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      <span>₹{deliveryCharge}</span>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-800 text-lg">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
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
    <Footer />
    </>
  );
}
