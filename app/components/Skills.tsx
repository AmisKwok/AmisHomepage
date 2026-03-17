/* eslint-disable prefer-const */
 
"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "../stores/language-store";
import { useThemeStore } from "../stores/theme-store";
import { skillsConfig } from "../config";
import { getThemeColors } from "../config/themeConfig";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useConfigStore } from "../(home)/stores/config-store";

export default function Skills() {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const colors = getThemeColors(theme);
  const { siteContent } = useConfigStore();
  const [animatedLevels, setAnimatedLevels] = useState<Record<string, number>>({});

  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    if (isVisible) {
      skillsConfig.forEach((skill) => {
        let start = 0;
        const end = skill.level;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          setAnimatedLevels((prev) => ({
            ...prev,
            [skill.name]: Math.round(start + (end - start) * easeOutQuart),
          }));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      });
    }
  }, [isVisible]);

  if (siteContent?.showSkills === false) {
    return null;
  }

  return (
    <div id="skills" className="w-full max-w-3xl mx-auto">
      <div 
        ref={ref}
        className={`relative group transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30"
            : "bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20"
        }`}></div>
        <div className={`relative ${colors.cardBackground}/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border ${colors.border} hover:${colors.borderHover} transition-all duration-300`}>
          <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${colors.text}`}>
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center">
              <i className="fas fa-chart-line text-white text-sm"></i>
            </span>
            {t("skills")}
          </h3>

          <div className="space-y-4">
            {skillsConfig.map((skill, index) => (
              <div key={skill.name} className="group/skill">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center`}>
                      <i className={`${skill.icon} text-white text-xs`}></i>
                    </span>
                    <span className={`font-medium ${colors.text}`}>{skill.name}</span>
                  </div>
                  <span className={`text-sm font-mono ${colors.textSecondary}`}>
                    {animatedLevels[skill.name] || 0}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  theme === "dark" 
                    ? "bg-white/10" 
                    : "bg-gray-200 border border-gray-100"
                }`}>
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out group-hover/skill:brightness-110`}
                    style={{ 
                      width: `${animatedLevels[skill.name] || 0}%`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
