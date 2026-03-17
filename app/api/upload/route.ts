import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, putFile } from '@/app/api/auth/github/github-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const privateKey = formData.get('privateKey') as string;
    const targetDir = formData.get('targetDir') as string || 'images/config';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    if (!appId || !owner || !repo || !branch) {
      return NextResponse.json({ error: 'GitHub configuration not set in environment variables' }, { status: 500 });
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const isCursor = file.name.toLowerCase().endsWith('.cur');
    const isAudio = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac', 'audio/x-m4a'].includes(file.type) || 
                    ['.mp3', '.wav', '.ogg', '.m4a', '.flac'].some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!allowedImageTypes.includes(file.type) && !isCursor && !isAudio) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const maxSize = isAudio ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large (max ${isAudio ? '20MB' : '5MB'})` }, { status: 400 });
    }

    const filename = `${Date.now()}_${file.name}`;
    const path = `public/${targetDir}/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString('base64');

    const jwt = signAppJwt(appId, privateKey);
    const installationId = await getInstallationId(jwt, owner, repo);
    const token = await createInstallationToken(jwt, installationId);
    await putFile(token, owner, repo, path, content, `Upload file: ${filename}`, branch);

    const relativePath = `/${targetDir}/${filename}`;

    return NextResponse.json({ success: true, path: relativePath });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
