/**
 * 页面导航组件
 * 提供统一的页面顶部导航，支持返回主页和跳转到其他页面
 * 可配置显示哪些导航链接，自动过滤当前页面
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "../../stores/language-store";

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

  // 过滤掉当前页面的链接
  const filteredLinks = links.filter(link => link.href !== pathname);

  return (
    <motion.div
      className="flex flex-wrap items-start gap-2 sm:gap-3 mb-6 w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 返回主页按钮 */}
      <Link
        href="/"
        className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl ${cardClass} ${textClass} ${hoverClass} transition-all group`}
      >
        <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform text-sm"></i>
        <span className="text-sm sm:text-base">{t("backToHome")}</span>
      </Link>

      {/* 分隔符 - 仅当有其他链接时显示 */}
      {filteredLinks.length > 0 && (
        <div className={`hidden sm:block w-px h-6 ${textClass} opacity-30`}></div>
      )}

      {/* 其他页面链接 */}
      <div className="flex flex-wrap items-center gap-2">
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl ${cardClass} ${textClass} ${hoverClass} transition-all group`}
          >
            <i className={`${link.icon} text-sm`}></i>
            <span className="text-sm sm:text-base">{t(link.labelKey)}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
