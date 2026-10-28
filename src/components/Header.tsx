import React, { useState } from 'react';
import { ShieldCheck, Lock, GraduationCap, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigateHome: () => void;
  onOpenTeacherDashboard: () => void;
  isExamInProgress?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
  onOpenTeacherDashboard,
  isExamInProgress = false,
}) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPinText, setShowPinText] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Verification PIN is "guru123" without revealing it in any UI text
    if (pinInput.trim() === 'guru123') {
      setShowPinModal(false);
      setPinInput('');
      setErrorMsg('');
      onOpenTeacherDashboard();
    } else {
      setErrorMsg('PIN yang dimasukkan tidak valid. Silakan coba kembali.');
    }
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-emerald-900/50 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* School Brand */}
            <div
              onClick={() => {
                if (!isExamInProgress) onNavigateHome();
              }}
              className={`flex items-center gap-3 ${
                isExamInProgress ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
              }`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black tracking-wider text-emerald-400 uppercase">
                    SMP Ar Rohmah IIBS
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/50 hidden md:inline-block">
                    Informatika
                  </span>
                </div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-100 leading-tight">
                  Daily Asesmen: Algoritma Adventure
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
                  Bab 2 Jelajahi Dunia Pemrograman • Kelas VIII / XI
                </p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Anti-cheat status badge if exam in progress */}
              {isExamInProgress && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-pulse">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Pengawasan Aktif</span>
                </div>
              )}

              {/* Teacher Dashboard Access Button */}
              {!isExamInProgress && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentView === 'teacher_dashboard') {
                      onNavigateHome();
                    } else {
                      setShowPinModal(true);
                      setErrorMsg('');
                      setPinInput('');
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                    currentView === 'teacher_dashboard'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span>{currentView === 'teacher_dashboard' ? 'Kembali ke Ujian' : 'Dashboard Guru'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Teacher PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Portal Guru & Pengawas</h3>
                <p className="text-xs text-slate-400">
                  SMP Ar Rohmah Islamic International Boarding School
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700 leading-relaxed">
              Silakan masukkan PIN otorisasi guru untuk melihat hasil rekapitulasi asesmen, menilai essay, dan mengunduh laporan nilai siswa.
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  PIN Pengawas / Guru
                </label>
                <div className="relative">
                  <input
                    type={showPinText ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    autoFocus
                    placeholder="Masukkan PIN"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinText(!showPinText)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errorMsg && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-900/30 transition"
                >
                  Buka Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
