/**
 * 认证状态管理钩子
 * 用于管理用户认证状态和相关操作
 */
import { create } from 'zustand'
import { clearAllAuthCache, getAuthToken as getToken, hasAuth as checkAuth, getPemFromCache, savePemToCache } from '@/lib/auth'
import { useConfigStore } from '@/app/stores/config-store'

/**
 * 认证状态接口
 */
interface AuthStore {
	// 状态
	isAuth: boolean // 是否已认证
	privateKey: string | null // 私钥

	// 操作
	setPrivateKey: (key: string) => void // 设置私钥
	clearAuth: () => void // 清除认证状态
	refreshAuthState: () => void // 刷新认证状态
	getAuthToken: () => Promise<string> // 获取认证令牌
}

/**
 * 认证状态存储
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
	isAuth: false,
	privateKey: null,

	/**
	 * 设置私钥并更新认证状态
	 * @param key 私钥字符串
	 */
	setPrivateKey: async (key: string) => {
		set({ isAuth: true, privateKey: key })
		const { siteContent } = useConfigStore.getState()
		if (siteContent?.isCachePem) {
			await savePemToCache(key)
		}
	},

	/**
	 * 清除认证状态
	 */
	clearAuth: () => {
		clearAllAuthCache()
		set({ isAuth: false })
	},

	/**
	 * 刷新认证状态
	 */
	refreshAuthState: async () => {
		const isAuth = await checkAuth()
		set({ isAuth })
	},

	/**
	 * 获取认证令牌
	 * @returns 认证令牌
	 */
	getAuthToken: async () => {
		const token = await getToken()
		get().refreshAuthState()
		return token
	}
}))

// 从缓存中获取私钥并更新状态
getPemFromCache().then((key) => {
	if (key) {
		useAuthStore.setState({ privateKey: key })
	}
})

// 检查认证状态并更新状态
checkAuth().then((isAuth) => {
	if (isAuth) {
		useAuthStore.setState({ isAuth })
	}
})
