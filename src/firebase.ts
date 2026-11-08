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
import firebaseConfig from '../firebase-applet-config.json';
import { FirebaseCustomConfig, StudentProject } from './types';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const dbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Test Connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or connectivity.");
    }
  }
}
testConnection();

// Clear legacy demo data from localStorage if present
try {
  const stored = localStorage.getItem('erlass_competition_students_v1');
  if (stored && (stored.includes('student-1') || stored.includes('Muhammad Fatih'))) {
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

  return onSnapshot(
    q,
    (snapshot) => {
      const students: StudentProject[] = [];
      snapshot.forEach((docSnap) => {
        // Abaikan data demo lama jika ada
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

      // Urutkan siswa terbaru di atas
      students.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(students, true);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Logged for diagnosis, provide empty list with false status
        callback([], false);
      }
    }
  );
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
    return { students, isLive: true };
  } catch (error) {
    console.warn('Firestore fetch notice:', error);
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      // Return empty list
    }
    return { students: [], isLive: false };
  }
}

/**
 * Upload file ke Firebase Storage
 */
export async function uploadFileToStorage(
  file: File, 
  folder: 'modules' | 'sb3_projects'
): Promise<{ url: string; fileName: string }> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${timestamp}_${safeName}`;

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return { url: downloadUrl, fileName: file.name };
  } catch (err) {
    console.warn('Firebase Storage upload notice (using Data URL fallback):', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: (reader.result as string) || URL.createObjectURL(file),
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Tambah data siswa baru ke Firestore
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

  try {
    await setDoc(doc(db, path, newId), {
      studentName: payload.studentName.trim(),
      competitionIdea: payload.competitionIdea.trim(),
      moduleUrl: payload.moduleUrl.trim(),
      sb3FileUrl: payload.sb3FileUrl.trim(),
      moduleFileName: payload.moduleFileName || 'Modul.pdf',
      sb3FileName: payload.sb3FileName || 'Proyek.sb3',
      category: payload.category || 'Game Scratch',
      grade: payload.grade || 'SD Islam Al Ikhlas',
      createdAt: serverTimestamp()
    });

    return {
      id: newId,
      ...payload,
      createdAt: now
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${path}/${newId}`);
    throw err;
  }
}

/**
 * Update data siswa di Firestore
 */
export async function updateStudent(id: string, payload: Partial<StudentProject>): Promise<void> {
  const path = `students/${id}`;
  try {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, {
      ...payload,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

/**
 * Hapus data siswa di Firestore
 */
export async function deleteStudent(id: string): Promise<void> {
  const path = `students/${id}`;
  try {
    const docRef = doc(db, 'students', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
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
    } catch {
      // ignore
    }
  }
}
