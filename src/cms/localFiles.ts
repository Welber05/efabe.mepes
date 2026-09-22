import { useEffect, useState } from 'react';

const PREFIX = 'local-media:';

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('efabe-media-files', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('files');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeLocalFile(file: File, id: string): Promise<string> {
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').put(file, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return `${PREFIX}${id}`;
  } finally { db.close(); }
}

export async function readLocalFile(url: string): Promise<Blob | undefined> {
  if (!url.startsWith(PREFIX)) return undefined;
  const db = await database();
  try {
    return await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction('files', 'readonly');
      const request = tx.objectStore('files').get(url.slice(PREFIX.length));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally { db.close(); }
}

export async function deleteLocalFile(url: string): Promise<void> {
  if (!url.startsWith(PREFIX)) return;
  const db = await database();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').delete(url.slice(PREFIX.length));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally { db.close(); }
}

export function useMediaUrl(url: string): string {
  const [resolved, setResolved] = useState(url.startsWith(PREFIX) ? '' : url);
  useEffect(() => {
    if (!url.startsWith(PREFIX)) return;
    let active = true;
    let objectUrl = '';
    readLocalFile(url).then((file) => {
      if (!active || !file) return;
      objectUrl = URL.createObjectURL(file);
      setResolved(objectUrl);
    }).catch(() => setResolved(''));
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [url]);
  return url.startsWith(PREFIX) ? resolved : url;
}
