"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  ClipboardList,
  MapPin,
  CreditCard,
  ReceiptText,
  Package,
  Lock,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Header from "../../components/header";
import Navbar from "../../components/redesign/Navbar";
import Footer from "../../components/redesign/Footer";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [deliveryConfig, setDeliveryConfig] = useState({ deliveryCharge: 50, minOrderForFreeDelivery: 500 });
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });
  const [service, setService] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: { Authorization: token },
        });
        setCart(res.data);
        if (!res.data || res.data.items.length === 0) {
          router.push("/");
        }
      } catch (error) {
        console.log("Cart fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();

    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/adminsettings`);
        if (res.data && res.data.settings) {
          setDeliveryConfig({
            deliveryCharge: res.data.settings.deliveryCharge !== undefined ? Number(res.data.settings.deliveryCharge) : 50,
            minOrderForFreeDelivery: res.data.settings.minOrderForFreeDelivery !== undefined ? Number(res.data.settings.minOrderForFreeDelivery) : 500,
          });
        }
      } catch (err) {
        console.error("Error fetching delivery settings:", err);
      }
    };
    fetchSettings();
  }, [router]);

  // Auto-fill saved address from settings + profile
  useEffect(() => {
    const fetchSavedAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [profileRes, settingsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            headers: { Authorization: token },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-settings`, {
            headers: { Authorization: token },
          }),
        ]);

        const user = profileRes.data.user;
        const saved = settingsRes.data.settings;

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

  // Fetch service area info when pincode or city changes
  useEffect(() => {
    const checkService = async () => {
      const trimmedPincode = form.pincode ? form.pincode.trim() : "";
      const trimmedCity = form.city ? form.city.trim() : "";

      if (trimmedPincode.length >= 6 || trimmedCity.length >= 2) {
        setServiceLoading(true);
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/service-areas-check?pincode=${encodeURIComponent(trimmedPincode)}&city=${encodeURIComponent(trimmedCity)}`
          );
          if (res.data.success && res.data.area) {
            setService(res.data.area);
          } else {
            setService(null);
          }
        } catch (error) {
          setService(null);
        } finally {
          setServiceLoading(false);
        }
      } else {
        setService(null);
      }
    };
    const timer = setTimeout(checkService, 400);
    return () => clearTimeout(timer);
  }, [form.pincode, form.city]);
  
  const isServiceAvailable = !!service;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isServiceAvailable) {
      alert("Sorry, we do not provide delivery service in this area/city yet.");
      return;
    }

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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/place-order`,
        {
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            pincode: form.pincode,
          },
          paymentMethod: form.paymentMethod,
        },
        {
          headers: { Authorization: token },
        },
      );

      if (res.data.success) {
        router.push("/my-orders");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
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

  const subtotal = parseFloat(cart.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0).toFixed(2));
  const totalMrp = parseFloat(cart.items.reduce((sum, item) => {
    const p = Number(item.price);
    const dp = Number(item.discountPrice);
    const mrp = (dp && dp > p) ? dp : p;
    return sum + (mrp * item.quantity);
  }, 0).toFixed(2));
  const totalSavings = parseFloat((totalMrp - subtotal).toFixed(2));
  
  const deliveryCharge = subtotal >= deliveryConfig.minOrderForFreeDelivery || subtotal === 0 ? 0 : deliveryConfig.deliveryCharge;
  const grandTotal = parseFloat((subtotal + deliveryCharge).toFixed(2));

  return (
    <>
    <Header />
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-16 md:top-[124px] z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            </div>
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
                  <MapPin className="w-5 h-5 text-green-600" /> Delivery Address
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
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black ${
                        form.city.trim().length >= 2 
                          ? (isServiceAvailable ? "border-green-500" : "border-red-500") 
                          : "border-gray-300"
                      }`}
                    />
                    {serviceLoading && (
                      <div className="absolute right-3 top-3.5 w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {form.city.trim().length >= 2 && !serviceLoading && (
                      <p className={`text-[10px] mt-1 font-bold ${isServiceAvailable ? "text-green-600" : "text-red-500"}`}>
                        {isServiceAvailable 
                          ? `✓ Delivery available in ${service.city}` 
                          : "✗ Delivery not available in this city"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="Enter pincode"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black ${
                          form.pincode.trim().length >= 6 
                            ? (isServiceAvailable ? "border-green-500" : "border-red-500") 
                            : "border-gray-300"
                        }`}
                      />
                      {serviceLoading && (
                        <div className="absolute right-3 top-3.5 w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {form.pincode.trim().length >= 6 && !serviceLoading && (
                        <p className={`text-[10px] mt-1 font-bold ${isServiceAvailable ? "text-green-600" : "text-red-500"}`}>
                          {isServiceAvailable 
                            ? `✓ Delivery available in ${service.city} ${service.pincode ? `(${service.pincode})` : "(All areas)"}` 
                            : "✗ Delivery not available for this area"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" /> Payment
                  Method
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
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-not-allowed opacity-60 bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={form.paymentMethod === "upi"}
                      onChange={handleChange}
                      disabled
                      className="w-5 h-5 text-gray-400 cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800">UPI Payment</p>
                        <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold uppercase tracking-wider">Unavailable</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Pay via Google Pay, PhonePe, Paytm
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-not-allowed opacity-60 bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === "card"}
                      onChange={handleChange}
                      disabled
                      className="w-5 h-5 text-gray-400 cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800">
                          Credit/Debit Card
                        </p>
                        <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold uppercase tracking-wider">Unavailable</span>
                      </div>
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
                disabled={placing || !isServiceAvailable}
                className="lg:hidden w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer">
                {placing
                  ? "Placing Order..."
                  : !isServiceAvailable 
                    ? "Service Not Available"
                    : `Place Order — ₹${grandTotal}`}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-[80px] md:top-[140px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-green-600" /> Order Summary
              </h3>

              {/* Items list */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.image}`}
                          alt={item.title}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-300" />
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
                      ₹{parseFloat((item.price * item.quantity).toFixed(2))}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Total MRP ({cart.items.length} items)</span>
                  <span className="line-through text-gray-400">₹{totalMrp}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Selling Price</span>
                  <span>₹{subtotal}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-gray-600 text-sm font-semibold">
                    <span>You Save</span>
                    <span>-₹{totalSavings}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Delivery Charges <span className="text-[10px] text-gray-400 font-normal ml-1">(Free above ₹{deliveryConfig.minOrderForFreeDelivery})</span></span>
                  {!isServiceAvailable && form.pincode.length >= 6 ? (
                    <span className="text-red-500 font-semibold tracking-tighter text-xs">Service Unavailable</span>
                  ) : deliveryCharge === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span>₹{deliveryCharge}</span>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span className="text-green-600">₹{grandTotal}</span>
                </div>
              </div>

              {/* Place Order Button (desktop) */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing || !isServiceAvailable}
                className="hidden lg:block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer">
                {placing ? "Placing Order..." : !isServiceAvailable ? "Service Not Available" : "Place Order"}
              </button>

              <p className="text-center text-gray-400 text-xs mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> 100% Secure Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
