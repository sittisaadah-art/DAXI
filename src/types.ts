export type ClassCategory = 'VIII Akademik' | 'VIII Cambridge' | 'VIII Tahfidz Timteng' | 'XI SMA';

export interface QuestionPG {
  id: number;
  question: string;
  codeSnippet?: string;
  language?: 'python' | 'pseudocode';
  flowchartType?: 'max3' | 'custom';
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  points: number; // default 6
  explanation: string;
}

export interface QuestionEssay {
  id: number;
  question: string;
  maxPoints: number; // default 8
  keywords: string[];
  sampleAnswer: string;
  placeholder: string;
  helperGuide?: string;
}

export interface ViolationRecord {
  id: string;
  timestamp: string;
  reason: string;
  type: 'tab_switch' | 'fullscreen_exit' | 'devtools_or_copy';
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentClass: ClassCategory | string;
  nisn: string;
  startedAt: string;
  submittedAt: string;
  durationSeconds: number;
  answersPG: Record<number, 'A' | 'B' | 'C' | 'D'>;
  answersEssay: Record<number, string>;
  scorePG: number; // 0 to 60
  scoreEssay: number; // 0 to 40
  totalScore: number; // 0 to 100
  isPassed: boolean; // totalScore >= 75
  violationsCount: number;
  violationsLog: ViolationRecord[];
  isDisqualified: boolean;
  teacherGraded?: boolean;
  essayGradingDetails?: Record<number, { score: number; comment?: string }>;
  teacherFeedback?: string;
}

export type ExamViewMode = 'register' | 'exam' | 'result' | 'teacher_dashboard';
