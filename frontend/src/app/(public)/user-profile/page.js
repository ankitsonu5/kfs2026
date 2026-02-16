"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState({ fullName: "", email: "", role: "" });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await axios.get("http://localhost:8080/profile", {
          headers: { Authorization: token },
        });
        setUser(res.data.user);
        setForm({
          fullName: res.data.user.fullName,
          email: res.data.user.email,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:8080/profile", form, {
        headers: { Authorization: token },
      });
      alert(res.data.message);
      setUser({ ...user, ...form });
      setEditing(false);
    } catch (error) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-green-600 transition text-xl cursor-pointer">
            ←
          </button>
          <h1 className="text-2xl font-bold text-green-600">My Profile</h1>
        </div>
      </header>

      {/* Profile Card */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-3">
              <FaUserCircle className="text-white text-6xl" />
            </div>
            <p className="text-lg font-bold text-gray-800">{user.fullName}</p>
            <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wide">
              {user.role}
            </span>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {!editing ? (
              /* View Mode */
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Full Name
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {user.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-lg">📧</span>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Email Address
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-lg">📅</span>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Member Since
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition shadow-md cursor-pointer">
                  ✏️ Edit Profile
                </button>
              </div>
            ) : (
              /* Edit Mode */
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Edit Your Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition shadow-md cursor-pointer">
                    💾 Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        fullName: user.fullName,
                        email: user.email,
                      });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
