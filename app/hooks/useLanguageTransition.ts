/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useLanguageStore } from '../stores/language-store'

export function useLanguageTransition() {
  const { language, hydrated } = useLanguageStore()
  const [isLanguageChanging, setIsLanguageChanging] = useState(false)
  const [prevLanguage, setPrevLanguage] = useState(language)

  useEffect(() => {
    if (!hydrated) return
    if (prevLanguage !== language) {
      setIsLanguageChanging(true)
      const timer = setTimeout(() => {
        setIsLanguageChanging(false)
        setPrevLanguage(language)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [language, prevLanguage, hydrated])

  return { isLanguageChanging }
}
