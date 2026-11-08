import React from 'react';
import { Trophy, Code2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-6 pb-2 sm:pt-8 sm:pb-3 px-4 text-center">
      {/* Top minimal badge */}
      <div className="inline-flex items-center gap-1.5 bg-[#FFE066] border-2 border-black px-3 py-1 font-extrabold text-xs sm:text-sm shadow-[2px_2px_0px_#000] rotate-[-1deg] mb-3">
        <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
        <span>Kompetisi Koding 2026</span>
      </div>

      {/* Main Title */}
      <div className="max-w-4xl mx-auto mb-2">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-black">
          <span className="bg-[#FFE066] px-2 py-0.5 border-3 border-black shadow-[4px_4px_0px_#000] inline-block mb-1.5 transform -rotate-1">
            Erlass Coding Competition
          </span>{' '}
          <span className="inline-block">2026</span>
          <br className="hidden sm:inline" />
          <span className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 mt-1 block">
            SD Islam Al Ikhlas
          </span>
        </h1>
      </div>

      {/* Brief Subtitle */}
      <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base font-bold text-slate-700 leading-snug">
        Cari nama atau klik namamu di bawah untuk langsung membuka kartu ide lomba, membaca modul PDF, dan memainkan proyek Scratch!
      </p>
    </section>
  );
};
