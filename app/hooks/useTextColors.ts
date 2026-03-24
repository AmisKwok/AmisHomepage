/**
 * 文字颜色 Hook
 * 根据主题和站点配置获取文字颜色
 */
import { useMemo } from 'react'
import { useThemeStore } from '../stores/theme-store'
import { useConfigStore } from '../stores/config-store'

/**
 * 文字颜色 Hook
 * @returns textColor - 主文字颜色
 * @returns textSecondaryColor - 次要文字颜色
 */
export function useTextColors() {
  const { theme } = useThemeStore()
  const { siteContent } = useConfigStore()

  // 主文字颜色
  const textColor = useMemo(() => {
    return theme === 'dark'
      ? (siteContent?.site?.textColor?.dark || '#ffffff')
      : (siteContent?.site?.textColor?.light || '#1f2937')
  }, [theme, siteContent?.site?.textColor])

  // 次要文字颜色
  const textSecondaryColor = useMemo(() => {
    return theme === 'dark'
      ? (siteContent?.site?.textSecondaryColor?.dark || 'rgba(255, 255, 255, 0.9)')
      : (siteContent?.site?.textSecondaryColor?.light || 'rgba(31, 41, 55, 0.9)')
  }, [theme, siteContent?.site?.textSecondaryColor])

  return { textColor, textSecondaryColor }
}
