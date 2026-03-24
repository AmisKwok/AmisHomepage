/**
 * 页面过渡组件
 * 用于页面切换时的水合等待状态
 * 提供简洁的加载指示，不阻塞页面渲染
 */
"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "../../stores/theme-store";

interface PageTransitionProps {
  hydrated: boolean;  // 是否已完成水合
  mounted: boolean;   // 是否已挂载
}

export default function PageTransition({ hydrated, mounted }: PageTransitionProps) {
  const { theme } = useThemeStore();
  const [showTransition, setShowTransition] = useState(true);

  useEffect(() => {
    // 水合完成后快速淡出
    if (hydrated && mounted) {
      const timer = setTimeout(() => {
        setShowTransition(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [hydrated, mounted]);

  // 不需要过渡时不渲染
  if (!showTransition) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-150 ${
        hydrated && mounted ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#faf5eb]"}`}
    >
      {/* 简洁的加载指示器 */}
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          theme === "dark" ? "bg-blue-400" : "bg-blue-500"
        }`} style={{ animationDelay: "0ms" }}></div>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          theme === "dark" ? "bg-purple-400" : "bg-purple-500"
        }`} style={{ animationDelay: "150ms" }}></div>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          theme === "dark" ? "bg-pink-400" : "bg-pink-500"
        }`} style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  );
}
