import { MediaAsset } from '../types';

export const MEDIA_STORAGE_KEY = 'mepes_cms_media_library';

export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
  return match?.[1] || null;
}

export function extractDriveId(url: string): string | null {
  const match = url.match(/\/d\/([\w-]+)/) || url.match(/[?&]id=([\w-]+)/) || url.match(/folders\/([\w-]+)/);
  return match?.[1] || null;
}

export function detectMediaKind(url: string): MediaAsset['kind'] {
  if (extractYouTubeId(url)) return 'youtube';
  if (/drive\.google\.com/i.test(url)) return 'drive';
  if (/\.pdf(?:$|[?#])/i.test(url)) return 'pdf';
  if (/\.(?:png|jpe?g|gif|webp|svg|avif)(?:$|[?#])/i.test(url) || url.startsWith('data:image/')) return 'image';
  if (/\.(?:mp4|webm|ogg)(?:$|[?#])/i.test(url)) return 'video';
  return 'document';
}

export function getMediaPreviewUrl(asset: MediaAsset): string {
  const youtubeId = extractYouTubeId(asset.url);
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  const driveId = asset.driveFileId || extractDriveId(asset.url);
  if ((asset.kind === 'image' || asset.kind === 'drive') && driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
  }
  return asset.thumbnailUrl || asset.url;
}

export function loadMediaLibrary(): MediaAsset[] {
  try {
    return JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveMediaLibrary(assets: MediaAsset[]) {
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(assets));
}

