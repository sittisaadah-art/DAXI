import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Download,
  Printer,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  FileCheck2,
} from 'lucide-react';
import { StudentSubmission } from '../types';
import { QUESTIONS_PG, QUESTIONS_ESSAY } from '../data/questionsData';
import { generateStudentResultPDF } from '../utils/pdfGenerator';

interface StudentResultModalProps {
  submission: StudentSubmission;
  onRetakeExam: () => void;
  onOpenTeacherPortal: () => void;
  onPrintOfficialReport: () => void;
}

export const StudentResultModal: React.FC<StudentResultModalProps> = ({
  submission,
  onRetakeExam,
  onPrintOfficialReport,
}) => {
  // Fire confetti if passed
  useEffect(() => {
    if (submission.isPassed && !submission.isDisqualified) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [submission.isPassed, submission.isDisqualified]);

  const durationMin = Math.round(submission.durationSeconds / 60);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Result Status Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8 border shadow-2xl ${
          submission.isDisqualified
            ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 border-rose-500/40'
            : submission.isPassed
            ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/40'
            : 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border-amber-500/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border bg-slate-900/80">
              {submission.isDisqualified ? (
                <span className="text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Ujian Dihentikan Paksa (Diskualifikasi)
                </span>
              ) : submission.isPassed ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Asesmen Berhasil Diselesaikan
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5" /> Asesmen Selesai - Perlu Penguatan Remedial
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {submission.isDisqualified
                ? 'Didiskualifikasi (Pelanggaran Tab)'
                : submission.isPassed
                ? 'Selamat! Anda Tuntas KKM 78'
                : 'Hasil Asesmen Harian Siswa'}
            </h2>

            <p className="text-sm text-slate-300 mt-1">
              Santri: <strong className="text-white">{submission.studentName}</strong> • {submission.studentClass}
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              Data hasil ujian ini telah langsung masuk dan tersimpan pada Dashboard Guru Informatika SMA Ar Rohmah IIBS.
            </p>
          </div>

          {/* Big Score Circular Card */}
          <div className="flex-shrink-0 flex items-center gap-4 bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl shadow-xl">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Nilai Akhir
              </span>
              <div
                className={`text-4xl sm:text-5xl font-black font-mono leading-none my-1 ${
                  submission.isDisqualified
                    ? 'text-rose-400'
                    : submission.isPassed
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {submission.totalScore}
              </div>
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-extrabold ${
                  submission.isDisqualified
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : submission.isPassed
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {submission.isDisqualified ? 'DISKUALIFIKASI' : submission.isPassed ? 'TUNTAS (>= 78)' : 'REMEDIAL (< 78)'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Skor Pilihan Ganda</span>
            <span className="text-sm font-bold text-white font-mono">{submission.scorePG} / 60</span>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Skor Soal Essay</span>
            <span className="text-sm font-bold text-teal-300 font-mono">{submission.scoreEssay} / 40</span>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Durasi Pengerjaan</span>
            <span className="text-sm font-bold text-white font-mono">{durationMin} Menit</span>
          </div>
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Catatan Pindah Tab</span>
            <span
              className={`text-sm font-bold font-mono ${
                submission.violationsCount === 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {submission.violationsCount}x Terdeteksi
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: PDF Download & Print */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => generateStudentResultPDF(submission)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File PDF Rekapitulasi Nilai</span>
          </button>

          <button
            type="button"
            onClick={onPrintOfficialReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Lembar Resmi</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRetakeExam}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mulai Ujian Baru</span>
        </button>
      </div>

      {/* Detailed Breakdown Accordion / List */}
      <div className="space-y-6">
        {/* Pilihan Ganda Review */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Koreksi Soal Pilihan Ganda (10 Butir)</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
              Skor: {submission.scorePG} / 60
            </span>
          </h3>

          <div className="space-y-4">
            {QUESTIONS_PG.map((q) => {
              const studentAns = submission.answersPG[q.id];
              const isCorrect = studentAns === q.correctKey;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-800/60'
                      : 'bg-rose-950/20 border-rose-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                        {q.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Jawaban Benar (+{q.points} Poin)
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Jawaban Salah (0 Poin)
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="text-xs font-mono">
                      Jawaban Anda: <strong className="text-white">{studentAns || '-'}</strong> | Kunci: <strong className="text-emerald-400">{q.correctKey}</strong>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 mb-2 leading-relaxed whitespace-pre-line">
                    {q.question}
                  </p>

                  <div className="text-[11px] p-2.5 rounded-lg bg-slate-900/90 text-slate-300 border border-slate-800">
                    <strong className="text-emerald-400">Pembahasan:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Essay Review */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              <span>Review Jawaban Soal Essay (5 Soal)</span>
            </span>
            <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2.5 py-1 rounded-lg border border-teal-800">
              Skor Essay: {submission.scoreEssay} / 40
            </span>
          </h3>

          <div className="space-y-4">
            {QUESTIONS_ESSAY.map((eq) => {
              const studentAns = submission.answersEssay[eq.id] || '(Tidak dijawab)';
              const scoreInfo = submission.essayGradingDetails?.[eq.id];
              return (
                <div key={eq.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal-400">Soal {eq.id}</span>
                    <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      Skor: {scoreInfo ? scoreInfo.score : Math.round(submission.scoreEssay / 5)} / {eq.maxPoints}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 mb-2 font-medium">{eq.question}</p>

                  <div className="my-2 p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-300 whitespace-pre-wrap border border-slate-800">
                    {studentAns}
                  </div>

                  <details className="mt-2 text-xs text-slate-400">
                    <summary className="cursor-pointer text-slate-300 hover:text-white font-semibold">
                      Lihat Kunci Konsep & Jawaban Standar
                    </summary>
                    <div className="mt-2 p-3 rounded bg-slate-900 text-slate-300 text-[11px] font-mono whitespace-pre-wrap border border-slate-700">
                      {eq.sampleAnswer}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
        </div>

        {/* Violations Log if any */}
        {submission.violationsLog.length > 0 && (
          <div className="bg-slate-900 border border-rose-900/40 rounded-2xl p-5 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Catatan Log Pengawasan Sistem</span>
            </h4>
            <div className="space-y-2">
              {submission.violationsLog.map((v, i) => (
                <div
                  key={v.id || i}
                  className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-rose-200 font-mono"
                >
                  <span>{v.reason}</span>
                  <span className="text-[11px] text-rose-400">{v.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
