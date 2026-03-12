"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function StatusCard() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
        {/* 关于我 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <i className="fas fa-user text-blue-400"></i>
            {t("aboutMe")}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed">
            {t("aboutMeContent")}
          </p>
        </div>

        {/* 心情 */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
            <i className="fas fa-heart text-white text-xl"></i>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">{t("statusMood")}</p>
            <p className="text-white font-medium">{t("statusMoodValue")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
