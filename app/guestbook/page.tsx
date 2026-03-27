/**
 * 留言簿页面
 * 使用 Waline 评论系统实现留言功能
 * 支持响应式布局和主题切换
 */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguageStore, useTranslation } from "../stores/language-store";
import { useThemeStore } from "../stores/theme-store";
import { guestbookConfig } from "../site-config";
import LoadingScreen from "../components/effects/LoadingScreen";
import PageTransition from "../components/effects/PageTransition";
import PageNav from "../components/layout/PageNav";
import SEOHead from "../components/seo/SEOHead";
import ParticleBackground from "../components/effects/ParticleBackground";
import DynamicLines from "../components/effects/DynamicLines";
import TopToolbar from "../components/ui/TopToolbar";
import WalineComments from "../components/waline/WalineComments.jsx";
import "../css/waline.css";

// 容器动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // 子元素交错出现
    },
  },
};

// 列表项动画配置
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
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

export default function GuestbookPage() {
  const { t } = useTranslation();
  const { hydrated, hydrate, language } = useLanguageStore();
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 初始化语言状态
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  // 主题颜色配置
  const colors = {
    background: theme === "dark" ? "bg-linear-to-br from-[#0a0a0a] via-[#0f0f23] to-[#1a1a2e]" : "bg-linear-to-br from-gray-50 via-white to-gray-100",
    card: theme === "dark" ? "bg-white/5 backdrop-blur-md border border-white/10" : "bg-white/80 backdrop-blur-md border border-gray-200",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
    glow: theme === "dark" ? "shadow-pink-500/20" : "shadow-pink-500/10",
  };

  // Waline 配置
  const walineUrl = guestbookConfig?.walineUrl || "";
  const pageTitle = guestbookConfig?.title?.[language] || t("guestbook");

  return (
    <>
      <LoadingScreen />
      <PageTransition hydrated={hydrated} mounted={mounted} />
      <SEOHead
        title={pageTitle}
        description={pageTitle}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/guestbook`}
      />
      <motion.div 
        className={`min-h-screen ${colors.background} relative overflow-hidden`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* 顶部工具栏 */}
        <TopToolbar />
        
        <ParticleBackground theme={theme} />
        <DynamicLines theme={theme} />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          <motion.header className="mb-8" variants={itemVariants}>
            <PageNav
              cardClass={colors.card}
              textClass={colors.text}
              hoverClass="hover:bg-pink-500/10"
            />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.div 
                  className="relative inline-block"
                  variants={floatVariants}
                  animate="animate"
                >
                  <motion.div 
                    className="absolute inset-0 bg-linear-to-br from-pink-500 to-rose-600 rounded-2xl blur-xl opacity-50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-pink-500 to-rose-600 shadow-lg">
                    <i className="fas fa-comments text-white text-xl sm:text-2xl"></i>
                  </div>
                </motion.div>
                
                <motion.h1 
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colors.text} bg-linear-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent`}
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
                {language === "zh" ? "欢迎留下你的足迹 ✨" : "Leave your footprint here ✨"}
              </motion.p>
            </div>
          </motion.header>

          <motion.div 
            className={`${colors.card} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 min-h-[500px] shadow-xl ${colors.glow}`}
            variants={itemVariants}
            whileHover={{ boxShadow: theme === "dark" ? "0 25px 50px -12px rgba(236, 72, 153, 0.25)" : "0 25px 50px -12px rgba(236, 72, 153, 0.15)" }}
          >
            {walineUrl ? (
              <WalineComments path="/guestbook" />
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <motion.div 
                  className="w-24 h-24 rounded-2xl bg-linear-to-br from-gray-400 to-gray-500 flex items-center justify-center mb-6 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <i className="fas fa-cog text-white text-4xl"></i>
                </motion.div>
                <h3 className={`text-2xl font-semibold ${colors.text} mb-3`}>
                  {language === "zh" ? "留言板未配置" : "Guestbook Not Configured"}
                </h3>
                <p className={`${colors.textSecondary} max-w-md`}>
                  {language === "zh" 
                    ? "请在配置页面设置 Waline 服务端地址，开启访客留言功能" 
                    : "Please configure Waline server URL in the admin page to enable guest comments"}
                </p>
              </div>
            )}
          </motion.div>

          <motion.div 
            className={`mt-6 sm:mt-8 flex flex-row justify-center sm:grid sm:grid-cols-3 gap-3 sm:gap-4 ${colors.card} rounded-2xl p-4 sm:p-6 overflow-x-auto sm:overflow-visible`}
            variants={itemVariants}
          >
            {[
              { icon: "fa-heart", color: "from-pink-500 to-rose-500", label: language === "zh" ? "友善交流" : "Be Friendly" },
              { icon: "fa-shield-alt", color: "from-blue-500 to-cyan-500", label: language === "zh" ? "尊重他人" : "Be Respectful" },
              { icon: "fa-smile", color: "from-yellow-500 to-orange-500", label: language === "zh" ? "分享快乐" : "Share Joy" },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center gap-2 text-center min-w-[80px] sm:min-w-0 shrink-0 sm:shrink"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <i className={`fas ${item.icon} text-white`}></i>
                </div>
                <span className={`text-xs sm:text-sm ${colors.textSecondary} whitespace-nowrap`}>{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
