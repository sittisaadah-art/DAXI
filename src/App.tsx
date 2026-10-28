/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudentRegistration } from './components/StudentRegistration';
import { ExamScreen } from './components/ExamScreen';
import { StudentResultModal } from './components/StudentResultModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { OfficialPrintReport } from './components/OfficialPrintReport';
import { StudentSubmission, ExamViewMode } from './types';
import { getSubmissions, saveSubmission } from './utils/storage';

export default function App() {
  const [viewMode, setViewMode] = useState<ExamViewMode | 'print_report'>('register');
  const [studentInfo, setStudentInfo] = useState<{
    name: string;
    studentClass: string;
    nisn: string;
  } | null>(null);

  const [activeSubmission, setActiveSubmission] = useState<StudentSubmission | null>(null);
  const [submissionsList, setSubmissionsList] = useState<StudentSubmission[]>([]);

  // Load existing submissions on mount
  useEffect(() => {
    const data = getSubmissions();
    setSubmissionsList(data);
  }, []);

  // Handler: Start Exam
  const handleStartExam = (info: { name: string; studentClass: string; nisn: string }) => {
    setStudentInfo(info);
    setViewMode('exam');
  };

  // Handler: Finish Exam
  const handleFinishExam = (submission: StudentSubmission) => {
    saveSubmission(submission);
    setActiveSubmission(submission);
    setSubmissionsList(getSubmissions());
    setViewMode('result');
  };

  // Handler: Refresh data in teacher dashboard
  const handleRefreshData = () => {
    setSubmissionsList(getSubmissions());
  };

  // Handler: Retake or new exam
  const handleRetakeExam = () => {
    setStudentInfo(null);
    setActiveSubmission(null);
    setViewMode('register');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header - Not shown in official print sheet */}
      {viewMode !== 'print_report' && (
        <Header
          currentView={viewMode}
          onNavigateHome={() => setViewMode('register')}
          onOpenTeacherDashboard={() => setViewMode('teacher_dashboard')}
          isExamInProgress={viewMode === 'exam'}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {viewMode === 'register' && (
          <StudentRegistration onStartExam={handleStartExam} />
        )}

        {viewMode === 'exam' && studentInfo && (
          <ExamScreen
            studentInfo={studentInfo}
            onFinishExam={handleFinishExam}
          />
        )}

        {viewMode === 'result' && activeSubmission && (
          <StudentResultModal
            submission={activeSubmission}
            onRetakeExam={handleRetakeExam}
            onOpenTeacherPortal={() => setViewMode('teacher_dashboard')}
            onPrintOfficialReport={() => setViewMode('print_report')}
          />
        )}

        {viewMode === 'teacher_dashboard' && (
          <TeacherDashboard
            submissions={submissionsList}
            onRefreshData={handleRefreshData}
            onSelectStudentForPrint={(sub) => {
              setActiveSubmission(sub);
              setViewMode('print_report');
            }}
            onExitDashboard={() => setViewMode('register')}
          />
        )}

        {viewMode === 'print_report' && activeSubmission && (
          <OfficialPrintReport
            submission={activeSubmission}
            onBack={() => setViewMode(activeSubmission ? 'result' : 'teacher_dashboard')}
          />
        )}
      </main>

      {/* Footer - Hidden when exam in progress or printing */}
      {viewMode !== 'exam' && viewMode !== 'print_report' && (
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © 2026 SMP Ar Rohmah IIBS Malang / Bogor • Daily Asesmen Informatika Bab 2 Algoritma Adventure
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>Sistem Pengawasan Real-Time & Kunci Layar</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setViewMode('teacher_dashboard')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Portal Guru
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
