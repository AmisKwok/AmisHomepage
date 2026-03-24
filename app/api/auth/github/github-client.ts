/**
 * GitHub App 客户端工具
 * 
 * 提供 GitHub API 认证和文件操作功能：
 * - JWT 签名和认证
 * - 获取安装令牌
 * - 文件读写删除
 * - Git 操作（树、提交、引用）
 * 
 * 使用 jsrsasign 库进行 RSA 签名
 * 支持通过 GitHub App 进行仓库操作
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { KJUR, KEYUTIL } from 'jsrsasign'

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
	const now = Math.floor(Date.now() / 1000)
	const header = { alg: 'RS256', typ: 'JWT' }
	const payload = { iat: now - 60, exp: now + 8 * 60, iss: appId }
	const prv = KEYUTIL.getKey(privateKeyPem) as unknown as string
	return KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), prv)
}

/**
 * 获取 GitHub App 安装 ID
 * @param jwt 签名后的 JWT
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @returns 安装 ID
 */
export async function getInstallationId(jwt: string, owner: string, repo: string): Promise<number> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/installation`, {
		headers: {
			Authorization: `Bearer ${jwt}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	})
	if (!res.ok) throw new Error(`installation lookup failed: ${res.status}`)
	const data = await res.json()
	return data.id
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
 * 获取 Git 引用
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param ref 引用名称（分支）
 * @returns 引用的 SHA 值
 */
export async function getRef(token: string, owner: string, repo: string, ref: string): Promise<{ sha: string }> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(ref)}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	})
	if (!res.ok) throw new Error(`get ref failed: ${res.status}`)
	const data = await res.json()
	return { sha: data.object.sha }
}

/**
 * Git 树项接口
 */
export type TreeItem = {
	path: string
	mode: '100644' | '100755' | '040000' | '160000' | '120000'
	type: 'blob' | 'tree' | 'commit'
	content?: string
	sha?: string | null
}

/**
 * 创建 Git 树
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param tree 树项数组
 * @param baseTree 基础树 SHA
 * @returns 创建的树的 SHA 值
 */
export async function createTree(token: string, owner: string, repo: string, tree: TreeItem[], baseTree?: string): Promise<{ sha: string }> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/trees`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ tree, base_tree: baseTree })
	})
	if (!res.ok) throw new Error(`create tree failed: ${res.status}`)
	const data = await res.json()
	return { sha: data.sha }
}

/**
 * 创建 Git 提交
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param message 提交消息
 * @param tree 树 SHA
 * @param parents 父提交 SHA 数组
 * @returns 创建的提交的 SHA 值
 */
export async function createCommit(token: string, owner: string, repo: string, message: string, tree: string, parents: string[]): Promise<{ sha: string }> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/commits`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message, tree, parents })
	})
	if (!res.ok) throw new Error(`create commit failed: ${res.status}`)
	const data = await res.json()
	return { sha: data.sha }
}

/**
 * 更新 Git 引用
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param ref 引用名称（分支）
 * @param sha 新的 SHA 值
 * @param force 是否强制更新
 */
export async function updateRef(token: string, owner: string, repo: string, ref: string, sha: string, force = false): Promise<void> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(ref)}`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ sha, force })
	})
	if (!res.ok) throw new Error(`update ref failed: ${res.status}`)
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
 * 创建 Git blob
 * @param token 认证令牌
 * @param owner 仓库所有者
 * @param repo 仓库名称
 * @param content 内容
 * @param encoding 编码方式
 * @returns 创建的 blob 的 SHA 值
 */
export async function createBlob(
	token: string,
	owner: string,
	repo: string,
	content: string,
	encoding: 'utf-8' | 'base64' = 'base64'
): Promise<{ sha: string }> {
	const res = await fetch(`${GH_API}/repos/${owner}/${repo}/git/blobs`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ content, encoding })
	})
	if (!res.ok) throw new Error(`create blob failed: ${res.status}`)
	const data = await res.json()
	return { sha: data.sha }
}

/**
 * 删除文件
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
