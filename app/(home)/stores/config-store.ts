/**
 * 配置状态管理
 * 用于管理网站配置相关的状态
 */
import { create } from 'zustand'

/**
 * 配置内容接口
 */
interface SiteContent {
	isCachePem?: boolean
	showProjects?: boolean
	showSkills?: boolean
	showLocalTime?: boolean
	showCustomCursor?: boolean
	customCursorPath?: string
	site?: {
		backgroundImage?: {
			dark?: string
			light?: string
		}
		textColor?: {
			dark?: string
			light?: string
		}
		textSecondaryColor?: {
			dark?: string
			light?: string
		}
	}
}

/**
 * 配置状态接口
 */
interface ConfigStore {
	siteContent: SiteContent | null
	setSiteContent: (content: SiteContent) => void
}

/**
 * 配置状态存储
 */
export const useConfigStore = create<ConfigStore>((set) => ({
	siteContent: null,

	setSiteContent: (content: SiteContent) => {
		set({ siteContent: content })
	}
}))
