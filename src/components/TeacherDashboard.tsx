import React, { useState } from 'react';
import {
  Users,
  Award,
  ShieldAlert,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  Edit3,
  CheckCircle,
  XCircle,
  Save,
  Trash2,
  Eye,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import { StudentSubmission } from '../types';
import { QUESTIONS_PG, QUESTIONS_ESSAY } from '../data/questionsData';
import { updateSubmissionScore, resetSubmissionsToDefault } from '../utils/storage';
import { generateStudentResultPDF } from '../utils/pdfGenerator';

interface TeacherDashboardProps {
  submissions: StudentSubmission[];
  onRefreshData: () => void;
  onSelectStudentForPrint: (sub: StudentSubmission) => void;
  onExitDashboard: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  submissions,
  onRefreshData,
  onSelectStudentForPrint,
  onExitDashboard,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'time' | 'violations'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Detail Modal for reviewing and grading
  const [inspectingStudent, setInspectingStudent] = useState<StudentSubmission | null>(null);
  const [essayScoresDraft, setEssayScoresDraft] = useState<Record<number, number>>({});
  const [teacherFeedbackDraft, setTeacherFeedbackDraft] = useState<string>('');
  const [isSavingGrade, setIsSavingGrade] = useState<boolean>(false);

  // Filter logic
  const filteredSubmissions = submissions.filter((sub) => {
    // Class filter
    if (selectedClass !== 'all') {
      if (selectedClass === 'VIII Akademik' && !sub.studentClass.includes('Akademik')) return false;
      if (selectedClass === 'VIII Cambridge' && !sub.studentClass.includes('Cambridge')) return false;
      if (selectedClass === 'VIII Tahfidz Timteng' && !sub.studentClass.includes('Tahfidz')) return false;
    }

    // Status filter
    if (selectedStatus === 'tuntas' && (!sub.isPassed || sub.isDisqualified)) return false;
    if (selectedStatus === 'remedial' && (sub.isPassed || sub.isDisqualified)) return false;
    if (selectedStatus === 'disqualified' && !sub.isDisqualified) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName.toLowerCase().includes(q);
      const matchNisn = (sub.nisn || '').toLowerCase().includes(q);
      const matchClass = sub.studentClass.toLowerCase().includes(q);
      if (!matchName && !matchNisn && !matchClass) return false;
    }

    return true;
  });

  // Sort logic
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.studentName.localeCompare(b.studentName);
    } else if (sortBy === 'score') {
      comparison = a.totalScore - b.totalScore;
    } else if (sortBy === 'violations') {
      comparison = a.violationsCount - b.violationsCount;
    } else {
      // Default: time
      comparison = a.id.localeCompare(b.id);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Statistics
  const totalStudents = submissions.length;
  const avgScore = totalStudents > 0 ? Math.round(submissions.reduce((acc, s) => acc + s.totalScore, 0) / totalStudents) : 0;
  const passedStudents = submissions.filter((s) => s.isPassed && !s.isDisqualified).length;
  const passRate = totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0;
  const disqualifiedStudents = submissions.filter((s) => s.isDisqualified).length;
  const highestScore = submissions.length > 0 ? Math.max(...submissions.map((s) => s.totalScore)) : 0;
  const lowestScore = submissions.length > 0 ? Math.min(...submissions.map((s) => s.totalScore)) : 0;

  // Open Inspection Drawer
  const handleOpenInspect = (student: StudentSubmission) => {
    setInspectingStudent(student);
    const initialDraft: Record<number, number> = {};
    QUESTIONS_ESSAY.forEach((eq) => {
      initialDraft[eq.id] =
        student.essayGradingDetails?.[eq.id]?.score ??
        (student.teacherGraded ? Math.round(student.scoreEssay / 5) : 6);
    });
    setEssayScoresDraft(initialDraft);
    setTeacherFeedbackDraft(student.teacherFeedback || '');
  };

  // Save adjusted essay scores & feedback
  const handleSaveGrades = () => {
    if (!inspectingStudent) return;
    setIsSavingGrade(true);

    const newScoreEssay = Object.values(essayScoresDraft).reduce((a, b) => a + b, 0);
    const newDetails: Record<number, { score: number; comment?: string }> = {};
    QUESTIONS_ESSAY.forEach((eq) => {
      newDetails[eq.id] = {
        score: essayScoresDraft[eq.id] || 0,
        comment: 'Dinilai oleh guru pengampu.',
      };
    });

    const updated = updateSubmissionScore(inspectingStudent.id, {
      scoreEssay: newScoreEssay,
      essayGradingDetails: newDetails,
      teacherFeedback: teacherFeedbackDraft,
      teacherGraded: true,
    });

    setIsSavingGrade(false);
    onRefreshData();
    // Update active inspector
    const fresh = updated.find((s) => s.id === inspectingStudent.id);
    if (fresh) setInspectingStudent(fresh);
  };

  // Export to CSV / Excel
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = [
      'ID',
      'Nama Siswa',
      'Kelas',
      'NISN',
      'Waktu Selesai',
      'Skor PG (Maks 60)',
      'Skor Essay (Maks 40)',
      'Total Nilai (100)',
      'Status KKM (75)',
      'Jumlah Pelanggaran Tab',
      'Status Diskualifikasi',
      'Catatan Guru',
    ];

    const rows = submissions.map((s) => [
      s.id,
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.studentClass}"`,
      s.nisn || '',
      s.submittedAt,
      s.scorePG,
      s.scoreEssay,
      s.totalScore,
      s.isPassed ? 'TUNTAS' : 'REMEDIAL',
      s.violationsCount,
      s.isDisqualified ? 'YA (3x Tab)' : 'TIDAK',
      `"${(s.teacherFeedback || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_Informatika_SMP_Ar_Rohmah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Portal Otorisasi Pengawas & Guru Mata Pelajaran</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dashboard Rekapitulasi Asesmen Informatika
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              SMP Ar Rohmah IIBS • Bab 2: Algoritma Adventure • KKM 75
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shadow"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (submissions.length > 0) {
                  onSelectStudentForPrint(submissions[0]);
                }
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shadow"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Cetak Rekap Resmi</span>
            </button>

            <button
              type="button"
              onClick={onExitDashboard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/40"
            >
              <span>Kembali ke Halaman Siswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Total Santri</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalStudents}</div>
          <span className="text-[10px] text-slate-500">Mengikuti Asesmen</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Award className="w-4 h-4 text-teal-400" />
            <span>Rata-Rata Nilai</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{avgScore}</div>
          <span className="text-[10px] text-slate-500">Skala 0 - 100</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Tuntas KKM</span>
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            {passedStudents}{' '}
            <span className="text-xs font-normal text-slate-400">({passRate}%)</span>
          </div>
          <span className="text-[10px] text-slate-500">Nilai &gt;= 75</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <XCircle className="w-4 h-4 text-amber-400" />
            <span>Remedial</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {totalStudents - passedStudents}
          </div>
          <span className="text-[10px] text-slate-500">Nilai &lt; 75</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Diskualifikasi</span>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {disqualifiedStudents}
          </div>
          <span className="text-[10px] text-rose-400/80">3x Pindah Tab</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <ArrowUpDown className="w-4 h-4 text-cyan-400" />
            <span>Tertinggi / Terendah</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {highestScore} <span className="text-xs font-normal text-slate-500">/</span> {lowestScore}
          </div>
          <span className="text-[10px] text-slate-500">Rentang Skor</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama santri, NISN, atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter by Class */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Kelas</option>
            <option value="VIII Akademik">VIII Akademik</option>
            <option value="VIII Cambridge">VIII Cambridge</option>
            <option value="VIII Tahfidz Timteng">VIII Tahfidz Timteng</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Semua Status</option>
            <option value="tuntas">Tuntas (Lulus)</option>
            <option value="remedial">Remedial</option>
            <option value="disqualified">Didiskualifikasi</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-1.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'score' | 'time' | 'violations')}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="time">Waktu Terbaru</option>
            <option value="score">Nilai Total</option>
            <option value="name">Nama Siswa</option>
            <option value="violations">Pelanggaran Tab</option>
          </select>

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            title="Ubah Urutan"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Submissions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">Kelas</th>
                <th className="py-3.5 px-4 text-center">PG (60)</th>
                <th className="py-3.5 px-4 text-center">Essay (40)</th>
                <th className="py-3.5 px-4 text-center">Nilai Akhir</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Pengawasan</th>
                <th className="py-3.5 px-4 text-center">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {sortedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    Tidak ditemukan data asesmen santri dengan kriteria filter tersebut.
                  </td>
                </tr>
              ) : (
                sortedSubmissions.map((sub, idx) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-800/50 transition-colors duration-150"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{sub.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        NISN: {sub.nisn || '-'} • Selesai: {sub.submittedAt}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
                        {sub.studentClass}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      {sub.scorePG}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-teal-300">
                      {sub.scoreEssay}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono font-black text-sm px-2.5 py-0.5 rounded ${
                          sub.isDisqualified
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : sub.isPassed
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {sub.totalScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {sub.isDisqualified ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          DISKUALIFIKASI
                        </span>
                      ) : sub.isPassed ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          TUNTAS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          REMEDIAL
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {sub.violationsCount === 0 ? (
                        <span className="text-emerald-400 font-semibold text-[11px]">
                          0x (Jujur ✓)
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold text-[11px]">
                          {sub.violationsCount}x Pindah Tab
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenInspect(sub)}
                          className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 transition"
                          title="Periksa & Nilai Essay"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => generateStudentResultPDF(sub)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
                          title="Unduh PDF Rekapitulasi Nilai"
                        >
                          <Download className="w-3.5 h-3.5" />
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

      {/* Reset Demo Data button */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
        <span>Menampilkan {sortedSubmissions.length} dari {totalStudents} peserta asesmen.</span>
        <button
          type="button"
          onClick={() => {
            if (confirm('Kembalikan data ke contoh awal santri SMP Ar Rohmah IIBS?')) {
              resetSubmissionsToDefault();
              onRefreshData();
            }
          }}
          className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset ke Data Demo Awal</span>
        </button>
      </div>

      {/* INSPECTION & ESSAY GRADING DRAWER / MODAL */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  Lembar Penilaian & Evaluasi Guru
                </span>
                <h3 className="text-lg font-bold text-white">
                  {inspectingStudent.studentName} ({inspectingStudent.studentClass})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => generateStudentResultPDF(inspectingStudent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingStudent(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Score Bar */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-slate-400 block">Skor Pilihan Ganda (Otomatis)</span>
                  <span className="text-lg font-bold text-white font-mono">
                    {inspectingStudent.scorePG} / 60
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Skor Essay (Setelah Dinilai)</span>
                  <span className="text-lg font-bold text-teal-300 font-mono">
                    {Object.values(essayScoresDraft).reduce((a, b) => a + b, 0)} / 40
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Nilai Akhir</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {inspectingStudent.scorePG + Object.values(essayScoresDraft).reduce((a, b) => a + b, 0)} / 100
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pelanggaran Tab</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      inspectingStudent.violationsCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {inspectingStudent.violationsCount}x
                  </span>
                </div>
              </div>

              {/* Essay Grading Cards */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span>Pemeriksaan Jawaban Soal Essay & Rubrik Skor</span>
                </h4>

                {QUESTIONS_ESSAY.map((eq) => {
                  const studentAns = inspectingStudent.answersEssay[eq.id] || '(Tidak dijawab)';
                  const currentScore = essayScoresDraft[eq.id] ?? 0;

                  return (
                    <div
                      key={eq.id}
                      className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="font-bold text-teal-400 block mb-1">
                            Soal {eq.id}: {eq.question}
                          </span>
                        </div>
                        {/* Score Stepper */}
                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                          <span className="text-slate-400 text-[11px]">Beri Nilai:</span>
                          <input
                            type="number"
                            min={0}
                            max={eq.maxPoints}
                            value={currentScore}
                            onChange={(e) => {
                              const val = Math.max(0, Math.min(eq.maxPoints, Number(e.target.value) || 0));
                              setEssayScoresDraft((prev) => ({ ...prev, [eq.id]: val }));
                            }}
                            className="w-12 bg-slate-800 text-center text-emerald-300 font-mono font-bold text-sm rounded py-0.5 focus:outline-none"
                          />
                          <span className="text-slate-400 font-mono">/ {eq.maxPoints}</span>
                        </div>
                      </div>

                      {/* Student's answer */}
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">
                          Jawaban Santri:
                        </span>
                        <div className="p-3 rounded-xl bg-slate-950 font-mono text-emerald-300 whitespace-pre-wrap border border-slate-800 text-xs">
                          {studentAns}
                        </div>
                      </div>

                      {/* Rubric Sample Answer */}
                      <details className="text-slate-400">
                        <summary className="cursor-pointer text-[11px] text-slate-300 hover:text-white font-semibold">
                          Lihat Kunci Konsep Standar Guru
                        </summary>
                        <div className="mt-2 p-2.5 rounded bg-slate-900 text-slate-300 text-[11px] font-mono whitespace-pre-wrap border border-slate-800">
                          {eq.sampleAnswer}
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>

              {/* Teacher Feedback Note */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Catatan Evaluasi / Umpan Balik Guru (Akan tercetak pada file PDF siswa)
                </label>
                <textarea
                  rows={3}
                  value={teacherFeedbackDraft}
                  onChange={(e) => setTeacherFeedbackDraft(e.target.value)}
                  placeholder="Contoh: MasyaAllah sangat baik, logika algoritma sudah tepat..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs leading-relaxed"
                ></textarea>
              </div>

              {/* Pilihan Ganda Quick Review Grid */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Rekap Jawaban Pilihan Ganda (10 Butir)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {QUESTIONS_PG.map((q) => {
                    const ans = inspectingStudent.answersPG[q.id];
                    const isCorrect = ans === q.correctKey;
                    return (
                      <div
                        key={q.id}
                        className={`p-2 rounded-lg border text-center font-mono ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400">Soal {q.id}</div>
                        <div className="font-bold">
                          {ans || '-'} {isCorrect ? '✓' : `✗ (${q.correctKey})`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Anti-cheat Violation Logs */}
              {inspectingStudent.violationsLog.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800 space-y-2">
                  <h5 className="font-bold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Riwayat Terdeteksi Pindah Tab ({inspectingStudent.violationsLog.length} Kali)</span>
                  </h5>
                  <div className="space-y-1">
                    {inspectingStudent.violationsLog.map((v, i) => (
                      <div key={v.id || i} className="text-[11px] text-rose-200 font-mono">
                        • {v.reason} ({v.timestamp})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Save Button */}
            <div className="bg-slate-800/80 px-6 py-4 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Perubahan nilai essay dan catatan guru langsung tersimpan di sistem.
              </span>
              <button
                type="button"
                disabled={isSavingGrade}
                onClick={handleSaveGrades}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingGrade ? 'Menyimpan...' : 'Simpan Nilai & Catatan Guru'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
