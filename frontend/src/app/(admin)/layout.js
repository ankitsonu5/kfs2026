"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "admin") {
        setIsAuthorized(false);
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    window.addEventListener("popstate", checkAuth);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("popstate", checkAuth);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  if (!isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0b1a2b] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
