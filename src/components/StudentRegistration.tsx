import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  Sparkles,
  Maximize2,
  BookOpen,
  HelpCircle,
  Award,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { ClassCategory } from '../types';

interface StudentRegistrationProps {
  onStartExam: (studentInfo: {
    name: string;
    studentClass: ClassCategory | string;
    nisn: string;
  }) => void;
}

const CLASS_OPTIONS: { id: ClassCategory; label: string; desc: string }[] = [
  {
    id: 'VIII Akademik',
    label: 'VIII Akademik',
    desc: 'Kelas Program Unggulan Akademik & Sains',
  },
  {
    id: 'VIII Cambridge',
    label: 'VIII Cambridge',
    desc: 'Kelas Program Internasional Kurikulum Cambridge',
  },
  {
    id: 'VIII Tahfidz Timteng',
    label: 'VIII Tahfidz Timteng',
    desc: 'Kelas Program Al-Qur\'an & Timur Tengah',
  },
];

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onStartExam }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassCategory>('VIII Akademik');
  const [customClass, setCustomClass] = useState('');
  const [isOtherClass, setIsOtherClass] = useState(false);
  const [nisn, setNisn] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Mohon masukkan Nama Lengkap Anda.');
      return;
    }
    const finalClass = isOtherClass ? customClass.trim() || 'VIII Akademik' : selectedClass;

    if (!agreed) {
      setError('Anda harus menyetujui integritas ujian dan aktivasi kunci layar.');
      return;
    }

    onStartExam({
      name: name.trim(),
      studentClass: finalClass,
      nisn: nisn.trim() || `NISN-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 sm:p-10 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Asesmen Harian Resmi Semester Genap 2026/2027</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Algoritma Adventure: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Jelajahi Dunia Pemrograman
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6">
            Selamat datang di Asesmen Harian Informatika SMP Ar Rohmah IIBS Malang. Uji ketajaman logika,
            analisis diagram alir (flowchart), pseudocode, dan dasar bahasa Python Anda secara mandiri dan jujur.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-slate-400">Durasi Ujian</p>
                <p className="font-bold text-white">60 Menit</p>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-slate-400">Pilihan Ganda</p>
                <p className="font-bold text-white">10 Butir (60 Poin)</p>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <div>
                <p className="text-slate-400">Soal Uraian</p>
                <p className="font-bold text-white">5 Soal (40 Poin)</p>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
              <Award className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <p className="text-slate-400">Nilai KKM</p>
                <p className="font-bold text-white">75 (Tuntas)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Anti-cheat Policy Info Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Sistem Anti-Cheating Real-Time</h3>
                <span className="text-[11px] text-rose-400 font-medium">Pengawasan Tab & Kunci Layar</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Aplikasi ini dilengkapi algoritma pengawasan integritas otomatis demi menjaga kejujuran santri:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-700 text-rose-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Deteksi Pindah Tab Real-Time:</strong> Sistem secara otomatis mendeteksi saat Anda membuka tab lain atau meminimalkan jendela.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-700 text-rose-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Batas Toleransi 3 Kali:</strong> Pelanggaran 1 & 2 akan memunculkan alarm peringatan. Pada pelanggaran ke-3, <strong>ujian langsung berakhir otomatis</strong> dan Anda didiskualifikasi!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-700 text-rose-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Kunci Layar Penuh (Fullscreen):</strong> Mode layar penuh akan dikunci saat menekan tombol mulai untuk mencegah membuka aplikasi lain.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-700 text-rose-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  <strong>Blokir Klik Kanan & Salin Teks:</strong> Shortcut copy/paste dinonaktifkan demi integritas asesmen.
                </span>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-2 text-rose-300 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>Kerjakanlah dengan jujur dengan mengharap ridho Allah SWT.</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">💡 Pengumpulan & Rekapitulasi</p>
            <p>
              Setelah menekan "Kumpulkan Ujian", nilai pilihan ganda dan rekomendasi skor essay langsung dihitung otomatis.
              File PDF Rekapitulasi Nilai resmi dapat langsung diunduh dan tersimpan di database dashboard guru.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Formulir Peserta Ujian</h3>
            <p className="text-xs text-slate-400 mb-6">
              Lengkapi identitas santri/siswa sebelum memasuki ruang asesmen terkunci.
            </p>

            <form onSubmit={handleStart} className="space-y-5">
              {/* Nama Siswa */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nama Lengkap Siswa <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Raihan Al-Fatih"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                />
              </div>

              {/* Kelas Selection with categories: VIII Akademik, VIII Cambridge, VIII Tahfidz Timteng */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Pilih Kategori Kelas <span className="text-rose-400">*</span>
                </label>
                <div className="space-y-2.5">
                  {CLASS_OPTIONS.map((item) => (
                    <label
                      key={item.id}
                      onClick={() => {
                        setSelectedClass(item.id);
                        setIsOtherClass(false);
                      }}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        !isOtherClass && selectedClass === item.id
                          ? 'bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950/40 text-white'
                          : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="classOption"
                        checked={!isOtherClass && selectedClass === item.id}
                        onChange={() => {
                          setSelectedClass(item.id);
                          setIsOtherClass(false);
                        }}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{item.label}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                            SMP Ar Rohmah
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </label>
                  ))}

                  {/* Option for XI SMA or Custom Class */}
                  <label
                    onClick={() => setIsOtherClass(true)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isOtherClass
                        ? 'bg-emerald-950/60 border-emerald-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="classOption"
                      checked={isOtherClass}
                      onChange={() => setIsOtherClass(true)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-xs text-slate-200">Kelas Lainnya / XI SMA</span>
                      {isOtherClass && (
                        <input
                          type="text"
                          placeholder="Ketik nama kelas (cth: XI SMA IPA 1)"
                          value={customClass}
                          onChange={(e) => setCustomClass(e.target.value)}
                          className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* NISN / No. Ujian */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nomor Absen / NISN (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 22091012"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition"
                />
              </div>

              {/* Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (error) setError('');
                    }}
                    className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    Saya berjanji akan mengerjakan ujian ini secara jujur dan mandiri. Saya memahami bahwa
                    <strong> perpindahan tab sebanyak 3 kali akan menghentikan ujian saya secara otomatis</strong>
                    dan mengaktifkan mode kunci layar (Fullscreen).
                  </div>
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full group bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Maximize2 className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>Kunci Layar & Mulai Ujian (60 Menit)</span>
                <ChevronRight className="w-5 h-5 ml-1 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
