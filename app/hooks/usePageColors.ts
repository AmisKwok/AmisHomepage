/**
 * 页面颜色配置 Hook
 * 根据主题返回统一的颜色配置
 * 用于友链、留言板等页面
 */
import { useThemeStore } from "@/app/stores/theme-store";

interface PageColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  glow: string;
}

interface UsePageColorsOptions {
  glowColor?: 'violet' | 'pink' | 'blue';
}

export function usePageColors(options: UsePageColorsOptions = {}): PageColors {
  const { glowColor = 'violet' } = options;
  const { theme } = useThemeStore();

  const glowColors = {
    violet: {
      dark: "shadow-violet-500/20",
      light: "shadow-violet-500/10"
    },
    pink: {
      dark: "shadow-pink-500/20",
      light: "shadow-pink-500/10"
    },
    blue: {
      dark: "shadow-blue-500/20",
      light: "shadow-blue-500/10"
    }
  };

  return {
    background: theme === "dark" 
      ? "bg-linear-to-br from-[#0a0a0a] via-[#0f0f23] to-[#1a1a2e]" 
      : "bg-linear-to-br from-gray-50 via-white to-gray-100",
    card: theme === "dark" 
      ? "bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20" 
      : "bg-white/80 backdrop-blur-md border border-gray-200 hover:border-gray-300",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
    glow: theme === "dark" ? glowColors[glowColor].dark : glowColors[glowColor].light,
  };
}
