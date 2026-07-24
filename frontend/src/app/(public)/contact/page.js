"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import Navbar from "../../components/redesign/Navbar";
import Footer from "../../components/redesign/Footer";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  User,
  MessageSquare,
  Tag,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
  });

  const [settings, setSettings] = useState({
    supportEmail: "kfs24x7@gmail.com",
    supportEmail2: "",
    primaryPhone: "+91 8800145844",
    secondaryPhone: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/adminsettings`);
        if (res.data && res.data.settings) {
          const data = res.data.settings;
          setSettings({
            supportEmail: data.supportEmail || "kfs24x7@gmail.com",
            supportEmail2: data.supportEmail2 || "",
            primaryPhone: data.primaryPhone || "+91 8800145844",
            secondaryPhone: data.secondaryPhone || "",
          });
        }
      } catch (err) {
        console.error("Error fetching contact settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact`, formData);
      if (res.data.success) {
        setStatus({ submitting: false, success: true, error: null });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(
          () => setStatus((prev) => ({ ...prev, success: false })),
          5000,
        );
      } else {
        setStatus({ submitting: false, success: false, error: res.data.message });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus({ submitting: false, success: false, error: "Something went wrong. Please try again." });
    }
  };

  const phoneDetails = [settings.primaryPhone];
  if (settings.secondaryPhone) {
    phoneDetails.push(settings.secondaryPhone);
  }

  const emailDetails = [settings.supportEmail];
  if (settings.supportEmail2) {
    emailDetails.push(settings.supportEmail2);
  }

  const contactInfo = [
    {
      icon: <Phone size={24} className="text-green-600" />,
      title: "Phone Number",
      details: phoneDetails,
      bg: "bg-green-50",
    },
    {
      icon: <Mail size={24} className="text-blue-600" />,
      title: "Email Address",
      details: emailDetails,
      bg: "bg-blue-50",
    },
    {
      icon: <MapPin size={24} className="text-red-600" />,
      title: "Office Address",
      details: ["Varanasi, Uttar Pradesh, India"],
      bg: "bg-red-50",
    },
    {
      icon: <Clock size={24} className="text-orange-600" />,
      title: "Working Hours",
      details: ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: Closed"],
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navbar />

      {/* Hero Section */}
      {/* <section className="relative bg-green-600 py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Contact Us</h1>
                    <p className="text-green-50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Have a question or need assistance? We're here to help. Reach out to us anytime and we'll respond as soon as possible.
                    </p>
                </div>
            </section> */}

      <main className="container mx-auto px-4 pt-12 mb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className={`${info.bg} p-6 rounded-2xl flex items-start gap-4 transition-transform hover:scale-102`}>
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                  {info.details.map((detail, dIdx) => (
                    <p key={dIdx} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Social Media */}
            <div className="bg-gray-900 p-8 rounded-2xl text-white space-y-6">
              <h3 className="text-xl font-bold">Follow Us</h3>
              <p className="text-gray-400 text-sm">
                Stay connected with us on social media for the latest updates
                and offers.
              </p>
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, link: "https://www.facebook.com/kfs24x7/" },
                  { Icon: Instagram, link: "https://instagram.com" },
                ].map(({ Icon, link }, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-green-600 rounded-full flex items-center justify-center transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="mb-8 pl-4 border-l-4 border-green-600">
              <h2 className="text-3xl font-bold text-gray-900">
                Send us a Message
              </h2>
              <p className="text-gray-500 mt-2">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User size={16} className="text-green-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-green-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag size={16} className="text-green-600" />
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageSquare size={16} className="text-green-600" />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Your message here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-gray-50 text-gray-900 resize-none"></textarea>
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30 ${status.submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95"}`}>
                {status.submitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>

              {status.success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center text-sm font-medium animate-bounce">
                  Message sent successfully! We&apos;ll get back to you soon.
                </div>
              )}

              {status.error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm font-medium">
                  {status.error}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Map UI Section */}
      <section className="container mx-auto px-4 mb-24">
        <div className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 ring-1 ring-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230820.68323415416!2d82.82789489671507!3d25.318540625066426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e335d52ca071b%3A0xc63b47b370f559eb!2sOnline%20Grocery%20Store%3A%20KFS%2024x7!5e0!3m2!1sen!2sin!4v1784526071218!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin">
            {" "}
          </iframe>{" "}
        </div>
      </section>

      <Footer />
    </div>
  );
}
