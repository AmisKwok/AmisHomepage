/**
 * 语言切换器组件
 * 用于切换中英文语言
 * 支持主题适配和响应式布局
 * 带有平滑过渡动画
 */
"use client";

import { useState } from "react";
import { useLanguageStore, useTranslation } from "../../stores/language-store";
import { useThemeStore } from "../../stores/theme-store";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      toggleLanguage();
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isTransitioning}
      className={`relative flex items-center gap-1 sm:gap-2 transition-all duration-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${
        theme === "dark"
          ? "text-white/90 hover:text-white border-white/20 hover:border-white/40 hover:bg-white/10"
          : "text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-100"
      } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
      title={language === "zh" ? t("switchToEnglish") : t("switchToChinese")}
    >
      {/* 语言图标 */}
      <i className="fas fa-language text-sm sm:text-base"></i>
      
      {/* 显示切换后的语言 - 带过渡动画 */}
      <div className="relative overflow-hidden h-4 sm:h-5">
        <AnimatePresence mode="wait">
          <motion.span
            key={language}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-medium"
          >
            {language === "zh" ? "EN" : "中"}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
}
