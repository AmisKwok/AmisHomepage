"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { techStackConfig, aboutMeConfig } from "../config";

export default function AboutCard() {
  const { language, t } = useLanguage();

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* 关于我 */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-rocket text-yellow-400"></i>
          {t("aboutMe")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 text-white/80">
            <i className="fas fa-user text-blue-400 w-5"></i>
            <span>{aboutMeConfig.name}</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <i className="fas fa-map-marker-alt text-red-400 w-5"></i>
            <span>{aboutMeConfig.location[language]}</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <i className="fas fa-briefcase text-green-400 w-5"></i>
            <span>{aboutMeConfig.focus[language]}</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <i className="fas fa-heart text-pink-400 w-5"></i>
            <span>{aboutMeConfig.hobbies[language]}</span>
          </div>
        </div>
      </div>

      {/* 技术栈 */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-tools text-purple-400"></i>
          {t("techStack")}
        </h3>

        {/* Backend */}
        <div className="mb-4">
          <p className="text-white/60 text-xs mb-2 flex items-center gap-2">
            <i className="fas fa-server"></i>
            {t("backend")}
          </p>
          <div className="flex flex-wrap gap-2">
            {techStackConfig.backend.map((tech) => (
              <span
                key={tech.name}
                className={`${tech.color} text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:scale-105 transition-transform cursor-default`}
              >
                <i className={tech.icon}></i>
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <p className="text-white/60 text-xs mb-2 flex items-center gap-2">
            <i className="fas fa-mobile-alt"></i>
            {t("mobile")}
          </p>
          <div className="flex flex-wrap gap-2">
            {techStackConfig.mobile.map((tech) => (
              <span
                key={tech.name}
                className={`${tech.color} text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:scale-105 transition-transform cursor-default`}
              >
                <i className={tech.icon}></i>
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Frontend */}
        <div>
          <p className="text-white/60 text-xs mb-2 flex items-center gap-2">
            <i className="fas fa-laptop-code"></i>
            {t("frontend")}
          </p>
          <div className="flex flex-wrap gap-2">
            {techStackConfig.frontend.map((tech) => (
              <span
                key={tech.name}
                className={`${tech.color} text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:scale-105 transition-transform cursor-default`}
              >
                <i className={tech.icon}></i>
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 当前关注 */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-bullseye text-red-400"></i>
          {t("currentFocus")}
        </h3>

        <div className="space-y-3">
          {aboutMeConfig.currentFocus.map((item, index) => (
            <div key={index} className="flex items-start gap-3 text-white/80 text-sm">
              <i className={item.icon + " mt-1"}></i>
              <span>{item.text[language]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 座右铭 */}
      <div className="text-center py-4">
        <p className="text-white/60 text-sm italic">
          💡 "{aboutMeConfig.motto[language]}"
        </p>
      </div>
    </div>
  );
}
