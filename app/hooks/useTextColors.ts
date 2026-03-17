import { useMemo } from 'react'
import { useThemeStore } from '../stores/theme-store'
import { useConfigStore } from '../(home)/stores/config-store'

export function useTextColors() {
  const { theme } = useThemeStore()
  const { siteContent } = useConfigStore()

  const textColor = useMemo(() => {
    return theme === 'dark'
      ? (siteContent?.site?.textColor?.dark || '#ffffff')
      : (siteContent?.site?.textColor?.light || '#1f2937')
  }, [theme, siteContent?.site?.textColor])

  const textSecondaryColor = useMemo(() => {
    return theme === 'dark'
      ? (siteContent?.site?.textSecondaryColor?.dark || 'rgba(255, 255, 255, 0.9)')
      : (siteContent?.site?.textSecondaryColor?.light || 'rgba(31, 41, 55, 0.9)')
  }, [theme, siteContent?.site?.textSecondaryColor])

  return { textColor, textSecondaryColor }
}
