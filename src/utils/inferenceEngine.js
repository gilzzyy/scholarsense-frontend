/**
 * =============================================================================
 * MOCK FORWARD CHAINING INFERENCE ENGINE
 * =============================================================================
 * File ini menyimulasikan mesin inferensi Forward Chaining di sisi frontend
 * untuk keperluan demo sebelum backend siap.
 *
 * SAAT BACKEND SUDAH SIAP → hapus fungsi runInference() di bawah dan ganti
 * pemanggilan di Kuesioner.jsx dengan:
 *
 *   const res = await fetch('/api/konsultasi', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ facts }),
 *   });
 *   const hasil = await res.json(); // { profiles, rekomendasi }
 *
 * Payload fakta yang dikirim:
 *   { K1: true, K2: false, K3: true, ... K24: true }
 *
 * Backend menjalankan rule base R1–R12 (sesuai Basis Pengetahuan v2) dan
 * mengembalikan array profil aktif beserta rekomendasi.
 * =============================================================================
 */

// --------------------------------------------------------------------------
// 15 PERTANYAAN FINAL
// Setiap pertanyaan meng-set satu atau lebih kriteria (K) sekaligus.
// --------------------------------------------------------------------------
export const PERTANYAAN = [
  {
    no: 1,
    kriteria: ["K1", "K2"],
    teks: "Apakah kamu selalu hadir di kelas dan masuk tepat waktu (toleransi terlambat maksimal 15 menit)?",
  },
  {
    no: 2,
    kriteria: ["K3", "K4"],
    teks: "Apakah kamu selalu mengumpulkan tugas kuliah tepat waktu dan isinya sudah sesuai dengan petunjuk dosen?",
  },
  {
    no: 3,
    kriteria: ["K5"],
    teks: "Apakah kamu aktif bertanya, memberikan tanggapan, atau berdiskusi saat sesi perkuliahan berlangsung?",
  },
  {
    no: 4,
    kriteria: ["K6", "K7"],
    teks: "Apakah kamu selalu menjaga sopan santun saat berbicara dengan dosen dan menghargai sesama teman kuliah?",
  },
  {
    no: 5,
    kriteria: ["K8"],
    teks: "Apakah kamu bisa menahan diri untuk tidak bermain HP atau membuka hal non-akademik saat dosen sedang mengajar?",
  },
  {
    no: 6,
    kriteria: ["K9"],
    teks: "Apakah pakaian yang kamu kenakan saat ke kampus selalu rapi dan mematuhi aturan standar berpakaian di kampus?",
  },
  {
    no: 7,
    kriteria: ["K10", "K16"],
    teks: "Apakah kamu aktif meluangkan waktu untuk ikut organisasi, UKM, atau kegiatan sosial (seperti Baznas/Lazisnu) di kampus?",
  },
  {
    no: 8,
    kriteria: ["K11"],
    teks: "Saat kerja kelompok, apakah kamu selalu ikut mengerjakan bagian tugasmu dan hadir saat diajak kumpul tim?",
  },
  {
    no: 9,
    kriteria: ["K12", "K13"],
    teks: "Apakah kamu selalu mengerjakan tugas dan ujian secara jujur tanpa mencontek atau melakukan plagiarisme?",
  },
  {
    no: 10,
    kriteria: ["K14", "K19"],
    teks: "Apakah kamu punya kebiasaan belajar yang teratur dan suka membaca materi kuliah sebelum kelas dimulai?",
  },
  {
    no: 11,
    kriteria: ["K15", "K22"],
    teks: "Apakah kamu selalu merawat fasilitas kampus dengan baik dan patuh pada seluruh aturan tata tertib yang berlaku?",
  },
  {
    no: 12,
    kriteria: ["K17"],
    teks: "Apakah kamu merasa mampu mengatur waktu dengan baik antara tugas kuliah, organisasi, dan urusan pribadi?",
  },
  {
    no: 13,
    kriteria: ["K18", "K23"],
    teks: "Apakah kamu bisa menerima masukan/kritik dengan lapang dada dan menghargai perbedaan pendapat di kampus?",
  },
  {
    no: 14,
    kriteria: ["K20"],
    teks: "Apakah kamu merasa nyaman dan mampu beradaptasi dengan baik di lingkungan pertemanan dan iklim kampus saat ini?",
  },
  {
    no: 15,
    kriteria: ["K21", "K24"],
    teks: "Apakah kamu bijak bersosial media dan memiliki komitmen kuat untuk menyelesaikan kuliahmu hingga lulus nanti?",
  },
];

// --------------------------------------------------------------------------
// PROFIL KESIMPULAN (P1–P10)
// --------------------------------------------------------------------------
export const PROFIL = {
  P1:  { kode: "P1",  nama: "Disiplin Waktu",                       urgensi: "positif",  warna: "green" },
  P2:  { kode: "P2",  nama: "Berintegritas",                         urgensi: "positif",  warna: "green" },
  P3:  { kode: "P3",  nama: "Komunikatif & Kooperatif",              urgensi: "positif",  warna: "green" },
  P4:  { kode: "P4",  nama: "Mandiri & Aktif Berorganisasi",         urgensi: "positif",  warna: "green" },
  P5:  { kode: "P5",  nama: "Berpotensi Bermasalah",                 urgensi: "sedang",   warna: "yellow" },
  P6:  { kode: "P6",  nama: "Sibuk Organisasi (Akademik Terganggu)", urgensi: "sedang",   warna: "yellow" },
  P7:  { kode: "P7",  nama: "Riwayat Pelanggaran",                   urgensi: "tinggi",   warna: "red" },
  P8:  { kode: "P8",  nama: "Kendala Penyesuaian Studi",             urgensi: "sedang",   warna: "yellow" },
  P9:  { kode: "P9",  nama: "Risiko Tinggi Dropout",                 urgensi: "kritis",   warna: "red" },
  P10: { kode: "P10", nama: "Mahasiswa Berkarakter Unggul",          urgensi: "apresiasi",warna: "green" },
};

// --------------------------------------------------------------------------
// REKOMENDASI per profil
// --------------------------------------------------------------------------
export const REKOMENDASI = {
  P1:  "Pertahankan konsistensimu! Kamu sudah memiliki manajemen waktu yang sangat baik. Gunakan kemampuan ini untuk mulai mencicil persiapan karier, magang, atau proyek akademis yang lebih besar. Jangan ragu untuk berbagi tips produktivitas dengan teman sekelasmu.",
  P2:  "Luar biasa! Karakter jujur dan patuh aturan adalah aset terbesar dalam dunia profesional. Teruskan sikap amanah ini dalam setiap tugas dan ujian. Kamu sangat cocok untuk direkomendasikan menjadi pemimpin kelompok, asisten dosen, atau posisi krusial di organisasi.",
  P3:  "Kemampuan sosialmu sangat bagus! Kamu adalah aset berharga dalam tim kerja kelompok. Pertahankan etika komunikasimu yang sopan. Cobalah mulai mengambil peran sebagai ketua tim atau moderator dalam diskusi untuk lebih mengasah jiwa kepemimpinanmu.",
  P4:  "Kamu hebat bisa menyeimbangkan organisasi dan belajar mandiri! Tetap pantau energi dan kesehatanmu agar tidak mengalami burnout. Pastikan jadwal rapat organisasi tidak bertabrakan dengan waktu belajar mandiri yang sudah kamu agendakan.",
  P5:  "Peringatan awal untukmu. Yuk, mulai kurangi kebiasaan menunda tugas dan mulailah datang lebih awal ke kelas. Jika kamu merasa terganggu oleh handphone/gadget saat kuliah, cobalah masukkan gadget ke dalam tas selama dosen mengajar agar kamu bisa kembali fokus.",
  P6:  "Organisasi itu baik, tetapi kuliah tetap yang utama. Kamu perlu mengevaluasi kembali prioritasmu. Mulailah membuat skala prioritas harian, delegasikan tugas organisasi jika beban terlalu berat, dan komunikasikan dengan dosen jika ada tugas kuliah yang tertinggal.",
  P7:  "Tindakan segera diperlukan. Segera temui dosen pembimbing akademik (PA) atau bagian kemahasiswaan untuk mengonsultasikan masalah etika atau ketidakjujuran yang sempat terjadi. Lakukan pemulihan nama baik dengan berkomitmen penuh mematuhi aturan kampus mulai hari ini.",
  P8:  "Kamu tidak sendirian. Jika kamu merasa jenuh, stres, atau sulit beradaptasi dengan lingkungan kampus, jangan ragu untuk bercerita kepada dosen pembimbing akademik (PA), sahabat, atau manfaatkan layanan konseling kampus. Mulailah bergabung dengan kelompok belajar kecil yang suportif.",
  P9:  "Kondisi kritis! Kamu sangat disarankan untuk segera menghadap dosen pembimbing akademik (PA) atau Kepala Program Studi dalam minggu ini. Diskusikan kelanjutan studimu, cari solusi bersama terkait masalah kehadiran, dan urus administrasi resmi jika memang ada kendala yang mendesak.",
  P10: "Selamat! Kamu adalah representasi mahasiswa ideal di kampus. Pertahankan performa luar biasa ini. Kamu sangat direkomendasikan untuk mengikuti seleksi Mahasiswa Berprestasi (Mapres), mengajukan beasiswa unggulan, atau mengajukan diri dalam kompetisi ilmiah mewakili kampus.",
};

// --------------------------------------------------------------------------
// MESIN INFERENSI FORWARD CHAINING (R1–R12)
// Input : facts = { K1: true, K2: false, ..., K24: true }
// Output: array profil aktif, masing-masing berisi { ...PROFIL[Px], rekomendasi }
// --------------------------------------------------------------------------
export function runInference(facts) {
  const K  = (k) => facts[k] === true;
  const NK = (k) => facts[k] === false;

  const derived = {};

  // R1 – Disiplin Waktu
  if (K("K1") && K("K2") && K("K3") && K("K17"))
    derived.P1 = true;

  // R2 – Berintegritas
  if (K("K9") && K("K12") && K("K13") && K("K22"))
    derived.P2 = true;

  // R3 – Komunikatif & Kooperatif
  if (K("K5") && K("K6") && K("K11") && K("K18"))
    derived.P3 = true;

  // R4 – Mandiri & Aktif Berorganisasi
  if (K("K10") && K("K14") && K("K19"))
    derived.P4 = true;

  // R5 – Berpotensi Bermasalah (via absensi + keterlambatan + tugas)
  if (NK("K1") && NK("K2") && NK("K3"))
    derived.P5 = true;

  // R6 – Berpotensi Bermasalah (via gadget + kualitas tugas)
  if (NK("K8") && NK("K4"))
    derived.P5 = true;

  // R7 – Sibuk Organisasi – Akademik Terganggu
  if (K("K10") && (NK("K1") || NK("K3")))
    derived.P6 = true;

  // R8 – Riwayat Pelanggaran Akademik
  if (NK("K12") || NK("K22"))
    derived.P7 = true;

  // R9 – Riwayat Pelanggaran Sosial
  if (NK("K7") || NK("K21"))
    derived.P7 = true;

  // R10 – Kendala Penyesuaian Studi
  if (NK("K18") && NK("K19") && NK("K20"))
    derived.P8 = true;

  // R11 – Risiko Tinggi Dropout
  if (NK("K1") && NK("K24"))
    derived.P9 = true;

  // R12 – Mahasiswa Berkarakter Unggul (chaining dari profil lain)
  if (derived.P1 && derived.P2 && derived.P3)
    derived.P10 = true;

  // Susun hasil akhir dengan prioritas urgensi
  const prioritasUrutan = ["P10", "P9", "P7", "P1", "P2", "P3", "P4", "P5", "P6", "P8"];
  const hasil = prioritasUrutan
    .filter((kode) => derived[kode])
    .map((kode) => ({
      ...PROFIL[kode],
      rekomendasi: REKOMENDASI[kode],
    }));

  // Fallback: jika tidak ada profil yang terpicu (sangat jarang secara logika)
  if (hasil.length === 0) {
    hasil.push({
      ...PROFIL.P8,
      rekomendasi: REKOMENDASI.P8,
    });
  }

  return hasil;
}

// --------------------------------------------------------------------------
// TIPS AKSI per profil (3 bullet point untuk halaman Hasil Analisis)
// --------------------------------------------------------------------------
export const TIPS = {
  P1: [
    "Alokasikan 2 jam di pagi hari untuk tugas dengan tingkat kognitif tertinggi sebelum distraksi muncul.",
    "Gunakan teknik Pomodoro (50/10) untuk menjaga fokus jangka panjang tanpa kelelahan mental.",
    "Review jadwal mingguan setiap hari Minggu malam untuk memvisualisasikan beban kerja mendatang.",
  ],
  P2: [
    "Jadikan kejujuran akademik sebagai identitas diri, bukan sekadar kewajiban peraturan kampus.",
    "Beranikan diri untuk menegur dengan santun jika melihat pelanggaran integritas di sekitarmu.",
    "Dokumentasikan setiap pencapaian akademis dengan jujur sebagai portofolio masa depan.",
  ],
  P3: [
    "Latih kemampuan public speaking dengan bergabung di komunitas debat atau diskusi ilmiah kampus.",
    "Jadilah pendengar aktif: catat poin penting saat diskusi kelompok agar kontribusimu lebih terarah.",
    "Bangun jaringan pertemanan lintas jurusan untuk memperluas wawasan dan kolaborasi akademis.",
  ],
  P4: [
    "Buat kalender gabungan antara jadwal kuliah dan kegiatan organisasi agar tidak saling bertabrakan.",
    "Delegasikan tugas organisasi kepada anggota lain saat beban akademis sedang tinggi.",
    "Manfaatkan pengalaman organisasimu sebagai bahan cerita di CV dan sesi wawancara kerja.",
  ],
  P5: [
    "Mulai hari dengan menetapkan 3 prioritas utama sebelum membuka media sosial atau handphone.",
    "Pasang handphone dalam mode senyap dan simpan di dalam tas selama sesi perkuliahan berlangsung.",
    "Temukan 'partner belajar' yang disiplin untuk saling mengingatkan dan menjaga produktivitas.",
  ],
  P6: [
    "Buat kesepakatan dengan pengurus organisasi tentang batas maksimal jam rapat di hari kuliah.",
    "Komunikasikan kendala tugasmu kepada dosen lebih awal, jangan tunggu deadline terlewat.",
    "Evaluasi kembali apakah semua posisi organisasi yang kamu emban benar-benar memberikan manfaat.",
  ],
  P7: [
    "Temui dosen pembimbing akademik (PA) minggu ini untuk mendiskusikan langkah pemulihan reputasi.",
    "Buat komitmen tertulis kepada dirimu sendiri untuk mematuhi seluruh aturan akademik kampus.",
    "Jadikan pengalaman ini sebagai titik balik: mulailah membangun rekam jejak positif dari sekarang.",
  ],
  P8: [
    "Bergabunglah dengan kelompok belajar kecil (3–5 orang) untuk mengurangi rasa jenuh belajar sendiri.",
    "Manfaatkan layanan konseling atau psikolog kampus — itu hakmu sebagai mahasiswa, bukan kelemahan.",
    "Cari satu aktivitas non-akademis yang kamu sukai untuk menjaga keseimbangan mental dan emosi.",
  ],
  P9: [
    "Segera jadwalkan pertemuan dengan dosen PA atau Kaprodi dalam minggu ini tanpa penundaan.",
    "Identifikasi satu hambatan terbesar dalam studimu dan fokus selesaikan satu per satu.",
    "Ingat alasan awalmu masuk kuliah dan tuliskan kembali tujuan yang ingin kamu capai setelah lulus.",
  ],
  P10: [
    "Jadilah mentor bagi adik tingkat atau mahasiswa baru yang membutuhkan bimbingan akademis.",
    "Daftarkan diri ke kompetisi ilmiah, beasiswa unggulan, atau program pertukaran mahasiswa.",
    "Dokumentasikan perjalanan akademismu sebagai inspirasi dan bangun personal branding yang kuat.",
  ],
};