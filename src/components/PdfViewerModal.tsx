import React from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  studentName: string;
  moduleFileName?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  studentName,
  moduleFileName = 'Modul_Pembelajaran.pdf',
}) => {
  if (!isOpen) return null;

  const isDataUrl = pdfUrl.startsWith('data:');
  const isHttpUrl = pdfUrl.startsWith('http');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border-4 border-black shadow-[8px_8px_0px_#000] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#FFE066] border-b-3 border-black px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_#000]">
              <FileText className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-black leading-tight">
                Modul Pembelajaran & Panduan Lomba
              </h3>
              <p className="text-xs font-semibold text-slate-700">
                Siswa: {studentName} ({moduleFileName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download={moduleFileName}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn bg-[#4ADE80] hover:bg-[#3ec470] text-black text-xs px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh PDF</span>
            </a>

            <button
              onClick={onClose}
              className="neo-btn bg-[#FF6584] hover:bg-[#ff4b70] text-black p-1.5 sm:px-3 sm:py-1.5 flex items-center justify-center cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden flex flex-col min-h-[450px]">
          {pdfUrl ? (
            <div className="w-full h-full border-2 border-black bg-white shadow-[3px_3px_0px_#000] flex flex-col overflow-hidden">
              <iframe
                src={pdfUrl}
                title={`Modul PDF - ${studentName}`}
                className="w-full h-full flex-1 border-0"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white border-2 border-black">
              <FileText className="w-16 h-16 text-slate-300 mb-3" />
              <h4 className="font-extrabold text-lg text-slate-800">Modul Belum Diunggah</h4>
              <p className="text-sm text-slate-600 max-w-md mt-1">
                Guru pembimbing belum menyematkan file modul untuk ide proyek ini. Silakan hubungi admin lomba.
              </p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-[#FFFDF5] border-t-3 border-black px-4 py-2 text-xs font-bold text-slate-700 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Tips: Jika pratinjau browser tidak muncul, klik tombol &quot;Unduh PDF&quot; di atas untuk membuka di aplikasi PDF favoritmu.
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-black text-black hover:text-blue-700 flex items-center gap-1"
          >
            Buka di Tab Baru <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
