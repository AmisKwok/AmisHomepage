/**
 * 音乐上传 API
 * POST /api/music/upload
 * 上传音乐文件到 GitHub 仓库
 * 支持的格式：mp3, wav, ogg, m4a, flac
 * 最大文件大小：20MB
 */
import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, putFile } from '@/app/api/auth/github/github-client';

/**
 * 上传音乐文件
 * @param request - FormData 包含 file 和 privateKey
 * @returns 上传结果，包含文件路径和名称
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const privateKey = formData.get('privateKey') as string;

    // 验证文件
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 验证私钥
    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    // 验证文件格式
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext || '')) {
      return NextResponse.json({ error: 'Invalid file type. Only audio files are allowed.' }, { status: 400 });
    }

    // 验证文件大小（最大 20MB）
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });
    }

    // 获取 GitHub 配置
    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    if (!appId || !owner || !repo || !branch) {
      return NextResponse.json({ error: 'GitHub configuration not set' }, { status: 500 });
    }

    // 生成唯一文件名
    const filename = `${Date.now()}_${file.name}`;
    const relativePath = `/music/${filename}`;
    const githubPath = `public/music/${filename}`;

    // 读取文件内容并转为 Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString('base64');

    // GitHub App 认证流程
    const jwt = signAppJwt(appId, privateKey);
    const installationId = await getInstallationId(jwt, owner, repo);
    const token = await createInstallationToken(jwt, installationId);

    // 上传到 GitHub
    await putFile(token, owner, repo, githubPath, content, `Upload music: ${filename}`, branch);

    return NextResponse.json({ success: true, path: relativePath, name: file.name });
  } catch (error) {
    console.error('Error uploading music:', error);
    return NextResponse.json({ error: 'Failed to upload music' }, { status: 500 });
  }
}
