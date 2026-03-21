/* eslint-disable react-hooks/refs */
"use client";

import Image from "next/image";
import { useLanguageStore } from "../../stores/language-store";
import { useThemeStore } from "../../stores/theme-store";
import { projectsConfig, moreProjectsConfig } from "../../site-config";
import { getThemeColors } from "../../themeConfig";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useConfigStore } from "../../stores/config-store";

export default function FeaturedProjects() {
  const { language, t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = getThemeColors(theme);
  const { siteContent } = useConfigStore();

  const projectsSection = useScrollAnimation({ threshold: 0.1 });

  if (siteContent?.showProjects === false) {
    return null;
  }

  return (
    <div id="projects" className="w-full max-w-5xl mx-auto">
      <div 
        ref={projectsSection.ref as React.RefObject<HTMLDivElement>}
        className={`relative group transition-all duration-1000 ${
          projectsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500 ${
          theme === "dark"
            ? "bg-linear-to-r from-violet-500/30 via-purple-500/30 to-fuchsia-500/30"
            : "bg-linear-to-r from-blue-400/20 via-green-400/20 to-teal-400/20"
        }`}></div>
        <div className={`relative ${colors.cardBackground}/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border ${colors.border} hover:${colors.borderHover} transition-all duration-300`}>
          <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${colors.text}`}>
            <span className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-400 to-fuchsia-600 flex items-center justify-center">
              <i className="fas fa-star text-white text-sm"></i>
            </span>
            {t("featuredProjects")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsConfig.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/project relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  theme === "dark" 
                    ? "bg-white/5 hover:bg-white/10 hover:shadow-2xl" 
                    : "bg-white shadow-md hover:shadow-xl border border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover/project:scale-125"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-8 h-8 rounded-lg bg-linear-to-br ${project.gradient} flex items-center justify-center`}>
                        <i className={`${project.icon} text-white text-xs`}></i>
                      </span>
                      <h4 className="text-white font-semibold text-lg">{project.name}</h4>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className={`text-sm mb-4 line-clamp-2 ${colors.textSecondary}`}>
                    {project.description[language]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${
                          theme === "dark" 
                            ? "bg-white/10 text-white/80 hover:bg-white/20" 
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className={`flex items-center gap-2 text-sm transition-colors ${colors.textSecondary} group-hover/project:${theme === "dark" ? "text-white/80" : "text-blue-600"}`}>
                    <span>{t("viewProject")}</span>
                    <i className="fas fa-arrow-right transition-transform group-hover/project:translate-x-1"></i>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href={moreProjectsConfig.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                theme === "dark"
                  ? "bg-linear-to-r from-violet-500 to-fuchsia-600 text-white hover:from-violet-600 hover:to-fuchsia-700"
                  : "bg-linear-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700"
              }`}
            >
              <span>{moreProjectsConfig.title[language]}</span>
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
