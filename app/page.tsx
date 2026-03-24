/**
 * 首页组件
 * 个人主页的主要展示页面
 * 包含：头部背景、导航菜单、个人信息、项目展示、技能展示、页脚等
 */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { linksConfig, guestbookConfig, friendLinksConfig } from "./site-config";
import { useLanguageStore, useTranslation } from "./stores/language-store";
import { useThemeStore } from "./stores/theme-store";
import { useSiteConfig } from "./hooks/useSiteConfig";
import { useLanguageTransition } from "./hooks/useLanguageTransition";
import { useBackToTop } from "./hooks/useBackToTop";
import { useTextColors } from "./hooks/useTextColors";
// 内容组件
import TypeWriter from "./components/content/TypeWriter";
import LanguageSwitcher from "./components/ui/LanguageSwitcher";
import ThemeSwitcher from "./components/ui/ThemeSwitcher";
import DrawnTitle from "./components/effects/DrawnTitle";
import Avatar from "./components/media/Avatar";
import AboutCard from "./components/content/AboutCard";
import FeaturedProjects from "./components/content/FeaturedProjects";
import Skills from "./components/content/Skills";
// 效果组件
import StarryBackground from "./components/effects/StarryBackground";
import LightBackground from "./components/effects/LightBackground";
import LoadingScreen from "./components/effects/LoadingScreen";
import PageTransition from "./components/effects/PageTransition";
import SectionNav from "./components/layout/SectionNav";
import MobileNav from "./components/layout/MobileNav";
import ThemeTransition from "./components/effects/ThemeTransition";
import LocalTime from "./components/effects/LocalTime";
import CustomCursor from "./components/ui/CustomCursor";

export default function Home() {
  // 翻译函数
  const { t } = useTranslation();
  // 语言状态
  const { hydrated, hydrate } = useLanguageStore();
  // 主题状态
  const { theme } = useThemeStore();
  // 站点配置
  const { siteContent } = useSiteConfig();
  // 语言切换过渡状态
  const { isLanguageChanging } = useLanguageTransition();
  // 返回顶部功能
  const { showBackToTop, scrollToTop } = useBackToTop();
  // 文字颜色
  const { textColor, textSecondaryColor } = useTextColors();
  // 页面加载状态
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 初始化语言状态
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 页面加载完成
  useEffect(() => {
    setIsLoaded(true);
    setMounted(true);
  }, []);

  return (
    <>
      <LoadingScreen />
      <PageTransition hydrated={hydrated} mounted={mounted} />
      <CustomCursor />
      <ThemeTransition />
      <div className={`min-h-screen font-sans transition-all duration-500 ease-in-out overflow-x-hidden ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <StarryBackground />
        <LightBackground />
      
      <header className="relative w-full" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <div className="absolute inset-0">
          <Image
            src={theme === "dark" 
              ? (siteContent?.site?.backgroundImage?.dark || "/images/index.jpg")
              : (siteContent?.site?.backgroundImage?.light || "/images/index4.jpg")}
            alt="Background"
            fill
            priority
            className="object-cover transition-opacity duration-500"
            sizes="100vw"
          />
        </div>
        
        {theme === "dark" && (
          <div className="absolute inset-0 bg-black/30"></div>
        )}
        
        <nav className="relative z-10 flex items-center justify-end px-6 py-4 md:px-12">
          <div id="menus" className="hidden md:flex items-center space-x-6">
            {siteContent?.showProjects !== false && (
              <a 
                href="#projects" 
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.getElementById("projects");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="group transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
                style={{ color: textSecondaryColor }}
              >
                <i className="fas fa-star fa-fw group-hover:scale-110 transition-transform"></i>
                <span className="relative">
                  {t("featuredProjects")}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: textColor }}
                  ></span>
                </span>
              </a>
            )}
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                const section = document.getElementById("about");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              className="group transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
              style={{ color: textSecondaryColor }}
            >
              <i className="fas fa-user fa-fw group-hover:scale-110 transition-transform"></i>
              <span className="relative">
                {t("aboutMe")}
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: textColor }}
                ></span>
              </span>
            </a>
            {siteContent?.showSkills !== false && (
              <a 
                href="#skills" 
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.getElementById("skills");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="group transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
                style={{ color: textSecondaryColor }}
              >
                <i className="fas fa-chart-line fa-fw group-hover:scale-110 transition-transform"></i>
                <span className="relative">
                  {t("skills")}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: textColor }}
                  ></span>
                </span>
              </a>
            )}
            {guestbookConfig?.enabled && (
              <Link 
                href="/guestbook"
                className="group transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
                style={{ color: textSecondaryColor }}
              >
                <i className="fas fa-comments fa-fw group-hover:scale-110 transition-transform"></i>
                <span className="relative">
                  {t("guestbook")}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: textColor }}
                  ></span>
                </span>
              </Link>
            )}
            {friendLinksConfig?.enabled && (
              <Link 
                href="/friends"
                className="group transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
                style={{ color: textSecondaryColor }}
              >
                <i className="fas fa-link fa-fw group-hover:scale-110 transition-transform"></i>
                <span className="relative">
                  {t("friendLinks")}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: textColor }}
                  ></span>
                </span>
              </Link>
            )}
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </nav>
        
        <div 
          id="site-info" 
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-5 overflow-visible px-4 transition-opacity duration-300"
          style={{ 
            color: textColor,
            opacity: isLanguageChanging ? 0 : 1
          }}
        >
          <Avatar 
            src="/images/avatar.jpg" 
            alt="Amis" 
            size={140} 
            className="mb-6"
          />
          
          <div className="min-h-[80px] flex items-center justify-center w-[90vw] mb-4">
            <DrawnTitle text={t("siteTitle")} className="w-full" />
          </div>
          <div 
            id="site-subtitle" 
            className="text-lg md:text-xl mb-8 max-w-2xl px-4 font-medium"
            style={{ color: textSecondaryColor }}
          >
            <TypeWriter 
              key={useLanguageStore.getState().language}
              texts={[t("typeWriterText"), t("typeWriterText2")]} 
              typeSpeed={120} 
              deleteSpeed={80}
              delay={2500} 
              pauseTime={2000}
            />
          </div>
          
          <div id="site_social_icons" className="flex items-center gap-4 flex-wrap justify-center">
            {linksConfig.email?.show !== false && (
              <a 
                href={linksConfig.email.url}
                rel="external nofollow noreferrer" 
                target="_blank" 
                title={linksConfig.email.title[useLanguageStore.getState().language]}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: textColor
                }}
              >
                <i className="fas fa-envelope"></i>
              </a>
            )}
            {linksConfig.github?.show !== false && (
              <a 
                href={linksConfig.github.url}
                target="_blank" 
                rel="noopener noreferrer"
                title={linksConfig.github.title[useLanguageStore.getState().language]}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: textColor
                }}
              >
                <i className="fab fa-github"></i>
              </a>
            )}
            {linksConfig.gitee?.show !== false && (
              <a 
                href={linksConfig.gitee.url}
                target="_blank" 
                rel="noopener noreferrer"
                title={linksConfig.gitee.title[useLanguageStore.getState().language]}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: textColor
                }}
              >
                <i className="fab fa-gitee"></i>
              </a>
            )}
            {linksConfig.blog?.show !== false && (
              <a 
                href={linksConfig.blog.url}
                target="_blank"
                title={linksConfig.blog.title[useLanguageStore.getState().language]}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: textColor
                }}
              >
                <i className="fas fa-blog"></i>
              </a>
            )}
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <button
            onClick={() => {
              const content = document.getElementById("content");
              if (content) content.scrollIntoView({ behavior: "smooth" });
            }}
            className="p-2 rounded-full transition-all duration-300"
            style={{ color: textSecondaryColor }}
            aria-label="Scroll down"
          >
            <i className="fas fa-chevron-down text-2xl"></i>
          </button>
        </div>
      </header>
      
      <section id="content" className="py-16 px-6 md:px-12 relative">
        <div className={`absolute inset-0 ${
          theme === "dark" 
            ? "bg-linear-to-b from-[#0a0a0a]/60 via-[#0f0f23]/80 to-[#1a1a2e]/90" 
            : "bg-linear-to-b from-white/70 via-white/90 to-gray-50/95"
        }`}></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-12">
          <FeaturedProjects />
          <AboutCard />
          <Skills />
        </div>
      </section>
      
      <footer className={`py-8 px-6 border-t backdrop-blur-sm ${
        theme === "dark"
          ? "bg-linear-to-b from-[#1a1a2e]/90 to-[#0f0f23]/95 text-white border-white/10"
          : "bg-linear-to-b from-white/90 to-gray-50/95 text-gray-900 border-gray-200"
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={theme === "dark" ? "text-white/60" : "text-gray-600"}>
            {t("footer")}
          </p>
          <div className="mt-2 hidden md:block">
            <Link
              href="/admin"
              className={`text-xs transition-all duration-300 ${
                theme === "dark"
                  ? "text-white/20 hover:text-white/40"
                  : "text-gray-300 hover:text-gray-500"
              }`}
              title={t("configManagement")}
            >
              <i className="fas fa-cog mr-1"></i>
              Config
            </Link>
          </div>
        </div>
      </footer>

      <MobileNav />
      <SectionNav />
      {siteContent?.showLocalTime !== false && <LocalTime />}

      <button
        onClick={scrollToTop}
        className={`fixed w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        } bottom-8 right-8`}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
      </div>
    </>
  );
}
