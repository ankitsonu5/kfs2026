"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-[#0b1a2b] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-[#111827] p-6 md:p-8 rounded-xl border border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Add Product</h1>

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

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-gray-300 bg-[#1f2937] border border-gray-600 
              rounded-md p-2 file:bg-blue-600 file:border-0 file:text-white 
              file:px-4 file:py-1 file:rounded"
              style={{ cursor: "pointer" }}
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-4 w-40 rounded-lg border border-gray-700"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold"
            style={{ cursor: "pointer" }}>
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
