/**
 * 语言切换过渡动画 Hook
 * 监听语言变化，提供过渡动画状态
 */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useLanguageStore } from '../stores/language-store'

/**
 * 语言切换过渡动画 Hook
 * @returns isLanguageChanging - 是否正在切换语言
 */
export function useLanguageTransition() {
  const { language, hydrated } = useLanguageStore()
  const [isLanguageChanging, setIsLanguageChanging] = useState(false)
  const [prevLanguage, setPrevLanguage] = useState(language)

  useEffect(() => {
    if (!hydrated) return
    // 检测语言变化
    if (prevLanguage !== language) {
      setIsLanguageChanging(true)
      // 300ms 后结束过渡动画
      const timer = setTimeout(() => {
        setIsLanguageChanging(false)
        setPrevLanguage(language)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [language, prevLanguage, hydrated])

  return { isLanguageChanging }
}
