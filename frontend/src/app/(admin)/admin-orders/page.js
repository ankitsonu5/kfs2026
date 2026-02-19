"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Search,
  Filter,
  Package,
  Trash2,
  Inbox,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Admin only.");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        fetchOrders(); // Refresh list
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this order? This action cannot be undone.",
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        alert("Order deleted successfully");
        fetchOrders();
      }
    } catch (error) {
      console.error("Delete order error:", error);
      alert("Failed to delete order");
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium tracking-wide">
            Fetching orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8 overflow-x-hidden no-scrollbar">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button
              onClick={() => router.push("/admindashboard")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-3 text-sm font-medium cursor-pointer">
              <ArrowLeft size={14} /> Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Orders Management
            </h1>
            <p className="text-gray-400 mt-2">
              Track and manage all customer orders in one place.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search ID, Name, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1e293b] border border-[#334155] rounded-xl pl-12 pr-4 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition shadow-inner"
              />
            </div>
            <button className="bg-[#1e293b] p-3.5 rounded-xl border border-[#334155] text-gray-400 hover:text-white transition shadow-sm cursor-pointer">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-[#1e293b] rounded-3xl p-16 text-center border border-[#334155] shadow-2xl flex flex-col items-center">
            <div className="w-20 h-20 bg-[#334155]/30 rounded-full flex items-center justify-center mb-6">
              <Inbox size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-200">No orders found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map((o) => (
              <div
                key={o._id}
                className="bg-[#1e293b] rounded-3xl border border-[#334155] overflow-hidden hover:border-blue-500/30 transition group shadow-xl">
                {/* Order Meta Header */}
                <div className="bg-[#334155]/20 px-6 py-5 flex flex-wrap justify-between items-center gap-4 border-b border-[#334155]/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                      {o.userId?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Order ID
                      </p>
                      <p className="font-mono text-sm text-blue-400 tracking-tight">
                        #{o._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Created At
                      </p>
                      <p className="text-sm text-gray-300">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        value={o.orderStatus}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition cursor-pointer focus:outline-none ${
                          o.orderStatus === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : o.orderStatus === "Cancelled"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                        }`}>
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">
                          Out for delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDelete(o._id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                        title="Delete Order">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-extrabold">
                    {/* User & Shipping */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-[#0f172a]/50 p-5 rounded-2xl border border-[#334155]/30 shadow-inner">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-4">
                          Customer Details
                        </h4>
                        <p className="font-bold text-gray-200">
                          {o.userId?.fullName ||
                            o.userId?.name ||
                            "Anonymous User"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                          {o.userId?.email || "No email provided"}
                        </p>
                      </div>

                      <div className="bg-[#0f172a]/50 p-5 rounded-2xl border border-[#334155]/30 shadow-inner">
                        <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-4">
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-400 space-y-1 font-medium">
                          <p className="text-gray-200 font-bold">
                            {o.shippingAddress?.fullName}
                          </p>
                          <p>{o.shippingAddress?.phone}</p>
                          <p className="leading-relaxed">
                            {o.shippingAddress?.address}
                          </p>
                          <p>
                            {o.shippingAddress?.city},{" "}
                            {o.shippingAddress?.pincode}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="lg:col-span-12 mt-4">
                      <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-4 ml-1">
                        Order Items ({o.items?.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                        {o.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-5 bg-[#0f172a]/40 p-3 rounded-2xl border border-[#334155]/30 hover:bg-[#0f172a]/60 transition">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-[#334155]/50 flex-shrink-0 p-1 shadow-sm">
                              {item.image ? (
                                <img
                                  src={`http://localhost:8080/uploads/${item.image}`}
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-100 truncate">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700 font-bold uppercase tracking-widest">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-xs text-gray-500">
                                  × ₹{item.price}
                                </span>
                              </div>
                            </div>
                            <p className="font-black text-gray-100 pr-2">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Footer */}
                    <div className="lg:col-span-12 flex flex-wrap justify-between items-center gap-6 mt-6 pt-6 border-t border-[#334155]/50">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#334155]/30 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 border border-[#334155]/50 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                          Payment Method:{" "}
                          <span className="text-gray-200 uppercase">
                            {o.paymentMethod || "COD"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.1em] mb-1">
                          Total Order Value
                        </p>
                        <p className="text-3xl font-black text-emerald-400">
                          ₹{o.totalAmount?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: animate-in 0.4s ease-out forwards;
        }
      `,
        }}
      />
    </div>
  );
}
