import { NextRequest, NextResponse } from 'next/server';
import { signAppJwt, getInstallationId, createInstallationToken, getFile, deleteFile } from '@/api/auth/github/github-client';
import fs from 'fs';
import path from 'path';

const MUSIC_DIR = path.join(process.cwd(), 'public', 'music');
const MUSIC_CONFIG_FILE = path.join(process.cwd(), 'config.json');

interface MusicFile {
  id: string;
  name: string;
  path: string;
  order: number;
}

function ensureMusicDir() {
  if (!fs.existsSync(MUSIC_DIR)) {
    fs.mkdirSync(MUSIC_DIR, { recursive: true });
  }
}

function getMusicList(): MusicFile[] {
  ensureMusicDir();
  
  let config: any = {};
  if (fs.existsSync(MUSIC_CONFIG_FILE)) {
    const content = fs.readFileSync(MUSIC_CONFIG_FILE, 'utf-8');
    config = JSON.parse(content);
  }

  const musicOrder = config.musicOrder || {};
  const files = fs.readdirSync(MUSIC_DIR);
  const musicFiles: MusicFile[] = [];

  files.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();
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

  musicFiles.sort((a, b) => a.order - b.order);
  return musicFiles;
}

export async function GET() {
  try {
    const musicList = getMusicList();
    return NextResponse.json({ success: true, music: musicList });
  } catch (error) {
    console.error('Error fetching music list:', error);
    return NextResponse.json({ error: 'Failed to fetch music list' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const privateKey = request.headers.get('X-Private-Key');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    if (!privateKey) {
      return NextResponse.json({ error: 'Private key is required' }, { status: 400 });
    }

    const appId = process.env.GITHUB_APP_ID;
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_REPO_BRANCH;

    if (!appId || !owner || !repo || !branch) {
      ensureMusicDir();
      const filePath = path.join(MUSIC_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return NextResponse.json({ success: true });
    }

    const jwt = signAppJwt(appId, privateKey);
    const installationId = await getInstallationId(jwt, owner, repo);
    const token = await createInstallationToken(jwt, installationId);
    
    const githubPath = `public/music/${filename}`;
    await deleteFile(token, owner, repo, githubPath, `Delete music: ${filename}`, branch);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting music:', error);
    return NextResponse.json({ error: 'Failed to delete music' }, { status: 500 });
  }
}
