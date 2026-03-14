/**
 * GitHub 客户端工具
 * 用于与 GitHub API 交互，处理认证、文件操作和 Git 操作
 */

/**
 * GitHub API 基础 URL
 */
export const GH_API = 'https://api.github.com'

/**
 * 将字符串转换为 Base64 UTF-8 编码
 * @param input 输入字符串
 * @returns Base64 编码的字符串
 */
export function toBase64Utf8(input: string): string {
	return btoa(unescape(encodeURIComponent(input)))
}

/**
 * 签名 GitHub App JWT
 * @param appId GitHub App ID
 * @param privateKeyPem 私钥 PEM 字符串
 * @returns 签名后的 JWT
 */
export function signAppJwt(appId: string, privateKeyPem: string): string {
	console.log('Signing JWT with App ID:', appId)
	console.log('Private key length:', privateKeyPem.length)
	
	const { KJUR, KEYUTIL } = require('jsrsasign')
	const now = Math.floor(Date.now() / 1000)
	const header = { alg: 'RS256', typ: 'JWT' }
	const payload = { iat: now - 60, exp: now + 8 * 60, iss: appId }
	
	console.log('JWT payload:', payload)
	
	try {
		const prv = KEYUTIL.getKey(privateKeyPem) as unknown as string
		const jwt = KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), prv)
		console.log('JWT signed successfully, length:', jwt.length)
		return jwt
	} catch (error) {
		console.error('Error signing JWT:', error)
		if (error instanceof Error) {
			console.error('Error message:', error.message)
			console.error('Error stack:', error.stack)
		}
		throw error
	}
}

/**
 * 获取 GitHub App 安装 ID
 * @param jwt 签名后的 JWT
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @returns 安装 ID
 */
export async function getInstallationId(jwt: string, owner: string, repo: string): Promise<number> {
	const url = `${GH_API}/repos/${owner}/${repo}/installation`
	console.log('Fetching installation ID from:', url)
	console.log('JWT (first 50 chars):', jwt.substring(0, 50) + '...')
	
	try {
		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${jwt}`,
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28'
			}
		})
		
		console.log('Response status:', res.status)
		console.log('Response headers:', Object.fromEntries(res.headers.entries()))
		
		if (!res.ok) {
			const errorText = await res.text()
			console.error('Error response body:', errorText)
			throw new Error(`installation lookup failed: ${res.status} - ${errorText}`)
		}
		
		const data = await res.json()
		console.log('Response data:', data)
		return data.id
	} catch (error) {
		console.error('Fetch error:', error)
		if (error instanceof Error) {
			console.error('Error message:', error.message)
			console.error('Error stack:', error.stack)
		}
		throw error
	}
}

/**
 * 创建 GitHub 安装令牌
 * @param jwt 签名后的 JWT
 * @param installationId 安装 ID
 * @returns 安装令牌
 */
export async function createInstallationToken(jwt: string, installationId: number): Promise<string> {
	const res = await fetch(`${GH_API}/app/installations/${installationId}/access_tokens`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${jwt}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	})
	if (!res.ok) throw new Error(`create token failed: ${res.status}`)
	const data = await res.json()
	return data.token as string
}

/**
 * 获取文件的 SHA 值
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param path 文件路径
 * @param branch 分支名称
 * @returns 文件 SHA 值或 undefined
 */
export async function getFileSha(token: string, owner: string, repo: string, path: string, branch: string): Promise<string | undefined> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	})
	if (res.status === 404) return undefined
	if (!res.ok) throw new Error(`get file sha failed: ${res.status}`)
	const data = await res.json()
	return (data && data.sha) || undefined
}

/**
 * 上传文件到 GitHub 仓库
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param path 文件路径
 * @param contentBase64 Base64 编码的文件内容
 * @param message 提交消息
 * @param branch 分支名称
 * @returns 响应数据
 */
export async function putFile(token: string, owner: string, repo: string, path: string, contentBase64: string, message: string, branch: string) {
	const sha = await getFileSha(token, owner, repo, path, branch)
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message, content: contentBase64, branch, ...(sha ? { sha } : {}) })
	})
	if (!res.ok) throw new Error(`put file failed: ${res.status}`)
	return res.json()
}

/**
 * 从仓库读取文本文件
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param path 文件路径
 * @param ref 引用名称（分支）
 * @returns 文件内容或 null
 */
export async function readTextFileFromRepo(token: string, owner: string, repo: string, path: string, ref: string): Promise<string | null> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	})
	if (res.status === 404) return null
	if (!res.ok) throw new Error(`read file failed: ${res.status}`)
	const data: any = await res.json()
	if (Array.isArray(data) || !data.content) return null
	try {
		return decodeURIComponent(escape(atob(data.content)))
	} catch {
		return atob(data.content)
	}
}

/**
 * 递归列出仓库文件
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param path 起始路径
 * @param ref 引用名称（分支）
 * @returns 文件路径数组
 */
export async function listRepoFilesRecursive(token: string, owner: string, repo: string, path: string, ref: string): Promise<string[]> {
	async function fetchPath(targetPath: string): Promise<string[]> {
		const res = await fetch(`${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(targetPath)}?ref=${encodeURIComponent(ref)}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28'
			}
		})
		if (res.status === 404) return []
		if (!res.ok) throw new Error(`read directory failed: ${res.status}`)
		const data: any = await res.json()
		if (Array.isArray(data)) {
			const files: string[] = []
			for (const item of data) {
				if (item.type === 'file') {
					files.push(item.path)
				} else if (item.type === 'dir') {
					const nested = await fetchPath(item.path)
					files.push(...nested)
				}
			}
			return files
		}
		if (data?.type === 'file') return [data.path]
		if (data?.type === 'dir') return fetchPath(data.path)
		return []
	}

	return fetchPath(path)
}

/**
 * 获取文件信息（包含内容和 SHA）
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param path 文件路径
 * @param branch 分支名称
 * @returns 文件信息或 null
 */
export async function getFile(token: string, owner: string, repo: string, path: string, branch: string): Promise<{ content: string; sha: string } | null> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	})
	if (res.status === 404) return null
	if (!res.ok) throw new Error(`get file failed: ${res.status}`)
	const data = await res.json()
	if (Array.isArray(data) || !data.content) return null
	return { content: data.content, sha: data.sha }
}

/**
 * 删除文件
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param path 文件路径
 * @param message 提交消息
 * @param branch 分支名称
 */
export async function deleteFile(token: string, owner: string, repo: string, path: string, message: string, branch: string) {
	const sha = await getFileSha(token, owner, repo, path, branch)
	if (!sha) return
	
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message, sha, branch })
	})
	if (!res.ok) throw new Error(`delete file failed: ${res.status}`)
	return res.json()
}
