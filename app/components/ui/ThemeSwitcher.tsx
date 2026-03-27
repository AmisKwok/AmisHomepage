/**
 * 主题切换器组件
 * 用于切换深色/浅色主题
 * 带有平滑过渡动画
 * 支持响应式布局
 */
"use client";

import { useThemeStore } from "../../stores/theme-store";
import { useTranslation } from "../../stores/language-store";

export default function ThemeSwitcher() {
  const { theme, toggleTheme, isTransitioning } = useThemeStore();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      disabled={isTransitioning}
      className={`relative w-7 h-7 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden border ${
        theme === "dark" 
          ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40" 
          : "bg-white hover:bg-gray-100 border-gray-300 hover:border-gray-400"
      } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
      title={theme === "dark" ? t("switchToLightMode") : t("switchToDarkMode")}
    >
      <div className="relative w-full h-full">
        {/* 深色模式图标 - 月亮 */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
          }`}
        >
          <i className="fas fa-moon text-white text-sm sm:text-lg"></i>
        </div>
        {/* 浅色模式图标 - 太阳 */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
        >
          <i className="fas fa-sun text-yellow-500 text-sm sm:text-lg"></i>
        </div>
      </div>
    </button>
  );
}
