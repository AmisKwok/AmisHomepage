/**
 * 主题状态管理 Store
 * 使用 Zustand 管理应用的深色/浅色主题切换
 * 支持主题过渡动画和本地存储持久化
 */
import { create } from 'zustand'
import type { Theme } from '../../types'

// 主题 Store 接口定义
interface ThemeStore {
	theme: Theme                     // 当前主题
	isTransitioning: boolean         // 是否正在过渡动画中
	toggleTheme: () => void          // 切换主题
	setTheme: (theme: Theme) => void // 设置主题
}

// 主题过渡动画时长（毫秒）
const THEME_TRANSITION_TOTAL = 500
// localStorage 存储键名
const THEME_STORAGE_KEY = 'theme'

/**
 * 获取初始主题
 * 优先从 localStorage 读取，其次检测系统偏好
 */
function getInitialTheme(): Theme {
	if (typeof window === 'undefined') return 'dark'
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
	if (savedTheme) return savedTheme
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * 应用主题到 DOM
 * 更新 html 元素的 class
 */
function applyTheme(theme: Theme) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.remove('dark', 'light')
		document.documentElement.classList.add(theme)
	}
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
	theme: 'dark',
	isTransitioning: false,

	// 直接设置主题（无动画）
	setTheme: (theme: Theme) => {
		localStorage.setItem(THEME_STORAGE_KEY, theme)
		applyTheme(theme)
		set({ theme })
	},

	// 切换主题（带过渡动画）
	toggleTheme: () => {
		const { isTransitioning, theme } = get()
		// 防止过渡动画期间重复触发
		if (isTransitioning) return

		set({ isTransitioning: true })

		// 使用 requestAnimationFrame 确保动画流畅
		requestAnimationFrame(() => {
			const newTheme = theme === 'dark' ? 'light' : 'dark'
			localStorage.setItem(THEME_STORAGE_KEY, newTheme)
			applyTheme(newTheme)
			set({ theme: newTheme })

			// 动画结束后重置状态
			setTimeout(() => {
				requestAnimationFrame(() => {
					set({ isTransitioning: false })
				})
			}, THEME_TRANSITION_TOTAL)
		})
	}
}))

// 客户端初始化：恢复保存的主题
if (typeof window !== 'undefined') {
	const initialTheme = getInitialTheme()
	useThemeStore.setState({ theme: initialTheme })
	applyTheme(initialTheme)
}
