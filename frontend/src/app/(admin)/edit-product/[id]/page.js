"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080/products/${id}`, {
          headers: { Authorization: token },
        });
        if (res.data.success) {
          const p = res.data.product;
          setForm({
            title: p.title,
            price: p.price,
            description: p.description,
            category: p.category?.[0] || "",
            stock: p.stock,
          });
          if (p.image) {
            setPreview(`http://localhost:8080/uploads/${p.image}`);
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
        const res = await axios.get("http://localhost:8080/categories", {
          headers: { Authorization: token },
        });
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
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.put(
        `http://localhost:8080/products/${id}`,
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Product</h1>

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
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
