"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import {
  FaChevronLeft,
  FaFolderPlus,
  FaUpload,
  FaImage,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { MdOutlineCategory, MdToggleOn } from "react-icons/md";

export default function AddCategory() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    status: "active",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", form.title);
    formData.append("status", form.status);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add-category`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Category Added Successfully!");
      router.push("/admindashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1a2b] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-600/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
        {/* Back Button */}
        <button
          onClick={() => router.push("/admindashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 border border-white/10 transition-all">
            <FaChevronLeft size={12} />
          </div>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
          {/* Subtle Glow Header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-50"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FaFolderPlus size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Add Category
              </h1>
              <p className="text-gray-400 text-sm">
                Define a new niche for your products
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest ml-1">
                <MdOutlineCategory size={14} /> Category Name
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Traditional Wear"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl 
                text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest ml-1">
                <MdToggleOn size={14} /> Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl 
                text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer">
                <option value="active" className="bg-[#111827]">
                  Active
                </option>
                <option value="inactive" className="bg-[#111827]">
                  Inactive
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest ml-1">
                <FaImage size={14} /> Category Icon/Image
              </label>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative group w-full md:w-28 h-28">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    required
                    className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                  />
                  <div className="w-full h-full border-2 border-dashed border-white/10 group-hover:border-blue-500/50 rounded-2xl flex flex-col items-center justify-center transition-all bg-white/5">
                    <FaUpload
                      className="text-gray-500 group-hover:text-blue-400 mb-2"
                      size={20}
                    />
                    <span className="text-[9px] text-gray-500 font-bold group-hover:text-blue-400 transition-colors">
                      UPLOAD
                    </span>
                  </div>
                </div>

                {preview ? (
                  <div className="relative w-full md:w-28 h-28 rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FaImage className="text-white" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex flex-1 items-center gap-3 text-gray-600 italic text-sm">
                    <span className="p-3 bg-white/5 rounded-full">
                      <FaImage size={16} />
                    </span>
                    <span>Upload a visual for this category</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-700 cursor-not-allowed text-gray-500"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]"
              }`}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Category <FaFolderPlus />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-xs text-gray-500 font-medium">
          Make sure the category name is unique and descriptive.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-bottom {
          from { transform: translateY(20px); }
          to { transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out, slide-in-from-bottom 0.5s ease-out;
        }
      `,
        }}
      />
    </div>
  );
}
