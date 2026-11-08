import React from 'react';
import { Sparkles, Shield, Database, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isLiveFirebase: boolean;
  totalStudents: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isLiveFirebase, totalStudents }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF5] border-b-4 border-black px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & School Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FFE066] border-3 border-black shadow-[3px_3px_0px_#000] px-3 py-1.5 flex items-center gap-2 transform -rotate-1 hover:rotate-0 transition-transform">
            <span className="text-xl">🏫</span>
            <div className="leading-tight">
              <span className="font-extrabold text-sm sm:text-base tracking-tight block">SD ISLAM AL IKHLAS</span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider block">Cirendeu & Cipete</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-[#4ADE80] border-2 border-black px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Erlass Coding 2026</span>
          </div>
        </div>

        {/* Right side status & Admin button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator Badge */}
          <div 
            title="Terhubung Realtime ke Firebase Firestore: erlass-coding-competition-2026"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000] ${
              isLiveFirebase ? 'bg-[#A7F3D0] text-emerald-950' : 'bg-[#FEF08A] text-amber-950'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveFirebase ? 'bg-emerald-500' : 'bg-amber-500'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveFirebase ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
            </span>
            <span className="hidden sm:inline">
              {isLiveFirebase ? 'Firebase Realtime: Aktif' : 'Menghubungkan...'}
            </span>
            <span className="bg-black text-white text-[10px] px-1.5 py-0.2 rounded-sm ml-0.5">
              {totalStudents} Siswa
            </span>
          </div>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="neo-btn bg-[#FF6584] hover:bg-[#ff4b70] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            aria-label="Panel Admin"
          >
            <Shield className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="text-black font-extrabold">Portal Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
