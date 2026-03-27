/**
 * 顶部工具栏组件
 * 包含语言切换、主题切换和特效切换功能
 * 固定在页面顶部右侧
 * 支持响应式布局
 */
"use client";

import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeTransition from "../effects/ThemeTransition";
import EffectsToggleButton from "./EffectsToggleButton";
import { useSiteConfig } from "@/app/hooks/useSiteConfig";

interface TopToolbarProps {
  className?: string;
}

export default function TopToolbar({ className = "" }: TopToolbarProps) {
  const { siteContent } = useSiteConfig();
  const showEffectsToggle = siteContent?.showEffectsToggle !== false;

  return (
    <>
      {/* 主题切换过渡动画 */}
      <ThemeTransition />
      
      {/* 
        移动端/桌面端：与 PageNav 按钮垂直居中对齐
        页面容器：py-8 (32px top padding)
        PageNav 按钮：py-2 (8px) + 按钮高度约 32px
        按钮中心：32px + 16px = 48px from top
        TopToolbar 高度约 28px，中心位置 = 48px - 14px = 34px
      */}
      <div className={`fixed top-[34px] right-4 z-60 flex items-center gap-2 sm:gap-3 ${className}`}>
        {/* 特效开关按钮 - 仅桌面端显示，根据配置决定是否显示 */}
        {showEffectsToggle && (
          <div className="hidden md:block">
            <EffectsToggleButton />
          </div>
        )}
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </>
  );
}
