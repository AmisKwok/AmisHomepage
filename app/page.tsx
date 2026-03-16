/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { linksConfig } from "./config";
import { useLanguage } from "./contexts/LanguageContext";
import { useTheme } from "./contexts/ThemeContext";
import { useConfigStore } from "./(home)/stores/config-store";
import TypeWriter from "./components/TypeWriter";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ThemeSwitcher from "./components/ThemeSwitcher";
import DrawnTitle from "./components/DrawnTitle";
import Avatar from "./components/Avatar";
import AboutCard from "./components/AboutCard";
import FeaturedProjects from "./components/FeaturedProjects";
import Skills from "./components/Skills";
import StarryBackground from "./components/StarryBackground";
import LightBackground from "./components/LightBackground";
import LoadingScreen from "./components/LoadingScreen";
import SectionNav from "./components/SectionNav";
import MobileNav from "./components/MobileNav";
import ThemeTransition from "./components/ThemeTransition";
import LocalTime from "./components/LocalTime";
import CustomCursor from "./components/CustomCursor";

export default function Home() {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const { siteContent, setSiteContent } = useConfigStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLanguageChanging, setIsLanguageChanging]
   = useState(false);
  const [prevLanguage, setPrevLanguage] = useState(language);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        const config = data.config || data;
        setSiteContent({
          showProjects: config.showProjects,
          showSkills: config.showSkills,
          showLocalTime: config.showLocalTime,
          showCustomCursor: config.showCustomCursor,
          customCursorPath: config.customCursorPath,
          site: {
            backgroundImage: config.site?.backgroundImage,
            textColor: config.site?.textColor,
            textSecondaryColor: config.site?.textSecondaryColor
          }
        });
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };
    loadConfig();
  }, [setSiteContent]);

  // 语言切换时的淡出淡入效果
  useEffect(() => {
    if (prevLanguage !== language) {
      setIsLanguageChanging(true);
      const timer = setTimeout(() => {
        setIsLanguageChanging(false);
        setPrevLanguage(language);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [language, prevLanguage]);

  const getTextColor = () => {
    return theme === "dark" 
      ? (siteContent?.site?.textColor?.dark || "#ffffff")
      : (siteContent?.site?.textColor?.light || "#1f2937");
  };

  const getTextSecondaryColor = () => {
    return theme === "dark" 
      ? (siteContent?.site?.textSecondaryColor?.dark || "rgba(255, 255, 255, 0.9)")
      : (siteContent?.site?.textSecondaryColor?.light || "rgba(31, 41, 55, 0.9)");
  };

  // 页面加载动画
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 监听滚动显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <LoadingScreen />
      {/* 鼠标光晕效果 */}
      <CustomCursor />
      {/* 主题切换过渡动画 */}
      <ThemeTransition />
      <div className={`min-h-screen font-sans transition-all duration-500 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        {/* 星空动态背景 - 暗色模式 */}
        <StarryBackground />
        {/* 落叶动态背景 - 亮色模式 */}
        <LightBackground />
      
      {/* 全屏Header */}
      <header className="relative h-screen w-full">
        {/* 背景图 - 使用Next.js Image优化 */}
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
        
        {/* 遮罩层 - 只在暗色模式显示 */}
        {theme === "dark" && (
          <div className="absolute inset-0 bg-black/30"></div>
        )}
        
        {/* 导航栏 */}
        <nav className="relative z-10 flex items-center justify-end px-6 py-4 md:px-12">
          
          {/* 桌面端导航菜单 */}
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
                style={{ color: getTextSecondaryColor() }}
              >
                <i className="fas fa-star fa-fw group-hover:scale-110 transition-transform"></i>
                <span className="relative">
                  {t("featuredProjects")}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: getTextColor() }}
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
              style={{ color: getTextSecondaryColor() }}
            >
              <i className="fas fa-user fa-fw group-hover:scale-110 transition-transform"></i>
              <span className="relative">
                {t("aboutMe")}
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: getTextColor() }}
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
                style={{ color: getTextSecondaryColor() }}
              >
                <i className="fas fa-chart-line fa-fw group-hover:scale-110 transition-transform"></i>
                <span className="relative">
                  {t("skills")}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: getTextColor() }}
                  ></span>
                </span>
              </a>
            )}
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          
          {/* 移动端显示语言和主题切换 */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </nav>
        
        {/* 网站信息 */}
        <div 
          id="site-info" 
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-5 overflow-visible px-4 transition-opacity duration-300"
          style={{ 
            color: getTextColor(),
            opacity: isLanguageChanging ? 0 : 1
          }}
        >
          {/* 头像 */}
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
            style={{ color: getTextSecondaryColor() }}
          >
            <TypeWriter 
              key={language}
              texts={[t("typeWriterText"), t("typeWriterText2")]} 
              typeSpeed={120} 
              deleteSpeed={80}
              delay={800} 
              pauseTime={2000}
            />
          </div>
          
          {/* 社交图标 */}
          <div id="site_social_icons" className="flex items-center gap-4 flex-wrap justify-center">
            {linksConfig.email?.show !== false && (
              <a 
                href={linksConfig.email.url}
                rel="external nofollow noreferrer" 
                target="_blank" 
                title={linksConfig.email.title[language]}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: getTextColor()
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
                title={linksConfig.github.title[language]}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: getTextColor()
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
                title={linksConfig.gitee.title[language]}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: getTextColor()
                }}
              >
                <i className="fab fa-gitee"></i>
              </a>
            )}
            {linksConfig.blog?.show !== false && (
              <a 
                href={linksConfig.blog.url}
                target="_blank"
                title={linksConfig.blog.title[language]}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: getTextColor()
                }}
              >
                <i className="fas fa-blog"></i>
              </a>
            )}
          </div>
        </div>
        
        {/* 向下箭头 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <button
            onClick={() => {
              const content = document.getElementById("content");
              if (content) content.scrollIntoView({ behavior: "smooth" });
            }}
            className="p-2 rounded-full transition-all duration-300"
            style={{ color: getTextSecondaryColor() }}
            aria-label="Scroll down"
          >
            <i className="fas fa-chevron-down text-2xl"></i>
          </button>
        </div>
      </header>
      
      {/* 内容区域 - 关于我 */}
      <section id="content" className="py-16 px-6 md:px-12 relative">
        <div className={`absolute inset-0 ${
          theme === "dark" 
            ? "bg-gradient-to-b from-[#0a0a0a]/60 via-[#0f0f23]/80 to-[#1a1a2e]/90" 
            : "bg-gradient-to-b from-white/70 via-white/90 to-gray-50/95"
        }`}></div>
        <div className="max-w-6xl mx-auto relative z-10 space-y-12">
          <FeaturedProjects />
          <AboutCard />
          <Skills />
        </div>
      </section>
      
      {/* 页脚 */}
      <footer className={`py-8 px-6 border-t backdrop-blur-sm ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#1a1a2e]/90 to-[#0f0f23]/95 text-white border-white/10"
          : "bg-gradient-to-b from-white/90 to-gray-50/95 text-gray-900 border-gray-200"
      }`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={theme === "dark" ? "text-white/60" : "text-gray-600"}>
            {t("footer")}
          </p>
          <div className="mt-2 hidden md:block">
            <a
              href="/config"
              className={`text-xs transition-all duration-300 ${
                theme === "dark"
                  ? "text-white/20 hover:text-white/40"
                  : "text-gray-300 hover:text-gray-500"
              }`}
              title={t("configManagement")}
            >
              <i className="fas fa-cog mr-1"></i>
              Config
            </a>
          </div>
        </div>
      </footer>

      {/* 移动端底部导航 */}
      <MobileNav />

      {/* 桌面端侧边导航 */}
      <SectionNav />

      {/* 本地时间显示 */}
      {siteContent?.showLocalTime !== false && <LocalTime />}

      {/* 返回顶部按钮 */}
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
