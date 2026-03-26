/**
 * 站点配置 Hook
 * 从 API 加载站点配置并存储到 Zustand Store
 */
import { useState, useEffect } from 'react'
import { useConfigStore } from '../stores/config-store'

/**
 * 站点配置 Hook
 * @returns siteContent - 站点内容配置
 * @returns isLoading - 加载状态
 */
export function useSiteConfig() {
  const { siteContent, setSiteContent } = useConfigStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 加载配置
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        const data = await response.json()
        const config = data.config || data
        // 设置站点内容配置
        setSiteContent({
          showProjects: config.showProjects,
          showSkills: config.showSkills,
          showLocalTime: config.showLocalTime,
          showCustomCursor: config.showCustomCursor,
          customCursorPath: config.customCursorPath,
          typeWriterEffects: config.typeWriterEffects,
          heroTitleEffects: config.heroTitleEffects,
          site: {
            backgroundImage: config.site?.backgroundImage,
            textColor: config.site?.textColor,
            textSecondaryColor: config.site?.textSecondaryColor
          }
        })
      } catch (error) {
        console.error('Failed to load config:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadConfig()
  }, [setSiteContent])

  return { siteContent, isLoading }
}
