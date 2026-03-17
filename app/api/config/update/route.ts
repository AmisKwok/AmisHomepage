import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, putFile } from '@/app/api/auth/github/github-client';

export async function POST(request: NextRequest) {
  try {
    const { config, privateKey } = await request.json();
    
    if (!config) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    console.log('Environment variables:', { appId, owner, repo, branch });

    if (!appId || !owner || !repo || !branch) {
      return NextResponse.json({ error: 'GitHub configuration not set in environment variables' }, { status: 500 });
    }

    console.log('Step 1: Signing JWT...');
    const jwt = signAppJwt(appId, privateKey);
    console.log('JWT signed successfully');

    console.log('Step 2: Getting installation ID...');
    const installationId = await getInstallationId(jwt, owner, repo);
    console.log('Installation ID:', installationId);

    console.log('Step 3: Creating installation token...');
    const token = await createInstallationToken(jwt, installationId);
    console.log('Token created successfully');

    console.log('Step 4: Committing to GitHub...');
    const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
    await putFile(token, owner, repo, 'config.json', content, 'Update config.json', branch);

    return NextResponse.json({ success: true, message: '配置已保存并提交到 GitHub' });
  } catch (error) {
    console.error('Error updating config:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error stack:', errorStack);
    
    return NextResponse.json({ 
      error: 'Failed to update config', 
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}
