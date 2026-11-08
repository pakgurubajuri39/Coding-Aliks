import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  KeyRound, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Upload, 
  FileText, 
  Layers, 
  Database, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  LogOut,
  ExternalLink,
  Code
} from 'lucide-react';
import { StudentProject, FirebaseCustomConfig } from '../types';
import { 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  uploadFileToStorage, 
  getSavedFirebaseConfig, 
  saveFirebaseConfig,
  cleanUpOldDemoData
} from '../firebase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProject[];
  onRefreshStudents: () => Promise<void>;
  onPreviewStudent: (student: StudentProject) => void;
  isLiveFirebase: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  students,
  onRefreshStudents,
  onPreviewStudent,
  isLiveFirebase,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Tab State: 'list' | 'create' | 'firebase'
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'firebase'>('list');
  const [searchTableTerm, setSearchTableTerm] = useState('');

  // New Student Form State
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [grade, setGrade] = useState('Kelas 5 Umar');
  const [category, setCategory] = useState<StudentProject['category']>('Game Scratch');
  const [moduleFile, setModuleFile] = useState<File | null>(null);
  const [sb3File, setSb3File] = useState<File | null>(null);
  const [moduleUrlInput, setModuleUrlInput] = useState('');
  const [sb3UrlInput, setSb3UrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Editing State
  const [editingStudent, setEditingStudent] = useState<StudentProject | null>(null);

  // Firebase Config Form State
  const [fbConfig, setFbConfig] = useState<FirebaseCustomConfig>(getSavedFirebaseConfig());
  const [configSavedNotice, setConfigSavedNotice] = useState('');

  if (!isOpen) return null;

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    // Verification according to user prompt:
    // Username: admin
    // Password: pakguru OR bajuri39
    if (cleanUser === 'admin' && (cleanPass === 'pakguru' || cleanPass === 'bajuri39')) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Username atau sandi admin salah. Silakan coba kembali.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setActiveTab('list');
    setEditingStudent(null);
  };

  // Handle Create Student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !idea.trim()) {
      alert('Nama siswa dan ide lomba wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess('');

    try {
      let finalModuleUrl = moduleUrlInput.trim();
      let finalModuleFileName = 'Modul.pdf';
      let finalSb3Url = sb3UrlInput.trim();
      let finalSb3FileName = 'Proyek.sb3';

      // Upload Module File if selected
      if (moduleFile) {
        const uploadedMod = await uploadFileToStorage(moduleFile, 'modules');
        finalModuleUrl = uploadedMod.url;
        finalModuleFileName = uploadedMod.fileName;
      }

      // Upload SB3 File if selected
      if (sb3File) {
        const uploadedSb3 = await uploadFileToStorage(sb3File, 'sb3_projects');
        finalSb3Url = uploadedSb3.url;
        finalSb3FileName = uploadedSb3.fileName;
      }

      // Fallback URLs if none provided
      if (!finalModuleUrl) {
        finalModuleUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      }
      if (!finalSb3Url) {
        finalSb3Url = 'https://cdn.scratch.mit.edu/scratchr2/static/projects/104/104.sb3';
      }

      await createStudent({
        studentName: name,
        competitionIdea: idea,
        moduleUrl: finalModuleUrl,
        sb3FileUrl: finalSb3Url,
        moduleFileName: finalModuleFileName,
        sb3FileName: finalSb3FileName,
        category,
        grade,
      });

      await onRefreshStudents();

      // Reset form
      setName('');
      setIdea('');
      setModuleFile(null);
      setSb3File(null);
      setModuleUrlInput('');
      setSb3UrlInput('');
      setSubmitSuccess('Data siswa dan file proyek berhasil disimpan!');
      setActiveTab('list');
    } catch (err) {
      console.error('Error saving student:', err);
      alert('Terjadi kesalahan saat menyimpan data siswa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Student
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setIsSubmitting(true);
    try {
      let finalModuleUrl = editingStudent.moduleUrl;
      let finalModuleFileName = editingStudent.moduleFileName;
      let finalSb3Url = editingStudent.sb3FileUrl;
      let finalSb3FileName = editingStudent.sb3FileName;

      if (moduleFile) {
        const uploadedMod = await uploadFileToStorage(moduleFile, 'modules');
        finalModuleUrl = uploadedMod.url;
        finalModuleFileName = uploadedMod.fileName;
      }

      if (sb3File) {
        const uploadedSb3 = await uploadFileToStorage(sb3File, 'sb3_projects');
        finalSb3Url = uploadedSb3.url;
        finalSb3FileName = uploadedSb3.fileName;
      }

      await updateStudent(editingStudent.id, {
        studentName: editingStudent.studentName,
        competitionIdea: editingStudent.competitionIdea,
        grade: editingStudent.grade,
        category: editingStudent.category,
        moduleUrl: finalModuleUrl,
        moduleFileName: finalModuleFileName,
        sb3FileUrl: finalSb3Url,
        sb3FileName: finalSb3FileName,
      });

      await onRefreshStudents();
      setEditingStudent(null);
      setModuleFile(null);
      setSb3File(null);
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Gagal memperbarui data siswa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Student
  const handleDeleteStudent = async (id: string, studentName: string) => {
    if (window.confirm(`Yakin ingin menghapus data siswa "${studentName}" dari kompetisi?`)) {
      await deleteStudent(id);
      await onRefreshStudents();
    }
  };

  // Filtered Students in Table
  const filteredStudents = students.filter((s) => {
    const q = searchTableTerm.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(q) ||
      s.competitionIdea.toLowerCase().includes(q) ||
      (s.grade && s.grade.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q))
    );
  });

  // Handle Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Erlass_Coding_2026_SDI_AlIkhlas_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Save Firebase Config
  const handleSaveFirebaseConfig = () => {
    saveFirebaseConfig(fbConfig);
    setConfigSavedNotice('Konfigurasi Firebase berhasil disimpan ke browser!');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleCleanDemoData = async () => {
    if (window.confirm('Bersihkan semua data demo lama dari database?')) {
      await cleanUpOldDemoData();
      await onRefreshStudents();
      alert('Data demo lama berhasil dibersihkan!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-white border-4 border-black shadow-[10px_10px_0px_#000] flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#FFE066] border-b-4 border-black px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-black text-[#FFE066] p-1.5 border-2 border-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-black leading-tight">
                Panel Manajemen Lomba (Admin)
              </h3>
              <p className="text-xs font-bold text-slate-800">
                Erlass Coding Competition 2026 SD Islam Al Ikhlas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="neo-btn bg-[#FF6584] hover:bg-[#ff4b70] text-black px-2.5 py-1 text-xs font-black flex items-center gap-1 cursor-pointer"
                title="Keluar Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="neo-btn bg-white hover:bg-slate-100 text-black p-1.5 flex items-center justify-center cursor-pointer"
              aria-label="Tutup Admin"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FFFDF5]">
          {!isAuthenticated ? (
            /* ================= LOGIN FORM ================= */
            <div className="max-w-md mx-auto my-8">
              <div className="neo-card p-6 sm:p-8 bg-white text-center">
                <div className="w-14 h-14 bg-[#FFE066] border-3 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_#000] mb-4">
                  <Lock className="w-7 h-7 text-black stroke-[2.5]" />
                </div>

                <h4 className="text-xl font-black text-black">Autentikasi Guru & Panitia</h4>
                <p className="text-xs font-semibold text-slate-600 mt-1 mb-6">
                  Masukkan identitas admin untuk mengelola data siswa, modul, dan file proyek Scratch.
                </p>

                {loginError && (
                  <div className="mb-4 p-3 bg-rose-100 border-2 border-black text-xs font-bold text-rose-900 flex items-center gap-2 text-left">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                      Username Admin:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="Ketik username admin..."
                        className="w-full bg-[#FFFBEB] border-3 border-black px-3.5 py-2.5 font-bold text-sm focus:outline-none focus:bg-[#FEF08A] shadow-[2px_2px_0px_#000]"
                        required
                        autoFocus
                      />
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                      Password:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#FFFBEB] border-3 border-black px-3.5 py-2.5 font-bold text-sm focus:outline-none focus:bg-[#FEF08A] shadow-[2px_2px_0px_#000]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
                      >
                        {showPassword ? 'Sembunyikan' : 'Lihat'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full neo-btn bg-[#4ADE80] hover:bg-[#3ec470] text-black py-3 font-black text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Masuk ke Dashboard Admin</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* ================= AUTHENTICATED DASHBOARD ================= */
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-black pb-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('list');
                      setEditingStudent(null);
                    }}
                    className={`neo-btn px-4 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'list' && !editingStudent
                        ? 'bg-[#FFE066] text-black shadow-[4px_4px_0px_#000]'
                        : 'bg-white text-slate-700 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Daftar Siswa ({students.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('create');
                      setEditingStudent(null);
                    }}
                    className={`neo-btn px-4 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'create'
                        ? 'bg-[#4ADE80] text-black shadow-[4px_4px_0px_#000]'
                        : 'bg-white text-slate-700 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Tambah Siswa & Proyek</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('firebase');
                      setEditingStudent(null);
                    }}
                    className={`neo-btn px-4 py-2 text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'firebase'
                        ? 'bg-[#38BDF8] text-black shadow-[4px_4px_0px_#000]'
                        : 'bg-white text-slate-700 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    <span>Konfigurasi Firebase</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="neo-btn bg-white hover:bg-slate-100 text-xs px-2.5 py-1.5 font-bold flex items-center gap-1 cursor-pointer"
                    title="Ekspor JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Ekspor Data</span>
                  </button>
                  <button
                    onClick={onRefreshStudents}
                    className="neo-btn bg-[#FFE066] hover:bg-[#fed633] text-xs px-2.5 py-1.5 font-bold flex items-center gap-1 cursor-pointer"
                    title="Segarkan Data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Segarkan</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-3 bg-white border-2 border-black flex flex-wrap items-center justify-between gap-2 text-xs font-bold shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border border-black ${isLiveFirebase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span>
                    Status Backend:{' '}
                    <strong>{isLiveFirebase ? 'Firebase Firestore Realtime Aktif (erlass-coding-competition-2026)' : 'Menghubungkan ke Firebase...'}</strong>
                  </span>
                </div>
                <div className="text-slate-600">
                  Total Peserta: <span className="bg-black text-white px-1.5 py-0.5 rounded-sm">{students.length} Siswa</span>
                </div>
              </div>

              {/* TAB 1: LIST OF STUDENTS (TABLE CRUD) */}
              {activeTab === 'list' && !editingStudent && (
                <div className="space-y-4">
                  {/* Table Search */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchTableTerm}
                        onChange={(e) => setSearchTableTerm(e.target.value)}
                        placeholder="Cari siswa berdasarkan nama, ide, atau kelas..."
                        className="w-full bg-white border-2 border-black px-3.5 py-2 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#000]"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Responsive Table */}
                  <div className="border-3 border-black bg-white shadow-[4px_4px_0px_#000] overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FFE066] border-b-2 border-black text-black uppercase font-black tracking-wider">
                          <th className="p-3 border-r-2 border-black w-10 text-center">No</th>
                          <th className="p-3 border-r-2 border-black min-w-[160px]">Nama Siswa</th>
                          <th className="p-3 border-r-2 border-black min-w-[120px]">Kelas & Kategori</th>
                          <th className="p-3 border-r-2 border-black min-w-[220px]">Ide Lomba</th>
                          <th className="p-3 border-r-2 border-black min-w-[120px] text-center">Modul & File SB3</th>
                          <th className="p-3 min-w-[140px] text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
                              Tidak ada data siswa ditemukan. Silakan tambahkan siswa baru!
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((s, index) => (
                            <tr key={s.id} className="hover:bg-amber-50/70 transition-colors">
                              <td className="p-3 border-r-2 border-black text-center font-bold">
                                {index + 1}
                              </td>
                              <td className="p-3 border-r-2 border-black font-extrabold text-sm text-black">
                                {s.studentName}
                              </td>
                              <td className="p-3 border-r-2 border-black">
                                <div className="space-y-1">
                                  <span className="inline-block bg-slate-100 border border-black px-1.5 py-0.5 text-[11px] font-bold">
                                    {s.grade || 'SDI Al Ikhlas'}
                                  </span>
                                  <span className="inline-block bg-emerald-100 border border-black px-1.5 py-0.5 text-[11px] font-bold text-emerald-950">
                                    {s.category || 'Game Scratch'}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 border-r-2 border-black text-slate-800 font-medium leading-relaxed">
                                <p className="line-clamp-2" title={s.competitionIdea}>
                                  {s.competitionIdea}
                                </p>
                              </td>
                              <td className="p-3 border-r-2 border-black text-center">
                                <div className="flex flex-col items-center gap-1.5">
                                  {s.moduleUrl && (
                                    <a
                                      href={s.moduleUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 bg-rose-100 hover:bg-rose-200 border border-black px-2 py-0.5 font-bold text-[10px] text-rose-950"
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span>Modul PDF</span>
                                    </a>
                                  )}
                                  {s.sb3FileUrl && (
                                    <a
                                      href={s.sb3FileUrl}
                                      download={s.sb3FileName || 'proyek.sb3'}
                                      className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 border border-black px-2 py-0.5 font-bold text-[10px] text-amber-950"
                                    >
                                      <Code className="w-3 h-3" />
                                      <span>File .SB3</span>
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Preview button */}
                                  <button
                                    onClick={() => onPreviewStudent(s)}
                                    className="p-1.5 bg-[#BAE6FD] hover:bg-sky-300 border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                                    title="Lihat Pratinjau Siswa"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit button */}
                                  <button
                                    onClick={() => setEditingStudent(s)}
                                    className="p-1.5 bg-[#FFE066] hover:bg-amber-300 border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                                    title="Edit Data"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete button */}
                                  <button
                                    onClick={() => handleDeleteStudent(s.id, s.studentName)}
                                    className="p-1.5 bg-[#FF6584] hover:bg-rose-400 border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
                                    title="Hapus Siswa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* EDIT STUDENT MODAL / FORM */}
              {editingStudent && (
                <div className="neo-card p-5 bg-[#FEF08A]">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                    <h4 className="font-black text-base text-black flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Edit Data Siswa: {editingStudent.studentName}
                    </h4>
                    <button
                      onClick={() => setEditingStudent(null)}
                      className="text-xs font-bold underline cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleUpdateStudent} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1">
                          Nama Lengkap Siswa:
                        </label>
                        <input
                          type="text"
                          value={editingStudent.studentName}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, studentName: e.target.value })
                          }
                          className="w-full bg-white border-2 border-black p-2 font-bold text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1">
                          Kelas:
                        </label>
                        <input
                          type="text"
                          value={editingStudent.grade || ''}
                          onChange={(e) =>
                            setEditingStudent({ ...editingStudent, grade: e.target.value })
                          }
                          className="w-full bg-white border-2 border-black p-2 font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        Kategori Lomba:
                      </label>
                      <select
                        value={editingStudent.category || 'Game Scratch'}
                        onChange={(e) =>
                          setEditingStudent({
                            ...editingStudent,
                            category: e.target.value as StudentProject['category'],
                          })
                        }
                        className="w-full bg-white border-2 border-black p-2 font-bold text-sm"
                      >
                        <option value="Game Scratch">Game Scratch</option>
                        <option value="Animasi Interaktif">Animasi Interaktif</option>
                        <option value="Cerita Bergambar">Cerita Bergambar</option>
                        <option value="Simulasi Sains">Simulasi Sains</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        Ide & Deskripsi Lomba:
                      </label>
                      <textarea
                        rows={3}
                        value={editingStudent.competitionIdea}
                        onChange={(e) =>
                          setEditingStudent({ ...editingStudent, competitionIdea: e.target.value })
                        }
                        className="w-full bg-white border-2 border-black p-2 font-bold text-sm"
                        required
                      />
                    </div>

                    {/* File replacement options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 border-2 border-black">
                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Ganti File Modul (PDF):
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => setModuleFile(e.target.files?.[0] || null)}
                          className="text-xs file:mr-2 file:py-1 file:px-2 file:border-2 file:border-black file:text-xs file:font-bold file:bg-[#FFE066]"
                        />
                        <div className="text-[11px] text-slate-500 mt-1 truncate">
                          Saat ini: {editingStudent.moduleFileName || 'Modul.pdf'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Ganti File Scratch (.sb3):
                        </label>
                        <input
                          type="file"
                          accept=".sb3"
                          onChange={(e) => setSb3File(e.target.files?.[0] || null)}
                          className="text-xs file:mr-2 file:py-1 file:px-2 file:border-2 file:border-black file:text-xs file:font-bold file:bg-[#4ADE80]"
                        />
                        <div className="text-[11px] text-slate-500 mt-1 truncate">
                          Saat ini: {editingStudent.sb3FileName || 'Proyek.sb3'}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="neo-btn bg-white px-4 py-2 text-xs font-bold cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="neo-btn bg-[#4ADE80] px-5 py-2 text-xs font-black cursor-pointer flex items-center gap-1.5"
                      >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: FORM TAMBAH SISWA & PROYEK */}
              {activeTab === 'create' && (
                <div className="neo-card p-5 sm:p-7 bg-[#FFFBEB]">
                  <h4 className="font-black text-lg text-black mb-1 flex items-center gap-2">
                    <Plus className="w-5 h-5 bg-[#4ADE80] border-2 border-black p-0.5" />
                    Formulir Tambah Data Siswa & Proyek Lomba
                  </h4>
                  <p className="text-xs font-medium text-slate-600 mb-6">
                    Data siswa, deskripsi ide, file modul PDF dan file Scratch (.sb3) akan disimpan ke database lomba.
                  </p>

                  {submitSuccess && (
                    <div className="mb-4 p-3 bg-emerald-100 border-2 border-black text-xs font-bold text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateStudent} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1">
                          Nama Lengkap Siswa: <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Contoh: Muhammad Fatih Al-Ghifari"
                          className="w-full bg-white border-3 border-black p-2.5 font-bold text-sm shadow-[2px_2px_0px_#000]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider mb-1">
                            Kelas:
                          </label>
                          <input
                            type="text"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="Contoh: Kelas 5 Umar"
                            className="w-full bg-white border-3 border-black p-2.5 font-bold text-sm shadow-[2px_2px_0px_#000]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider mb-1">
                            Kategori:
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as StudentProject['category'])}
                            className="w-full bg-white border-3 border-black p-2.5 font-bold text-sm shadow-[2px_2px_0px_#000]"
                          >
                            <option value="Game Scratch">Game Scratch</option>
                            <option value="Animasi Interaktif">Animasi Interaktif</option>
                            <option value="Cerita Bergambar">Cerita Bergambar</option>
                            <option value="Simulasi Sains">Simulasi Sains</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        Deskripsi / Ide Lomba Siswa: <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Tuliskan judul dan sinopsis ide koding Scratch milik siswa di sini..."
                        className="w-full bg-white border-3 border-black p-3 font-bold text-sm shadow-[2px_2px_0px_#000]"
                        required
                      />
                    </div>

                    {/* File Inputs (Storage Upload) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* File 1: Modul PDF */}
                      <div className="bg-white border-3 border-black p-4 shadow-[3px_3px_0px_#000]">
                        <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider text-rose-700">
                          <FileText className="w-4 h-4" />
                          <span>File Input 1: Modul PDF</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2 font-medium">
                          Unggah file modul panduan lomba (.pdf atau dokumen panduan).
                        </p>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => setModuleFile(e.target.files?.[0] || null)}
                          className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:border-2 file:border-black file:text-xs file:font-black file:bg-[#FF6584] file:cursor-pointer"
                        />
                        <div className="mt-2">
                          <span className="text-[11px] font-bold text-slate-500">
                            Atau tempel Link External / Google Drive PDF:
                          </span>
                          <input
                            type="url"
                            value={moduleUrlInput}
                            onChange={(e) => setModuleUrlInput(e.target.value)}
                            placeholder="https://...link-modul-pdf"
                            className="w-full bg-slate-50 border-2 border-black p-1.5 text-xs font-medium mt-0.5"
                          />
                        </div>
                      </div>

                      {/* File 2: SB3 Scratch Project */}
                      <div className="bg-white border-3 border-black p-4 shadow-[3px_3px_0px_#000]">
                        <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider text-amber-600">
                          <Code className="w-4 h-4" />
                          <span>File Input 2: Proyek Scratch (.sb3)</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2 font-medium">
                          Unggah file kodingan Scratch 3.0 (.sb3) milik siswa.
                        </p>
                        <input
                          type="file"
                          accept=".sb3"
                          onChange={(e) => setSb3File(e.target.files?.[0] || null)}
                          className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:border-2 file:border-black file:text-xs file:font-black file:bg-[#4ADE80] file:cursor-pointer"
                        />
                        <div className="mt-2">
                          <span className="text-[11px] font-bold text-slate-500">
                            Atau tempel Link SB3 / Link Scratch Project:
                          </span>
                          <input
                            type="url"
                            value={sb3UrlInput}
                            onChange={(e) => setSb3UrlInput(e.target.value)}
                            placeholder="https://...link-file.sb3"
                            className="w-full bg-slate-50 border-2 border-black p-1.5 text-xs font-medium mt-0.5"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full neo-btn bg-[#4ADE80] hover:bg-[#3ec470] text-black py-3 sm:py-3.5 font-black text-base flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-5 h-5 stroke-[2.5]" />
                        <span>{isSubmitting ? 'Mengunggah & Menyimpan Data...' : 'Simpan Data Siswa & Proyek'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: FIREBASE CONFIGURATION SETTINGS */}
              {activeTab === 'firebase' && (
                <div className="neo-card p-5 sm:p-7 bg-white">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                    <h4 className="font-black text-lg text-black flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-600" />
                      Konfigurasi Firebase Web SDK (v9/v10 Modular)
                    </h4>
                    <span className="bg-[#FFE066] border border-black px-2 py-0.5 text-xs font-extrabold">
                      Firestore & Storage
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium mb-4">
                    Sistem ini mendukung integrasi langsung dengan Firebase Firestore (Database) dan Firebase Storage (File Modul PDF & Proyek .SB3). Anda dapat menempelkan konfigurasi dari Firebase Console Anda di bawah ini:
                  </p>

                  {configSavedNotice && (
                    <div className="mb-4 p-3 bg-emerald-100 border-2 border-black text-xs font-bold text-emerald-950 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>{configSavedNotice}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">apiKey:</label>
                      <input
                        type="text"
                        value={fbConfig.apiKey}
                        onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                        placeholder="AIzaSy..."
                        className="w-full font-mono text-xs bg-slate-50 border-2 border-black p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">authDomain:</label>
                      <input
                        type="text"
                        value={fbConfig.authDomain}
                        onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                        placeholder="your-project.firebaseapp.com"
                        className="w-full font-mono text-xs bg-slate-50 border-2 border-black p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">projectId:</label>
                      <input
                        type="text"
                        value={fbConfig.projectId}
                        onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                        placeholder="your-project-id"
                        className="w-full font-mono text-xs bg-slate-50 border-2 border-black p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">storageBucket:</label>
                      <input
                        type="text"
                        value={fbConfig.storageBucket}
                        onChange={(e) => setFbConfig({ ...fbConfig, storageBucket: e.target.value })}
                        placeholder="your-project.firebasestorage.app"
                        className="w-full font-mono text-xs bg-slate-50 border-2 border-black p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">messagingSenderId:</label>
                      <input
                        type="text"
                        value={fbConfig.messagingSenderId}
                        onChange={(e) => setFbConfig({ ...fbConfig, messagingSenderId: e.target.value })}
                        placeholder="123456789012"
                        className="w-full font-mono text-xs bg-slate-50 border-2 border-black p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">appId:</label>
                      <input
                        type="text"
                        value={fbConfig.appId}
                        onChange={(e) => setFbConfig({ ...fbConfig, appId: e.target.value })}
                        placeholder="1:123456789012:web:abcdef..."
                        className="w-full font-mono text-xs bg-slate-50 border-2 border-black p-2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t-2 border-black">
                    <button
                      type="button"
                      onClick={handleCleanDemoData}
                      className="neo-btn bg-[#FF6584] hover:bg-[#ff4b70] text-black px-4 py-2 text-xs font-extrabold cursor-pointer"
                    >
                      Bersihkan Data Demo Lama
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveFirebaseConfig}
                      className="neo-btn bg-[#4ADE80] hover:bg-[#3ec470] text-black px-6 py-2.5 text-xs sm:text-sm font-black cursor-pointer"
                    >
                      Simpan & Terapkan Konfigurasi Firebase
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
