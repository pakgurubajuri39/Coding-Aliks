import React from 'react';
import { Heart, Sparkles, Trophy, Code2 } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="mt-auto border-t-4 border-black bg-[#FFE066] text-black">
      {/* Upper decorative marquee ribbon */}
      <div className="border-b-3 border-black bg-[#38BDF8] py-2 px-4 overflow-hidden">
        <div className="flex items-center justify-around gap-6 text-xs sm:text-sm font-black uppercase tracking-wider text-black select-none">
          <span className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
            Erlass Coding Competition 2026
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500" />
            SD Islam Al Ikhlas Jakarta
          </span>
          <span className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-indigo-900" />
            Kreativitas Generasi Muslim Masa Depan
          </span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Brand Info */}
          <div>
            <div className="inline-block bg-white border-2 border-black px-3 py-1 font-black text-sm shadow-[2px_2px_0px_#000] mb-2">
              Erlass Coding Competition 2026
            </div>
            <p className="text-xs font-bold text-slate-800">
              Platform Manajemen Lomba Koding & Scratch SD Islam Al Ikhlas
            </p>
          </div>

          {/* Quick link & admin trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="text-xs font-extrabold underline decoration-2 hover:text-rose-700 cursor-pointer"
            >
              Akses Admin / Guru
            </button>
          </div>
        </div>

        {/* Required Copyright Line */}
        <div className="mt-6 pt-4 border-t-2 border-black/30 text-center">
          <p className="text-xs sm:text-sm font-black tracking-tight text-black">
            @copyright Pak GuruAI
          </p>
        </div>
      </div>
    </footer>
  );
};
