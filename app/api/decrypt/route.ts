import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';

function getKeyBuffer(key: string): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(key);
  return hash.digest();
}

function decrypt(encrypted: string): string {
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
