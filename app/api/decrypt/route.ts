/**
 * 解密 API
 * POST /api/decrypt
 * 使用 AES-256-GCM 算法解密数据
 * 用于解密本地存储的加密私钥
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
 * 使用 AES-256-GCM 解密文本
 * @param encrypted - 加密的字符串（格式：iv:encrypted:authTag）
 * @returns 解密后的原始文本
 */
function decrypt(encrypted: string): string {
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
 * 解密接口
 * @param request - 包含 encrypted 字段的请求体
 * @returns 解密结果
 */
export async function POST(request: Request) {
  try {
    const { encrypted } = await request.json();
    
    if (!encrypted) {
      return NextResponse.json(
        { success: false, error: 'Encrypted data is required' },
        { status: 400 }
      );
    }
    
    const decrypted = decrypt(encrypted);
    
    return NextResponse.json({
      success: true,
      decrypted: decrypted
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { success: false, error: 'Decryption failed' },
      { status: 500 }
    );
  }
}
