import jsPDF from 'jspdf';
import { StudentSubmission } from '../types';
import { QUESTIONS_PG, QUESTIONS_ESSAY } from '../data/questionsData';

export function generateStudentResultPDF(sub: StudentSubmission) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // Header Background decoration
  doc.setFillColor(15, 76, 58); // Islamic Forest Green #0f4c3a
  doc.rect(10, y, pageWidth - 20, 24, 'F');

  // School Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('LPI HIDAYATULLAH - SMP AR ROHMAH IIBS', pageWidth / 2, y + 7, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('LEMBAR REKAPITULASI HASIL ASESMEN HARIAN INFORMATIKA', pageWidth / 2, y + 13, { align: 'center' });

  doc.setFontSize(8);
  doc.text('Bab 2: Algoritma Adventure - Jelajahi Dunia Pemrograman | Tahun Pelajaran 2026/2027', pageWidth / 2, y + 18, { align: 'center' });

  y += 28;

  // Student Identity Box
  doc.setDrawColor(200, 210, 215);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(10, y, pageWidth - 20, 26, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('IDENTITAS PESERTA ASESMEN', 14, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  // Left Column
  doc.text(`Nama Siswa    : ${sub.studentName}`, 14, y + 11);
  doc.text(`Kelas / Jurusan : ${sub.studentClass}`, 14, y + 16);
  doc.text(`NISN / No. Ujian: ${sub.nisn || '-'}`, 14, y + 21);

  // Right Column
  const durationMin = Math.round(sub.durationSeconds / 60);
  doc.text(`Waktu Selesai : ${sub.submittedAt}`, 115, y + 11);
  doc.text(`Durasi Waktu  : ${durationMin} Menit`, 115, y + 16);
  
  const cheatText = sub.isDisqualified
    ? '3x Pindah Tab (DIDISKUALIFIKASI)'
    : sub.violationsCount > 0
    ? `${sub.violationsCount}x Catatan Tab (Aman)`
    : '0x Pelanggaran (Sangat Jujur)';
  doc.text(`Pengawasan    : ${cheatText}`, 115, y + 21);

  y += 31;

  // Score Highlight Card
  doc.setFillColor(sub.isPassed ? 240 : 254, sub.isPassed ? 253 : 242, sub.isPassed ? 244 : 242);
  doc.setDrawColor(sub.isPassed ? 52 : 239, sub.isPassed ? 211 : 68, sub.isPassed ? 153 : 68);
  doc.roundedRect(10, y, pageWidth - 20, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('REKAPITULASI NILAI AKHIR (KKM: 75)', 14, y + 6);

  // Scores
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Skor PG (Maks 60)   : ${sub.scorePG}`, 14, y + 12);
  doc.text(`Skor Essay (Maks 40): ${sub.scoreEssay}`, 70, y + 12);

  // Big Total Score
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  const statusColor = sub.isPassed ? [16, 149, 103] : [220, 38, 38];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`TOTAL NILAI: ${sub.totalScore} / 100`, 130, y + 8);

  doc.setFontSize(9.5);
  const statusLabel = sub.isDisqualified
    ? 'STATUS: TIDAK TUNTAS (DISKUALIFIKASI)'
    : sub.isPassed
    ? 'STATUS: TUNTAS (LULUS)'
    : 'STATUS: REMEDIAL (BELUM TUNTAS)';
  doc.text(statusLabel, 130, y + 15);

  y += 25;

  // Multiple Choice Answers Breakdown Table
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('A. Rincian Jawaban Soal Pilihan Ganda (10 Butir)', 10, y);
  y += 4;

  // Table Header
  doc.setFillColor(226, 232, 240);
  doc.rect(10, y, pageWidth - 20, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('No', 12, y + 4);
  doc.text('Topik Materi', 20, y + 4);
  doc.text('Kunci', 105, y + 4);
  doc.text('Jawaban Siswa', 125, y + 4);
  doc.text('Status', 160, y + 4);
  doc.text('Poin', 185, y + 4);
  y += 6;

  doc.setFont('helvetica', 'normal');
  const pgTopics = [
    'Simbol Belah Ketupat (Decision)',
    'Diagram Alir Mencari Max 3 Bilangan',
    'Python Print f-string & Order GoFood',
    'Tipe Data Input Python (str vs int)',
    'Pseudocode Perhitungan Diskon Belanja',
    'MAIN PROGRAM Percabangan Pilihan 7',
    'Eksekusi Loop Pilihan 4 lalu 5',
    'Dekomposisi Function / Modular',
    'Tracing Table Kolom Nilai Variabel',
    'Tahap Debugging / Perbaikan Bug',
  ];

  QUESTIONS_PG.forEach((q, idx) => {
    const studentAns = sub.answersPG[q.id] || '-';
    const isCorrect = studentAns === q.correctKey;
    const earned = isCorrect ? q.points : 0;

    // alternating row fill
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(10, y, pageWidth - 20, 5, 'F');
    }

    doc.setFontSize(7);
    doc.text(`${q.id}`, 12, y + 3.5);
    doc.text(pgTopics[idx], 20, y + 3.5);
    doc.text(q.correctKey, 107, y + 3.5);
    doc.text(studentAns, 132, y + 3.5);

    if (isCorrect) {
      doc.setTextColor(22, 101, 52);
      doc.text('Benar ✓', 160, y + 3.5);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.text('Salah ✗', 160, y + 3.5);
    }
    doc.setTextColor(30, 41, 59);
    doc.text(`${earned}`, 187, y + 3.5);

    y += 5;
  });

  y += 4;

  // Essay Section Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('B. Rincian Jawaban Soal Essay / Uraian (5 Butir)', 10, y);
  y += 4;

  QUESTIONS_ESSAY.forEach((eq) => {
    const studentAns = sub.answersEssay[eq.id] || '(Tidak dijawab)';
    const essayScore = sub.essayGradingDetails?.[eq.id]?.score ?? (sub.teacherGraded ? Math.round(sub.scoreEssay / 5) : 8);

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(10, y, pageWidth - 20, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const title = `Soal ${eq.id}: ${eq.question.slice(0, 75)}...`;
    doc.text(title, 12, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 149, 103);
    doc.text(`Skor: ${essayScore}/${eq.maxPoints}`, pageWidth - 32, y + 4);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    const snippet = studentAns.replace(/\n/g, ' ').slice(0, 110);
    doc.text(`Jawaban: "${snippet}${studentAns.length > 110 ? '...' : ''}"`, 12, y + 9);

    y += 16;
  });

  // Teacher feedback note if any
  if (sub.teacherFeedback) {
    doc.setFillColor(254, 249, 195);
    doc.setDrawColor(250, 204, 21);
    doc.roundedRect(10, y, pageWidth - 20, 11, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(133, 77, 14);
    doc.text('Catatan / Evaluasi Guru Pengampu:', 12, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(sub.teacherFeedback, 12, y + 8);
    y += 14;
  } else {
    y += 2;
  }

  // Signature Block
  const sigY = Math.min(y + 3, 268);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  // Left signature
  doc.text('Mengetahui,', 25, sigY);
  doc.text('Orang Tua / Wali Siswa', 25, sigY + 4);
  doc.text('( ............................................ )', 25, sigY + 18);

  // Middle signature
  doc.text('Bogor / Malang, 27 Oktober 2026', 130, sigY);
  doc.text('Guru Mata Pelajaran Informatika,', 130, sigY + 4);
  doc.setFont('helvetica', 'bold');
  doc.text('Sitti Sa\'adah, S.Kom., M.Pd.', 130, sigY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('NIP/NIY: 198506122010012004', 130, sigY + 21);

  // File download name
  const cleanName = sub.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Rekap_Asesmen_${cleanName}_${sub.studentClass.replace(/\s+/g, '_')}.pdf`);
}
