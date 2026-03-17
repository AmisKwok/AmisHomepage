import type { ThemeColors, Theme } from "../types";

export const themeConfig: Record<Theme, ThemeColors> = {
  dark: {
    background: "#0a0a0a",
    cardBackground: "#0d0d1a",
    text: "text-white",
    textSecondary: "text-white/60",
    border: "border-white/10",
    borderHover: "border-white/20",
    hoverBackground: "hover:bg-white/10",
    iconBackground: "bg-white/10",
    overlay: "bg-black/30",
  },
  light: {
    background: "#f5f5f5",
    cardBackground: "#ffffff",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-gray-200",
    borderHover: "border-gray-400",
    hoverBackground: "hover:bg-gray-50",
    iconBackground: "bg-gray-100",
    overlay: "bg-white/20",
  },
};

export const getThemeColors = (theme: Theme): ThemeColors => {
  return themeConfig[theme];
};
