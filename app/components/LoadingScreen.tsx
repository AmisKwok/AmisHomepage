/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${
      theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#faf5eb]"
    }`}>
      <div className="relative">
        <div className={`absolute inset-0 blur-xl opacity-50 animate-pulse ${
          theme === "dark"
            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            : "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400"
        }`}></div>
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <div className={`w-16 h-16 border-4 rounded-full animate-spin ${
              theme === "dark"
                ? "border-white/20 border-t-blue-500"
                : "border-gray-200 border-t-blue-500"
            }`}></div>
            <div className={`absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin ${
              theme === "dark"
                ? "border-r-purple-500"
                : "border-r-cyan-500"
            }`} style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
          </div>
          <p className={`text-sm animate-pulse ${
            theme === "dark" ? "text-white/80" : "text-gray-600"
          }`}>Loading...</p>
        </div>
      </div>
    </div>
  );
}
