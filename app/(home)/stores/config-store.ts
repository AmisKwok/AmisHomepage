/**
 * 配置状态管理
 * 用于管理网站配置相关的状态
 */
import { create } from 'zustand'

/**
 * 配置内容接口
 */
interface SiteContent {
	isCachePem?: boolean // 是否缓存私钥
	showProjects?: boolean // 是否显示项目模块
	showSkills?: boolean // 是否显示技能模块
	showLocalTime?: boolean // 是否显示时间组件
}

/**
 * 配置状态接口
 */
interface ConfigStore {
	siteContent: SiteContent | null // 网站配置内容
	setSiteContent: (content: SiteContent) => void // 设置配置内容
}

/**
 * 配置状态存储
 */
export const useConfigStore = create<ConfigStore>((set) => ({
	siteContent: null,

	/**
	 * 设置配置内容
	 * @param content 配置内容
	 */
	setSiteContent: (content: SiteContent) => {
		set({ siteContent: content })
	}
}))
