"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Package,
  DollarSign,
  Type,
  Layers,
  Box,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

export default function AddProducts() {
  const [isMounted, setIsMounted] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    setIsMounted(true);
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/categories", {
          headers: { Authorization: token },
        });
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      formData.append("image", imageFile);
      const res = await axios.post(
        "http://localhost:8080/add-products",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        alert("Product Added Successfully");
        setForm({
          title: "",
          price: "",
          description: "",
          category: "",
          stock: "",
          image: "",
        });
        router.push("/admindashboard");
        setPreview(null);
        setImageFile(null);
      } else {
        alert("Error: " + res.data.error);
      }
    } catch (error) {
      alert("Server Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1a2b] text-white p-4 md:p-10 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-[#111827]/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="md:flex">
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 border-r border-gray-700/50 flex flex-col justify-between">
            <div>
              <button
                onClick={() => router.push("/admindashboard")}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 font-medium cursor-pointer">
                <ArrowLeft size={18} /> Back to Dashboard
              </button>
              <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fill in the details to list a new product in your marketplace.
                Ensure descriptions and images are high quality for better
                engagement.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center gap-3 text-gray-500 mb-4 opacity-50">
                <Box size={40} />
                <div className="h-0.5 flex-1 bg-gray-700"></div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                KFS Marketplace Admin Panel
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="md:w-2/3 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                    <Type size={16} className="text-blue-500" /> Product Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Premium Wireless Headphones"
                    className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                    <DollarSign size={16} className="text-green-500" /> Price
                    (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Layers size={16} className="text-purple-500" /> Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="" className="bg-[#111827]">
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                      className="bg-[#111827]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Package size={16} className="text-yellow-500" /> Stock
                  Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  Description
                </label>
                <textarea
                  rows="3"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the product features and specifications..."
                  className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Product Visuals
                </label>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="relative group w-full md:w-32 h-32">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                    />
                    <div className="w-full h-full border-2 border-dashed border-gray-600 group-hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center transition-all bg-[#1f2937]/30">
                      <Upload
                        className="text-gray-500 group-hover:text-blue-500 mb-1"
                        size={24}
                      />
                      <span className="text-[10px] text-gray-500 font-bold">
                        UPLOAD
                      </span>
                    </div>
                  </div>

                  {preview ? (
                    <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden border border-gray-700 shadow-xl group">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="text-white" size={20} />
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:flex flex-1 items-center gap-3 text-gray-600 italic text-sm">
                      <ImageIcon size={20} />
                      <span>No image selected yet</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer">
                Publish Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
