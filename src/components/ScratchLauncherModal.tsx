import React from 'react';
import { X, Download, Play, ExternalLink, Sparkles, CheckCircle2, Laptop } from 'lucide-react';

interface ScratchLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  sb3Url: string;
  studentName: string;
  sb3FileName?: string;
  projectTitle: string;
}

export const ScratchLauncherModal: React.FC<ScratchLauncherModalProps> = ({
  isOpen,
  onClose,
  sb3Url,
  studentName,
  sb3FileName = 'Proyek_Scratch.sb3',
  projectTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_#000] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#FF9431] border-b-3 border-black px-4 py-3 sm:px-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_#000] text-2xl">
              🐱
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-black leading-tight">
                Peluncur Scratch 3.0 Proyek Siswa
              </h3>
              <p className="text-xs font-bold text-slate-900">
                Karya: {studentName} ({sb3FileName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neo-btn bg-[#FF6584] hover:bg-[#ff4b70] text-black p-1.5 sm:px-2.5 sm:py-1 flex items-center justify-center cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 bg-[#FFFDF5] space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Project Box */}
          <div className="p-3.5 bg-[#FFFBEB] border-3 border-black shadow-[3px_3px_0px_#000]">
            <span className="text-[11px] font-black uppercase tracking-wider bg-[#FFE066] border border-black px-2 py-0.5 text-black">
              Proyek Lomba
            </span>
            <h4 className="font-extrabold text-base sm:text-lg text-black mt-1">
              {projectTitle}
            </h4>
          </div>

          {/* Step by step visual instructions for elementary students */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-black flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              Cara Membuka & Menjalankan File SB3 di Scratch:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="bg-white border-3 border-black p-3 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 bg-[#FFE066] border-2 border-black flex items-center justify-center font-black text-sm mb-2 shadow-[1px_1px_0px_#000]">
                    1
                  </div>
                  <h5 className="font-extrabold text-sm text-black">Unduh File SB3</h5>
                  <p className="text-xs text-slate-600 mt-1">
                    Klik tombol kuning di bawah untuk menyimpan file <strong>.sb3</strong> ke komputermu.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white border-3 border-black p-3 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 bg-[#38BDF8] border-2 border-black flex items-center justify-center font-black text-sm mb-2 shadow-[1px_1px_0px_#000]">
                    2
                  </div>
                  <h5 className="font-extrabold text-sm text-black">Buka Editor</h5>
                  <p className="text-xs text-slate-600 mt-1">
                    Buka Scratch Editor resmi atau TurboWarp melalui tombol peluncur cepat.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border-3 border-black p-3 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 bg-[#4ADE80] border-2 border-black flex items-center justify-center font-black text-sm mb-2 shadow-[1px_1px_0px_#000]">
                    3
                  </div>
                  <h5 className="font-extrabold text-sm text-black">Muat File</h5>
                  <p className="text-xs text-slate-600 mt-1">
                    Di editor Scratch: pilih menu <strong>File</strong> ➔ <strong>Muat dari komputer Anda</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Download SB3 Button */}
            <a
              href={sb3Url}
              download={sb3FileName}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full neo-btn bg-[#FFE066] hover:bg-[#fed633] text-black p-3 sm:p-4 text-center flex items-center justify-center gap-2 cursor-pointer font-black text-sm sm:text-base"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Langkah 1: Unduh File Proyek ({sb3FileName})</span>
            </a>

            {/* Launch Scratch Editor Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://scratch.mit.edu/projects/editor/"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn bg-[#FF9431] hover:bg-[#e07b1a] text-white p-3 text-center flex items-center justify-center gap-2 cursor-pointer font-extrabold text-sm"
              >
                <Play className="w-4 h-4 fill-white stroke-[2]" />
                <span>Buka Scratch Editor Resmi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://turbowarp.org/editor"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn bg-[#38BDF8] hover:bg-[#1db0f3] text-black p-3 text-center flex items-center justify-center gap-2 cursor-pointer font-extrabold text-sm"
              >
                <Laptop className="w-4 h-4 text-black" />
                <span>Buka di TurboWarp Editor (Cepat)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Extra Help Note */}
          <div className="p-3 bg-emerald-50 border-2 border-black text-xs font-semibold text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              File .sb3 adalah format proyek koding Scratch 3.0 yang aman dan bisa dimainkan di semua komputer / laptop sekolah.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FEF08A] border-t-3 border-black px-4 py-2.5 flex justify-end">
          <button
            onClick={onClose}
            className="neo-btn bg-white hover:bg-slate-100 text-black px-4 py-1.5 text-xs font-extrabold cursor-pointer"
          >
            Tutup Peluncur
          </button>
        </div>
      </div>
    </div>
  );
};
