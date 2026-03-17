import { create } from 'zustand'
import { translations, Language } from '../site-config'

type Translations = typeof translations
type TranslationKey = keyof Translations['zh']

type TranslationReturnType = {
	siteTitle: string
	typeWriterText: string
	typeWriterText2: string
	quickLinks: string
	footer: string
	nav: Record<string, string>
	aboutMe: string
	techStack: string
	backend: string
	mobile: string
	frontend: string
	currentFocus: string
	featuredProjects: string
	skills: string
	viewProject: string
	moreProjects: string
	totalMusic: (count: number) => string
	openMusicPlayer: string
	listLoop: string
	listNoLoop: string
	singleLoop: string
	singleNoLoop: string
	noMusicSelected: string
	cancelMute: string
	mute: string
	playlist: string
	switchToEnglish: string
	switchToChinese: string
	switchToLightMode: string
	switchToDarkMode: string
	configManagement: string
	locationLoading: string
	locationDenied: string
	cursorSettings: string
	siteComponents: string
	localTimeComponent: string
	enableLocalTime: string
	customCursor: string
	enableCustomCursor: string
	cursorFile: string
	cursorFileHint: string
	cursorFileError: string
	cursorUploadSuccess: string
	cursorUploadError: string
	resetCursor: string
	cursorPreviewHint: string
	expandAll: string
	collapseAll: string
	quickNav: string
	clear: string
	backToHome: string
	configDescription: string
	githubAuth: string
	pemKeyFile: string
	pemKeyHint: string
	pemKeyLoaded: string
	siteInfo: string
	siteName: string
	siteTitleLabel: string
	siteUrl: string
	footerSettings: string
	footerText: string
	author: string
	siteDescription: string
	keywords: string
	backgroundImage: string
	darkTheme: string
	lightTheme: string
	textColor: string
	textSecondaryColor: string
	profile: string
	name: string
	avatar: string
	location: string
	focus: string
	hobbies: string
	motto: string
	typeWriterText1Label: string
	typeWriterText2Label: string
	links: string
	linkUrl: string
	linkTitle: string
	linkDescription: string
	linkIcon: string
	showLink: string
	skillColor: string
	skillIcon: string
	retry: string
	uploadPemFirst: string
	fileUploadSuccess: string
	fileUploadFailed: string
	configSaveSuccess: string
	configSaveFailed: string
	loadConfigFailed: string
	saveToGithub: string
	saving: string
	addProject: string
	projectName: string
	projectUrl: string
	projectImage: string
	projectIcon: string
	projectGradient: string
	projectDescription: string
	projectTags: string
	delete: string
	description: string
	chinese: string
	english: string
	addSkill: string
	level: string
	icon: string
	uploadMusic: string
	musicUploadHint: string
	noMusic: string
	loading: string
	weekdays: string[]
	months: string[]
}

interface LanguageStore {
	language: Language
	hydrated: boolean
	setLanguage: (lang: Language) => void
	toggleLanguage: () => void
	t: <K extends TranslationKey>(key: K) => TranslationReturnType[K]
	hydrate: () => void
}

function getSystemLanguage(): Language {
	const systemLang = navigator.language.toLowerCase()
	if (systemLang.startsWith('zh')) return 'zh'
	return 'en'
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
	language: 'en',
	hydrated: false,

	setLanguage: (lang: Language) => {
		const validLang: Language = lang === 'zh' ? 'zh' : 'en'
		localStorage.setItem('language', validLang)
		set({ language: validLang })
	},

	toggleLanguage: () => {
		const { language, setLanguage } = get()
		setLanguage(language === 'zh' ? 'en' : 'zh')
	},

	t: <K extends TranslationKey>(key: K): TranslationReturnType[K] => {
		const { language } = get()
		return translations[language][key] as TranslationReturnType[K]
	},

	hydrate: () => {
		const savedLang = localStorage.getItem('language') as Language | null
		const initialLang = savedLang && (savedLang === 'zh' || savedLang === 'en')
			? savedLang
			: getSystemLanguage()
		set({ language: initialLang, hydrated: true })
	}
}))
