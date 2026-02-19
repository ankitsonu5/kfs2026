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
  X,
  Image as ImageIcon,
} from "lucide-react";

export default function AddProducts() {
  const [isMounted, setIsMounted] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    isTopSellingProducts: false,
    isDealsOfDay: false,
    isRice: false,
    isAttaAndFlour: false,
    isDryFruites: false,
    isDalAndPulses: false,
    isMasala: false,
    isNamkeenAndSnacks: false,
  });

  useEffect(() => {
    setIsMounted(true);
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          { headers: { Authorization: token } },
        );
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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

      // Append Boolean Flags
      formData.append("isTopSellingProducts", form.isTopSellingProducts);
      formData.append("isDealsOfDay", form.isDealsOfDay);
      formData.append("isRice", form.isRice);
      formData.append("isAttaAndFlour", form.isAttaAndFlour);
      formData.append("isDryFruites", form.isDryFruites);
      formData.append("isDalAndPulses", form.isDalAndPulses);
      formData.append("isMasala", form.isMasala);
      formData.append("isNamkeenAndSnacks", form.isNamkeenAndSnacks);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-products`,
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
          isTopSellingProducts: false,
          isDealsOfDay: false,
          isRice: false,
          isAttaAndFlour: false,
          isDryFruites: false,
          isDalAndPulses: false,
          isMasala: false,
          isNamkeenAndSnacks: false,
        });
        router.push("/admindashboard");
        setPreviews([]);
        setImageFiles([]);
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

              {/* Homepage Section Flags */}
              <div className="space-y-4 bg-[#1f2937]/30 p-6 rounded-2xl border border-gray-700/50">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Display Settings (Homepage)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Top Selling", name: "isTopSellingProducts" },
                    { label: "Deals of Day", name: "isDealsOfDay" },
                    { label: "Rice", name: "isRice" },
                    { label: "Atta & Flour", name: "isAttaAndFlour" },
                    { label: "Dry Fruits", name: "isDryFruites" },
                    { label: "Dal & Pulses", name: "isDalAndPulses" },
                    { label: "Masala", name: "isMasala" },
                    { label: "Snacks", name: "isNamkeenAndSnacks" },
                  ].map((flag) => (
                    <label
                      key={flag.name}
                      className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name={flag.name}
                        checked={form[flag.name]}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-600 bg-[#111827] text-blue-600 focus:ring-blue-500/50 cursor-pointer"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {flag.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Product Visuals
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div className="relative group aspect-square">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImage}
                      className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                    />
                    <div className="w-full h-full border-2 border-dashed border-gray-600 group-hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center transition-all bg-[#1f2937]/30">
                      <Upload
                        className="text-gray-500 group-hover:text-blue-500 mb-1"
                        size={24}
                      />
                      <span className="text-[10px] text-gray-500 font-bold text-center px-2">
                        ADD IMAGES
                      </span>
                    </div>
                  </div>

                  {previews.map((src, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-gray-700 shadow-xl group">
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm z-20">
                          MAIN
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer">
                        <X size={12} />
                      </button>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <ImageIcon className="text-white" size={20} />
                      </div>
                    </div>
                  ))}

                  {previews.length === 0 && (
                    <div className="hidden md:flex items-center gap-3 text-gray-600 italic text-sm col-span-2">
                      <ImageIcon size={20} />
                      <span>Upload at least one image</span>
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
