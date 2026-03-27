/**
 * 特效切换按钮组件
 * 用于控制网站特效的开关
 * 支持多语言提示
 */
"use client";

import { useEffectsStore } from "@/app/stores/effects-store";
import { useTranslation } from "@/app/stores/language-store";

export default function EffectsToggleButton() {
  const { effectsEnabled, toggleEffects } = useEffectsStore();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleEffects}
      className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
      title={effectsEnabled ? t('disableEffects') : t('enableEffects')}
      aria-label={effectsEnabled ? t('disableEffects') : t('enableEffects')}
    >
      <i className={`fas ${effectsEnabled ? 'fa-wand-magic-sparkles' : 'fa-wand-magic'} text-sm`}></i>
    </button>
  );
}
