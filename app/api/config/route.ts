/**
 * 配置读取 API
 * GET /api/config
 * 从 config.json 读取站点配置
 */
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/**
 * 获取站点配置
 * @returns 配置 JSON 数据
 */
export async function GET() {
  try {
    // 读取项目根目录下的 config.json
    const configPath = path.join(process.cwd(), 'config.json');
    const configContent = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configContent);

    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}
