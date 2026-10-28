import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  ShieldAlert,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  Maximize2,
  FileText,
  HelpCircle,
  Code2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { QuestionPG, QuestionEssay, ViolationRecord, StudentSubmission, KKM_SCORE } from '../types';
import { QUESTIONS_PG, QUESTIONS_ESSAY, autoGradeEssay } from '../data/questionsData';
import { FlowchartViewer } from './FlowchartViewer';
import { playAlertSound } from '../utils/storage';

interface ExamScreenProps {
  studentInfo: {
    name: string;
    studentClass: string;
    nisn: string;
  };
  onFinishExam: (submission: StudentSubmission) => void;
}

const TOTAL_TIME_SECONDS = 60 * 60; // 60 minutes

export const ExamScreen: React.FC<ExamScreenProps> = ({ studentInfo, onFinishExam }) => {
  // Navigation & Answers State
  const [activeSection, setActiveSection] = useState<'pg' | 'essay'>('pg');
  const [currentPgIndex, setCurrentPgIndex] = useState<number>(0);
  const [currentEssayIndex, setCurrentEssayIndex] = useState<number>(0);

  const [answersPG, setAnswersPG] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [answersEssay, setAnswersEssay] = useState<Record<number, string>>({});

  // Timer State (60 minutes)
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const startTimeRef = useRef<Date>(new Date());

  // Anti-Cheat Engine State
  const [strikeCount, setStrikeCount] = useState<number>(0);
  const [violationsLog, setViolationsLog] = useState<ViolationRecord[]>([]);
  const [warningModalOpen, setWarningModalOpen] = useState<boolean>(false);
  const [latestWarningReason, setLatestWarningReason] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Ref to prevent double-firing handlers
  const lastViolationTimeRef = useRef<number>(0);
  const hasFinishedRef = useRef<boolean>(false);

  // Helper to trigger full screen
  const requestFullscreenLock = useCallback(() => {
    try {
      const elem = document.documentElement as unknown as {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
      };
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } catch {
      // Ignore if user denies or not permitted
    }
  }, []);

  // Request fullscreen on start
  useEffect(() => {
    requestFullscreenLock();
  }, [requestFullscreenLock]);

  // Submit Handler
  const executeSubmission = useCallback(
    (isDisqualified = false, disqualificationReason?: string) => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;
      setIsTimerRunning(false);
      setIsSubmitting(true);

      const endTime = new Date();
      const durationSeconds = Math.max(
        1,
        Math.floor((endTime.getTime() - startTimeRef.current.getTime()) / 1000)
      );

      // Grade Multiple Choice (PG) - 6 pts each, max 60
      let scorePG = 0;
      QUESTIONS_PG.forEach((q) => {
        if (answersPG[q.id] === q.correctKey) {
          scorePG += q.points;
        }
      });

      // Auto-Grade Essay (5 questions, max 8 pts each = 40 pts)
      let scoreEssay = 0;
      const essayGradingDetails: Record<number, { score: number; comment?: string }> = {};

      QUESTIONS_ESSAY.forEach((eq) => {
        const studentAns = answersEssay[eq.id] || '';
        const grading = autoGradeEssay(eq.id, studentAns);
        scoreEssay += grading.score;
        essayGradingDetails[eq.id] = {
          score: grading.score,
          comment: grading.feedback,
        };
      });

      let totalScore = scorePG + scoreEssay;
      if (isDisqualified) {
        totalScore = Math.min(totalScore, 30); // Penalized if disqualified
      }

      const isPassed = totalScore >= KKM_SCORE && !isDisqualified;

      const updatedViolations = [...violationsLog];
      if (disqualificationReason) {
        updatedViolations.push({
          id: `viol-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('id-ID'),
          reason: disqualificationReason,
          type: 'tab_switch',
        });
      }

      const submission: StudentSubmission = {
        id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        studentName: studentInfo.name,
        studentClass: studentInfo.studentClass,
        nisn: studentInfo.nisn,
        startedAt: startTimeRef.current.toLocaleTimeString('id-ID'),
        submittedAt: endTime.toLocaleTimeString('id-ID'),
        durationSeconds,
        answersPG,
        answersEssay,
        scorePG,
        scoreEssay,
        totalScore,
        isPassed,
        violationsCount: updatedViolations.length,
        violationsLog: updatedViolations,
        isDisqualified,
        teacherGraded: false,
        essayGradingDetails,
        teacherFeedback: isDisqualified
          ? 'Ujian diselesaikan paksa oleh sistem karena mendeteksi 3x perpindahan tab/jendela.'
          : 'Hasil penilaian otomatis awal. Guru pengampu dapat meninjau dan menyesuaikan skor essay.',
      };

      onFinishExam(submission);
    },
    [answersEssay, answersPG, onFinishExam, studentInfo, violationsLog]
  );

  // Anti-Cheat: Record strike & trigger warnings
  const recordViolation = useCallback(
    (reason: string, type: 'tab_switch' | 'fullscreen_exit' | 'devtools_or_copy') => {
      if (hasFinishedRef.current) return;

      const now = Date.now();
      // Debounce consecutive events within 1500ms
      if (now - lastViolationTimeRef.current < 1500) {
        return;
      }
      lastViolationTimeRef.current = now;

      const newStrike = strikeCount + 1;
      const timeStr = new Date().toLocaleTimeString('id-ID');
      const newRecord: ViolationRecord = {
        id: `viol-${now}`,
        timestamp: timeStr,
        reason: `${reason} (Pukul ${timeStr})`,
        type,
      };

      const newLog = [...violationsLog, newRecord];
      setViolationsLog(newLog);
      setStrikeCount(newStrike);
      setLatestWarningReason(reason);

      if (newStrike >= 3) {
        // Strike 3: Terminate Exam Immediately!
        playAlertSound('penalty');
        setWarningModalOpen(false);
        alert(
          'PERINGATAN KRITIS: Anda telah berpindah tab sebanyak 3 kali!\nSesuai aturan ujian, asesmen Anda langsung dihentikan dan didiskualifikasi secara otomatis.'
        );
        executeSubmission(
          true,
          'Diskualifikasi Otomatis: Terdeteksi 3 kali perpindahan tab atau jendela browser.'
        );
      } else {
        // Strike 1 or 2: Audio chime & Warning modal
        playAlertSound('warning');
        setWarningModalOpen(true);
      }
    },
    [strikeCount, violationsLog, executeSubmission]
  );

  // Tab switch & visibility detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('Terdeteksi berpindah tab browser atau meminimalkan jendela', 'tab_switch');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('Jendela ujian kehilangan fokus (berpindah ke aplikasi lain)', 'tab_switch');
    };

    const handleFullscreenChange = () => {
      const doc = document as unknown as { fullscreenElement?: Element; webkitFullscreenElement?: Element };
      const inFull = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
      setIsFullscreen(inFull);
      if (!inFull && !hasFinishedRef.current) {
        recordViolation('Keluar dari mode layar penuh (kunci layar terlepas)', 'fullscreen_exit');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation('Mencoba klik kanan (context menu dinonaktifkan)', 'devtools_or_copy');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+V, Ctrl+U, F12, Ctrl+Shift+I
      if (
        (e.ctrlKey && ['c', 'v', 'u', 'a', 'p', 's'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        recordViolation(`Menekan tombol pintas terlarang (${e.key})`, 'devtools_or_copy');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [recordViolation]);

  // 60-Minute Countdown Timer
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          playAlertSound('penalty');
          alert('WAKTU HABIS: Durasi 60 menit telah selesai. Jawaban Anda akan dikumpulkan otomatis.');
          executeSubmission(false, 'Waktu ujian 60 menit telah berakhir.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, executeSubmission]);

  // Format Time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = timeLeft < 300; // < 5 mins
  const isTimeWarning = timeLeft < 600 && timeLeft >= 300; // < 10 mins

  // Current Question References
  const currentPg = QUESTIONS_PG[currentPgIndex];
  const currentEssay = QUESTIONS_ESSAY[currentEssayIndex];

  // Count answered questions
  const totalPgAnswered = Object.keys(answersPG).length;
  const totalEssayAnswered = Object.values(answersEssay).filter((t) => t.trim().length > 0).length;
  const totalAnswered = totalPgAnswered + totalEssayAnswered;
  const totalQuestions = QUESTIONS_PG.length + QUESTIONS_ESSAY.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Sticky Header Exam Bar with Timer & Strike Status */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Student details */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              XI
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[140px] sm:max-w-[220px]">
                {studentInfo.name}
              </p>
              <p className="text-[10px] text-slate-400">
                {studentInfo.studentClass} • {studentInfo.nisn}
              </p>
            </div>
          </div>

          {/* Central Strike & Fullscreen Warning Bar */}
          <div className="flex items-center gap-2">
            {/* Strike Indicator */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                strikeCount === 0
                  ? 'bg-slate-800/80 border-slate-700 text-emerald-400'
                  : strikeCount === 1
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                  : 'bg-rose-950/90 border-rose-600 text-rose-300 animate-pulse'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>
                Pindah Tab: <span className="font-mono">{strikeCount}/3</span>
              </span>
            </div>

            {!isFullscreen && (
              <button
                type="button"
                onClick={requestFullscreenLock}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-md shadow-rose-900/40"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">Kunci Layar Lagi</span>
              </button>
            )}
          </div>

          {/* 60-Minute Timer Badge & Finish Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm sm:text-base font-bold shadow-inner ${
                isTimeCritical
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                  : isTimeWarning
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                  : 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
              }`}
            >
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{timeFormatted}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kumpulkan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Exam Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Content */}
        <div className="lg:col-span-8 flex flex-col space-y-5">
          {/* Section Switcher Tabs */}
          <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveSection('pg')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeSection === 'pg'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>Bagian A: Pilihan Ganda</span>
                <span className="text-[10px] bg-slate-900/70 px-1.5 py-0.5 rounded-full">
                  {totalPgAnswered}/10
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('essay')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeSection === 'essay'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>Bagian B: Soal Essay</span>
                <span className="text-[10px] bg-slate-900/70 px-1.5 py-0.5 rounded-full">
                  {totalEssayAnswered}/5
                </span>
              </button>
            </div>

            <div className="text-xs text-slate-400 hidden sm:block pr-3">
              Total Terjawab: <strong className="text-white">{totalAnswered}</strong> / {totalQuestions}
            </div>
          </div>

          {/* ACTIVE SECTION: PILIHAN GANDA */}
          {activeSection === 'pg' && currentPg && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col flex-1">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                    {currentPg.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Soal Pilihan Ganda (Bobot: {currentPg.points} Poin)
                  </span>
                </div>
                {answersPG[currentPg.id] ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Terjawab: {answersPG[currentPg.id]}
                  </span>
                ) : (
                  <span className="text-xs text-amber-400 font-medium bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800">
                    Belum Dijawab
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed whitespace-pre-line mb-4">
                {currentPg.question}
              </div>

              {/* Question 2 Flowchart Embed */}
              {currentPg.flowchartType === 'max3' && (
                <div className="mb-5">
                  <FlowchartViewer type="max3" />
                </div>
              )}

              {/* Code Snippet if present */}
              {currentPg.codeSnippet && (
                <div className="my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
                  <div className="bg-slate-800/80 px-4 py-1.5 flex items-center justify-between border-b border-slate-700 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                      <Code2 className="w-3.5 h-3.5" />
                      {currentPg.language === 'python' ? 'Python Script' : 'Pseudocode'}
                    </span>
                    <span className="text-[10px] text-slate-400">Algoritma Adventure</span>
                  </div>
                  <pre className="p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
                    <code>{currentPg.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Choices List */}
              <div className="space-y-3 mt-4 flex-1">
                {currentPg.options.map((opt) => {
                  const isSelected = answersPG[currentPg.id] === opt.key;
                  return (
                    <label
                      key={opt.key}
                      onClick={() => setAnswersPG((prev) => ({ ...prev, [currentPg.id]: opt.key }))}
                      className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-950/50 text-white ring-1 ring-emerald-500'
                          : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-700/60 text-slate-300'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                        {opt.text}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Bottom Navigation for PG */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
                <button
                  type="button"
                  disabled={currentPgIndex === 0}
                  onClick={() => setCurrentPgIndex((prev) => prev - 1)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    currentPgIndex === 0
                      ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {currentPgIndex < QUESTIONS_PG.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentPgIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('essay');
                      setCurrentEssayIndex(0);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-900/30 transition"
                  >
                    <span>Lanjut ke Soal Essay</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE SECTION: ESSAY / URAIAN */}
          {activeSection === 'essay' && currentEssay && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col flex-1">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm">
                    {currentEssay.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Soal Essay / Uraian (Bobot Maks: {currentEssay.maxPoints} Poin)
                  </span>
                </div>
                {answersEssay[currentEssay.id]?.trim() ? (
                  <span className="flex items-center gap-1 text-xs text-teal-400 font-semibold bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sudah Ditulis
                  </span>
                ) : (
                  <span className="text-xs text-amber-400 font-medium bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800">
                    Belum Diisi
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed mb-3">
                {currentEssay.question}
              </div>

              {/* Helper Guide Notice */}
              {currentEssay.helperGuide && (
                <div className="p-3 mb-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Panduan Menjawab:</strong> {currentEssay.helperGuide}
                  </span>
                </div>
              )}

              {/* For Essay 1: Payment machine flowchart preview aid */}
              {currentEssay.id === 1 && (
                <div className="mb-4">
                  <details className="cursor-pointer group">
                    <summary className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 mb-2">
                      <span>Lihat Referensi Simbol Standar Flowchart</span>
                    </summary>
                    <FlowchartViewer type="payment_machine" />
                  </details>
                </div>
              )}

              {/* Textarea for student answer */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Lembar Jawaban Santri / Siswa:</span>
                  <span className="font-mono text-[11px]">
                    {(answersEssay[currentEssay.id] || '').length} Karakter
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={answersEssay[currentEssay.id] || ''}
                  onChange={(e) =>
                    setAnswersEssay((prev) => ({ ...prev, [currentEssay.id]: e.target.value }))
                  }
                  placeholder={currentEssay.placeholder}
                  className="w-full flex-1 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-2xl p-4 text-emerald-300 font-mono text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 leading-relaxed resize-y min-h-[220px]"
                ></textarea>
              </div>

              {/* Bottom Navigation for Essay */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (currentEssayIndex === 0) {
                      setActiveSection('pg');
                      setCurrentPgIndex(QUESTIONS_PG.length - 1);
                    } else {
                      setCurrentEssayIndex((prev) => prev - 1);
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentEssayIndex === 0 ? 'Kembali ke Pilihan Ganda' : 'Sebelumnya'}</span>
                </button>

                {currentEssayIndex < QUESTIONS_ESSAY.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentEssayIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-900/30 transition"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirm(true)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Selesai & Kumpulkan Ujian</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Question Matrix Navigation Palette */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl sticky top-20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
              <span>Navigasi Soal Asesmen</span>
              <span className="text-[11px] text-emerald-400 font-mono">
                {totalAnswered}/{totalQuestions}
              </span>
            </h4>

            {/* Pilihan Ganda Palette */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Pilihan Ganda (10 Soal)</span>
                <span className="text-[10px] text-slate-500">6 Poin/Soal</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {QUESTIONS_PG.map((q, idx) => {
                  const isAnswered = Boolean(answersPG[q.id]);
                  const isActive = activeSection === 'pg' && currentPgIndex === idx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setActiveSection('pg');
                        setCurrentPgIndex(idx);
                      }}
                      className={`h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        isActive
                          ? 'ring-2 ring-emerald-400 bg-emerald-600 text-white shadow-md scale-105'
                          : isAnswered
                          ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <span>{q.id}</span>
                      {isAnswered && (
                        <span className="text-[9px] font-mono leading-none">
                          {answersPG[q.id]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Essay Palette */}
            <div className="mb-5 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">Soal Essay (5 Soal)</span>
                <span className="text-[10px] text-slate-500">8 Poin/Soal</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {QUESTIONS_ESSAY.map((eq, idx) => {
                  const isAnswered = Boolean(answersEssay[eq.id]?.trim());
                  const isActive = activeSection === 'essay' && currentEssayIndex === idx;
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => {
                        setActiveSection('essay');
                        setCurrentEssayIndex(idx);
                      }}
                      className={`h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        isActive
                          ? 'ring-2 ring-teal-400 bg-teal-600 text-white shadow-md scale-105'
                          : isAnswered
                          ? 'bg-teal-950/80 border border-teal-600 text-teal-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <span>{eq.id}</span>
                      <span className="text-[9px] leading-none">
                        {isAnswered ? '✓' : '—'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anti-cheat audit info box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status Kejujuran:</span>
                <span
                  className={`font-bold ${
                    strikeCount === 0
                      ? 'text-emerald-400'
                      : strikeCount === 1
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {strikeCount === 0
                    ? 'Sangat Baik (0 Pelanggaran)'
                    : `${strikeCount}x Pindah Tab`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Kunci Layar (Fullscreen):</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {isFullscreen ? 'Terkunci' : 'Lepas'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800/80 leading-relaxed">
                Peringatan: Berpindah tab browser sebanyak 3 kali akan mengakhiri ujian Anda secara paksa!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WARNING MODAL: STRIKE 1 & 2 */}
      {warningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border-2 border-rose-600 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center mx-auto mb-4 text-rose-500 animate-bounce">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-rose-950 border border-rose-700 text-rose-300 font-mono text-xs font-bold mb-2">
              PERINGATAN PELANGGARAN TAB KE-{strikeCount} DARI 3
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              Terdeteksi Berpindah Jendela Ujian!
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
              Sistem pengawasan mendeteksi Anda meninggalkan jendela asesmen ({latestWarningReason}).
            </p>

            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs sm:text-sm font-semibold mb-6">
              ⚠️ Peringatan Terakhir:{' '}
              {strikeCount === 1 ? (
                <span>Tersisa 1 kali kesempatan lagi sebelum diskualifikasi otomatis.</span>
              ) : (
                <span className="text-rose-300 font-bold">
                  Satu kali perpindahan tab lagi, ujian Anda akan BERAKHIR SECARA OTOMATIS dan didiskualifikasi!
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setWarningModalOpen(false);
                requestFullscreenLock();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-950/50 transition"
            >
              Saya Mengerti dan Kembali Mengerjakan Ujian
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL BEFORE SUBMISSION */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Konfirmasi Pengumpulan</h3>
                <p className="text-xs text-slate-400">Asesmen Harian Informatika Bab 2</p>
              </div>
            </div>

            <div className="space-y-3 mb-6 bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Soal Pilihan Ganda Terjawab:</span>
                <span className="font-bold text-white font-mono">{totalPgAnswered} / 10</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Soal Essay Terjawab:</span>
                <span className="font-bold text-white font-mono">{totalEssayAnswered} / 5</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-700">
                <span>Sisa Waktu Ujian:</span>
                <span className="font-bold text-emerald-400 font-mono">{timeFormatted}</span>
              </div>
            </div>

            {totalAnswered < totalQuestions && (
              <div className="p-3 mb-5 rounded-xl bg-amber-950/70 border border-amber-800 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Terdapat {totalQuestions - totalAnswered} soal yang belum dijawab. Apakah Anda yakin ingin mengumpulkan sekarang?
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              >
                Periksa Lagi
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => executeSubmission(false)}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ya, Kumpulkan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
