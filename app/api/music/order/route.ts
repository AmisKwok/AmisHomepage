/**
 * 音乐排序 API
 * POST /api/music/order
 * 更新音乐播放顺序
 * 将排序信息保存到 config.json 的 musicOrder 字段
 */
import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, readTextFileFromRepo, putFile } from '@/app/api/auth/github/github-client';

/**
 * 更新音乐排序
 * @param request - 包含 order 对象和 privateKey 的请求体
 * @returns 更新结果
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order, privateKey } = body;

    // 验证排序数据
    if (!order || typeof order !== 'object') {
      return NextResponse.json({ error: 'Order data is required' }, { status: 400 });
    }

    // 验证私钥
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

    // 读取现有配置
    const configContent = await readTextFileFromRepo(token, owner, repo, 'config.json', branch);
    let config: Record<string, unknown> = {};
    
    if (configContent) {
      try {
        config = JSON.parse(configContent);
      } catch {
        config = {};
      }
    }

    // 更新音乐排序
    config.musicOrder = order;

    // 提交到 GitHub
    const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
    await putFile(token, owner, repo, 'config.json', content, 'Update music order', branch);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating music order:', error);
    return NextResponse.json({ error: 'Failed to update music order' }, { status: 500 });
  }
}
