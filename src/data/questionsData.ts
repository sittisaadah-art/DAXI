import { QuestionPG, QuestionEssay } from '../types';

export const QUESTIONS_PG: QuestionPG[] = [
  {
    id: 1,
    question: 'Simbol belah ketupat pada diagram alir (flowchart) digunakan untuk ....',
    options: [
      { key: 'A', text: 'menandai titik awal atau titik akhir program' },
      { key: 'B', text: 'menunjukkan proses perhitungan atau operasi aritmetika' },
      { key: 'C', text: 'menunjukkan titik percabangan berdasarkan suatu kondisi' },
      { key: 'D', text: 'menerima data masukan dari pengguna' },
    ],
    correctKey: 'C',
    points: 6,
    explanation: 'Simbol belah ketupat (Decision) dalam flowchart berfungsi untuk pengambilan keputusan / percabangan berdasarkan kondisi tertentu (True / False).',
  },
  {
    id: 2,
    question: 'Perhatikan diagram alir berikut untuk menjawab soal nomor 2.\nJika pengguna memasukkan bil1 = 7, bil2 = 4, dan bil3 = 9, nilai yang ditampilkan pada akhir diagram alir adalah ....',
    flowchartType: 'max3',
    options: [
      { key: 'A', text: '9' },
      { key: 'B', text: '7' },
      { key: 'C', text: '20' },
      { key: 'D', text: '4' },
    ],
    correctKey: 'A',
    points: 6,
    explanation: 'Diagram alir mencari nilai terbesar: bil1 (7) > bil2 (4) bernilai True, sehingga max = 7. Selanjutnya dicek bil3 (9) > max (7) bernilai True, sehingga max diubah menjadi 9. Output yang dicetak adalah 9.',
  },
  {
    id: 3,
    question: 'Perhatikan kode program Python berikut untuk menjawab soal nomor 3.\nJika pengguna memasukkan lokasi pengantaran "Asrama B", restoran "Warung Bu Ani", dan daftar pesanan "Nasi Goreng, Es Teh", keluaran pada perintah print() yang terakhir adalah ....',
    codeSnippet: `def order_gofood():
    delivery_location = input("Masukkan lokasi pengantaran: ")
    restaurant = input("Pilih restoran: ")
    order_list = input("Masukkan daftar pesanan (pisahkan dengan koma): ")
    print("Memproses pemesanan GoFood...")
    # Simulasikan proses pemesanan
    print(f"Pemesanan GoFood dari restoran {restaurant} "
          f"dengan pesanan {order_list} "
          f"akan diantarkan ke {delivery_location}")`,
    language: 'python',
    options: [
      { key: 'A', text: 'Pemesanan GoFood dari restoran Nasi Goreng, Es Teh dengan pesanan Warung Bu Ani akan diantarkan ke Asrama B' },
      { key: 'B', text: 'Pemesanan GoFood dari restoran Asrama B dengan pesanan Nasi Goreng, Es Teh akan diantarkan ke Warung Bu Ani' },
      { key: 'C', text: 'Pemesanan GoFood dari restoran Warung Bu Ani dengan pesanan Nasi Goreng, Es Teh akan diantarkan ke Asrama B' },
      { key: 'D', text: 'Memproses pemesanan GoFood...' },
    ],
    correctKey: 'C',
    points: 6,
    explanation: 'Pada f-string di Python, variabel disisipkan sesuai posisinya: {restaurant} = "Warung Bu Ani", {order_list} = "Nasi Goreng, Es Teh", {delivery_location} = "Asrama B".',
  },
  {
    id: 4,
    question: 'Perhatikan fungsi main() pada kode program Python berikut untuk menjawab soal nomor 4.\nPada fungsi main() tersebut, baris if choice == "1": diubah menjadi if choice == 1: (tanpa tanda kutip). Jika pengguna memasukkan angka 1, yang terjadi adalah ....',
    codeSnippet: `def main():
    while True:
        show_main_menu()
        choice = input("Pilih layanan (1-5): ")

        if choice == "1":
            order_gocar()
        elif choice == "2":
            order_goride()
        elif choice == "3":
            order_gosend()
        elif choice == "4":
            order_gofood()
        elif choice == "5":
            print("Terima kasih telah menggunakan aplikasi kami. Sampai jumpa!")
            break
        else:
            print("Pilihan tidak valid. Silakan pilih kembali.")`,
    language: 'python',
    options: [
      { key: 'A', text: 'fungsi order_gocar() tetap dijalankan karena 1 dan "1" dianggap sama' },
      { key: 'B', text: 'program menampilkan "Pilihan tidak valid. Silakan pilih kembali." karena input() menghasilkan string "1" yang tidak sama dengan angka 1' },
      { key: 'C', text: 'program berhenti karena terjadi kesalahan sintaks (SyntaxError)' },
      { key: 'D', text: 'program keluar karena nilai 1 dianggap sebagai pilihan "5"' },
    ],
    correctKey: 'B',
    points: 6,
    explanation: 'Fungsi input() di Python selalu mengembalikan tipe data string (str). Maka "1" == 1 bernilai False dalam Python karena perbandingan string dengan integer tidak melakukan konversi otomatis. Akibatnya program masuk ke blok else.',
  },
  {
    id: 5,
    question: 'Perhatikan pseudocode berikut untuk menjawab soal nomor 5.\nJika pengguna memasukkan total_belanja = 100000, nilai yang ditampilkan oleh perintah PRINT bayar adalah ....',
    codeSnippet: `START
INPUT total_belanja
IF total_belanja >= 100000 THEN
    diskon = 10000
ELSE
    diskon = 0
bayar = total_belanja - diskon
PRINT bayar
END`,
    language: 'pseudocode',
    options: [
      { key: 'A', text: 'Rp100.000' },
      { key: 'B', text: 'Rp0' },
      { key: 'C', text: 'Rp10.000' },
      { key: 'D', text: 'Rp90.000' },
    ],
    correctKey: 'D',
    points: 6,
    explanation: 'total_belanja = 100000 memenuhi kondisi total_belanja >= 100000 (True), sehingga diskon = 10000. bayar = 100000 - 10000 = 90000 (Rp90.000).',
  },
  {
    id: 6,
    question: 'Perhatikan bagian program utama (MAIN PROGRAM) aplikasi pemesanan online berikut untuk menjawab soal nomor 6 dan 7.\nJika pengguna memasukkan angka 7, hal yang terjadi adalah ....',
    codeSnippet: `WHILE TRUE:
    ShowMainMenu()
    choice = INPUT "Pilih layanan (1-5):"
    IF choice == 1 THEN
        OrderGoCar()
    ELSE IF choice == 2 THEN
        OrderGoRide()
    ELSE IF choice == 3 THEN
        OrderGoSend()
    ELSE IF choice == 4 THEN
        OrderGoFood()
    ELSE IF choice == 5 THEN
        PRINT "Terima kasih telah menggunakan aplikasi kami."
        BREAK
    ELSE
        PRINT "Pilihan tidak valid. Silakan pilih kembali."`,
    language: 'pseudocode',
    options: [
      { key: 'A', text: 'menampilkan "Pilihan tidak valid. Silakan pilih kembali." lalu menu utama ditampilkan kembali' },
      { key: 'B', text: 'program berhenti dan menampilkan "Terima kasih telah menggunakan aplikasi kami."' },
      { key: 'C', text: 'fungsi OrderGoFood() dijalankan' },
      { key: 'D', text: 'program berhenti karena terjadi kesalahan (error)' },
    ],
    correctKey: 'A',
    points: 6,
    explanation: 'Nilai 7 tidak cocok dengan pilihan 1 hingga 5, sehingga bagian ELSE dieksekusi ("Pilihan tidak valid. Silakan pilih kembali."). Karena berada di dalam WHILE TRUE tanpa perintah BREAK, perulangan kembali ke atas dan memanggil ShowMainMenu() lagi.',
  },
  {
    id: 7,
    question: 'Berdasarkan kode MAIN PROGRAM di soal nomor 6, jika pengguna memasukkan angka 4 lalu angka 5 secara berurutan, yang terjadi adalah ....',
    codeSnippet: `WHILE TRUE:
    ShowMainMenu()
    choice = INPUT "Pilih layanan (1-5):"
    IF choice == 1 THEN
        OrderGoCar()
    ELSE IF choice == 2 THEN
        OrderGoRide()
    ELSE IF choice == 3 THEN
        OrderGoSend()
    ELSE IF choice == 4 THEN
        OrderGoFood()
    ELSE IF choice == 5 THEN
        PRINT "Terima kasih telah menggunakan aplikasi kami."
        BREAK
    ELSE
        PRINT "Pilihan tidak valid. Silakan pilih kembali."`,
    language: 'pseudocode',
    options: [
      { key: 'A', text: 'fungsi OrderGoSend() dijalankan, kemudian program berhenti' },
      { key: 'B', text: 'fungsi OrderGoFood() dijalankan dan program langsung berhenti' },
      { key: 'C', text: 'fungsi OrderGoFood() dijalankan, menu ditampilkan kembali, lalu program berhenti setelah angka 5 dimasukkan' },
      { key: 'D', text: 'pesan "Pilihan tidak valid" ditampilkan dua kali' },
    ],
    correctKey: 'C',
    points: 6,
    explanation: 'Input pertama (4) mengeksekusi OrderGoFood(). Perulangan berlanjut dan menu kembali ditampilkan. Input kedua (5) mencetak salam penutup dan perintah BREAK menghentikan loop.',
  },
  {
    id: 8,
    question: 'Pada pseudocode aplikasi pemesanan online, program dipecah menjadi beberapa FUNCTION, seperti ShowMainMenu(), OrderGoCar(), dan OrderGoFood(). Manfaat utama pemecahan tersebut adalah ....',
    options: [
      { key: 'A', text: 'kode program selalu menjadi lebih pendek dalam semua kasus' },
      { key: 'B', text: 'setiap bagian program lebih mudah dibaca, diuji, dan diperbaiki' },
      { key: 'C', text: 'program dapat berjalan tanpa memerlukan masukan dari pengguna' },
      { key: 'D', text: 'MAIN PROGRAM tidak lagi diperlukan' },
    ],
    correctKey: 'B',
    points: 6,
    explanation: 'Dekomposisi modular program menjadi beberapa function/fungsi membuat kode lebih terstruktur, mudah diuji (testing), dirawat (maintainability), dan diperbaiki jika terdapat kesalahan.',
  },
  {
    id: 9,
    question: 'Pada tabel penelusuran (tracing) algoritma, kolom Nilai Variabel digunakan untuk ....',
    options: [
      { key: 'A', text: 'mencatat nilai yang tersimpan dalam variabel pada setiap langkah' },
      { key: 'B', text: 'menuliskan data yang akan diproses oleh algoritma' },
      { key: 'C', text: 'menampilkan hasil akhir dari algoritma' },
      { key: 'D', text: 'memberi nama pada setiap langkah algoritma' },
    ],
    correctKey: 'A',
    points: 6,
    explanation: 'Tracing table (tabel penelusuran) mencatat jalannya eksekusi program baris demi baris, di mana kolom variabel berfungsi memantau perubahan isi/nilai variabel pada setiap langkah.',
  },
  {
    id: 10,
    question: 'Dalam tahapan pemrosesan bahasa pemrograman, tahap yang dilakukan untuk menemukan dan memperbaiki kesalahan (bug) pada program adalah ....',
    options: [
      { key: 'A', text: 'pengoptimalan' },
      { key: 'B', text: 'penyebaran (deployment)' },
      { key: 'C', text: 'kompilasi atau interpretasi' },
      { key: 'D', text: 'debugging' },
    ],
    correctKey: 'D',
    points: 6,
    explanation: 'Debugging adalah proses mengidentifikasi, menganalisis, dan memperbaiki bug atau kesalahan (kesalahan logika, runtime, maupun sintaks) dalam kode program komputer.',
  },
];

export const QUESTIONS_ESSAY: QuestionEssay[] = [
  {
    id: 1,
    question: 'Sebuah mesin pembayaran otomatis menerima dua masukan, yaitu total_pembayaran dan jumlah_uang_dibayarkan. Jika jumlah uang yang dibayarkan lebih besar atau sama dengan total pembayaran, mesin menghitung kembalian (jumlah_uang_dibayarkan dikurangi total_pembayaran) lalu menampilkannya. Jika jumlah uang yang dibayarkan kurang dari total pembayaran, mesin menampilkan teks "Uang yang dibayarkan kurang". Buatlah diagram alir (flowchart) berdasarkan deskripsi tersebut dengan menggunakan simbol yang tepat!',
    maxPoints: 8,
    keywords: ['total_pembayaran', 'jumlah_uang_dibayarkan', 'kembalian', 'kurang', 'decision', 'input', 'start', 'end'],
    sampleAnswer: `[START] (Oval / Terminator)
   ↓
[INPUT total_pembayaran, jumlah_uang_dibayarkan] (Jajar Genjang)
   ↓
< Apakah jumlah_uang_dibayarkan >= total_pembayaran? > (Belah Ketupat / Decision)
   ├─ [YA / TRUE] ──> [kembalian = jumlah_uang_dibayarkan - total_pembayaran] (Persegi Panjang)
   │                   ↓
   │                  [TAMPILKAN kembalian] (Jajar Genjang)
   │                   ↓
   └─ [TIDAK / FALSE] > [TAMPILKAN "Uang yang dibayarkan kurang"] (Jajar Genjang)
                       ↓
                    [END] (Terminator)`,
    placeholder: 'Tuliskan deskripsi langkah diagram alir (simbol dan keterangannya) atau buat representasi flowchart alur pembayaran di sini...',
    helperGuide: 'Sebutkan simbol yang digunakan: Terminator (Mulai/Selesai), Jajar Genjang (Input/Output), Belah Ketupat (Keputusan/Kondisi), dan Persegi Panjang (Proses/Perhitungan).',
  },
  {
    id: 2,
    question: 'Tuliskan pseudocode untuk program yang menentukan ketuntasan belajar siswa: program meminta masukan nilai; jika nilai minimal 75, program menampilkan "Tuntas", selain itu menampilkan "Remedial". Awali dengan START dan akhiri dengan END.',
    maxPoints: 8,
    keywords: ['start', 'input', '75', 'tuntas', 'remedial', 'if', 'else', 'end'],
    sampleAnswer: `START
    INPUT nilai
    IF nilai >= 75 THEN
        PRINT "Tuntas"
    ELSE
        PRINT "Remedial"
    END IF
END`,
    placeholder: 'START\n    INPUT nilai\n    ...\nEND',
    helperGuide: 'Pastikan diawali START, menggunakan INPUT, kondisi percabangan IF nilai >= 75, dan diakhiri END.',
  },
  {
    id: 3,
    question: 'Tulislah source code Python untuk menghitung luas lingkaran! Program meminta pengguna memasukkan jari-jari, menghitung luas dengan rumus L = π × r² (gunakan π = 3,14), lalu menampilkan hasilnya.',
    maxPoints: 8,
    keywords: ['input', 'float', '3.14', 'print', 'luas', 'r', '*'],
    sampleAnswer: `# Program Menghitung Luas Lingkaran
r = float(input("Masukkan panjang jari-jari lingkaran: "))
pi = 3.14
luas = pi * (r ** 2)
print("Luas lingkaran adalah:", luas)`,
    placeholder: '# Tuliskan kode Python di sini\nr = float(input("Masukkan jari-jari: "))\n...',
    helperGuide: 'Gunakan input() yang diubah ke tipe desimal (float/int), definisikan pi = 3.14, hitung rumus luas, dan cetak dengan print().',
  },
  {
    id: 4,
    question: 'Tuliskan pseudocode untuk menghitung luas lingkaran dengan ketentuan yang sama seperti soal nomor 3! Awali dengan START dan akhiri dengan END.',
    maxPoints: 8,
    keywords: ['start', 'input', '3.14', 'luas', 'print', 'end', 'r'],
    sampleAnswer: `START
    INPUT r
    pi = 3.14
    luas = pi * r * r
    PRINT luas
END`,
    placeholder: 'START\n    INPUT r\n    ...\nEND',
    helperGuide: 'Format pseudocode standar dengan huruf kapital: START, INPUT r, proses perhitungan luas, PRINT luas, END.',
  },
  {
    id: 5,
    question: 'Perhatikan kembali diagram alir pada soal nomor 2. Tuliskan pseudocode yang setara dengan diagram alir tersebut! Awali dengan START dan akhiri dengan END.',
    maxPoints: 8,
    keywords: ['start', 'input', 'bil1', 'bil2', 'bil3', 'max', 'if', 'print', 'end'],
    sampleAnswer: `START
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
    placeholder: 'START\n    INPUT bil1, bil2, bil3\n    ...\nEND',
    helperGuide: 'Pseudocode untuk mencari bilangan terbesar dari 3 angka (bil1, bil2, bil3) menggunakan variabel pembantu "max" dan percabangan IF.',
  },
];

// Helper auto-grader for essay answers
export function autoGradeEssay(questionId: number, answerText: string): { score: number; feedback: string } {
  if (!answerText || answerText.trim().length === 0) {
    return { score: 0, feedback: 'Belum dijawab.' };
  }

  const q = QUESTIONS_ESSAY.find((item) => item.id === questionId);
  if (!q) return { score: 0, feedback: '' };

  const lower = answerText.toLowerCase();
  let matches = 0;
  for (const kw of q.keywords) {
    if (lower.includes(kw.toLowerCase())) {
      matches++;
    }
  }

  const ratio = matches / q.keywords.length;
  let score = Math.round(ratio * q.maxPoints);

  // Minimum partial score if student wrote substantive code/answer
  if (answerText.trim().length > 30 && score < 4) {
    score = Math.max(score, 4);
  }

  if (score > q.maxPoints) score = q.maxPoints;

  return {
    score,
    feedback: `Analisis otomatis kecocokan konsep (${matches}/${q.keywords.length} kata kunci teridentifikasi). Guru dapat mengubah nilai ini secara manual.`,
  };
}
