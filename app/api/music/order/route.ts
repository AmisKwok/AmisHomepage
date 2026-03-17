import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, readTextFileFromRepo, putFile } from '@/app/api/auth/github/github-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order, privateKey } = body;

    if (!order || typeof order !== 'object') {
      return NextResponse.json({ error: 'Order data is required' }, { status: 400 });
    }

    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    if (!appId || !owner || !repo || !branch) {
      return NextResponse.json({ error: 'GitHub configuration not set' }, { status: 500 });
    }

    const jwt = signAppJwt(appId, privateKey);
    const installationId = await getInstallationId(jwt, owner, repo);
    const token = await createInstallationToken(jwt, installationId);

    const configContent = await readTextFileFromRepo(token, owner, repo, 'config.json', branch);
    let config: any = {};
    
    if (configContent) {
      try {
        config = JSON.parse(configContent);
      } catch {
        config = {};
      }
    }

    config.musicOrder = order;

    const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
    await putFile(token, owner, repo, 'config.json', content, 'Update music order', branch);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating music order:', error);
    return NextResponse.json({ error: 'Failed to update music order' }, { status: 500 });
  }
}
