/**
 * 顶部工具栏组件
 * 包含语言切换和主题切换功能
 * 固定在页面顶部右侧
 * 支持响应式布局
 */
"use client";

import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeTransition from "../effects/ThemeTransition";

interface TopToolbarProps {
  className?: string;
}

export default function TopToolbar({ className = "" }: TopToolbarProps) {
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
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </>
  );
}
