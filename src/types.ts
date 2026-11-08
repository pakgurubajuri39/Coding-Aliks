/**
 * Type definitions for Erlass Coding Competition 2026 SD Islam Al Ikhlas
 */

export interface StudentProject {
  id: string;
  studentName: string;
  competitionIdea: string;
  moduleUrl: string; // URL download/preview file modul PDF dari Firebase Storage atau Link External Drive/PDF
  sb3FileUrl: string; // URL file .sb3 dari Firebase Storage atau link download/TurboWarp
  moduleFileName?: string;
  sb3FileName?: string;
  category?: 'Game Scratch' | 'Animasi Interaktif' | 'Cerita Bergambar' | 'Simulasi Sains';
  grade?: string; // misal Kelas 4A, 5B, 6C
  createdAt: string; // ISO string / timestamp
}

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
