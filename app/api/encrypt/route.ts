import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';

function getKeyBuffer(key: string): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(key);
  return hash.digest();
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const key = getKeyBuffer(ENCRYPTION_KEY);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag().toString('base64');
  
  return `${iv.toString('base64')}:${encrypted}:${authTag}`;
}

export function decrypt(encrypted: string): string {
  const [ivBase64, encryptedBase64, authTagBase64] = encrypted.split(':');
  
  if (!ivBase64 || !encryptedBase64 || !authTagBase64) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(ivBase64, 'base64');
  const key = getKeyBuffer(ENCRYPTION_KEY);
  const authTag = Buffer.from(authTagBase64, 'base64');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

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
