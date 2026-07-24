"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
        {
          email,
        },
      );
      if (res.data.success) {
        setEmailSent(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-green-100 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            href="/"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <Image src="/kfslogo.webp" alt="logo" width={250} height={250} />
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Forgot Password?
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Enter your email and we’ll send reset link
              </p>

              {!emailSent ? (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your email
                    </label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-blue-400"
                    style={{ cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <h3 className="text-lg font-semibold text-green-600 mb-2">
                    Email Sent!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    Check your inbox for the reset link.
                  </p>

                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-green-600 hover:underline text-sm">
                    Resend Email
                  </button>
                </div>
              )}

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-sm text-green-600 hover:underline">
                  ← Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
