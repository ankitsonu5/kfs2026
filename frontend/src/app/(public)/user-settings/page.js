"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  MapPin,
  Bell,
  Lock,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function UserSettings() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [settings, setSettings] = useState({
    phone: "",
    address: "",
    city: "",
    pincode: "",
    notifications: {
      orderUpdates: true,
      offers: true,
    },
  });
  const [activeTab, setActiveTab] = useState("address");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await axios.get("http://localhost:8080/user-settings", {
          headers: { Authorization: token },
        });
        if (res.data.settings) {
          setSettings({
            phone: res.data.settings.phone || "",
            address: res.data.settings.address || "",
            city: res.data.settings.city || "",
            pincode: res.data.settings.pincode || "",
            notifications: res.data.settings.notifications || {
              orderUpdates: true,
              offers: true,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8080/user-settings",
        settings,
        { headers: { Authorization: token } },
      );
      alert(res.data.message);
    } catch (error) {
      alert("Error saving settings");
    }
  };

  const changePassword = async () => {
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8080/change-password",
        { password },
        { headers: { Authorization: token } },
      );
      alert(res.data.message);
      setPassword("");
    } catch (error) {
      alert("Error updating password");
    }
  };

  const deleteAccount = async () => {
    if (
      !confirm(
        "Are you sure? This will permanently delete your account and all data. This cannot be undone!",
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:8080/delete-account", {
        headers: { Authorization: token },
      });
      localStorage.removeItem("token");
      alert("Account deleted. Sorry to see you go!");
      router.push("/");
    } catch (error) {
      alert("Error deleting account");
    }
  };

  const tabs = [
    { id: "address", label: "Delivery Address", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "password", label: "Password", icon: Lock },
    { id: "danger", label: "Account", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-green-600 transition p-2 hover:bg-gray-100 rounded-full cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {/* Sidebar Tabs */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition cursor-pointer flex items-center gap-3 ${
                    activeTab === tab.id
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}>
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Delivery Address */}
            {activeTab === "address" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" /> Default Delivery
                  Address
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  This address will be auto-filled during checkout.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) =>
                        setSettings({ ...settings, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={settings.city}
                      onChange={(e) =>
                        setSettings({ ...settings, city: e.target.value })
                      }
                      placeholder="Enter city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address
                    </label>
                    <textarea
                      value={settings.address}
                      onChange={(e) =>
                        setSettings({ ...settings, address: e.target.value })
                      }
                      placeholder="House no, Street, Landmark..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={settings.pincode}
                      onChange={(e) =>
                        setSettings({ ...settings, pincode: e.target.value })
                      }
                      placeholder="Enter pincode"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    />
                  </div>
                </div>
                <button
                  onClick={saveSettings}
                  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer">
                  Save Address
                </button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-600" /> Notification
                  Preferences
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Choose what updates you want to receive.
                </p>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-800">Order Updates</p>
                      <p className="text-sm text-gray-500">
                        Get notified about order status changes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderUpdates}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            orderUpdates: e.target.checked,
                          },
                        })
                      }
                      className="w-5 h-5 text-green-600 rounded cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-800">
                        Offers & Discounts
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive deals and promotional offers
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.offers}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            offers: e.target.checked,
                          },
                        })
                      }
                      className="w-5 h-5 text-green-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
                <button
                  onClick={saveSettings}
                  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer">
                  Save Preferences
                </button>
              </div>
            )}

            {/* Password */}
            {activeTab === "password" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" /> Change Password
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Password must be at least 6 characters long.
                </p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 text-black"
                />
                <button
                  onClick={changePassword}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer">
                  Update Password
                </button>
              </div>
            )}

            {/* Danger Zone */}
            {activeTab === "danger" && (
              <div className="bg-white rounded-xl border border-red-200 p-6">
                <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Once you delete your account, there is no going back. All your
                  data, orders, and saved addresses will be permanently removed.
                </p>
                <button
                  onClick={deleteAccount}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer">
                  Delete My Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
