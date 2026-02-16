"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaChevronLeft,
  FaUserShield,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/adminprofile", {
        headers: { Authorization: token },
      });
      setAdmin(res.data.admin);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8080/adminprofile",
        { ...admin, password },
        { headers: { Authorization: token } },
      );
      alert(res.data.message || "Profile updated successfully!");
      setPassword("");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0b1a2b] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1a2b] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-lg z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
        {/* Back Button */}
        <button
          onClick={() => router.push("/admindashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 border border-white/10 transition-all">
            <FaChevronLeft size={12} />
          </div>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Header Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <FaUserShield size={36} className="text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Admin Profile
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your account credentials
            </p>
          </div>

          <form onSubmit={updateProfile} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  value={admin.name}
                  onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="email"
                  value={admin.email}
                  onChange={(e) =>
                    setAdmin({ ...admin, email: e.target.value })
                  }
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-pink-400 uppercase tracking-widest ml-1">
                New Password (Optional)
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20"
              }`}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Update Profile Settings"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          Secured with end-to-end encryption 🔒
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(20px); } to { transform: translateY(0); } }
        .animate-in { animation: fade-in 0.6s ease-out, slide-in-from-bottom 0.6s ease-out forwards; }
      `,
        }}
      />
    </div>
  );
}
