/**
 * 加密 API
 * POST /api/encrypt
 * 使用 AES-256-GCM 算法加密敏感数据
 * 用于加密 GitHub 私钥等敏感信息
 */
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// 加密密钥（从环境变量获取）
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';

/**
 * 从密钥字符串生成 256 位密钥 Buffer
 * @param key - 密钥字符串
 * @returns SHA-256 哈希后的密钥 Buffer
 */
function getKeyBuffer(key: string): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(key);
  return hash.digest();
}

/**
 * 使用 AES-256-GCM 加密文本
 * @param text - 要加密的文本
 * @returns 加密后的字符串（格式：iv:encrypted:authTag）
 */
function encrypt(text: string): string {
  // 生成随机初始化向量
  const iv = crypto.randomBytes(12);
  const key = getKeyBuffer(ENCRYPTION_KEY);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  // 加密数据
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // 获取认证标签
  const authTag = cipher.getAuthTag().toString('base64');
  
  // 返回格式：iv:encrypted:authTag
  return `${iv.toString('base64')}:${encrypted}:${authTag}`;
}

/**
 * 解密函数（导出供其他模块使用）
 * @param encrypted - 加密的字符串
 * @returns 解密后的原始文本
 */
export function decrypt(encrypted: string): string {
  const [ivBase64, encryptedBase64, authTagBase64] = encrypted.split(':');
  
  // 验证数据格式
  if (!ivBase64 || !encryptedBase64 || !authTagBase64) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(ivBase64, 'base64');
  const key = getKeyBuffer(ENCRYPTION_KEY);
  const authTag = Buffer.from(authTagBase64, 'base64');
  
  // 创建解密器
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  // 解密数据
  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * 加密接口
 * @param request - 包含 text 字段的请求体
 * @returns 加密结果
 */
export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }
    
    const encrypted = encrypt(text);
    
    return NextResponse.json({
      success: true,
      encrypted: encrypted
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { success: false, error: 'Encryption failed' },
      { status: 500 }
    );
  }
}
