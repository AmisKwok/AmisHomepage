/**
 * 页面导航组件
 * 提供统一的页面顶部导航，支持返回主页和跳转到其他页面
 * 可配置显示哪些导航链接，自动过滤当前页面
 * 使用三条横线菜单按钮展开可跳转页面
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../../stores/language-store";
import { useState, useEffect, useRef } from "react";

// 导航链接配置接口
interface NavLink {
  href: string;        // 跳转路径
  labelKey: string;    // 翻译键
  icon: string;        // 图标类名
}

// 组件属性接口
interface PageNavProps {
  cardClass: string;   // 卡片样式类
  textClass: string;   // 文字样式类
  hoverClass?: string; // 悬停样式类
  links?: NavLink[];   // 额外的导航链接
}

// 默认的额外页面链接
const defaultLinks: NavLink[] = [
  { href: "/friends", labelKey: "friendLinks", icon: "fas fa-user-friends" },
  { href: "/guestbook", labelKey: "guestbook", icon: "fas fa-comments" },
];

export default function PageNav({ cardClass, textClass, hoverClass = "", links = defaultLinks }: PageNavProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 过滤掉当前页面的链接
  const filteredLinks = links.filter(link => link.href !== pathname);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 切换菜单状态
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.div
      className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 返回主页按钮 */}
      <Link
        href="/"
        className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl ${cardClass} ${textClass} ${hoverClass} transition-all group`}
      >
        <i className="fas fa-home group-hover:scale-110 transition-transform text-sm"></i>
        <span className="hidden sm:inline text-sm sm:text-base">{t("backToHome")}</span>
      </Link>

      {/* 分隔符 - 仅当有其他链接时显示 */}
      {filteredLinks.length > 0 && (
        <div className={`hidden sm:block w-px h-6 ${textClass} opacity-30`}></div>
      )}

      {/* 三条横线菜单按钮 - 仅当有可跳转链接时显示 */}
      {filteredLinks.length > 0 && (
        <div className="relative" ref={menuRef}>
          {/* 菜单按钮 */}
          <button
            onClick={toggleMenu}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${cardClass} ${textClass} ${hoverClass} transition-all hover:scale-105`}
            aria-label={t("moreOptions")}
          >
            <i className={`fas fa-bars text-sm transition-transform ${isMenuOpen ? "rotate-90" : ""}`}></i>
          </button>

          {/* 下拉菜单 */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-full left-0 mt-2 w-48 rounded-2xl ${cardClass} shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden z-50`}
              >
                {filteredLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 ${textClass} ${hoverClass} transition-all hover:bg-opacity-50 ${
                      index !== filteredLinks.length - 1 ? "border-b border-gray-200/30 dark:border-white/10" : ""
                    }`}
                  >
                    <i className={`${link.icon} text-sm`}></i>
                    <span className="text-sm">{t(link.labelKey)}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
