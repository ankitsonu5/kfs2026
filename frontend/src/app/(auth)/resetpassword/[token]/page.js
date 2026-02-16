"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/reset-password", {
        token,
        password: formData.password,
      });

      if (data.success) {
        alert("Password reset successful! You can now login.");
        router.push("/login");
      }
    } catch (error) {
      alert(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1a2b] p-4 text-white">
      <div className="bg-[#111827] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 border-t-4 border-t-blue-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <span className="text-3xl text-blue-400">🛡️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Create New Password</h2>
          <p className="text-gray-400 text-sm">
            Please set a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-bold uppercase tracking-widest">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#1f2937] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 font-bold uppercase tracking-widest">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-[#1f2937] border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed transform active:scale-95 duration-200">
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
