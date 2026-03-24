/**
 * 音乐管理 API
 * GET /api/music - 获取音乐列表
 * DELETE /api/music - 删除音乐文件
 * 
 * 音乐文件存储在 public/music 目录
 * 支持的格式：mp3, wav, ogg, m4a, flac
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, deleteFile } from '@/app/api/auth/github/github-client';
import fs from 'fs';
import path from 'path';

// 音乐目录路径
const MUSIC_DIR = path.join(process.cwd(), 'public', 'music');
// 配置文件路径
const MUSIC_CONFIG_FILE = path.join(process.cwd(), 'config.json');

// 音乐文件接口
interface MusicFile {
  id: string;     // 文件唯一标识（Base64 编码的文件名）
  name: string;   // 音乐名称
  path: string;   // 访问路径
  order: number;  // 排序顺序
}

/**
 * 获取音乐列表
 * 从 public/music 目录读取所有音乐文件
 * 根据 config.json 中的 musicOrder 配置排序
 * @returns 音乐文件列表
 */
function getMusicList(): MusicFile[] {
  // 检查音乐目录是否存在
  if (!fs.existsSync(MUSIC_DIR)) {
    return [];
  }
  
  // 读取配置文件获取排序信息
  let config: any = {};
  if (fs.existsSync(MUSIC_CONFIG_FILE)) {
    const content = fs.readFileSync(MUSIC_CONFIG_FILE, 'utf-8');
    config = JSON.parse(content);
  }

  const musicOrder = config.musicOrder || {};
  const files = fs.readdirSync(MUSIC_DIR);
  const musicFiles: MusicFile[] = [];

  // 遍历音乐文件
  files.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();
    // 只处理支持的音乐格式
    if (['.mp3', '.wav', '.ogg', '.m4a', '.flac'].includes(ext)) {
      const id = Buffer.from(file).toString('base64');
      musicFiles.push({
        id,
        name: path.basename(file, ext),
        path: `/music/${file}`,
        order: musicOrder[file] !== undefined ? musicOrder[file] : index
      });
    }
  });

  // 按排序字段排序
  musicFiles.sort((a, b) => a.order - b.order);
  return musicFiles;
}

/**
 * 获取音乐列表接口
 * @returns 音乐列表 JSON
 */
export async function GET() {
  try {
    const musicList = getMusicList();
    return NextResponse.json({ success: true, music: musicList });
  } catch (error) {
    console.error('Error fetching music list:', error);
    return NextResponse.json({ error: 'Failed to fetch music list' }, { status: 500 });
  }
}

/**
 * 删除音乐文件接口
 * @param request - 包含 filename 参数和 X-Private-Key 头
 * @returns 删除结果
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const privateKey = request.headers.get('X-Private-Key');

    // 验证参数
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    // 获取 GitHub 配置
    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    if (!appId || !owner || !repo || !branch) {
      return NextResponse.json({ error: 'GitHub configuration not set' }, { status: 500 });
    }

    // GitHub App 认证流程
    const jwt = signAppJwt(appId, privateKey);
    const installationId = await getInstallationId(jwt, owner, repo);
    const token = await createInstallationToken(jwt, installationId);
    
    // 删除 GitHub 仓库中的文件
    const githubPath = `public/music/${filename}`;
    await deleteFile(token, owner, repo, githubPath, `Delete music: ${filename}`, branch);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting music:', error);
    return NextResponse.json({ error: 'Failed to delete music' }, { status: 500 });
  }
}
