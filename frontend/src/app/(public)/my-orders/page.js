"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  Package,
  XCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(res.data.orders);
    } catch (error) {
      console.error("Fetch my orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/my-orders/cancel/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        alert("Order cancelled successfully");
        fetchOrders();
      }
    } catch (error) {
      console.log("Cancel order error:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this order from your history?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/my-orders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        setOrders(orders.filter((o) => o._id !== id));
        alert("Order deleted from history");
      }
    } catch (error) {
      console.log("Delete order error:", error);
      alert(error.response?.data?.message || "Failed to delete order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-black">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Fetching your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-green-600 font-semibold hover:underline flex items-center gap-2 cursor-pointer transition-all">
            <ArrowLeft className="w-5 h-5" /> Back to Shop
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No orders placed yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start shopping and treats will appear here!
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition cursor-pointer">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <div
                key={o._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                      Order ID
                    </p>
                    <p className="font-mono text-gray-600">
                      #{o._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                      Date
                    </p>
                    <p className="text-gray-600">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        o.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : o.orderStatus === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }`}>
                      {o.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                          {item.image ? (
                            <img
                              src={`http://localhost:8080/uploads/${item.image}`}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50 flex flex-wrap justify-between items-end gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">
                        Payment
                      </p>
                      <p className="text-sm font-medium text-gray-600 uppercase italic">
                        {o.paymentMethod}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {["Placed", "Confirmed"].includes(o.orderStatus) && (
                        <button
                          onClick={() => handleCancel(o._id)}
                          className="px-6 py-2 border border-red-500 text-red-500 rounded-full text-sm font-bold hover:bg-red-50 transition cursor-pointer">
                          Cancel Order
                        </button>
                      )}
                      {["Cancelled", "Delivered"].includes(o.orderStatus) && (
                        <button
                          onClick={() => handleDelete(o._id)}
                          className="px-6 py-2 border border-gray-300 text-gray-500 rounded-full text-sm font-bold hover:bg-gray-50 transition cursor-pointer">
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-400">Grand Total</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{o.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
