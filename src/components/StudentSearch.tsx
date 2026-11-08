import React, { useState, useMemo } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight, User, Users, Shield } from 'lucide-react';
import { StudentProject } from '../types';

interface StudentSearchProps {
  students: StudentProject[];
  onSelectStudent: (student: StudentProject) => void;
  onOpenAdmin: () => void;
}

export const StudentSearch: React.FC<StudentSearchProps> = ({ 
  students, 
  onSelectStudent,
  onOpenAdmin 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notFound, setNotFound] = useState(false);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => 
      s.studentName.toLowerCase().includes(q) ||
      (s.grade && s.grade.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q))
    );
  }, [searchTerm, students]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    // Search exact or substring
    const match = students.find((s) => s.studentName.toLowerCase().includes(query));

    if (match) {
      setNotFound(false);
      onSelectStudent(match);
    } else {
      setNotFound(true);
    }
  };

  const handleQuickSelect = (student: StudentProject) => {
    setNotFound(false);
    onSelectStudent(student);
  };

  const bgColors = [
    'bg-[#FFE066]', // pastel yellow
    'bg-[#A7F3D0]', // mint
    'bg-[#BAE6FD]', // sky
    'bg-[#FFD6E0]', // soft pink
    'bg-[#DDD6FE]', // light purple
    'bg-[#FED7AA]', // soft orange
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-6">
      {/* Search Input Box */}
      <div className="neo-card p-4 sm:p-6 bg-[#FFFBEB] mb-6">
        <form onSubmit={handleSearch} className="relative">
          <label htmlFor="student-search-input" className="block text-sm sm:text-base font-black text-black mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Cari Nama Siswa:
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black text-emerald-900 bg-[#A7F3D0] border border-black px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Realtime Sync</span>
              </span>
              <span className="text-xs font-bold text-slate-800 bg-white border border-black px-2 py-0.5">
                {students.length} Peserta Terdaftar
              </span>
            </div>
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                id="student-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (notFound) setNotFound(false);
                }}
                placeholder="Ketik nama siswa untuk menyaring..."
                className="w-full bg-white border-3 border-black px-4 py-3 text-base font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:bg-[#FEF08A] transition-colors shadow-[3px_3px_0px_#000]"
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setNotFound(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold bg-slate-200 hover:bg-slate-300 border border-black px-2 py-1 rounded cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <button
              type="submit"
              className="neo-btn bg-[#4ADE80] hover:bg-[#3ec470] text-black px-6 py-3 font-black text-sm sm:text-base flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Buka Proyek</span>
              <span className="text-lg">🚀</span>
            </button>
          </div>
        </form>

        {/* Not Found Alert */}
        {notFound && (
          <div className="mt-3 p-3 bg-[#FFD6D6] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-2 text-xs font-bold text-rose-950">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              Nama &quot;{searchTerm}&quot; tidak ditemukan. Klik salah satu nama peserta di daftar bawah ini.
            </span>
          </div>
        )}
      </div>

      {/* Prominent Quick-Pick List of All Students Added by Admin */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-black">
            <Users className="w-4 h-4 text-blue-700" />
            <span>Daftar Siswa Peserta Lomba (Klik Untuk Membuka):</span>
          </div>
          {searchTerm && (
            <span className="text-xs font-bold text-slate-600">
              Menampilkan {filteredStudents.length} dari {students.length} siswa
            </span>
          )}
        </div>

        {students.length === 0 ? (
          /* Empty State when no students added yet */
          <div className="neo-card p-8 bg-white text-center">
            <div className="w-12 h-12 bg-[#FFE066] border-2 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_#000] mb-3">
              <User className="w-6 h-6 text-black" />
            </div>
            <h4 className="font-black text-base text-black mb-1">
              Belum Ada Siswa yang Didaftarkan
            </h4>
            <p className="text-xs font-medium text-slate-600 max-w-md mx-auto mb-4">
              Silakan masuk ke Portal Admin untuk menambahkan data siswa, ide lomba, modul PDF, dan file proyek Scratch (.sb3).
            </p>
            <button
              onClick={onOpenAdmin}
              className="neo-btn bg-[#FF6584] hover:bg-[#ff4b70] text-black px-4 py-2 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Buka Portal Admin Sekarang</span>
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="neo-card p-6 bg-white text-center text-xs font-bold text-slate-600">
            Tidak ada siswa dengan nama &quot;{searchTerm}&quot;. Coba kata kunci lain atau kosongkan kolom pencarian.
          </div>
        ) : (
          /* Grid of student cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredStudents.map((student, idx) => {
              const colorClass = bgColors[idx % bgColors.length];
              return (
                <button
                  key={student.id}
                  onClick={() => handleQuickSelect(student)}
                  className={`neo-card p-3 sm:p-4 ${colorClass} hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all text-left flex flex-col justify-between cursor-pointer group`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-1.5 py-0.5">
                        {student.grade || 'SDI Al Ikhlas'}
                      </span>
                      <span className="text-xs group-hover:translate-x-1 transition-transform">
                        👉
                      </span>
                    </div>

                    <h4 className="font-black text-sm sm:text-base text-black leading-tight line-clamp-1 mb-1">
                      {student.studentName}
                    </h4>

                    <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug">
                      {student.competitionIdea}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/20 flex items-center justify-between text-[11px] font-bold text-slate-900">
                    <span className="truncate max-w-[150px]">
                      {student.category || 'Scratch Project'}
                    </span>
                    <span className="text-emerald-900 font-black flex items-center gap-0.5">
                      Buka <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
