/**
 * 首次加载动画组件
 * 仅在用户首次访问网站时显示
 * 使用 sessionStorage 标记已加载状态，页面切换时不再显示
 * 支持通过 effectsStore 动态开关
 */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useEffectsStore } from "@/app/stores/effects-store";

// sessionStorage 键名
const LOADED_KEY = "site-first-loaded";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { effectsEnabled } = useEffectsStore();

  useEffect(() => {
    // 特效关闭时不显示加载动画
    if (!effectsEnabled) {
      sessionStorage.setItem(LOADED_KEY, "true");
      return;
    }

    // 检查是否已经加载过
    const hasLoaded = sessionStorage.getItem(LOADED_KEY);
    
    if (hasLoaded) {
      // 已加载过，不显示加载动画
      return;
    }

    // 首次访问，显示加载动画
    setIsLoading(true);

    // 读取保存的主题设置
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      // 根据系统主题设置
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }

    // 800ms 后隐藏加载屏幕并标记已加载
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem(LOADED_KEY, "true");
    }, 800);

    return () => clearTimeout(timer);
  }, [effectsEnabled]);

  // 不加载时不渲染
  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-100 flex items-center justify-center ${
      theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#faf5eb]"
    }`}>
      <div className="relative">
        {/* 发光背景效果 */}
        <div className={`absolute inset-0 blur-xl opacity-50 animate-pulse ${
          theme === "dark"
            ? "bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"
            : "bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400"
        }`}></div>
        <div className="relative flex flex-col items-center gap-6">
          {/* 双层旋转加载动画 */}
          <div className="relative">
            {/* 外层旋转 */}
            <div className={`w-16 h-16 border-4 rounded-full animate-spin ${
              theme === "dark"
                ? "border-white/20 border-t-blue-500"
                : "border-gray-200 border-t-blue-500"
            }`}></div>
            {/* 内层反向旋转 */}
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
