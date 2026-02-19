"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaChevronLeft, FaSave, FaImage, FaUpload } from "react-icons/fa";
import { MdOutlineCategory, MdToggleOn } from "react-icons/md";

export default function EditCategory() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    status: "active",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
          {
            headers: { Authorization: token },
          },
        );
        if (res.data) {
          setForm({
            title: res.data.name,
            status: res.data.status || "active",
          });
          if (res.data.image) {
            setPreview(
              `${process.env.NEXT_PUBLIC_API_URL}/uploads/${res.data.image}`,
            );
          }
        }
      } catch (error) {
        alert("Error loading category");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

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
      formData.append("name", form.title);
      formData.append("status", form.status);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Category Updated Successfully");
      router.push("/admindashboard");
    } catch (error) {
      alert("Server Error: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1a2b] text-white flex items-center justify-center">
        <p className="text-xl">Loading category...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1a2b] text-white p-6 md:p-10 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#111827] p-8 md:p-10 rounded-3xl border border-gray-700 shadow-2xl relative overflow-hidden">
        {/* Back Button */}
        <button
          onClick={() => router.push("/admindashboard")}
          className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors">
          <FaChevronLeft size={20} />
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <MdOutlineCategory size={32} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Edit Category
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Update collection details and visibility
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest ml-1">
              Category Name
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter category name"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl 
              text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
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
              <FaImage size={14} /> Category Image
            </label>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative group w-full md:w-24 h-24">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                />
                <div className="w-full h-full border-2 border-dashed border-white/10 group-hover:border-blue-500/50 rounded-2xl flex flex-col items-center justify-center transition-all bg-white/5">
                  <FaUpload
                    className="text-gray-500 group-hover:text-blue-400 mb-1"
                    size={16}
                  />
                  <span className="text-[8px] text-gray-500 font-bold">
                    CHANGE
                  </span>
                </div>
              </div>

              {preview && (
                <div className="relative w-full md:w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer">
            <FaSave /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
