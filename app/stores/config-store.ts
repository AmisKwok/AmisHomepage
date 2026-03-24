/**
 * 站点配置状态管理 Store
 * 管理从后端获取的站点内容配置
 */
import { create } from 'zustand'
import type { SiteContent } from '../../types'

// 配置 Store 接口定义
interface ConfigStore {
	siteContent: SiteContent | null              // 站点内容配置
	setSiteContent: (content: SiteContent) => void  // 设置站点内容
}

export const useConfigStore = create<ConfigStore>((set) => ({
	siteContent: null,

	// 更新站点内容配置
	setSiteContent: (content: SiteContent) => {
		set({ siteContent: content })
	}
}))
