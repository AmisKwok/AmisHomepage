/**
 * 语言状态管理 Store
 * 使用 Zustand 管理应用的多语言状态
 * 与 react-i18next 配合使用，同步语言切换
 */
import { create } from 'zustand'
import i18n from '../../i18n'

// 支持的语言类型
export type Language = 'zh' | 'en'

// 语言 Store 接口定义
interface LanguageStore {
	language: Language              // 当前语言
	hydrated: boolean               // 是否已完成客户端水合
	setLanguage: (lang: Language) => void   // 设置语言
	toggleLanguage: () => void              // 切换语言
	hydrate: () => void                     // 客户端水合初始化
}

/**
 * 获取系统语言
 * 根据浏览器语言设置自动检测
 */
function getSystemLanguage(): Language {
	if (typeof window === 'undefined') return 'zh'
	const systemLang = navigator.language.toLowerCase()
	if (systemLang.startsWith('zh')) return 'zh'
	return 'en'
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
	language: 'zh',
	hydrated: false,

	// 设置语言并同步到 i18n
	setLanguage: (lang: Language) => {
		i18n.changeLanguage(lang)
		set({ language: lang })
	},

	// 切换中英文
	toggleLanguage: () => {
		const { language, setLanguage } = get()
		setLanguage(language === 'zh' ? 'en' : 'zh')
	},

	// 客户端水合：从 localStorage 恢复语言设置
	hydrate: () => {
		const savedLang = localStorage.getItem('language') as Language | null
		const initialLang = savedLang && (savedLang === 'zh' || savedLang === 'en')
			? savedLang
			: getSystemLanguage()
		i18n.changeLanguage(initialLang)
		set({ language: initialLang, hydrated: true })
	}
}))

// 导出 react-i18next 的翻译 hook
export { useTranslation } from 'react-i18next'
