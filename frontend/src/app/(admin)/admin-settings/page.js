"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaChevronLeft,
  FaGlobe,
  FaHeadset,
  FaTruckLoading,
  FaSave,
} from "react-icons/fa";

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    siteName: "",
    supportEmail: "",
    deliveryCharge: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/adminsettings", {
        headers: { Authorization: token },
      });
      setSettings(res.data.settings || {});
    } catch (err) {
      console.error("Settings fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8080/adminsettings",
        settings,
        { headers: { Authorization: token } },
      );
      alert(res.data.message || "Settings saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0b1a2b] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1a2b] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-2xl z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
        {/* Back Button */}
        <button
          onClick={() => router.push("/admindashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 border border-white/10 transition-all">
            <FaChevronLeft size={12} />
          </div>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-60"></div>

          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center shadow-emerald-500/20 shadow-2xl transform -rotate-6 group-hover:rotate-0 transition-transform">
              <FaGlobe size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Website Settings
              </h1>
              <p className="text-gray-400 text-sm">
                Configure your platform's global parameters
              </p>
            </div>
          </div>

          <form onSubmit={saveSettings} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] ml-1">
                  Site Title
                </label>
                <div className="relative group">
                  <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-400" />
                  <input
                    type="text"
                    placeholder="KFS Grocery"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">
                  Support Email
                </label>
                <div className="relative group">
                  <FaHeadset className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-400" />
                  <input
                    type="email"
                    placeholder="support@kfs.com"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, supportEmail: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] ml-1">
                Default Delivery Charge (₹)
              </label>
              <div className="relative group max-w-xs">
                <FaTruckLoading className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-orange-400" />
                <input
                  type="number"
                  placeholder="0"
                  value={settings.deliveryCharge}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryCharge: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-bold"
                />
              </div>
              <p className="text-[10px] text-gray-500 ml-1">
                This amount will be added to every order during checkout.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all  ${
                  loading
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
                }`}>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FaSave size={16} /> Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(30px); } to { transform: translateY(0); } }
        .animate-in { animation: fade-in 0.8s ease-out, slide-in-from-bottom 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `,
        }}
      />
    </div>
  );
}
