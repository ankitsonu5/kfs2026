"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { X, ImageIcon, Package } from "lucide-react";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
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
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
          {
            headers: { Authorization: token },
          },
        );
        if (res.data.success) {
          const p = res.data.product;
          setForm({
            title: p.title,
            price: p.price,
            description: p.description,
            category: p.category?.[0] || "",
            stock: p.stock,
            isTopSellingProducts: p.isTopSellingProducts || false,
            isDealsOfDay: p.isDealsOfDay || false,
            isRice: p.isRice || false,
            isAttaAndFlour: p.isAttaAndFlour || false,
            isDryFruites: p.isDryFruites || false,
            isDalAndPulses: p.isDalAndPulses || false,
            isMasala: p.isMasala || false,
            isNamkeenAndSnacks: p.isNamkeenAndSnacks || false,
          });
          if (p.images && p.images.length > 0) {
            setPreviews(
              p.images.map(
                (img) => `${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`,
              ),
            );
          }
        }
      } catch (error) {
        alert("Error loading product");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: { Authorization: token },
          },
        );
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) {
      fetchProduct();
      fetchCategories();
    }
  }, [id]);

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

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        alert("Product Updated Successfully");
        router.push("/admindashboard");
      } else {
        alert("Error: " + res.data.error);
      }
    } catch (error) {
      alert("Server Error: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1a2b] text-white flex items-center justify-center">
        <p className="text-xl">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1a2b] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-[#111827] p-6 md:p-8 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Product</h1>
          <button
            onClick={() => router.push("/admindashboard")}
            className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1 transition-colors cursor-pointer">
            ← Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Product Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter product title"
              className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-md 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="Enter price"
              className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-md 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Product description..."
              className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-md 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-md 
              text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Stock</label>
            <input
              type="text"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              placeholder="Enter stock"
              className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-md 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Homepage Section Flags */}
          <div className="space-y-3 bg-[#1f2937]/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">
              Homepage Display
            </h3>
            <div className="grid grid-cols-2 gap-3">
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
                  className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={flag.name}
                    checked={form[flag.name]}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-600 bg-[#111827] text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-300">{flag.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-3 font-semibold">
              Product Visuals
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="relative group aspect-square">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImage}
                  className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                />
                <div className="w-full h-full border-2 border-dashed border-gray-600 group-hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center transition-all bg-[#1f2937]/30">
                  <span className="text-gray-500 group-hover:text-blue-500 mb-1 text-2xl font-bold">
                    +
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    Add More
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
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold"
            style={{ cursor: "pointer" }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
