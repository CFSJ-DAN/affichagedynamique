import { promises as fs } from 'fs';
import { join } from 'path';

export async function ensureDirectoryExists(path: string): Promise<void> {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path, { recursive: true });
  }
}

export async function saveFile(path: string, data: string | Buffer): Promise<void> {
  await fs.writeFile(path, data);
}

export async function readFile(path: string): Promise<Buffer> {
  return fs.readFile(path);
}

export async function deleteFile(path: string): Promise<void> {
  try {
    await fs.unlink(path);
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
}

export async function readdir(path: string): Promise<string[]> {
  return fs.readdir(path);
}

export async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}