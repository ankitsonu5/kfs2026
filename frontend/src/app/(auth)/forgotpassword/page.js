"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/forgot-password", {
        email,
      });
      if (res.data.success) {
        setEmailSent(true);
        setResetToken(res.data.resetToken);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1a2b]">
      <div className="bg-[#111827] p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-2 text-white">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Enter your email and we’ll send reset link
        </p>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email Address
              </label>

              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-md 
                text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-600"
              style={{ cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              Email Sent!
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Reset link email par bhej diya hai.
              <br />
              <span className="text-xs text-yellow-500 font-bold block mt-2">
                Development Mode:{" "}
                <a href={`/resetpassword/${resetToken}`} className="underline">
                  Click here to reset password
                </a>
              </span>
            </p>

            <button
              onClick={() => setEmailSent(false)}
              className="text-blue-400 hover:underline text-sm">
              Resend Email
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-blue-400 hover:underline">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
