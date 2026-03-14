import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, getFile, putFile } from '@/api/auth/github/github-client';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'config.json');

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

    let config: any = {};
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      config = JSON.parse(content);
    }

    config.musicOrder = order;

    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    if (!appId || !owner || !repo || !branch) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
      return NextResponse.json({ success: true });
    }

    const jwt = signAppJwt(appId, privateKey);
    const installationId = await getInstallationId(jwt, owner, repo);
    const token = await createInstallationToken(jwt, installationId);

    const configPath = 'config.json';
    const existingFile = await getFile(token, owner, repo, configPath, branch);
    const sha = existingFile?.sha;

    const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
    await putFile(token, owner, repo, configPath, content, 'Update music order', branch, sha);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating music order:', error);
    return NextResponse.json({ error: 'Failed to update music order' }, { status: 500 });
  }
}
