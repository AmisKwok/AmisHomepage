/**
 * 主题配置文件
 * 定义深色/浅色主题的颜色变量
 */
import type { ThemeColors, Theme } from "../types";

// 主题颜色配置映射
export const themeConfig: Record<Theme, ThemeColors> = {
  // 深色主题配置
  dark: {
    background: "#0a0a0a",           // 页面背景色
    cardBackground: "#0d0d1a",       // 卡片背景色
    text: "text-white",              // 主文字颜色
    textSecondary: "text-white/60",  // 次要文字颜色
    border: "border-white/10",       // 边框颜色
    borderHover: "border-white/20",  // 边框悬停颜色
    hoverBackground: "hover:bg-white/10",  // 悬停背景
    iconBackground: "bg-white/10",   // 图标背景
    overlay: "bg-black/30",          // 遮罩层颜色
  },
  // 浅色主题配置
  light: {
    background: "#f5f5f5",           // 页面背景色
    cardBackground: "#ffffff",       // 卡片背景色
    text: "text-gray-900",           // 主文字颜色
    textSecondary: "text-gray-600",  // 次要文字颜色
    border: "border-gray-200",       // 边框颜色
    borderHover: "border-gray-400",  // 边框悬停颜色
    hoverBackground: "hover:bg-gray-50",  // 悬停背景
    iconBackground: "bg-gray-100",   // 图标背景
    overlay: "bg-white/20",          // 遮罩层颜色
  },
};

/**
 * 根据主题名称获取对应的颜色配置
 * @param theme - 主题名称 ('dark' | 'light')
 * @returns 主题颜色配置对象
 */
export const getThemeColors = (theme: Theme): ThemeColors => {
  return themeConfig[theme];
};
