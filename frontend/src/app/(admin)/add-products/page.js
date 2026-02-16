"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoBagAddOutline } from "react-icons/io5";

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
    stock: 0,
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
          stock: 0,
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

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 p-6 md:p-10 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/admindashboard")}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-all duration-300 text-slate-400 hover:text-blue-400"
            style={{ cursor: "pointer" }}>
            <IoArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3 bg-blue-500/10 px-4 py-2 rounded-2xl border border-blue-500/20">
            <IoBagAddOutline className="text-2xl text-blue-400" />
            <span className="font-semibold text-blue-400 tracking-wide uppercase text-xs">
              Inventory Panel
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />

              <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
                Add New <span className="text-blue-500">Product</span>
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Organic Avocados"
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    placeholder="Provide a detailed description of the product..."
                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                      <option value="" className="bg-slate-900">
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option
                          key={cat._id}
                          value={cat._id}
                          className="bg-slate-900">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">
                      Stock Availability
                    </label>
                    <select
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                      {[0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 100].map(
                        (num) => (
                          <option
                            key={num}
                            value={num}
                            className="bg-slate-900">
                            {num === 0 ? "0 (Out of Stock)" : `${num} Units`}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300 mt-4 active:scale-95"
                  style={{ cursor: "pointer" }}>
                  Create Product
                </button>
              </form>
            </div>
          </div>

          {/* Image Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl h-full flex flex-col items-center justify-center relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

              <h3 className="text-lg font-semibold mb-6 text-slate-200">
                Product Image
              </h3>

              <div className="w-full aspect-square bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 relative group/img overflow-hidden">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-bold">
                        Change Image
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl text-blue-400">🖼️</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      Click to upload product photo
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
              </div>

              <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl w-full">
                <p className="text-xs text-blue-300 leading-relaxed text-center italic">
                  "Quality images increase conversion rates. Use high-resolution
                  photos for best results."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
