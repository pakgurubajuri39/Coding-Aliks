import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc,
  doc, 
  deleteDoc, 
  updateDoc,
  serverTimestamp, 
  query, 
  getDocFromServer,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import localAppletConfig from '../firebase-applet-config.json';
import { FirebaseCustomConfig, StudentProject } from './types';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBvC2O9rZezT83jgyPWc_mL2OoH8D5QSEI",
  authDomain: "erlass-coding-competition-2026.firebaseapp.com",
  projectId: "erlass-coding-competition-2026",
  storageBucket: "erlass-coding-competition-2026.firebasestorage.app",
  messagingSenderId: "430511248174",
  appId: "1:430511248174:web:f8cc665d29aa646e1f20bf"
};

// Build active configuration with Vercel environment variables & JSON fallback support
const activeFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localAppletConfig.apiKey || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localAppletConfig.authDomain || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localAppletConfig.projectId || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localAppletConfig.storageBucket || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localAppletConfig.messagingSenderId || firebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localAppletConfig.appId || firebaseConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || (localAppletConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId,
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(activeFirebaseConfig) : getApp();

// Primary default Firestore database (visible in user's Firebase Console)
export const db = getFirestore(app);

// Named database if configured in cloud environment
const namedDbId = activeFirebaseConfig.firestoreDatabaseId;
export const namedDb = (namedDbId && namedDbId !== '(default)') ? getFirestore(app, namedDbId) : null;

export const auth = getAuth(app);
export const storage = getStorage(app);

// Cache helpers for instant UI responsiveness
const CACHE_KEY = 'erlass_realtime_students_cache_v2';

export function getLocalStudents(): StudentProject[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalStudents(students: StudentProject[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(students));
  } catch {
    // ignore
  }
}

// Clear legacy demo data
try {
  const stored = localStorage.getItem('erlass_competition_students_v1');
  if (stored) {
    localStorage.removeItem('erlass_competition_students_v1');
  }
} catch {
  // ignore
}

// Standardized error handling as mandated by skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const isFirebaseActive = () => true;

export function getSavedFirebaseConfig(): FirebaseCustomConfig {
  return {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  };
}

export function saveFirebaseConfig(config: FirebaseCustomConfig): void {
  localStorage.setItem('erlass_firebase_config_custom', JSON.stringify(config));
}

/**
 * Real-time listener ke Firestore collection('students')
 * Memberikan sinkronisasi instan setiap ada siswa yang ditambah/diedit/dihapus oleh admin
 */
export function subscribeToStudents(
  callback: (students: StudentProject[], isLive: boolean) => void
): Unsubscribe {
  const path = 'students';
  const q = query(collection(db, path));

  // Initialize immediately with cached students so there is zero layout flash
  const cached = getLocalStudents();
  if (cached.length > 0) {
    callback(cached, true);
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const students: StudentProject[] = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.id.startsWith('student-') && ['student-1', 'student-2', 'student-3', 'student-4', 'student-5', 'student-6'].includes(docSnap.id)) {
          return;
        }

        const data = docSnap.data();
        students.push({
          id: docSnap.id,
          studentName: data.studentName || '',
          competitionIdea: data.competitionIdea || '',
          moduleUrl: data.moduleUrl || '',
          sb3FileUrl: data.sb3FileUrl || '',
          moduleFileName: data.moduleFileName || 'Modul.pdf',
          sb3FileName: data.sb3FileName || 'Proyek.sb3',
          category: data.category || 'Game Scratch',
          grade: data.grade || 'SD Islam Al Ikhlas',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
        });
      });

      students.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveLocalStudents(students);
      callback(students, true);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Fallback to cached students
        callback(getLocalStudents(), false);
      }
    }
  );

  return unsubscribe;
}

/**
 * Mengambil data seluruh siswa dari Firestore collection('students') (One-time fetch)
 */
export async function getAllStudents(): Promise<{ students: StudentProject[]; isLive: boolean }> {
  const path = 'students';
  try {
    const q = query(collection(db, path));
    const querySnapshot = await getDocs(q);
    const students: StudentProject[] = [];

    querySnapshot.forEach((docSnap) => {
      if (docSnap.id.startsWith('student-') && ['student-1', 'student-2', 'student-3', 'student-4', 'student-5', 'student-6'].includes(docSnap.id)) {
        return;
      }

      const data = docSnap.data();
      students.push({
        id: docSnap.id,
        studentName: data.studentName || '',
        competitionIdea: data.competitionIdea || '',
        moduleUrl: data.moduleUrl || '',
        sb3FileUrl: data.sb3FileUrl || '',
        moduleFileName: data.moduleFileName || 'Modul.pdf',
        sb3FileName: data.sb3FileName || 'Proyek.sb3',
        category: data.category || 'Game Scratch',
        grade: data.grade || 'SD Islam Al Ikhlas',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString())
      });
    });

    students.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    saveLocalStudents(students);
    return { students, isLive: true };
  } catch (error) {
    console.warn('Firestore fetch notice:', error);
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      // Return cached list
    }
    return { students: getLocalStudents(), isLive: false };
  }
}

/**
 * Upload file dengan proteksi timeout cepat (Anti-Hang):
 * Jika Firebase Storage mengalami kendala CORS / autentikasi, langsung fallback ke Data URL instan (< 1 detik).
 */
export async function uploadFileToStorage(
  file: File, 
  folder: 'modules' | 'sb3_projects'
): Promise<{ url: string; fileName: string }> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${timestamp}_${safeName}`;

  // Helper konversi instan ke Data URL base64
  const convertToDataUrl = (): Promise<{ url: string; fileName: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: (reader.result as string) || URL.createObjectURL(file),
          fileName: file.name
        });
      };
      reader.onerror = () => {
        resolve({
          url: URL.createObjectURL(file),
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    });
  };

  try {
    const storageRef = ref(storage, path);

    // Timeout 2500ms agar browser tidak macet jika Firebase Storage bucket belum dikonfigurasi CORS
    const uploadTask = async () => {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return { url: downloadUrl, fileName: file.name };
    };

    const timeoutTask = new Promise<{ url: string; fileName: string }>((_, reject) => {
      setTimeout(() => reject(new Error('Storage upload timeout')), 2500);
    });

    return await Promise.race([uploadTask(), timeoutTask]);
  } catch (err) {
    console.warn('Firebase Storage notice (switching instantly to local Data URL):', err);
    return await convertToDataUrl();
  }
}

/**
 * Tambah data siswa baru ke Firestore
 * Menyimpan ke default database dan named database secara cepat tanpa macet
 */
export async function createStudent(payload: {
  studentName: string;
  competitionIdea: string;
  moduleUrl: string;
  sb3FileUrl: string;
  moduleFileName?: string;
  sb3FileName?: string;
  category?: StudentProject['category'];
  grade?: string;
}): Promise<StudentProject> {
  const path = 'students';
  const newId = 'student_' + Date.now();
  const now = new Date().toISOString();

  const studentData = {
    studentName: payload.studentName.trim(),
    competitionIdea: payload.competitionIdea.trim(),
    moduleUrl: payload.moduleUrl.trim(),
    sb3FileUrl: payload.sb3FileUrl.trim(),
    moduleFileName: payload.moduleFileName || 'Modul.pdf',
    sb3FileName: payload.sb3FileName || 'Proyek.sb3',
    category: payload.category || 'Game Scratch',
    grade: payload.grade || 'SD Islam Al Ikhlas',
    createdAt: serverTimestamp()
  };

  const studentResult: StudentProject = {
    id: newId,
    ...payload,
    createdAt: now
  };

  // Simpan ke cache lokal segera
  const localList = getLocalStudents();
  const existingIdx = localList.findIndex((s) => s.id === newId);
  if (existingIdx === -1) {
    localList.unshift(studentResult);
    saveLocalStudents(localList);
  }

  // Kirim ke Firestore dengan batas waktu 4 detik agar tidak pernah macet
  const firestoreWrite = async () => {
    // 1. Tulis ke default database (yang tampil di Firebase Console pengguna)
    await setDoc(doc(db, path, newId), studentData);

    // 2. Tulis ke named database jika ada
    if (namedDb) {
      try {
        await setDoc(doc(namedDb, path, newId), studentData);
      } catch {
        // Abaikan jika database sekunder tidak aktif
      }
    }
  };

  const writeTimeout = new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error('Firestore write timeout')), 4000);
  });

  try {
    await Promise.race([firestoreWrite(), writeTimeout]);
  } catch (err) {
    console.warn('Firestore write warning:', err);
  }

  return studentResult;
}

/**
 * Update data siswa di Firestore
 */
export async function updateStudent(id: string, payload: Partial<StudentProject>): Promise<void> {
  const path = `students/${id}`;

  // Update local cache
  const localList = getLocalStudents();
  const idx = localList.findIndex((s) => s.id === id);
  if (idx !== -1) {
    localList[idx] = { ...localList[idx], ...payload };
    saveLocalStudents(localList);
  }

  try {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, {
      ...payload,
      updatedAt: serverTimestamp()
    });

    if (namedDb) {
      try {
        await updateDoc(doc(namedDb, 'students', id), {
          ...payload,
          updatedAt: serverTimestamp()
        });
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.warn('Firestore update warning:', err);
  }
}

/**
 * Hapus data siswa di Firestore
 */
export async function deleteStudent(id: string): Promise<void> {
  const path = `students/${id}`;

  // Update local cache
  const localList = getLocalStudents();
  const filtered = localList.filter((s) => s.id !== id);
  saveLocalStudents(filtered);

  try {
    const docRef = doc(db, 'students', id);
    await deleteDoc(docRef);

    if (namedDb) {
      try {
        await deleteDoc(doc(namedDb, 'students', id));
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.warn('Firestore delete warning:', err);
  }
}

/**
 * Bersihkan data demo lama jika pernah terbuat di Firestore
 */
export async function cleanUpOldDemoData(): Promise<void> {
  const demoIds = ['student-1', 'student-2', 'student-3', 'student-4', 'student-5', 'student-6'];
  for (const id of demoIds) {
    try {
      await deleteDoc(doc(db, 'students', id));
      if (namedDb) {
        await deleteDoc(doc(namedDb, 'students', id));
      }
    } catch {
      // ignore
    }
  }
}
