import { useState, useEffect } from 'react'
import { useConfigStore } from '../stores/config-store'

export function useSiteConfig() {
  const { siteContent, setSiteContent } = useConfigStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        const data = await response.json()
        const config = data.config || data
        setSiteContent({
          showProjects: config.showProjects,
          showSkills: config.showSkills,
          showLocalTime: config.showLocalTime,
          showCustomCursor: config.showCustomCursor,
          customCursorPath: config.customCursorPath,
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
