/**
 * 认证工具函数
 * 用于管理 GitHub 认证相关的缓存和令牌
 */

const AUTH_TOKEN_KEY = 'github_auth_token'
const AUTH_PRIVATE_KEY = 'github_private_key'

/**
 * 清除所有认证缓存
 */
export function clearAllAuthCache(): void {
	if (typeof localStorage === 'undefined') return
	localStorage.removeItem(AUTH_TOKEN_KEY)
	localStorage.removeItem(AUTH_PRIVATE_KEY)
}

/**
 * 获取认证令牌
 * @returns 认证令牌字符串
 */
export async function getAuthToken(): Promise<string> {
	if (typeof localStorage === 'undefined') return ''
	const token = localStorage.getItem(AUTH_TOKEN_KEY) || ''
	return token
}

/**
 * 检查是否已认证
 * @returns 是否已认证
 */
export async function hasAuth(): Promise<boolean> {
	if (typeof localStorage === 'undefined') return false
	const token = localStorage.getItem(AUTH_TOKEN_KEY)
	return !!token
}

/**
 * 从缓存中获取私钥
 * @returns 私钥字符串或 null
 */
export async function getPemFromCache(): Promise<string | null> {
	if (typeof localStorage === 'undefined') return null
	const encrypted = localStorage.getItem(AUTH_PRIVATE_KEY)
	if (!encrypted) return null
	
	try {
		const response = await fetch('/api/decrypt', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ encrypted })
		})
		
		const data = await response.json()
		if (data.success) {
			return data.decrypted
		}
	} catch (error) {
		console.error('Failed to decrypt:', error)
	}
	
	return null
}

/**
 * 保存私钥到缓存
 * @param key 私钥字符串
 */
export async function savePemToCache(key: string): Promise<void> {
	if (typeof localStorage === 'undefined') return
	
	try {
		const response = await fetch('/api/encrypt', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: key })
		})
		
		const data = await response.json()
		if (data.success) {
			localStorage.setItem(AUTH_PRIVATE_KEY, data.encrypted)
		}
	} catch (error) {
		console.error('Failed to encrypt:', error)
	}
}

/**
 * 保存认证令牌
 * @param token 认证令牌
 */
export function saveAuthToken(token: string): void {
	if (typeof localStorage === 'undefined') return
	localStorage.setItem(AUTH_TOKEN_KEY, token)
}
