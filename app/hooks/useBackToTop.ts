/**
 * 返回顶部 Hook
 * 监听滚动位置，控制返回顶部按钮的显示/隐藏
 */
import { useState, useEffect, useCallback } from 'react'

/**
 * 返回顶部 Hook
 * @param threshold - 显示按钮的滚动阈值（像素）
 * @returns showBackToTop - 是否显示返回顶部按钮
 * @returns scrollToTop - 滚动到顶部的函数
 */
export function useBackToTop(threshold = 500) {
  const [showBackToTop, setShowBackToTop] = useState(false)

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > threshold)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return { showBackToTop, scrollToTop }
}
