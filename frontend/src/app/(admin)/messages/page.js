"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { safePush } from "@/lib/safe-navigation";
import axios from "axios";
import { ArrowLeft, Box, MessageSquare, Trash2 } from "lucide-react";

export default function Messages() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 15;
  const [messagesPage, setMessagesPage] = useState(1);
  const [messageSort, setMessageSort] = useState("newest");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/contact`,
          {
            headers: { Authorization: token },
          }
        );
        if (res.data.success) {
          setMessages(res.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/contact/${id}`,
          { headers: { Authorization: token } }
        );
        if (res.data.success) {
          setMessages(messages.filter((m) => m._id !== id));
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("Failed to delete message");
      }
    }
  };

  // Pagination & Sorting Logic
  let sortedMessages = [...messages];
  if (messageSort === "newest") sortedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (messageSort === "name-az") sortedMessages.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  
  const totalMessagePages = Math.ceil(sortedMessages.length / ITEMS_PER_PAGE);
  const paginatedMessages = sortedMessages.slice((messagesPage - 1) * ITEMS_PER_PAGE, messagesPage * ITEMS_PER_PAGE);

  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center mt-6 gap-2 pb-6">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-600 rounded-lg bg-[#1f2937] text-white disabled:opacity-50 hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-400 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-600 rounded-lg bg-[#1f2937] text-white disabled:opacity-50 hover:bg-gray-700 transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b1a2b] text-white p-4 md:p-10 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-[#111827]/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[80vh] flex flex-col md:flex-row">
        
        {/* Sidebar Info */}
        <div className="md:w-1/3 lg:w-1/4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6 md:p-8 border-r border-gray-700/50 flex flex-col justify-between shrink-0">
          <div>
            <button
              onClick={() => safePush(router, "/admindashboard")}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 font-medium cursor-pointer">
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <MessageSquare size={28} className="text-blue-400" />
              Messages
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              View and manage messages sent by customers through the contact form.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-3 text-gray-500 mb-4 opacity-50">
              <Box size={40} />
              <div className="h-0.5 flex-1 bg-gray-700"></div>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              KFS Marketplace Admin Panel
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:w-2/3 lg:w-3/4 p-5 md:p-8 overflow-y-auto">
          <div className="mb-6 flex justify-between items-center border-b border-gray-700 pb-4">
            <h2 className="text-xl font-bold">Inbox ({messages.length})</h2>
            <select value={messageSort} onChange={(e) => setMessageSort(e.target.value)} className="bg-[#1f2937] border border-gray-600 rounded px-3 py-1 text-sm font-semibold text-white">
              <option value="newest">Newest</option>
              <option value="name-az">Name (A-Z)</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : paginatedMessages.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white/5 rounded-xl border border-gray-700/50">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>No messages found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedMessages.map((msg) => (
                <div key={msg._id} className="bg-[#1f2937]/50 border border-gray-700/50 rounded-xl p-5 hover:bg-[#1f2937] transition-colors relative group">
                  <button 
                    onClick={() => handleDelete(msg._id)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2 bg-gray-800 rounded-lg cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="mb-2 pr-10">
                    <h3 className="font-bold text-lg text-white">{msg.subject}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4 border-b border-gray-700 pb-3">
                    <span className="font-medium text-blue-400">{msg.name}</span>
                    <span>•</span>
                    <a href={`mailto:${msg.email}`} className="hover:text-blue-400 hover:underline transition-all">{msg.email}</a>
                    <span>•</span>
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
          <PaginationControls currentPage={messagesPage} totalPages={totalMessagePages} onPageChange={setMessagesPage} />
        </div>
      </div>
    </div>
  );
}
