"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { techStackConfig, aboutMeConfig } from "../config";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function AboutCard() {
  const { language, t } = useLanguage();

  const aboutSection = useScrollAnimation({ threshold: 0.1 });
  const techSection = useScrollAnimation({ threshold: 0.1 });
  const focusSection = useScrollAnimation({ threshold: 0.1 });
  const mottoSection = useScrollAnimation({ threshold: 0.1 });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* 关于我 */}
      <div 
        ref={aboutSection.ref as React.RefObject<HTMLDivElement>}
        className={`relative group transition-all duration-1000 ${
          aboutSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative bg-[#0d0d1a]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <i className="fas fa-rocket text-white text-sm"></i>
            </span>
            {t("aboutMe")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "fas fa-user", color: "from-blue-400 to-blue-600", value: aboutMeConfig.name },
              { icon: "fas fa-map-marker-alt", color: "from-red-400 to-red-600", value: aboutMeConfig.location[language] },
              { icon: "fas fa-briefcase", color: "from-green-400 to-green-600", value: aboutMeConfig.focus[language] },
              { icon: "fas fa-heart", color: "from-pink-400 to-pink-600", value: aboutMeConfig.hobbies[language] },
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:translate-x-1"
              >
                <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                  <i className={`${item.icon} text-white text-xs`}></i>
                </span>
                <span className="text-white/80 text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 技术栈 */}
      <div 
        ref={techSection.ref as React.RefObject<HTMLDivElement>}
        className={`relative group transition-all duration-1000 delay-200 ${
          techSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative bg-[#0d0d1a]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
              <i className="fas fa-tools text-white text-sm"></i>
            </span>
            {t("techStack")}
          </h3>

          <div className="space-y-5">
            {[
              { key: "backend", data: techStackConfig.backend, icon: "fas fa-server", gradient: "from-orange-500 to-red-500" },
              { key: "mobile", data: techStackConfig.mobile, icon: "fas fa-mobile-alt", gradient: "from-blue-500 to-cyan-500" },
              { key: "frontend", data: techStackConfig.frontend, icon: "fas fa-laptop-code", gradient: "from-purple-500 to-pink-500" },
            ].map((category) => (
              <div key={category.key}>
                <p className="text-white/60 text-xs mb-2 flex items-center gap-2">
                  <i className={category.icon}></i>
                  {t(category.key as "backend" | "mobile" | "frontend")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.data.map((tech, index) => (
                    <span
                      key={tech.name}
                      className="relative group/tag"
                    >
                      <span className="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover/tag:blur-md transition-all duration-300 opacity-0 group-hover/tag:opacity-100"></span>
                      <span
                        className={`relative ${tech.color} text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:scale-110 transition-all duration-300 cursor-default shadow-lg`}
                      >
                        <i className={tech.icon}></i>
                        {tech.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 当前关注 */}
      <div 
        ref={focusSection.ref as React.RefObject<HTMLDivElement>}
        className={`relative group transition-all duration-1000 delay-400 ${
          focusSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative bg-[#0d0d1a]/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center">
              <i className="fas fa-bullseye text-white text-sm"></i>
            </span>
            {t("currentFocus")}
          </h3>

          <div className="space-y-3">
            {aboutMeConfig.currentFocus.map((item, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:translate-x-1"
              >
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <i className={item.icon}></i>
                </span>
                <span className="text-white/80 text-sm leading-relaxed">{item.text[language]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 座右铭 */}
      <div 
        ref={mottoSection.ref as React.RefObject<HTMLDivElement>}
        className={`relative transition-all duration-1000 delay-600 ${
          mottoSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-xl"></div>
        <div className="relative text-center py-6 px-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <span className="text-2xl">💡</span>
            <p className="text-white/80 text-sm italic">
              "{aboutMeConfig.motto[language]}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
