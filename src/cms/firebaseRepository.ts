import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { MediaAsset, PageContent, User } from '../types';
import { firebaseDb, firebaseStorage, isFirebaseConfigured } from '../lib/firebase';
import { AccessArea } from '../auth/access';

export type SyncState = 'local' | 'connecting' | 'synced' | 'error';

interface CmsUserDocument {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'teacher' | 'parent';
  active: boolean;
  avatar?: string;
  studentName?: string;
  turma?: string;
  subjects?: string[];
  studentIds?: string[];
  allowedAreas?: AccessArea[];
}

const requireFirestore = () => {
  if (!isFirebaseConfigured || !firebaseDb) throw new Error('Firebase ainda não foi configurado.');
  return firebaseDb;
};

const stripUndefined = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export function subscribeCmsPages(
  onData: (pages: PageContent[]) => void,
  onError?: (error: Error) => void,
) {
  if (!isFirebaseConfigured || !firebaseDb) return () => undefined;
  const pagesQuery = query(collection(firebaseDb, 'cmsPages'), orderBy('title'));
  return onSnapshot(
    pagesQuery,
    (snapshot) => onData(snapshot.docs.map((item) => item.data() as PageContent)),
    (error) => onError?.(error),
  );
}

export async function saveCmsPage(page: PageContent) {
  const db = requireFirestore();
  await setDoc(doc(db, 'cmsPages', page.id), {
    ...stripUndefined(page),
    cloudUpdatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getCmsUserProfile(uid: string): Promise<User> {
  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, 'cmsUsers', uid));
  if (!snapshot.exists()) throw new Error('Perfil do CMS não encontrado.');
  const profile = snapshot.data() as CmsUserDocument;
  if (!profile.active) throw new Error('Este perfil está desativado.');
  return {
    id: uid,
    firebaseUid: uid,
    name: profile.name,
    email: profile.email,
    role: profile.role === 'editor' ? 'admin' : profile.role,
    avatar: profile.avatar,
    studentName: profile.studentName,
    turma: profile.turma,
    subjects: profile.subjects,
    studentIds: profile.studentIds,
    allowedAreas: profile.allowedAreas,
  };
}

export async function deleteCmsPage(pageId: string) {
  const db = requireFirestore();
  await deleteDoc(doc(db, 'cmsPages', pageId));
}

export function subscribeMediaAssets(
  onData: (assets: MediaAsset[]) => void,
  onError?: (error: Error) => void,
) {
  if (!isFirebaseConfigured || !firebaseDb) return () => undefined;
  const mediaQuery = query(collection(firebaseDb, 'cmsMedia'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    mediaQuery,
    (snapshot) => onData(snapshot.docs.map((item) => item.data() as MediaAsset)),
    (error) => onError?.(error),
  );
}

export async function saveMediaAsset(asset: MediaAsset) {
  const db = requireFirestore();
  await setDoc(doc(db, 'cmsMedia', asset.id), stripUndefined(asset), { merge: true });
}

export async function deleteMediaAsset(assetId: string) {
  const db = requireFirestore();
  await deleteDoc(doc(db, 'cmsMedia', assetId));
}

const safeFileName = (name: string) => name
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9._-]/g, '-')
  .replace(/-+/g, '-');

export async function uploadMediaFile(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<{ url: string; path: string }> {
  if (!isFirebaseConfigured || !firebaseStorage) throw new Error('Firebase Storage ainda não foi configurado.');
  const path = `cms-media/${new Date().getFullYear()}/${Date.now()}-${safeFileName(file.name)}`;
  const uploadTask = uploadBytesResumable(ref(firebaseStorage, path), file, {
    contentType: file.type || undefined,
    customMetadata: { originalName: file.name, source: 'efabe-cms' },
  });

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      resolve,
    );
  });

  return { url: await getDownloadURL(uploadTask.snapshot.ref), path };
}
