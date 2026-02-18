"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, User } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPhonelinkSetup, MdOutlineManageAccounts } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]); // New state for banners
  const [bannerFile, setBannerFile] = useState(null); // New state for banner upload
  const [bannerTitle, setBannerTitle] = useState(""); // New state for banner title

  const [openMenuId, setOpenMenuId] = useState(null);
  const [masterSetupOpen, setMasterSetupOpen] = useState(false);
  const [dashStats, setDashStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    productGraph: [],
    userGraph: [],
    orderGraph: [],
    recentOrders: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/products", {
          headers: { Authorization: token },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/products/${id}`, {
        headers: { Authorization: token },
      });

      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/categories", {
          headers: { Authorization: token },
        });
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/dashboard-stats", {
          headers: { Authorization: token },
        });
        if (res.data.success) {
          setDashStats(res.data);
        }
      } catch (error) {
        console.log("Dashboard stats error:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (active !== "users") return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAllUsers(res.data.users);
        }
      } catch (error) {
        console.log("Users fetch error:", error);
      }
    };
    fetchUsers();
  }, [active]);

  // Fetch Banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/banners");
        setBanners(res.data);
      } catch (error) {
        console.log("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  const handleUploadBanner = async (e) => {
    e.preventDefault();
    if (!bannerFile) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", bannerFile);
    formData.append("title", bannerTitle);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8080/api/banners", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setBanners([res.data, ...banners]);
      setBannerFile(null);
      setBannerTitle("");
      alert("Banner uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to upload banner");
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/banners/${id}`, {
        headers: { Authorization: token },
      });
      setBanners(banners.filter((b) => b._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete banner");
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:8080/delete-user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        alert("User deleted successfully");
        setAllUsers(allUsers.filter((u) => u._id !== id));
      }
    } catch (error) {
      console.log("Delete user error:", error);
      alert("Failed to delete user");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/categories/${id}`, {
        headers: { Authorization: token },
      });

      setCategories(categories.filter((c) => c._id !== id));
      alert("Category deleted");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0b1a2b] text-white overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
      <div
        className={`fixed md:static top-0 left-0 min-h-screen w-64 bg-[#111827] p-5 border-r border-gray-700 z-50 flex flex-col justify-between transform transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div>
          <h1 className="text-2xl font-bold mb-8 text-blue-500">Admin</h1>

          <ul className="space-y-4">
            <li
              onClick={() => {
                setActive("dashboard");
                setOpen(false);
              }}
              className="cursor-pointer hover:text-blue-400">
              📊 Dashboard
            </li>
            <li
              onClick={() => {
                setActive("products");
                setOpen(false);
              }}
              className="cursor-pointer hover:text-blue-400">
              🛒 Products
            </li>
            <li
              onClick={() => {
                setActive("orders");
                setOpen(false);
              }}
              className="cursor-pointer hover:text-blue-400">
              📦 Orders
            </li>
            <li
              onClick={() => {
                setActive("users");
                setOpen(false);
              }}
              className="cursor-pointer hover:text-blue-400">
              👥 Users
            </li>

            <li className="cursor-pointer">
              <div
                className="flex items-center gap-1 hover:text-blue-400"
                onClick={() => setMasterSetupOpen(!masterSetupOpen)}>
                <MdPhonelinkSetup size={20} />
                <span className="text-sm font-medium">MasterSetup</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className={`ml-1 w-5 h-5 text-gray-400 transition-transform duration-200 ${masterSetupOpen ? "rotate-180" : ""
                    }`}>
                  <path
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </div>

              {masterSetupOpen && (
                <ul className="mt-2 ml-7 space-y-2 border-l border-gray-600 pl-3">
                  {/* <li
                    className="text-sm text-gray-300 hover:text-blue-400 cursor-pointer py-1"
                    onClick={() => {
                      setActive("products");
                      setOpen(false);
                    }}>
                    🛒 Products
                  </li> */}
                  <li
                    className="text-sm text-gray-300 hover:text-blue-400 cursor-pointer py-1"
                    onClick={() => {
                      setActive("category");
                      setOpen(false);
                    }}>
                    📂 Category
                  </li>
                  <li
                    className="text-sm text-gray-300 hover:text-blue-400 cursor-pointer py-1"
                    onClick={() => {
                      setActive("banners"); // Switch to banners view
                      setOpen(false);
                    }}>
                    🖼️ Banners
                  </li>
                  {/* <li
                    className="text-sm text-gray-300 hover:text-blue-400 cursor-pointer py-1"
                    onClick={() => {
                      setActive("orders");
                      setOpen(false);
                    }}>
                    📦 Orders
                  </li> */}
                  {/* <li
                    className="text-sm text-gray-300 hover:text-blue-400 cursor-pointer py-1"
                    onClick={() => {
                      setActive("users");
                      setOpen(false);
                    }}>
                    👥 Users
                  </li> */}
                </ul>
              )}
            </li>
            <li
              onClick={() => {
                router.push("/admin-profile");
                setOpen(false);
              }}
              className="cursor-pointer hover:text-blue-400 flex items-center gap-2">
              <MdOutlineManageAccounts size={20} />
              Profile
            </li>
            <li
              onClick={() => {
                router.push("/admin-settings");
                setOpen(false);
              }}
              className="cursor-pointer hover:text-blue-400 flex items-center gap-2">
              <IoSettingsOutline size={20} />
              Settings
            </li>
            <li
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                document.cookie =
                  "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie =
                  "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                router.push("/login");
                setOpen(false);
              }}
              className="cursor-pointer hover:text-red-400">
              🚪 Logout
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-gray-400">admin@kfs.com</p>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}></div>
      )}

      <div className="flex-1 md:ml-0 p-6 w-full">
        <div className="flex justify-between items-center mb-8">
          <button
            className="md:hidden bg-[#111827] p-2 rounded-lg"
            onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>

          <h2 className="text-2xl md:text-3xl font-bold capitalize">
            {active}
          </h2>

          <div className="flex items-center gap-2 bg-[#111827] px-4 py-2 rounded-full border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm hidden sm:inline">Admin</span>
          </div>
        </div>

        {active === "dashboard" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {/* Total Sales - dynamic */}
              <div className="bg-[#111827] p-6 rounded-xl border border-gray-700 flex flex-col justify-between min-h-[200px]">
                <div>
                  <p className="text-gray-400 text-sm">Total Sales</p>
                  <h3 className="text-3xl font-bold mt-2">
                    ₹{dashStats.totalSales?.toLocaleString("en-IN")}
                  </h3>
                </div>
                <div className="mt-4 h-[80px]">
                  <MiniGraph data={dashStats.orderGraph} color="#3b82f6" />
                </div>
              </div>

              {/* Orders - dynamic */}
              <div className="bg-[#111827] p-6 rounded-xl border border-gray-700 flex flex-col justify-between min-h-[200px]">
                <div>
                  <p className="text-gray-400 text-sm">Orders</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {dashStats.totalOrders}
                  </h3>
                </div>
                <div className="mt-4 h-[80px]">
                  <MiniGraph data={dashStats.orderGraph} color="#f59e0b" />
                </div>
              </div>

              {/* Users - dynamic */}
              <div className="bg-[#111827] p-6 rounded-xl border border-gray-700 flex flex-col justify-between min-h-[200px]">
                <div>
                  <p className="text-gray-400 text-sm">Users</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {dashStats.totalUsers}
                  </h3>
                </div>
                <div className="mt-4 h-[80px]">
                  <MiniGraph data={dashStats.userGraph} color="#8b5cf6" />
                </div>
              </div>

              {/* Products - dynamic */}
              <div className="bg-[#111827] p-6 rounded-xl border border-gray-700 flex flex-col justify-between min-h-[200px]">
                <div>
                  <p className="text-gray-400 text-sm">Products</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {dashStats.totalProducts}
                  </h3>
                </div>
                <div className="mt-4 h-[80px]">
                  <MiniGraph data={dashStats.productGraph} color="#10b981" />
                </div>
              </div>
            </div>

            <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-gray-700 overflow-x-auto no-scrollbar">
              <h3 className="text-xl mb-4 font-semibold">Recent Orders</h3>

              <table className="w-full text-sm">
                <thead className="text-gray-400">
                  <tr className="border-b border-gray-800">
                    <th className="py-3 text-left">Order</th>
                    <th className="py-3 text-left">User</th>
                    <th className="py-3 text-right">Amount</th>
                    <th className="py-3 text-right hidden sm:table-cell">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashStats.recentOrders.map((o) => (
                    <tr
                      key={o._id}
                      className="border-t border-gray-800 hover:bg-white/5 transition">
                      <td className="py-3 text-left font-mono font-bold text-blue-400">
                        #{o._id.slice(-4).toUpperCase()}
                      </td>
                      <td className="py-3 text-left max-w-[100px] truncate">
                        {o.userId?.fullName || "Guest"}
                      </td>
                      <td className="py-3 text-right font-bold">
                        ₹{o.totalAmount}
                      </td>
                      <td className="py-3 text-right hidden sm:table-cell">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${o.orderStatus === "Delivered"
                              ? "text-green-400 bg-green-400/10"
                              : o.orderStatus === "Cancelled"
                                ? "text-red-400 bg-red-400/10"
                                : "text-yellow-400 bg-yellow-400/10"
                            }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {active === "products" && (
          <Section title="Products">
            <button
              onClick={() => {
                router.push("/add-products");
                setOpen(false);
              }}
              className="bg-blue-600 px-4 py-2 rounded mb-4"
              style={{ cursor: "pointer" }}>
              + Add Product
            </button>
            <p className="text-gray-400">Products list yaha ayegi</p>

            <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-gray-700 overflow-x-auto no-scrollbar">
              <h3 className="text-xl mb-4 font-semibold">Products List</h3>

              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 text-left">Product</th>
                    <th className="py-3 text-right">Price</th>
                    <th className="py-3 text-center hidden sm:table-cell">
                      Stock
                    </th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-gray-800 hover:bg-white/5 transition">
                      <td className="py-3 text-left max-w-[150px] truncate">
                        {product.title}
                      </td>
                      <td className="py-3 text-right">₹{product.price}</td>
                      <td className="py-3 text-center hidden sm:table-cell">
                        {product.stock}
                      </td>
                      <td className="py-3 text-right relative">
                        <div className="flex justify-end">
                          <BsThreeDotsVertical
                            className="cursor-pointer"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === product._id ? null : product._id,
                              )
                            }
                          />
                        </div>

                        {openMenuId === product._id && (
                          <div className="absolute bottom-10 right-0 w-32 bg-[#1f2937] border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <p
                              className="px-4 py-2 hover:bg-blue-600 cursor-pointer text-center text-sm font-medium"
                              onClick={() =>
                                router.push(`/edit-product/${product._id}`)
                              }>
                              Edit
                            </p>

                            <div className="border-t border-gray-600"></div>

                            <p
                              className="px-4 py-2 hover:bg-red-600 cursor-pointer text-center text-sm font-medium text-red-400 hover:text-white"
                              onClick={() => handleDelete(product._id)}>
                              Delete
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {active === "category" && (
          <Section title="Category">
            <button
              onClick={() => {
                router.push("/add-category");
                setOpen(false);
              }}
              className="bg-blue-600 px-4 py-2 rounded mb-4"
              style={{ cursor: "pointer" }}>
              + Add Category
            </button>
            <p className="text-gray-400">Category list yaha ayegi</p>

            <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-gray-700 overflow-x-auto no-scrollbar">
              <h3 className="text-xl mb-4 font-semibold">Category List</h3>

              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 text-left">Category</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-t border-gray-800 hover:bg-white/5 transition">
                      <td className="py-3 text-left font-medium">
                        {category.name}
                      </td>
                      <td className="py-3 text-right relative">
                        <div className="flex justify-end pr-2">
                          <BsThreeDotsVertical
                            className="cursor-pointer"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === category._id
                                  ? null
                                  : category._id,
                              )
                            }
                          />
                        </div>

                        {openMenuId === category._id && (
                          <div className="absolute bottom-10 right-0 w-32 bg-[#1f2937] border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <p
                              className="px-4 py-2 hover:bg-blue-600 cursor-pointer text-center text-sm font-medium"
                              onClick={() =>
                                router.push(`/edit-category/${category._id}`)
                              }>
                              Edit
                            </p>

                            <div className="border-t border-gray-600"></div>

                            <p
                              className="px-4 py-2 hover:bg-red-600 cursor-pointer text-center text-sm font-medium text-red-400 hover:text-white"
                              onClick={() =>
                                handleDeleteCategory(category._id)
                              }>
                              Delete
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {active === "orders" && (
          <Section title="All Orders">
            <div className="bg-[#111827] rounded-xl overflow-x-auto mt-4 border border-gray-700 no-scrollbar">
              <table className="w-full text-sm">
                <thead className="text-gray-400">
                  <tr className="border-b border-gray-800">
                    <th className="py-3 text-left px-4">Order Info</th>
                    <th className="py-3 text-center hidden sm:table-cell">
                      Items
                    </th>
                    <th className="py-3 text-right px-4">Total</th>
                    <th className="py-3 text-right px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashStats.recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-8 text-gray-500 italic">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    dashStats.recentOrders.map((o) => (
                      <tr
                        key={o._id}
                        className="border-t border-gray-800 hover:bg-white/5 transition">
                        <td className="py-4 px-4 text-left">
                          <p className="font-mono text-xs text-blue-400 font-bold">
                            #{o._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="font-medium text-sm truncate max-w-[120px]">
                            {o.userId?.fullName || "Guest"}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center hidden sm:table-cell text-xs text-gray-400">
                          {o.items.length} items
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-sm">
                          ₹{o.totalAmount}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${o.orderStatus === "Delivered"
                                ? "bg-green-400/20 text-green-400"
                                : o.orderStatus === "Cancelled"
                                  ? "bg-red-400/20 text-red-400"
                                  : "bg-blue-400/20 text-blue-400"
                              }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="p-4 text-center border-t border-gray-800 bg-white/5">
                <button
                  onClick={() => router.push("/admin-orders")}
                  className="text-blue-500 hover:text-blue-400 text-sm font-bold transition-colors">
                  Full Management View →
                </button>
              </div>
            </div>
          </Section>
        )}

        {active === "users" && (
          <Section title="User Management">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by Name or Email..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-80"
              />
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                Total:{" "}
                {
                  allUsers.filter(
                    (u) =>
                      u.fullName
                        ?.toLowerCase()
                        .includes(userSearchTerm.toLowerCase()) ||
                      u.email
                        ?.toLowerCase()
                        .includes(userSearchTerm.toLowerCase()),
                  ).length
                }{" "}
                Users Found
              </p>
            </div>
            <div className="bg-[#111827] rounded-xl overflow-x-auto border border-gray-700 no-scrollbar">
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 text-left px-4">Name</th>
                    <th className="py-3 text-left px-4 hidden sm:table-cell">
                      Email
                    </th>
                    <th className="py-3 text-center px-4">Role</th>
                    <th className="py-3 text-right px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-8 text-gray-500 italic">
                        Loading users...
                      </td>
                    </tr>
                  ) : (
                    allUsers
                      .filter(
                        (u) =>
                          (u.fullName || u.name || "")
                            .toLowerCase()
                            .includes(userSearchTerm.toLowerCase()) ||
                          u.email
                            .toLowerCase()
                            .includes(userSearchTerm.toLowerCase()),
                      )
                      .map((u) => (
                        <tr
                          key={u._id}
                          className="border-t border-gray-800 hover:bg-white/5 transition">
                          <td className="py-4 px-4 text-left">
                            <p className="font-medium text-sm">
                              {u.fullName || u.name || "N/A"}
                            </p>
                            <p className="text-[10px] text-gray-500 sm:hidden truncate max-w-[120px]">
                              {u.email}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-left text-gray-400 hidden sm:table-cell truncate max-w-[150px]">
                            {u.email}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end">
                              {u.role !== "admin" && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                                  title="Delete User">
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {active === "banners" && (
          <Section title="Manage Banners">
            <div className="mb-8 p-4 bg-[#1f2937] rounded-lg border border-gray-700">
              <h4 className="text-lg font-medium mb-4">Upload New Banner</h4>
              <form onSubmit={handleUploadBanner} className="flex flex-col gap-4 max-w-md">
                <input
                  type="text"
                  placeholder="Banner Title (Optional)"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="px-4 py-2 bg-[#111827] border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files[0])}
                  className="text-gray-300"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors w-fit"
                >
                  Upload Banner
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div key={banner._id} className="relative group bg-[#111827] border border-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={`http://localhost:8080${banner.image}`}
                    alt={banner.title || "Banner"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h5 className="font-medium text-white truncate">{banner.title || "Untitled Banner"}</h5>
                  </div>
                  <button
                    onClick={() => handleDeleteBanner(banner._id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Banner"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {banners.length === 0 && (
                <p className="text-gray-500 col-span-full text-center py-8">No banners uploaded yet.</p>
              )}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-[#111827] p-6 rounded-xl border border-gray-700">
      <h3 className="text-xl mb-4">{title}</h3>
      {children}
    </div>
  );
}

function MiniGraph({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#9ca3af" }}
        />
        <XAxis dataKey="day" hide />
        <Area
          type="monotone"
          dataKey="count"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SalesChart() {
  const data = [
    { day: "Mon", amount: 3000 },
    { day: "Tue", amount: 5000 },
    { day: "Wed", amount: 4000 },
    { day: "Thu", amount: 7000 },
    { day: "Fri", amount: 2000 },
    { day: "Sat", amount: 6000 },
    { day: "Sun", amount: 5500 },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#9ca3af" }}
        />
        <XAxis dataKey="day" hide />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#salesGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
