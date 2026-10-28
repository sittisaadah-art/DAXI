import React from 'react';
import { ArrowLeft, Printer, Download, Award, ShieldCheck, ShieldAlert } from 'lucide-react';
import { StudentSubmission } from '../types';
import { QUESTIONS_PG, QUESTIONS_ESSAY } from '../data/questionsData';
import { generateStudentResultPDF } from '../utils/pdfGenerator';

interface OfficialPrintReportProps {
  submission: StudentSubmission;
  onBack: () => void;
}

export const OfficialPrintReport: React.FC<OfficialPrintReportProps> = ({ submission, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const durationMin = Math.round(submission.durationSeconds / 60);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 py-6 px-4 print:p-0 print:bg-white">
      {/* Top action bar - Hidden when printing */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => generateStudentResultPDF(submission)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/40 transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File PDF</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/40 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Print Dokumen (A4)</span>
          </button>
        </div>
      </div>

      {/* Official A4 Sheet */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-12 shadow-2xl print:shadow-none print:p-6 print:rounded-none border border-slate-300 print:border-none">
        {/* Kop Surat Resmi */}
        <div className="text-center pb-3 border-b-2 border-emerald-900 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="w-16 h-16 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-serif font-black text-2xl border border-emerald-950">
              AR
            </div>
            <div className="flex-1 px-4">
              <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-900">
                Yayasan Lembaga Pendidikan Islam Hidayatullah
              </p>
              <h2 className="text-lg sm:text-xl font-black uppercase text-slate-900 tracking-tight">
                SMA Ar Rohmah Islamic International Boarding School
              </h2>
              <p className="text-[11px] text-slate-600">
                Kampus Pesantren Ar Rohmah IIBS • Dau, Malang / Bogor, Jawa Barat
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Website: arrohmah.sch.id | Email: info@arrohmah.sch.id
              </p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-300 font-bold text-xs text-center border border-slate-900">
              IIBS
            </div>
          </div>
        </div>
        {/* Double Border line */}
        <div className="border-b border-slate-900 mt-0.5 mb-5"></div>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900 underline decoration-emerald-600 underline-offset-4">
            Lembar Rekapitulasi Hasil Asesmen Harian Siswa
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Mata Pelajaran: <strong>Informatika</strong> • Tingkat: <strong>Kelas XI SMA</strong> • Bab 2: <strong>Algoritma Adventure</strong> (Tahun Ajaran 2026/2027)
          </p>
        </div>

        {/* Identitas Siswa Box */}
        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-6 text-xs text-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
          <div>
            <span className="font-semibold text-slate-500 inline-block w-32">Nama Santri/Siswa</span>
            <span className="font-bold text-slate-900">: {submission.studentName}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 inline-block w-32">Waktu Selesai</span>
            <span className="font-mono text-slate-900">: {submission.submittedAt}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 inline-block w-32">Kelas / Jurusan</span>
            <span className="font-bold text-emerald-800">: {submission.studentClass}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 inline-block w-32">Durasi Pengerjaan</span>
            <span className="font-mono text-slate-900">: {durationMin} Menit (Batas 60 Menit)</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 inline-block w-32">NISN / No. Ujian</span>
            <span className="font-mono text-slate-900">: {submission.nisn || '-'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 inline-block w-32">Pengawasan Tab</span>
            <span
              className={`font-semibold ${
                submission.violationsCount === 0 ? 'text-emerald-700' : 'text-rose-700 font-bold'
              }`}
            >
              : {submission.violationsCount === 0 ? '0x Pindah Tab (Sangat Jujur)' : `${submission.violationsCount}x Catatan Tab`}
            </span>
          </div>
        </div>

        {/* Skor Summary Card */}
        <div
          className={`border-2 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${
            submission.isPassed
              ? 'bg-emerald-50/80 border-emerald-600'
              : 'bg-rose-50/80 border-rose-600'
          }`}
        >
          <div className="space-y-1 text-center sm:text-left text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700">
              Ringkasan Perolehan Nilai (Standar KKM: 78)
            </span>
            <div className="flex flex-wrap items-center gap-4 text-slate-800 pt-1">
              <div>
                Skor PG (10 Butir): <strong className="font-mono text-sm">{submission.scorePG}</strong> / 60
              </div>
              <div className="text-slate-400">•</div>
              <div>
                Skor Essay (5 Soal): <strong className="font-mono text-sm">{submission.scoreEssay}</strong> / 40
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-3xl sm:text-4xl font-black font-mono leading-none text-slate-900">
              {submission.totalScore} <span className="text-base font-normal text-slate-500">/ 100</span>
            </div>
            <div
              className={`inline-block mt-1 px-3 py-0.5 rounded text-xs font-black uppercase tracking-wider ${
                submission.isDisqualified
                  ? 'bg-rose-700 text-white'
                  : submission.isPassed
                  ? 'bg-emerald-700 text-white'
                  : 'bg-amber-700 text-white'
              }`}
            >
              {submission.isDisqualified
                ? 'DIDISKUALIFIKASI (3X TAB)'
                : submission.isPassed
                ? 'TUNTAS (>= 78)'
                : 'REMEDIAL (< 78)'}
            </div>
          </div>
        </div>

        {/* Rincian Pilihan Ganda (Tabel) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
            A. Rincian Jawaban Soal Pilihan Ganda (10 Butir)
          </h4>
          <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                <th className="p-2 border border-slate-300 text-center w-8">No</th>
                <th className="p-2 border border-slate-300">Materi Pokok / Indikator</th>
                <th className="p-2 border border-slate-300 text-center w-14">Kunci</th>
                <th className="p-2 border border-slate-300 text-center w-20">Jawaban</th>
                <th className="p-2 border border-slate-300 text-center w-20">Hasil</th>
                <th className="p-2 border border-slate-300 text-center w-12">Skor</th>
              </tr>
            </thead>
            <tbody>
              {QUESTIONS_PG.map((q, idx) => {
                const ans = submission.answersPG[q.id];
                const isCorrect = ans === q.correctKey;
                return (
                  <tr key={q.id} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="p-1.5 border border-slate-300 text-center font-mono">{q.id}</td>
                    <td className="p-1.5 border border-slate-300">
                      {q.question.slice(0, 60)}...
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center font-bold font-mono">
                      {q.correctKey}
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center font-bold font-mono">
                      {ans || '-'}
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center font-semibold">
                      {isCorrect ? (
                        <span className="text-emerald-700">Benar ✓</span>
                      ) : (
                        <span className="text-rose-700">Salah ✗</span>
                      )}
                    </td>
                    <td className="p-1.5 border border-slate-300 text-center font-mono font-bold">
                      {isCorrect ? q.points : 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Rincian Essay */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
            B. Rincian Jawaban Soal Uraian / Essay (5 Soal)
          </h4>
          <div className="space-y-3">
            {QUESTIONS_ESSAY.map((eq) => {
              const studentAns = submission.answersEssay[eq.id] || '(Tidak dijawab)';
              const score =
                submission.essayGradingDetails?.[eq.id]?.score ??
                (submission.teacherGraded ? Math.round(submission.scoreEssay / 5) : 8);

              return (
                <div key={eq.id} className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Soal {eq.id}</span>
                    <span className="font-bold font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Skor: {score} / {eq.maxPoints}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-1">{eq.question}</p>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-wrap">
                    {studentAns}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Catatan Evaluasi Guru */}
        {submission.teacherFeedback && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs mb-6">
            <span className="font-bold text-amber-900 block mb-0.5">Catatan Evaluasi Guru Pengampu:</span>
            <p className="text-slate-800 italic">"{submission.teacherFeedback}"</p>
          </div>
        )}

        {/* Tanda Tangan Validasi */}
        <div className="grid grid-cols-2 gap-8 pt-6 mt-6 border-t border-slate-300 text-xs text-center text-slate-800">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold">Orang Tua / Wali Santri</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900">( ................................................. )</p>
          </div>

          <div>
            <p>Malang / Bogor, 27 Oktober 2026</p>
            <p className="font-semibold">Guru Pengampu Mata Pelajaran Informatika</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900 underline">Sitti Sa'adah, S.Kom., M.Pd.</p>
            <p className="text-[10px] text-slate-600">NIP/NIY: 198506122010012004</p>
          </div>
        </div>
      </div>
    </div>
  );
};
