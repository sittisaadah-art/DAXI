import { StudentSubmission } from '../types';

export const INITIAL_MOCK_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-2026-001',
    studentName: 'Ahmad Fathi Rayyan',
    studentClass: 'VIII Akademik',
    nisn: '22091001',
    startedAt: '2026-10-27 08:00:15',
    submittedAt: '2026-10-27 08:45:20',
    durationSeconds: 2705,
    answersPG: {
      1: 'C',
      2: 'A',
      3: 'C',
      4: 'B',
      5: 'D',
      6: 'A',
      7: 'C',
      8: 'B',
      9: 'A',
      10: 'D',
    },
    answersEssay: {
      1: 'Start -> Input total_pembayaran dan jumlah_uang_dibayarkan -> Belah ketupat kondisi: jumlah_uang_dibayarkan >= total_pembayaran -> Jika Ya: proses kembalian = jumlah_uang_dibayarkan - total_pembayaran lalu Tampilkan kembalian -> Jika Tidak: Tampilkan "Uang yang dibayarkan kurang" -> End.',
      2: `START
    INPUT nilai
    IF nilai >= 75 THEN
        PRINT "Tuntas"
    ELSE
        PRINT "Remedial"
    END IF
END`,
      3: `r = float(input("Masukkan jari-jari: "))
pi = 3.14
luas = pi * (r ** 2)
print("Luas lingkaran =", luas)`,
      4: `START
    INPUT r
    pi = 3.14
    luas = pi * r * r
    PRINT luas
END`,
      5: `START
    INPUT bil1, bil2, bil3
    IF bil1 > bil2 THEN
        max = bil1
    ELSE
        max = bil2
    END IF
    IF bil3 > max THEN
        max = bil3
    END IF
    PRINT max
END`,
    },
    scorePG: 60,
    scoreEssay: 40,
    totalScore: 100,
    isPassed: true,
    violationsCount: 0,
    violationsLog: [],
    isDisqualified: false,
    teacherGraded: true,
    teacherFeedback: 'MasyaAllah, pemahaman algoritma dan logika flowchart sangat istimewa!',
  },
  {
    id: 'sub-2026-002',
    studentName: 'Muhammad Zaki Al-Farisi',
    studentClass: 'VIII Cambridge',
    nisn: '22091045',
    startedAt: '2026-10-27 08:02:10',
    submittedAt: '2026-10-27 08:52:30',
    durationSeconds: 3020,
    answersPG: {
      1: 'C',
      2: 'A',
      3: 'C',
      4: 'B',
      5: 'D',
      6: 'A',
      7: 'C',
      8: 'B',
      9: 'A',
      10: 'C', // wrong (chose C instead of D)
    },
    answersEssay: {
      1: 'Diagram dimulai dengan START terminator, masukkan total pembayaran dan uang dibayar. Cek apakah uang cukup dengan simbol decision belah ketupat. Bila cukup hitung kembalian dan cetak, bila kurang cetak pesan kurang. Selesai.',
      2: `START
    INPUT nilai
    IF nilai >= 75 THEN
        PRINT "Tuntas"
    ELSE
        PRINT "Remedial"
    END IF
END`,
      3: `jari = float(input("Jari-jari: "))
luas = 3.14 * jari * jari
print(luas)`,
      4: `START
    INPUT r
    luas = 3.14 * r * r
    PRINT luas
END`,
      5: `START
    INPUT bil1, bil2, bil3
    IF bil1 > bil2 THEN
        max = bil1
    ELSE
        max = bil2
    END IF
    PRINT max
END`,
    },
    scorePG: 54,
    scoreEssay: 34,
    totalScore: 88,
    isPassed: true,
    violationsCount: 1,
    violationsLog: [
      {
        id: 'viol-1',
        timestamp: '08:24:12',
        reason: 'Peringatan: Berpindah tab browser',
        type: 'tab_switch',
      },
    ],
    isDisqualified: false,
    teacherGraded: true,
    teacherFeedback: 'Sangat baik, perhatikan kembali soal nomor 10 tentang proses debugging.',
  },
  {
    id: 'sub-2026-003',
    studentName: 'Abdullah Azzam Al-Hafidz',
    studentClass: 'VIII Tahfidz Timteng',
    nisn: '22091078',
    startedAt: '2026-10-27 08:05:00',
    submittedAt: '2026-10-27 08:56:45',
    durationSeconds: 3105,
    answersPG: {
      1: 'C',
      2: 'A',
      3: 'C',
      4: 'A', // wrong
      5: 'D',
      6: 'A',
      7: 'C',
      8: 'B',
      9: 'B', // wrong
      10: 'D',
    },
    answersEssay: {
      1: 'Start -> Input total bayar dan bayar -> decision apakah bayar >= total bayar? Ya: kembalian = bayar - total. Tampilkan kembalian. Tidak: Tampilkan uang kurang -> Selesai',
      2: `START
    INPUT nilai
    IF nilai >= 75 THEN
        PRINT "Tuntas"
    ELSE
        PRINT "Remedial"
    END IF
END`,
      3: `r = float(input())
luas = 3.14 * r * r
print(luas)`,
      4: `START
    INPUT r
    L = 3.14 * r * r
    PRINT L
END`,
      5: `START
    INPUT bil1, bil2, bil3
    max = bil1
    IF bil2 > max THEN
        max = bil2
    END IF
    IF bil3 > max THEN
        max = bil3
    END IF
    PRINT max
END`,
    },
    scorePG: 48,
    scoreEssay: 36,
    totalScore: 84,
    isPassed: true,
    violationsCount: 0,
    violationsLog: [],
    isDisqualified: false,
    teacherGraded: true,
    teacherFeedback: 'Barakallahu fiik, terus tingkatkan logika pemrograman Python!',
  },
  {
    id: 'sub-2026-004',
    studentName: 'Faris Naufal Hidayat',
    studentClass: 'VIII Cambridge',
    nisn: '22091052',
    startedAt: '2026-10-27 08:10:00',
    submittedAt: '2026-10-27 08:35:12',
    durationSeconds: 1512,
    answersPG: {
      1: 'B',
      2: 'B',
      3: 'A',
      4: 'A',
      5: 'A',
      6: 'B',
      7: 'A',
      8: 'A',
      9: 'B',
      10: 'A',
    },
    answersEssay: {
      1: 'Masukan uang dan hitung kembalian',
      2: 'IF nilai 75 tuntas',
      3: 'print(3.14 * r)',
      4: 'INPUT r PRINT luas',
      5: 'INPUT bil1, bil2, bil3',
    },
    scorePG: 12,
    scoreEssay: 15,
    totalScore: 27,
    isPassed: false,
    violationsCount: 3,
    violationsLog: [
      { id: 'v1', timestamp: '08:15:20', reason: 'Pindah tab browser', type: 'tab_switch' },
      { id: 'v2', timestamp: '08:22:45', reason: 'Pindah tab browser', type: 'tab_switch' },
      { id: 'v3', timestamp: '08:35:12', reason: 'Pindah tab ke-3 (Diskualifikasi Otomatis)', type: 'tab_switch' },
    ],
    isDisqualified: true,
    teacherGraded: true,
    teacherFeedback: 'Terdeteksi 3x berpindah tab saat ujian berlangsung. Ujian diselesaikan secara paksa.',
  },
];
