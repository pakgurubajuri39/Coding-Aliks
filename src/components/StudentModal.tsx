import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Lightbulb, 
  FileText, 
  Play, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Laptop,
  Layers,
  Tag
} from 'lucide-react';
import { StudentProject } from '../types';

interface StudentModalProps {
  student: StudentProject | null;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({ student, onClose }) => {
  useEffect(() => {
    if (student) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [student]);

  if (!student) return null;

  // Generate TurboWarp embed url for the .sb3 file or project
  const isHttp = student.sb3FileUrl && student.sb3FileUrl.startsWith('http');
  const turboWarpEmbedUrl = isHttp 
    ? `https://turbowarp.org/embed?project_url=${encodeURIComponent(student.sb3FileUrl)}`
    : 'https://turbowarp.org/embed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-white border-4 border-black shadow-[10px_10px_0px_#000] flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-[#FFE066] border-b-4 border-black px-4 py-3 sm:px-6 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👋</span>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-black leading-tight">
                Halo, <span className="underline decoration-[#FF6584] decoration-4">{student.studentName}</span>!
              </h2>
              <p className="text-xs font-bold text-slate-800">
                Ready for Coding? Berikut ide lomba, modul pembelajaran, dan proyek Scratch milikmu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {student.grade && (
                <span className="bg-white border-2 border-black px-2 py-0.5 text-xs font-black shadow-[1px_1px_0px_#000]">
                  {student.grade}
                </span>
              )}
              {student.category && (
                <span className="bg-[#A7F3D0] border-2 border-black px-2 py-0.5 text-xs font-black shadow-[1px_1px_0px_#000]">
                  {student.category}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="neo-btn bg-[#FF6584] hover:bg-[#ff4b70] text-black p-1.5 sm:px-3 sm:py-1.5 flex items-center justify-center cursor-pointer"
              aria-label="Tutup Dashboard Siswa"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FFFDF5] space-y-6">
          
          {/* 1. KARTU IDE LOMBA (Langsung Tampil) */}
          <div className="neo-card p-4 sm:p-5 bg-[#FEF08A]">
            <div className="flex items-center gap-2 mb-2 font-black text-xs sm:text-sm uppercase tracking-wider text-black">
              <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Ide & Konsep Lomba:</span>
            </div>
            <div className="bg-white border-2 border-black p-3.5 shadow-[2px_2px_0px_#000]">
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                {student.competitionIdea || 'Ide lomba sedang disempurnakan.'}
              </p>
            </div>
          </div>

          {/* 2 & 3: GRID MODUL PDF & PROYEK SCRATCH YANG LANGSUNG DI-EMBED */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* EMBED MODUL PEMBELAJARAN (PDF) */}
            <div className="neo-card p-4 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider text-black">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>Modul Pembelajaran (PDF)</span>
                  </div>
                  {student.moduleUrl && (
                    <a
                      href={student.moduleUrl}
                      download={student.moduleFileName || 'Modul.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-btn bg-[#FFE066] hover:bg-[#fed633] text-black text-xs px-2.5 py-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </a>
                  )}
                </div>

                {/* Direct Embed Viewer */}
                <div className="w-full h-80 sm:h-96 border-2 border-black bg-slate-100 shadow-[2px_2px_0px_#000] overflow-hidden flex flex-col">
                  {student.moduleUrl ? (
                    <iframe
                      src={student.moduleUrl}
                      title={`Modul PDF - ${student.studentName}`}
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                      <FileText className="w-12 h-12 text-slate-300 mb-2" />
                      <p className="font-bold text-xs">Belum ada modul PDF terlampir.</p>
                    </div>
                  )}
                </div>
              </div>

              {student.moduleUrl && (
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="truncate max-w-[200px]">
                    {student.moduleFileName || 'Modul.pdf'}
                  </span>
                  <a
                    href={student.moduleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-black font-extrabold hover:text-blue-700 flex items-center gap-1"
                  >
                    Buka Tab Penuh <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* EMBED PROYEK SCRATCH */}
            <div className="neo-card p-4 bg-[#FFFBEB] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider text-black">
                    <span className="text-base">🐱</span>
                    <span>Proyek Scratch (.SB3)</span>
                  </div>
                  {student.sb3FileUrl && (
                    <a
                      href={student.sb3FileUrl}
                      download={student.sb3FileName || 'Proyek.sb3'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-btn bg-[#4ADE80] hover:bg-[#3ec470] text-black text-xs px-2.5 py-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh .SB3</span>
                    </a>
                  )}
                </div>

                {/* Direct Embed TurboWarp / Scratch Player */}
                <div className="w-full h-80 sm:h-96 border-2 border-black bg-white shadow-[2px_2px_0px_#000] overflow-hidden flex flex-col">
                  {student.sb3FileUrl ? (
                    <iframe
                      src={turboWarpEmbedUrl}
                      title={`Scratch Project - ${student.studentName}`}
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                      <Play className="w-12 h-12 text-slate-300 mb-2" />
                      <p className="font-bold text-xs">Belum ada file proyek Scratch terlampir.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Scratch Action Buttons */}
              <div className="mt-3 pt-2 border-t border-black/20 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                <span className="truncate max-w-[180px] text-slate-800">
                  {student.sb3FileName || 'Proyek.sb3'}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://scratch.mit.edu/projects/editor/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn bg-[#FF9431] hover:bg-[#e07b1a] text-white px-2.5 py-1 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <span>Scratch Editor</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://turbowarp.org/editor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn bg-[#38BDF8] hover:bg-[#1db0f3] text-black px-2.5 py-1 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <span>TurboWarp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Tip Footer */}
          <div className="bg-[#BAE6FD] border-2 border-black p-3 text-xs font-bold text-slate-900 flex items-center justify-between">
            <span>
              💡 <strong>Tips Lomba:</strong> Kamu dapat memainkan proyek Scratch langsung di frame atas atau mengunduh file <strong>.sb3</strong> untuk diedit di Scratch Editor.
            </span>
            <button
              onClick={onClose}
              className="neo-btn bg-white hover:bg-slate-100 text-black px-3 py-1 text-xs font-black shrink-0 ml-3 cursor-pointer"
            >
              Kembali
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
