# Erlass Coding Competition 2026 - SD Islam Al Ikhlas

Aplikasi web interaktif (SPA) berbasis React, Tailwind CSS, dan Firebase Firestore & Storage dengan gaya desain Neo-Brutalism untuk kompetisi koding siswa SD.

---

## Panduan Publish / Deploy ke Vercel

Aplikasi ini sudah dilengkapi berkas `vercel.json` dan siap di-deploy langsung ke Vercel.

### Cara 1: Deploy Melalui Vercel Dashboard (Rekomendasi)

1. **Push Proyek ke Git Repository:**
   - Unggah proyek ini ke repository **GitHub** atau **GitLab** Anda.
2. **Buka Vercel:**
   - Kunjungi [https://vercel.com](https://vercel.com) dan login.
   - Klik tombol **"Add New..."** ➔ **"Project"**.
   - Pilih repository GitHub proyek ini, lalu klik **Import**.
3. **Konfigurasi Proyek di Vercel:**
   - **Framework Preset:** `Vite` (terdeteksi otomatis)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. **Environment Variables (Opsional):**
   - Berkas `firebase-applet-config.json` sudah tersemat di repository sehingga aplikasi dapat langsung berjalan tanpa konfigurasi tambahan.
   - Jika ingin menggunakan environment variables terpisah di Vercel, buka menu **Environment Variables** di Vercel Dashboard dan tambahkan:
     - `VITE_FIREBASE_API_KEY` = `AIzaSyBvC2O9rZezT83jgyPWc_mL2OoH8D5QSEI`
     - `VITE_FIREBASE_AUTH_DOMAIN` = `erlass-coding-competition-2026.firebaseapp.com`
     - `VITE_FIREBASE_PROJECT_ID` = `erlass-coding-competition-2026`
     - `VITE_FIREBASE_STORAGE_BUCKET` = `erlass-coding-competition-2026.firebasestorage.app`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID` = `430511248174`
     - `VITE_FIREBASE_APP_ID` = `1:430511248174:web:f8cc665d29aa646e1f20bf`
     - `VITE_FIREBASE_DATABASE_ID` = `ai-studio-erlasscodingcomp-f49aa42b-ef64-475f-bce0-7bc605b51c62`
5. **Klik "Deploy":**
   - Vercel akan mengompilasi dan menerbitkan aplikasi ke URL publik (misal: `https://erlass-coding-2026.vercel.app`).

---

### Cara 2: Deploy Menggunakan Vercel CLI

Jika Anda memiliki Node.js di komputer:

```bash
# 1. Pasang Vercel CLI
npm install -g vercel

# 2. Login ke akun Vercel
vercel login

# 3. Deploy langsung dari folder proyek
vercel --prod
```

---

## Fitur Utama

- **Real-Time Sync:** Data siswa terhubung langsung ke Firebase Firestore (`erlass-coding-competition-2026`).
- **Portal Siswa:** Pencarian nama instan, kartu ide lomba, modul pembelajaran PDF ter-embed, dan player Scratch/TurboWarp ter-embed.
- **Portal Admin:** Akses aman (username `admin`, password rahasia) untuk input data, upload berkas modul PDF dan proyek `.sb3`, serta ekspor data JSON/CSV.
- **Gaya Desain:** Neo-Brutalism (Border tebal hitam, bayangan tajam, warna pastel kontras cerah ramah anak SD).
- **Hak Cipta:** `@copyright Pak GuruAI`
