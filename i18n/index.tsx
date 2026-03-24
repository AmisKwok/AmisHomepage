/**
 * 国际化 (i18n) 配置文件
 * 使用 react-i18next 实现多语言支持
 * 支持客户端语言持久化和自动检测系统语言
 */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhMessages from './messages/zh.json'  // 中文翻译文件
import enMessages from './messages/en.json'  // 英文翻译文件

// 语言资源配置
const resources = {
	zh: { translation: zhMessages },
	en: { translation: enMessages }
}

// 初始化标记，防止重复初始化
let initialized = false

/**
 * 初始化 i18n 实例
 * - 加载语言资源
 * - 检测初始语言（localStorage > 系统语言 > 默认中文）
 * - 监听语言变化并持久化
 */
function initI18n() {
	if (initialized) return

	/**
	 * 获取初始语言
	 * 优先级：localStorage > 系统语言设置 > 默认中文
	 */
	const getInitialLanguage = (): string => {
		if (typeof window === 'undefined') return 'zh'
		const savedLang = localStorage.getItem('language')
		if (savedLang === 'zh' || savedLang === 'en') return savedLang
		const systemLang = navigator.language.toLowerCase()
		if (systemLang.startsWith('zh')) return 'zh'
		return 'en'
	}

	// 初始化 i18next
	i18n.use(initReactI18next).init({
		resources,
		lng: getInitialLanguage(),
		fallbackLng: 'zh',  // 回退语言
		interpolation: {
			escapeValue: false  // React 已自动转义，无需重复
		}
	})

	// 监听语言变化，持久化到 localStorage 和 cookie
	i18n.on('languageChanged', (lng) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('language', lng)
			// cookie 用于服务端渲染时获取语言
			document.cookie = `language=${lng};path=/;max-age=31536000`
		}
	})

	initialized = true
}

/**
 * i18n Provider 组件
 * 确保在客户端完成初始化后再渲染子组件
 * 避免服务端渲染与客户端水合不一致
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		initI18n()
		setIsReady(true)
	}, [])

	// 初始化完成前不渲染，避免水合错误
	if (!isReady) {
		return null
	}

	return <>{children}</>
}

export default i18n
