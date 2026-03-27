/* eslint-disable react-hooks/exhaustive-deps */
/**
 * 友链页面
 * 展示友情链接列表
 * 支持响应式布局和主题切换
 * 支持瀑布流布局、粒子背景、搜索功能
 */
 
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguageStore, useTranslation } from "../stores/language-store";
import { useThemeStore } from "../stores/theme-store";
import { friendLinksConfig } from "../site-config";
import LoadingScreen from "../components/effects/LoadingScreen";
import PageTransition from "../components/effects/PageTransition";
import PageNav from "../components/layout/PageNav";
import SEOHead from "../components/seo/SEOHead";
import ParticleBackground from "../components/effects/ParticleBackground";
import DynamicLines from "../components/effects/DynamicLines";
import TopToolbar from "../components/ui/TopToolbar";
import type { FriendLink } from "../../types";

// 容器动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,  // 子元素交错出现
    },
  },
};

// 列表项动画配置
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

// 卡片动画配置
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

// 浮动动画配置
const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function FriendLinksPage() {
  const { t } = useTranslation();
  const { hydrated, hydrate, language } = useLanguageStore();
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 初始化语言状态
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  // 主题颜色配置
  const colors = {
    background: theme === "dark" ? "bg-linear-to-br from-[#0a0a0a] via-[#0f0f23] to-[#1a1a2e]" : "bg-linear-to-br from-gray-50 via-white to-gray-100",
    card: theme === "dark" ? "bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20" : "bg-white/80 backdrop-blur-md border border-gray-200 hover:border-gray-300",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
    glow: theme === "dark" ? "shadow-violet-500/20" : "shadow-violet-500/10",
  };

  const links: FriendLink[] = friendLinksConfig?.links || [];
  const pageTitle = friendLinksConfig?.title?.[language] || t("friendLinks");

  // 过滤友链
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;
    const query = searchQuery.toLowerCase();
    return links.filter(link => 
      link.name.toLowerCase().includes(query) ||
      link.description?.[language]?.toLowerCase().includes(query) ||
      link.description?.zh?.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
  }, [links, searchQuery, language]);

  const getFaviconUrl = (url: string, avatar?: string) => {
    if (avatar) return avatar;
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return null;
    }
  };

  return (
    <>
      <LoadingScreen />
      <PageTransition hydrated={hydrated} mounted={mounted} />
      <SEOHead
        title={pageTitle}
        description={pageTitle}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/friends`}
      />
      <motion.div 
        className={`min-h-screen ${colors.background} relative overflow-hidden`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 顶部工具栏 */}
        <TopToolbar />
        
        {/* 粒子背景 */}
        <ParticleBackground theme={theme} />
        
        {/* 动态线条 */}
        <DynamicLines theme={theme} />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <motion.header className="mb-10" variants={itemVariants}>
            <PageNav
              cardClass={colors.card}
              textClass={colors.text}
              hoverClass="hover:bg-violet-500/10"
            />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.div 
                  className="relative inline-block"
                  variants={floatVariants}
                  animate="animate"
                >
                  <motion.div 
                    className="absolute inset-0 bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl blur-xl opacity-50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg">
                    <i className="fas fa-link text-white text-xl sm:text-2xl"></i>
                  </div>
                </motion.div>
                
                <motion.h1 
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colors.text} bg-linear-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {pageTitle}
                </motion.h1>
              </div>
              
              <motion.p 
                className={`${colors.textSecondary} text-base sm:text-lg`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('friendLinksSubtitle')}
              </motion.p>
              
              {/* 搜索框 */}
              <motion.div 
                className="mt-6 max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchFriendLinks')}
                    className={`w-full px-4 py-3 pl-12 rounded-xl ${colors.card} ${colors.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all`}
                  />
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <motion.p 
                    className={`mt-2 text-sm ${colors.textSecondary}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {t('foundFriendLinks', { count: filteredLinks.length })}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.header>

          {filteredLinks.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              <AnimatePresence mode="popLayout">
                {filteredLinks.map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block ${colors.card} rounded-2xl p-4 sm:p-6 transition-all duration-300 shadow-lg ${colors.glow} relative overflow-hidden`}
                    variants={cardVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                  <motion.div 
                    className="absolute inset-0 bg-linear-to-br from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/5 group-hover:to-purple-500/5 transition-all duration-300"
                  />
                  
                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <motion.div 
                      className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden bg-linear-to-br from-violet-500/20 to-purple-500/20 shrink-0 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {getFaviconUrl(link.url, link.avatar) ? (
                        <Image
                          src={getFaviconUrl(link.url, link.avatar) || ""}
                          alt={link.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fas fa-globe text-2xl text-gray-400"></i>
                        </div>
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-lg ${colors.text} group-hover:text-violet-500 transition-colors truncate`}>
                        {link.name}
                      </h3>
                      <p className={`text-sm ${colors.textSecondary} mt-2 line-clamp-2 leading-relaxed`}>
                        {link.description?.[language] || link.description?.zh || ""}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className={`text-xs ${colors.textSecondary} truncate max-w-[70%] flex items-center gap-1`}>
                      <i className="fas fa-globe text-[10px]"></i>
                      {(() => {
                        try {
                          return new URL(link.url).hostname;
                        } catch {
                          return link.url;
                        }
                      })()}
                    </span>
                    <motion.span 
                      className="text-xs text-violet-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      {t("visitSite")}
                      <i className="fas fa-arrow-right text-[10px]"></i>
                    </motion.span>
                  </div>
                </motion.a>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              className={`${colors.card} rounded-3xl p-12 text-center shadow-xl`}
              variants={cardVariants}
            >
              <motion.div 
                className="w-24 h-24 rounded-2xl bg-linear-to-br from-gray-400 to-gray-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <i className="fas fa-user-friends text-white text-4xl"></i>
              </motion.div>
              <h3 className={`text-2xl font-semibold ${colors.text} mb-3`}>
                {searchQuery 
                  ? t('noMatchingFriendLinks')
                  : t("noFriendLinks")}
              </h3>
              <p className={`${colors.textSecondary} max-w-md mx-auto`}>
                {searchQuery 
                  ? t('tryOtherKeywords')
                  : t('lookingForFriends')}
              </p>
            </motion.div>
          )}

          <motion.div 
            className={`mt-8 sm:mt-10 ${colors.card} rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-lg relative overflow-hidden`}
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-linear-to-r from-violet-500/5 via-purple-500/5 to-indigo-500/5" />
            <div className="relative flex items-center justify-center gap-3 sm:gap-4 mb-3">
              <motion.div 
                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <i className="fas fa-handshake text-white text-lg sm:text-xl"></i>
              </motion.div>
              <h3 className={`font-semibold text-base sm:text-lg ${colors.text}`}>
                {t('applyFriendLink')}
              </h3>
            </div>
            <p className={`text-xs sm:text-sm ${colors.textSecondary} max-w-md mx-auto px-2`}>
              {t('applyFriendLinkDesc')}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
