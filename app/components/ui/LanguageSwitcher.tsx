/**
 * 语言切换器组件
 * 用于切换中英文语言
 * 支持主题适配
 */
"use client";

import { useLanguageStore, useTranslation } from "../../stores/language-store";
import { useThemeStore } from "../../stores/theme-store";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 transition-colors px-3 py-1 rounded-full border ${
        theme === "dark"
          ? "text-white/90 hover:text-white border-white/30 hover:border-white/50"
          : "text-gray-700 hover:text-gray-90 border-gray-300 hover:border-gray-500"
      }`}
      title={language === "zh" ? t("switchToEnglish") : t("switchToChinese")}
    >
      {/* 语言图标 */}
      <i className="fas fa-language"></i>
      {/* 显示切换后的语言 */}
      <span className="text-sm font-medium">
        {language === "zh" ? "EN" : "中"}
      </span>
    </button>
  );
}
