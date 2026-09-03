"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  User,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  FolderTree,
  LogOut,
  Pencil,
  Trash2,
  Settings,
  UserCircle,
  MoreVertical,
  Plus,
  ArrowRight,
  MapPin,
  ImageIcon,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import axios from "axios";
import Image from "next/image";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-end items-center mt-6 gap-2 pb-2 px-6">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400 disabled:opacity-50 hover:bg-gray-800 hover:text-white transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="flex items-center gap-1 flex-wrap">
        {(() => {
          let start = Math.max(currentPage - 1, 1);
          let end = start + 2;
          if (end > totalPages) {
            end = totalPages;
            start = Math.max(end - 2, 1);
          }
          const pages = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
          return pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-400 border border-gray-600 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {page}
            </button>
          ));
        })()}
      </span>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 border border-gray-600 rounded-lg bg-transparent text-gray-400 disabled:opacity-50 hover:bg-gray-800 hover:text-white transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const ITEMS_PER_PAGE = 15;
  const [productsPage, setProductsPage] = useState(1);
  const [productSort, setProductSort] = useState("newest");
  const [ordersPage, setOrdersPage] = useState(1);
  const [orderSort, setOrderSort] = useState("newest");
  const [usersPage, setUsersPage] = useState(1);
  const [userSort, setUserSort] = useState("newest");
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [categorySort, setCategorySort] = useState("newest");
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

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
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    link: "",
    type: "hero",
    order: 0,
    image: null,
  });
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  
  const [areas, setAreas] = useState([]);
  const [showAreaForm, setShowAreaForm] = useState(false);
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [areaForm, setAreaForm] = useState({
    city: "",
    pincode: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            headers: { Authorization: token },
          },
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        headers: { Authorization: token },
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: { Authorization: token },
          },
        );
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const [range, setRange] = useState("7d");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard-stats?range=${range}`,
          {
            headers: { Authorization: token },
          },
        );
        if (res.data.success) {
          setDashStats(res.data);
        }
      } catch (error) {
        console.log("Dashboard stats error:", error);
      }
    };
    fetchStats();
  }, [range]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (active !== "users") return;
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/all-users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.data.success) {
          setAllUsers(res.data.users);
        }
      } catch (error) {
        console.log("Users fetch error:", error);
      }
    };
    fetchUsers();
  }, [active]);

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/delete-user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        setAllUsers(allUsers.filter((u) => u._id !== id));
      }
    } catch (error) {
      console.log("Delete user error:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          headers: { Authorization: token },
        },
      );

      setCategories(categories.filter((c) => c._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/banners`,
        );
        setBanners(response.data);
      } catch (error) {
        console.log("Fetch banners error:", error);
      }
    };
    fetchBanners();
  }, [active]);

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("title", bannerForm.title);
    formData.append("subtitle", bannerForm.subtitle);
    formData.append("buttonText", bannerForm.buttonText);
    formData.append("link", bannerForm.link);
    formData.append("type", bannerForm.type);
    formData.append("order", bannerForm.order);
    if (bannerForm.image && typeof bannerForm.image !== 'string') {
      formData.append("image", bannerForm.image);
    }

    try {
      if (editingBannerId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/banners/${editingBannerId}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/add-banner`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }
      setShowBannerForm(false);
      setEditingBannerId(null);
      setBannerForm({
        title: "",
        subtitle: "",
        buttonText: "",
        link: "",
        type: "hero",
        order: 0,
        image: null,
      });
      // Refresh banners
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/banners`,
      );
      setBanners(response.data);
    } catch (error) {
      console.log("Banner submit error:", error);
    }
  };

  const handleDeleteBanner = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        headers: { Authorization: token },
      });
      setBanners(banners.filter((b) => b._id !== id));
    } catch (error) {
      console.log("Delete banner error:", error);
    }
  };

  const handleToggleBanner = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/banners/${id}/toggle`,
        {},
        {
          headers: { Authorization: token },
        },
      );
      setBanners(
        banners.map((b) =>
          b._id === id
            ? { ...b, status: b.status === "active" ? "inactive" : "active" }
            : b,
        ),
      );
    } catch (error) {
      console.log("Toggle banner error:", error);
    }
  };

  useEffect(() => {
    const fetchAreas = async () => {
      if (active !== "areas") return;
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/service-areas-all`, {
          headers: { Authorization: token },
        });
        if (res.data.success) {
          setAreas(res.data.areas);
        }
      } catch (error) {
        console.log("Fetch areas error:", error);
      }
    };
    fetchAreas();
  }, [active]);

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      if (editingAreaId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/service-areas/${editingAreaId}`, areaForm, {
          headers: { Authorization: token },
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/service-areas`, areaForm, {
          headers: { Authorization: token },
        });
      }
      setShowAreaForm(false);
      setEditingAreaId(null);
      setAreaForm({ city: "", pincode: "", isActive: true });
      // Refresh
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/service-areas-all`, {
        headers: { Authorization: token },
      });
      setAreas(res.data.areas);
    } catch (error) {
      alert(error.response?.data?.message || "Error saving area");
    }
  };

  const handleDeleteArea = async (id) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/service-areas/${id}`, {
        headers: { Authorization: token },
      });
      setAreas(areas.filter(a => a._id !== id));
    } catch (error) {
      console.log("Delete area error:", error);
    }
  };

  const handleToggleArea = async (id, currentStatus) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/service-areas/${id}`, { isActive: !currentStatus }, {
        headers: { Authorization: token },
      });
      setAreas(areas.map(a => a._id === id ? { ...a, isActive: !currentStatus } : a));
    } catch (error) {
      console.log("Toggle area error:", error);
    }
  };

  // Pagination & Sorting Logic
  
  // Products
  let sortedProducts = [...products];
  if (productSearchTerm) {
    sortedProducts = sortedProducts.filter(p => (p.title || "").toLowerCase().includes(productSearchTerm.toLowerCase()));
  }
  if (productCategoryFilter !== "all") {
    sortedProducts = sortedProducts.filter(p => {
      if (Array.isArray(p.category) && p.category.length > 0 && typeof p.category[0] === 'object') {
        return p.category.some(c => c._id === productCategoryFilter);
      }
      if (Array.isArray(p.category)) {
        return p.category.includes(productCategoryFilter);
      }
      return p.category === productCategoryFilter || p.category?._id === productCategoryFilter;
    });
  }

  if (productSort === "price-low") sortedProducts.sort((a, b) => a.price - b.price);
  else if (productSort === "price-high") sortedProducts.sort((a, b) => b.price - a.price);
  else if (productSort === "name-az") sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  else sortedProducts.reverse(); // newest
  
  const totalProductPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((productsPage - 1) * ITEMS_PER_PAGE, productsPage * ITEMS_PER_PAGE);

  // Orders
  let sortedOrders = dashStats.recentOrders ? [...dashStats.recentOrders] : [];
  if (orderSearchTerm) {
    sortedOrders = sortedOrders.filter(o => 
      (o._id || "").toLowerCase().includes(orderSearchTerm.toLowerCase()) || 
      (o.userId?.fullName || "").toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (o.userId?.email || "").toLowerCase().includes(orderSearchTerm.toLowerCase())
    );
  }
  if (orderSort === "amount-high") sortedOrders.sort((a, b) => b.totalAmount - a.totalAmount);
  else if (orderSort === "amount-low") sortedOrders.sort((a, b) => a.totalAmount - b.totalAmount);
  else if (orderSort === "status") sortedOrders.sort((a, b) => a.status.localeCompare(b.status));
  else sortedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const totalOrderPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice((ordersPage - 1) * ITEMS_PER_PAGE, ordersPage * ITEMS_PER_PAGE);

  // Users
  let sortedUsers = allUsers ? [...allUsers] : [];
  if (userSearchTerm) {
    sortedUsers = sortedUsers.filter(u => (u.fullName || u.name || "")?.toLowerCase().includes(userSearchTerm.toLowerCase()) || u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()));
  }
  if (userSort === "name-az") sortedUsers.sort((a, b) => (a.fullName || a.name || "").localeCompare(b.fullName || b.name || ""));
  else sortedUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const totalUserPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = sortedUsers.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE);

  // Categories
  let sortedCategories = [...categories];
  if (categorySearchTerm) {
    sortedCategories = sortedCategories.filter(c => (c.name || "").toLowerCase().includes(categorySearchTerm.toLowerCase()));
  }
  if (categorySort === "newest") sortedCategories.reverse();
  else sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
  
  const totalCategoryPages = Math.ceil(sortedCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = sortedCategories.slice((categoriesPage - 1) * ITEMS_PER_PAGE, categoriesPage * ITEMS_PER_PAGE);


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
        className={`fixed top-0 left-0 h-screen w-64 bg-[#111827] p-5 border-r border-gray-700 z-50 flex flex-col justify-between transform transition-transform duration-300 overflow-y-auto no-scrollbar
      ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-700/50">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <User size={20} />
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-white">Admin Panel</p>
              <p className="text-[10px] text-gray-500 truncate italic">admin@kfs.com</p>
            </div>
          </div>

          <ul className="space-y-4">
            <li
              onClick={() => {
                setActive("dashboard");
                setOpen(false);
              }}
              className={`cursor-pointer flex items-center gap-3 py-2 px-3 rounded-lg transition ${active === "dashboard" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <LayoutDashboard size={20} /> Dashboard
            </li>
            <li
              onClick={() => {
                setActive("products");
                setOpen(false);
              }}
              className={`cursor-pointer flex items-center gap-3 py-2 px-3 rounded-lg transition ${active === "products" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <ShoppingBag size={20} /> Products
            </li>
            <li
              onClick={() => {
                setActive("orders");
                setOpen(false);
              }}
              className={`cursor-pointer flex items-center gap-3 py-2 px-3 rounded-lg transition ${active === "orders" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Package size={20} /> Orders
            </li>
            <li
              onClick={() => {
                setActive("users");
                setOpen(false);
              }}
              className={`cursor-pointer flex items-center gap-3 py-2 px-3 rounded-lg transition ${active === "users" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Users size={20} /> Users
            </li>
            
            <li
              onClick={() => {
                router.push("/messages");
              }}
              className="cursor-pointer flex items-center gap-3 py-2 px-3 rounded-lg transition text-gray-400 hover:text-white hover:bg-white/5">
              <MessageSquare size={20} /> Messages
            </li>

            <li className="cursor-pointer">
              <div
                className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
                onClick={() => setMasterSetupOpen(!masterSetupOpen)}>
                <Settings size={20} />
                <span className="text-sm font-medium flex-1">Master Setup</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className={`ml-1 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    masterSetupOpen ? "rotate-180" : ""
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
                    Products
                  </li> */}
                  <li
                    className={`text-sm py-1.5 px-3 rounded-md transition flex items-center gap-2 ${active === "category" ? "text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                    onClick={() => {
                      setActive("category");
                      setOpen(false);
                    }}>
                    <FolderTree size={16} /> Category
                  </li>
                  <li
                    className={`text-sm py-1.5 px-3 rounded-md transition flex items-center gap-2 ${active === "banners" ? "text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                    onClick={() => {
                      setActive("banners");
                      setOpen(false);
                    }}>
                    <ImageIcon size={16} /> Banners
                  </li>
                  <li
                    className={`text-sm py-1.5 px-3 rounded-md transition flex items-center gap-2 ${active === "areas" ? "text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                    onClick={() => {
                      setActive("areas");
                      setOpen(false);
                    }}>
                    <MapPin size={16} /> Service Areas
                  </li>
                  <li
                    className={`text-sm py-1.5 px-3 rounded-md transition flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5`}
                    onClick={() => {
                      router.push("/about-cms");
                    }}>
                    <Settings size={16} /> About Us CMS
                  </li>
                  {/* <li
                    className="text-sm text-gray-300 hover:text-blue-400 cursor-pointer py-1"
                    onClick={() => {
                      setActive("orders");
                      setOpen(false);
                    }}>
                    Orders
                  </li> */}
                  {/* <li
                    className="text-sm text-gray-300 hover:text-blue-400 cursor-pointer py-1"
                    onClick={() => {
                      setActive("users");
                      setOpen(false);
                    }}>
                    Users
                  </li> */}
                </ul>
              )}
            </li>
            <li
              onClick={() => {
                router.push("/admin-profile");
                setOpen(false);
              }}
              className="cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition flex items-center gap-3">
              <UserCircle size={20} />
              Profile
            </li>
            <li
              onClick={() => {
                router.push("/admin-settings");
                setOpen(false);
              }}
              className="cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition flex items-center gap-3">
              <Settings size={20} />
              Settings
            </li>
            <li
              onClick={() => {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminRole");
                document.cookie =
                  "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie =
                  "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                router.push("/admin-login");
                setOpen(false);
              }}
              className="cursor-pointer text-gray-400 hover:text-red-400 hover:bg-white/5 py-2 px-3 rounded-lg transition flex items-center gap-3">
              <LogOut size={20} /> Logout
            </li>
          </ul>
        </div>

      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}></div>
      )}

      <div className="flex-1 md:ml-64 p-4 md:p-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3 bg-[#111827]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-700 shadow-2xl self-start">
            <button
              className="md:hidden bg-gray-800/50 p-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/40">
              <User size={22} className="text-white" />
            </div>
            <div className="h-6 w-px bg-gray-700 mx-1 hidden md:block"></div>
            <h2 className="text-xl md:text-2xl font-black capitalize tracking-tight text-white mb-0">
              {active}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {active === "dashboard" && (
              <div className="flex bg-[#111827] p-1 rounded-xl border border-gray-700 shadow-sm">
                {[
                  { label: "Today", value: "1d" },
                  { label: "7 Days", value: "7d" },
                  { label: "30 Days", value: "30d" },
                  { label: "All Time", value: "any" },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRange(r.value)}
                    className={`px-3 md:px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      range === r.value
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-400 hover:text-white"
                    }`}>
                    {r.label}
                  </button>
                ))}
              </div>
            )}
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
                    <th className="py-3 text-left px-2 md:px-4">Order</th>
                    <th className="py-3 text-left px-2 md:px-4">User</th>
                    <th className="py-3 text-right px-2 md:px-4">Amount</th>
                    <th className="py-3 text-right hidden md:table-cell">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashStats.recentOrders.map((o) => (
                    <tr
                      key={o._id}
                      className="border-t border-gray-800 hover:bg-white/5 transition">
                      <td className="py-3 px-2 md:px-4 text-left font-mono font-bold text-blue-400 text-xs">
                        #{o._id.slice(-4).toUpperCase()}
                      </td>
                      <td className="py-3 px-2 md:px-4 text-left max-w-[100px] md:max-w-[150px]">
                        <p className="truncate text-xs md:text-sm">
                          {o.userId?.fullName || "Guest"}
                        </p>
                        <p className="text-[9px] md:text-[10px] text-gray-500 truncate">
                          {o.userId?.email || ""}
                        </p>
                      </td>
                      <td className="py-3 px-2 md:px-4 text-right font-bold text-xs md:text-sm">
                        ₹{parseFloat(Number(o.totalAmount).toFixed(2))}
                      </td>
                      <td className="py-3 text-right hidden md:table-cell">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            o.orderStatus === "Delivered"
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
              <PaginationControls currentPage={ordersPage} totalPages={totalOrderPages} onPageChange={setOrdersPage} />
            </div>
          </>
        )}

        {active === "products" && (
          <Section 
            title="Product Management"
            action={
              <button
                onClick={() => {
                  router.push("/add-products");
                  setOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-95 cursor-pointer text-sm">
                <Plus size={18} /> Add Product
              </button>
            }
          >
            <div className="mb-6">
              <p className="text-gray-400 text-xs md:text-sm mb-4">
                Manage your store&apos;s inventory and products
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={productSearchTerm} 
                  onChange={(e) => setProductSearchTerm(e.target.value)} 
                  className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-300 w-full sm:w-48 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <select 
                  value={productCategoryFilter} 
                  onChange={(e) => setProductCategoryFilter(e.target.value)} 
                  className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-300 w-fit focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <select value={productSort} onChange={(e) => setProductSort(e.target.value)} className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-300 w-fit focus:outline-none focus:border-blue-500 transition-colors cursor-pointer">
                  <option value="newest">Newest</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="name-az">Name (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="bg-[#111827] rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-sm">
                  <thead className="text-gray-400 bg-white/5 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-4 text-left px-3 md:px-6">
                        Product
                      </th>
                      <th className="py-4 text-right px-3 md:px-6">Price</th>
                      <th className="py-4 text-center px-6 hidden md:table-cell">
                        Stock
                      </th>
                      <th className="py-4 text-right px-3 md:px-6">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-800">
                    {products.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-12 text-center text-gray-500 italic">
                          No products found. Start by adding one!
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-white/[0.03] transition-colors group">
                          <td className="py-4 px-3 md:px-6 text-left">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 group-hover:border-blue-500/50 transition-colors flex-shrink-0">
                                {product.images && product.images.length > 0 ? (
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.images[0]}`}
                                    alt={product.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="w-6 h-6 text-gray-500" />
                                )}
                              </div>
                              <div className="max-w-[120px] md:max-w-[180px]">
                                <p className="font-bold text-gray-100 truncate text-xs md:text-sm group-hover:text-blue-400 transition-colors">
                                  {product.title}
                                </p>
                                <p className="text-[9px] md:text-[10px] text-gray-500 font-mono">
                                  {product._id.slice(-6).toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3 md:px-6 text-right font-bold text-gray-100 italic text-xs md:text-sm">
                            ₹{product.price.toLocaleString("en-IN")}
                          </td>
                          <td className="py-4 px-6 text-center hidden md:table-cell">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                product.stock > 10
                                  ? "bg-green-500/10 text-green-500"
                                  : product.stock > 0
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-red-500/10 text-red-500"
                              }`}>
                              {product.stock > 0
                                ? `${product.stock} IN STOCK`
                                : "OUT OF STOCK"}
                            </span>
                          </td>
                          <td className="py-4 px-3 md:px-6 text-right relative">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === product._id
                                      ? null
                                      : product._id,
                                  )
                                }
                                className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                                <MoreVertical />
                              </button>
                            </div>

                            {openMenuId === product._id && (
                              <div className="absolute top-0 right-10 md:right-16 w-32 md:w-36 bg-[#1f2937] border border-gray-700 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-right-1 duration-200">
                                <button
                                  className="w-full px-4 py-2.5 hover:bg-blue-600 flex items-center gap-3 text-left text-xs font-semibold cursor-pointer"
                                  onClick={() =>
                                    router.push(`/edit-product/${product._id}`)
                                  }>
                                  <Pencil size={14} /> Edit
                                </button>
                                <div className="border-t border-gray-700"></div>
                                <button
                                  className="w-full px-4 py-2.5 hover:bg-red-600 flex items-center gap-3 text-left text-xs font-semibold text-red-400 hover:text-white cursor-pointer"
                                  onClick={() => handleDelete(product._id)}>
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationControls currentPage={productsPage} totalPages={totalProductPages} onPageChange={setProductsPage} />
            </div>
          </Section>
        )}

        {active === "category" && (
          <Section title="Category Management">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="flex flex-col gap-3">
                <p className="text-gray-400 text-xs md:text-sm">
                  Organize products into distinct collections
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Search categories..." 
                    value={categorySearchTerm} 
                    onChange={(e) => { setCategorySearchTerm(e.target.value); setCategoriesPage(1); }} 
                    className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-300 w-full sm:w-48 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <select value={categorySort} onChange={(e) => setCategorySort(e.target.value)} className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-300 w-fit focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer">
                    <option value="newest">Newest</option>
                    <option value="name-az">Name (A-Z)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  router.push("/add-category");
                  setOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 text-sm cursor-pointer"
               >
                <Plus size={18} /> Add Category
              </button>
            </div>

            <div className="bg-[#111827] rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-sm">
                  <thead className="text-gray-400 bg-white/5 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-4 text-left px-3 md:px-6">Collection</th>
                      <th className="py-4 text-center px-4 hidden md:table-cell">Visibility</th>
                      <th className="py-4 text-right px-3 md:px-6">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-800">
                    {categories.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-12 text-center text-gray-500 italic">
                          No categories found. Start organizing your shop!
                        </td>
                      </tr>
                    ) : (
                      paginatedCategories.map((category) => (
                         <tr
                          key={category._id}
                          className="hover:bg-white/[0.03] transition-colors group">
                          <td className="py-4 px-3 md:px-6 text-left">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 group-hover:border-emerald-500/50 transition-colors flex-shrink-0">
                                {category.image ? (
                                  <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/categories/${category.image}`}
                                    alt={category.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <FolderTree
                                    className="text-gray-600"
                                    size={18}
                                  />
                                )}
                              </div>
                              <span className="font-bold text-gray-100 group-hover:text-emerald-400 transition-colors text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                                {category.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center hidden md:table-cell">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                category.status === "active"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}>
                              {category.status || "active"}
                            </span>
                          </td>
                          <td className="py-4 px-3 md:px-6 text-right relative">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === category._id
                                      ? null
                                      : category._id,
                                  )
                                }
                                className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                                <MoreVertical />
                              </button>
                            </div>

                            {openMenuId === category._id && (
                              <div className="absolute top-0 right-10 md:right-16 w-36 bg-[#1f2937] border border-gray-700 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-right-1 duration-200">
                                <button
                                  className="w-full px-4 py-2.5 hover:bg-blue-600 flex items-center gap-3 text-left text-xs font-semibold"
                                  onClick={() =>
                                    router.push(
                                      `/edit-category/${category._id}`,
                                    )
                                  }>
                                  <Pencil size={14} /> Edit
                                </button>
                                <div className="border-t border-gray-700"></div>
                                <button
                                  className="w-full px-4 py-2.5 hover:bg-red-600 flex items-center gap-3 text-left text-xs font-semibold text-red-400 hover:text-white"
                                  onClick={() =>
                                    handleDeleteCategory(category._id)
                                  }>
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationControls currentPage={categoriesPage} totalPages={totalCategoryPages} onPageChange={setCategoriesPage} />
            </div>
          </Section>
        )}

        {active === "orders" && (
          <Section title="All Orders">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={orderSearchTerm} 
                onChange={(e) => { setOrderSearchTerm(e.target.value); setOrdersPage(1); }} 
                className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-300 w-full sm:w-64 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <select value={orderSort} onChange={(e) => setOrderSort(e.target.value)} className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-300 w-fit focus:outline-none focus:border-blue-500 transition-colors cursor-pointer">
                <option value="newest">Newest</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
                <option value="status">Status</option>
              </select>
            </div>
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
                    paginatedOrders.map((o) => (
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
                          <p className="text-[10px] text-gray-500 truncate max-w-[120px]">
                            {o.userId?.email || ""}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center hidden sm:table-cell text-xs text-gray-400">
                          {o.items.length} items
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-sm">
                          ₹{parseFloat(Number(o.totalAmount).toFixed(2))}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              o.orderStatus === "Delivered"
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
                <PaginationControls currentPage={ordersPage} totalPages={totalOrderPages} onPageChange={setOrdersPage} />
              <div className="p-4 text-center border-t border-gray-800 bg-white/5">
                <button
                  onClick={() => router.push("/admin-orders")}
                  className="text-blue-500 hover:text-blue-400 text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  Full Management View <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </Section>
        )}

        {active === "banners" && (
          <Section title="Homepage Banner Management">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <p className="text-gray-400 text-sm">
                Manage dynamic banners for your homepage
              </p>
              <button
                onClick={() => {
                  setEditingBannerId(null);
                  setBannerForm({
                    title: "",
                    subtitle: "",
                    buttonText: "",
                    link: "",
                    type: "hero",
                    order: 0,
                    image: null,
                  });
                  setShowBannerForm(true);
                }}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer text-sm">
                <Plus size={18} /> Add Banner
              </button>
            </div>

            {showBannerForm && (
              <div className="bg-white/5 border border-gray-700 rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <h4 className="text-lg font-bold mb-4 text-blue-400">
                  {editingBannerId ? "Edit Banner" : "New Banner"}
                </h4>
                <form
                  onSubmit={handleBannerSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Banner Title
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerForm.title}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, title: e.target.value })
                      }
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Fresh Groceries"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={bannerForm.subtitle}
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Up to 50% Off"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={bannerForm.buttonText || ""}
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          buttonText: e.target.value,
                        })
                      }
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Shop Now"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Target Link
                    </label>
                    <input
                      type="text"
                      value={bannerForm.link}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, link: e.target.value })
                      }
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. /shop"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Banner Type
                    </label>
                    <select
                      value={bannerForm.type}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, type: e.target.value })
                      }
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="hero">Hero Slider (Top)</option>
                      <option value="secondary">Secondary Banner (Middle)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={bannerForm.order}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, order: e.target.value })
                      }
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Banner Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          image: e.target.files[0],
                        })
                      }
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 file:bg-blue-600 file:border-none file:px-3 file:py-1 file:rounded file:text-white file:text-xs file:font-bold file:mr-4 file:cursor-pointer"
                    />
                    {bannerForm.image && (
                      <div className="mt-2">
                        <img 
                          src={typeof bannerForm.image === 'string' ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${bannerForm.image}` : URL.createObjectURL(bannerForm.image)} 
                          alt="Banner Preview" 
                          className="h-24 w-auto object-cover rounded-lg border border-gray-700 shadow-md"
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowBannerForm(false)}
                      className="px-6 py-2 rounded-lg border border-gray-700 text-sm font-bold hover:bg-white/5 cursor-pointer">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold shadow-lg shadow-blue-600/20 cursor-pointer">
                      {editingBannerId ? "Update Banner" : "Publish Banner"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {banners.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500 italic">
                  No banners found. Add your first promotional banner!
                </div>
              ) : (
                banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="bg-[#111827] border border-gray-700 rounded-xl md:rounded-2xl overflow-hidden group hover:border-blue-500 transition-all shadow-xl">
                    <div className="relative aspect-video bg-gray-900 border-b border-gray-800 flex items-center justify-center overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/banners/${banner.image}`}
                        alt={banner.title}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${banner.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {banner.status}
                        </span>
                        {banner.order > 0 && (
                          <span className="bg-blue-600 text-white min-w-[20px] h-5 flex items-center justify-center rounded text-[10px] font-bold">
                            #{banner.order}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="font-bold text-gray-100 line-clamp-1">
                        {banner.title}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
                        {banner.subtitle || "No subtitle"}
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-5 pt-4 border-t border-gray-800 gap-3">
                        <div className="flex justify-center sm:justify-start gap-2">
                          <button
                            onClick={() => {
                              setEditingBannerId(banner._id);
                              setBannerForm({
                                title: banner.title,
                                subtitle: banner.subtitle || "",
                                buttonText: banner.buttonText || "",
                                link: banner.link || "",
                                type: banner.type || "hero",
                                order: banner.order,
                                image: banner.image || null,
                              });
                              setShowBannerForm(true);
                            }}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all cursor-pointer flex-1 sm:flex-none flex items-center justify-center"
                            title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner._id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer flex-1 sm:flex-none flex items-center justify-center"
                            title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleToggleBanner(banner._id)}
                          className={`w-full sm:w-auto px-4 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${banner.status === "active" ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white" : "bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white"}`}>
                          {banner.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Section>
        )}

        {active === "users" && (
          <Section title="User Management">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search by Name or Email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-80"
                />
                <select value={userSort} onChange={(e) => setUserSort(e.target.value)} className="bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold text-gray-300 w-full md:w-fit focus:outline-none focus:border-blue-500 transition-colors cursor-pointer">
                  <option value="newest">Newest</option>
                  <option value="name-az">Name (A-Z)</option>
                </select>
              </div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                Total:{" "}
                {sortedUsers.length}{" "}
                Users Found
              </p>
            </div>
            <div className="bg-[#111827] rounded-xl overflow-x-auto border border-gray-700 no-scrollbar">
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3 text-left px-2 md:px-4">Name</th>
                    <th className="py-3 text-left px-2 md:px-4 hidden md:table-cell">
                      Email
                    </th>
                    <th className="py-3 text-center px-2 md:px-4">Role</th>
                    <th className="py-3 text-right px-2 md:px-4">Actions</th>
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
                    paginatedUsers.map((u) => (
                        <tr
                          key={u._id}
                          className="border-t border-gray-800 hover:bg-white/5 transition">
                          <td className="py-4 px-2 md:px-4 text-left">
                            <p className="font-medium text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                              {u.fullName || u.name || "N/A"}
                            </p>
                            <p className="text-[9px] md:text-[10px] text-gray-500 md:hidden truncate max-w-[80px]">
                              {u.email}
                            </p>
                          </td>
                          <td className="py-4 px-2 md:px-4 text-left text-gray-400 hidden md:table-cell truncate max-w-[150px]">
                            {u.email}
                          </td>
                          <td className="py-4 px-2 md:px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold uppercase ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-2 md:px-4 text-right">
                            <div className="flex justify-end">
                              {u.role !== "admin" && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                                  title="Delete User">
                                  <Trash2 size={16} />
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
              <PaginationControls currentPage={usersPage} totalPages={totalUserPages} onPageChange={setUsersPage} />
            </Section>
        )}

        {active === "areas" && (
          <Section title="Service Area Management">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <p className="text-gray-400 text-sm">
                Control delivery availability by City or specific Pincode. (Leave pincode blank to enable entire city)
              </p>
              <button
                onClick={() => {
                  setEditingAreaId(null);
                  setAreaForm({ city: "", pincode: "", isActive: true });
                  setShowAreaForm(true);
                }}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer text-sm">
                <Plus size={18} /> Add New Area
              </button>
            </div>

            {showAreaForm && (
              <div className="bg-white/5 border border-gray-700 rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <h4 className="text-lg font-bold mb-4 text-blue-400">
                  {editingAreaId ? "Edit Service Area" : "New Service Area"}
                </h4>
                <form onSubmit={handleAreaSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">City Name *</label>
                    <input
                      type="text" required
                      value={areaForm.city}
                      onChange={(e) => setAreaForm({ ...areaForm, city: e.target.value })}
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. New Delhi or Patna"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode (Optional)</label>
                    <input
                      type="text"
                      value={areaForm.pincode}
                      onChange={(e) => setAreaForm({ ...areaForm, pincode: e.target.value })}
                      className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 110001 (Leave empty for entire city)"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAreaForm(false)}
                      className="px-6 py-2 rounded-lg border border-gray-700 text-sm font-bold hover:bg-white/5 cursor-pointer">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold shadow-lg shadow-blue-600/20 cursor-pointer">
                      {editingAreaId ? "Update Area" : "Save Area"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-[#111827] rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-sm">
                  <thead className="text-gray-400 bg-white/5 uppercase tracking-wider text-[11px] font-bold">
                    <tr>
                      <th className="py-4 text-left px-3 md:px-6">Location (City & Pincode)</th>
                      <th className="py-4 text-center px-2 md:px-6">Status</th>
                      <th className="py-4 text-right px-3 md:px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {areas.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-12 text-center text-gray-500 italic">No service areas found.</td>
                      </tr>
                    ) : (
                      areas.map((area) => (
                        <tr key={area._id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="py-4 px-3 md:px-6 text-left">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                <MapPin size={16} className="md:w-5 md:h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-100 text-xs md:text-sm">
                                  {area.pincode ? area.pincode : <span className="text-emerald-400 font-normal">Entire City (All Pincodes)</span>}
                                </p>
                                <p className="text-[10px] md:text-xs text-gray-400 font-medium truncate">{area.city}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 md:px-6 text-center">
                            <button 
                              onClick={() => handleToggleArea(area._id, area.isActive)}
                              className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase transition-colors ${area.isActive ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}`}>
                              {area.isActive ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="py-4 px-3 md:px-6 text-right relative">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === area._id
                                      ? null
                                      : area._id,
                                  )
                                }
                                className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white">
                                <MoreVertical size={20} />
                              </button>
                            </div>

                            {openMenuId === area._id && (
                              <div className="absolute top-0 right-10 md:right-16 w-36 bg-[#1f2937] border border-gray-700 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-right-1 duration-200">
                                <button
                                  className="w-full px-4 py-2.5 hover:bg-blue-600 flex items-center gap-3 text-left text-xs font-semibold cursor-pointer"
                                  onClick={() => {
                                    setEditingAreaId(area._id);
                                    setAreaForm({ city: area.city, pincode: area.pincode, isActive: area.isActive });
                                    setShowAreaForm(true);
                                    setOpenMenuId(null);
                                  }}>
                                  <Pencil size={14} /> Edit
                                </button>
                                <div className="border-t border-gray-700"></div>
                                <button
                                  className="w-full px-4 py-2.5 hover:bg-red-600 flex items-center gap-3 text-left text-xs font-semibold text-red-400 hover:text-white cursor-pointer"
                                  onClick={() => {
                                    handleDeleteArea(area._id);
                                    setOpenMenuId(null);
                                  }}>
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, action, children }) {
  return (
    <div className="bg-[#111827] p-4 md:p-6 rounded-xl border border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center gap-4 mb-4">
        {title && <h3 className="text-lg md:text-xl font-semibold m-0">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
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