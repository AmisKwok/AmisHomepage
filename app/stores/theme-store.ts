import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeStore {
	theme: Theme
	isTransitioning: boolean
	toggleTheme: () => void
	setTheme: (theme: Theme) => void
}

const THEME_TRANSITION_TOTAL = 500
const THEME_STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
	if (typeof window === 'undefined') return 'dark'
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
	if (savedTheme) return savedTheme
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
	if (typeof document !== 'undefined') {
		document.documentElement.classList.remove('dark', 'light')
		document.documentElement.classList.add(theme)
	}
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
	theme: 'dark',
	isTransitioning: false,

	setTheme: (theme: Theme) => {
		localStorage.setItem(THEME_STORAGE_KEY, theme)
		applyTheme(theme)
		set({ theme })
	},

	toggleTheme: () => {
		const { isTransitioning, theme } = get()
		if (isTransitioning) return

		set({ isTransitioning: true })

		requestAnimationFrame(() => {
			const newTheme = theme === 'dark' ? 'light' : 'dark'
			localStorage.setItem(THEME_STORAGE_KEY, newTheme)
			applyTheme(newTheme)
			set({ theme: newTheme })

			setTimeout(() => {
				requestAnimationFrame(() => {
					set({ isTransitioning: false })
				})
			}, THEME_TRANSITION_TOTAL)
		})
	}
}))

if (typeof window !== 'undefined') {
	const initialTheme = getInitialTheme()
	useThemeStore.setState({ theme: initialTheme })
	applyTheme(initialTheme)
}
