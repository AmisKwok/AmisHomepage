/**
 * 首页组件
 * 个人主页的主要展示页面
 * 包含：头部背景、导航菜单、个人信息、项目展示、技能展示、页脚等
 */
"use client";

import { useState, useEffect, useCallback } from "react";
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
import SocialIcon from "./components/ui/SocialIcon";
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
  // 问候语状态
  const [greeting, setGreeting] = useState("");
  // 头像悬停状态
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  // 问候语拆分后的短语
  const [greetingParts, setGreetingParts] = useState<string[]>([]);
  // 每个短语的位置（左边还是右边）
  const [phrasePositions, setPhrasePositions] = useState<{ [key: number]: 'left' | 'right' }>({});
  // 随机显示的索引
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);

  // 获取问候语的函数
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    const currentLang = useLanguageStore.getState().language;
    
    // 从配置中获取问候语，如果没有配置则使用默认翻译
    if (hour >= 5 && hour < 12) {
      return siteContent?.greetings?.morning?.[currentLang] || t("greetingMorning");
    } else if (hour >= 12 && hour < 18) {
      return siteContent?.greetings?.afternoon?.[currentLang] || t("greetingAfternoon");
    } else {
      return siteContent?.greetings?.evening?.[currentLang] || t("greetingEvening");
    }
  }, [t, siteContent]);

  // 初始化语言状态
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 更新问候语
  useEffect(() => {
    if (hydrated) {
      setGreeting(getGreeting());
      // 每分钟更新一次问候语，确保在时间跨过时也能更新
      const interval = setInterval(() => {
        setGreeting(getGreeting());
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [hydrated, getGreeting, siteContent]);

  // 拆分问候语为短语（按标点符号）
  useEffect(() => {
    if (greeting) {
      const parts = greeting.split(/([!！。？?，,])/).reduce((acc, part, index) => {
        if (index % 2 === 0 && part.trim()) {
          acc.push(part.trim());
        } else if (index % 2 === 1 && acc.length > 0) {
          acc[acc.length - 1] += part;
        }
        return acc;
      }, [] as string[]);
      setGreetingParts(parts.length > 0 ? parts : [greeting]);
    }
  }, [greeting]);

  // 头像悬停时随机顺序显示短语并重新分配位置
  useEffect(() => {
    if (isAvatarHovered && greetingParts.length > 0) {
      setVisibleIndices([]);
      // 每次悬停时重新随机分配位置
      const positions: { [key: number]: 'left' | 'right' } = {};
      greetingParts.forEach((_, index) => {
        positions[index] = Math.random() > 0.5 ? 'left' : 'right';
      });
      setPhrasePositions(positions);
      
      const indices = Array.from({ length: greetingParts.length }, (_, i) => i);
      const shuffled = [...indices].sort(() => Math.random() - 0.5);
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < shuffled.length) {
          setVisibleIndices(prev => {
            const newIndices = [...prev, shuffled[i]];
            return newIndices;
          });
          i++;
        } else {
          clearInterval(interval);
          // 确保所有短语都显示了
          setTimeout(() => {
            setVisibleIndices(prev => {
              const allIndices = Array.from({ length: greetingParts.length }, (_, i) => i);
              const missingIndices = allIndices.filter(index => !prev.includes(index));
              if (missingIndices.length > 0) {
                return [...prev, ...missingIndices];
              }
              return prev;
            });
          }, 100);
        }
      }, 300);
      return () => clearInterval(interval);
    } else if (!isAvatarHovered) {
      setVisibleIndices([]);
    }
  }, [isAvatarHovered, greetingParts]);



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
            {guestbookConfig?.enabled && (
              <Link 
                href="/guestbook"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: textColor
                }}
                title={t("guestbook")}
              >
                <i className="fas fa-comments text-sm"></i>
              </Link>
            )}
            {friendLinksConfig?.enabled && (
              <Link 
                href="/friends"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                style={{ 
                  backgroundColor: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(229,231,235,1)",
                  color: textColor
                }}
                title={t("friendLinks")}
              >
                <i className="fas fa-link text-sm"></i>
              </Link>
            )}
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
          {/* 头像和问候语容器 - 移动端隐藏问候语 */}
          <div className="relative flex items-center justify-center gap-8 mb-6">
            {/* 左侧短语容器 */}
            {siteContent?.showGreetings !== false && (
              <div className="hidden md:flex flex-col items-end justify-center w-56 lg:w-64 gap-3">
                {greetingParts.map((part, index) => (
                  phrasePositions[index] === 'left' && (
                    <span
                      key={`left-${index}`}
                      className={`text-lg lg:text-xl font-medium transition-all duration-300 ${
                        visibleIndices.includes(index) 
                          ? 'opacity-100 translate-x-0 scale-100' 
                          : 'opacity-0 -translate-x-6 scale-75'
                      }`}
                      style={{
                        color: textColor,
                        transitionDelay: `${visibleIndices.indexOf(index) * 0.15}s`
                      }}
                    >
                      {part}
                    </span>
                  )
                ))}
              </div>
            )}
            
            <Avatar 
              src="/images/avatar.jpg" 
              alt="Amis" 
              size={140} 
              className=""
              onHoverStart={() => siteContent?.showGreetings !== false && setIsAvatarHovered(true)}
              onHoverEnd={() => setIsAvatarHovered(false)}
            />
            
            {/* 右侧短语容器 */}
            {siteContent?.showGreetings !== false && (
              <div className="hidden md:flex flex-col items-start justify-center w-56 lg:w-64 gap-3">
                {greetingParts.map((part, index) => (
                  phrasePositions[index] === 'right' && (
                    <span
                      key={`right-${index}`}
                      className={`text-lg lg:text-xl font-medium transition-all duration-300 ${
                        visibleIndices.includes(index) 
                          ? 'opacity-100 translate-x-0 scale-100' 
                          : 'opacity-0 translate-x-6 scale-75'
                      }`}
                      style={{
                        color: textColor,
                        transitionDelay: `${visibleIndices.indexOf(index) * 0.15}s`
                      }}
                    >
                      {part}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
          
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
              delay={2500}
            />
          </div>
          
          <div id="site_social_icons" className="flex items-center gap-4 flex-wrap justify-center">
            <SocialIcon
              href={linksConfig.email?.url || "#"}
              icon="fas fa-envelope"
              title={linksConfig.email?.title[useLanguageStore.getState().language] || ""}
              show={linksConfig.email?.show !== false}
              theme={theme}
              textColor={textColor}
            />
            <SocialIcon
              href={linksConfig.github?.url || "#"}
              icon="fab fa-github"
              title={linksConfig.github?.title[useLanguageStore.getState().language] || ""}
              show={linksConfig.github?.show !== false}
              theme={theme}
              textColor={textColor}
            />
            <SocialIcon
              href={linksConfig.gitee?.url || "#"}
              icon="fab fa-gitee"
              title={linksConfig.gitee?.title[useLanguageStore.getState().language] || ""}
              show={linksConfig.gitee?.show !== false}
              theme={theme}
              textColor={textColor}
            />
            <SocialIcon
              href={linksConfig.blog?.url || "#"}
              icon="fas fa-blog"
              title={linksConfig.blog?.title[useLanguageStore.getState().language] || ""}
              show={linksConfig.blog?.show !== false}
              theme={theme}
              textColor={textColor}
            />
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
