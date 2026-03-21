"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useThemeStore } from "../../stores/theme-store";
import { useConfigStore } from "../../stores/config-store";
import { guestbookConfig, friendLinksConfig } from "../../site-config";

type Section = "about" | "projects" | "skills";

export default function MobileNav() {
  const { theme } = useThemeStore();
  const { siteContent } = useConfigStore();
  const [currentSection, setCurrentSection] = useState<Section>("projects");
  const [isVisible, setIsVisible] = useState(false);
  const isScrollingRef = useRef(false);

  const sections: { id: Section; icon: string }[] = useMemo(() => [
    ...(siteContent?.showProjects !== false ? [{ id: "projects" as Section, icon: "fas fa-star" }] : []),
    { id: "about" as Section, icon: "fas fa-user" },
    ...(siteContent?.showSkills !== false ? [{ id: "skills" as Section, icon: "fas fa-chart-line" }] : []),
  ], [siteContent?.showProjects, siteContent?.showSkills]);

  const scrollToSection = (sectionId: Section) => {
    const section = document.getElementById(sectionId);
    if (section) {
      isScrollingRef.current = true;
      setCurrentSection(sectionId);
      section.scrollIntoView({ behavior: "smooth" });
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const sectionIds = sections.map(s => s.id);
      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
          if (isVisible) {
            setCurrentSection(sectionId as Section);
            break;
          }
        }
      }

      const scrollY = window.scrollY;
      setIsVisible(scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className={`fixed bottom-4 left-4 z-40 md:hidden transition-all duration-300 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
    }`}>
      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md ${
              currentSection === section.id
                ? "bg-linear-to-br from-blue-500 to-purple-600 shadow-lg scale-110"
                : theme === "dark"
                  ? "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  : "bg-white hover:bg-gray-50 border border-gray-200 shadow-lg"
            }`}
            title={section.id}
          >
            <i className={`${section.icon} ${currentSection === section.id ? "text-white" : theme === "dark" ? "text-white" : "text-gray-600"} text-sm`}></i>
          </button>
        ))}
        {guestbookConfig?.enabled && (
          <Link
            href="/guestbook"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md ${
              theme === "dark"
                ? "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                : "bg-white hover:bg-gray-50 border border-gray-200 shadow-lg"
            }`}
            title="guestbook"
          >
            <i className={`fas fa-comments ${theme === "dark" ? "text-white" : "text-gray-600"} text-sm`}></i>
          </Link>
        )}
        {friendLinksConfig?.enabled && (
          <Link
            href="/friends"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md ${
              theme === "dark"
                ? "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                : "bg-white hover:bg-gray-50 border border-gray-200 shadow-lg"
            }`}
            title="friends"
          >
            <i className={`fas fa-link ${theme === "dark" ? "text-white" : "text-gray-600"} text-sm`}></i>
          </Link>
        )}
      </div>
    </div>
  );
}
