import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, putFile } from '@/app/api/auth/github/github-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const privateKey = formData.get('privateKey') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext || '')) {
      return NextResponse.json({ error: 'Invalid file type. Only audio files are allowed.' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });
    }

    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    if (!appId || !owner || !repo || !branch) {
      return NextResponse.json({ error: 'GitHub configuration not set' }, { status: 500 });
    }

    const filename = `${Date.now()}_${file.name}`;
    const relativePath = `/music/${filename}`;
    const githubPath = `public/music/${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString('base64');

    const jwt = signAppJwt(appId, privateKey);
    const installationId = await getInstallationId(jwt, owner, repo);
    const token = await createInstallationToken(jwt, installationId);
    await putFile(token, owner, repo, githubPath, content, `Upload music: ${filename}`, branch);

    return NextResponse.json({ success: true, path: relativePath, name: file.name });
  } catch (error) {
    console.error('Error uploading music:', error);
    return NextResponse.json({ error: 'Failed to upload music' }, { status: 500 });
  }
}
