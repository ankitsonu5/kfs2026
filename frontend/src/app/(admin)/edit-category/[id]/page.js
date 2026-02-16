"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditCategory() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080/categories/${id}`, {
          headers: { Authorization: token },
        });
        setForm({ title: res.data.name });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:8080/categories/${id}`,
        { name: form.title },
        {
          headers: { Authorization: token },
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
    <div className="min-h-screen bg-[#0b1a2b] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-[#111827] p-6 md:p-8 rounded-xl border border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Edit Category</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter category name"
              className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-md 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
