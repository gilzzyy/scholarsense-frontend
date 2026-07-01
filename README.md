# ScholarSense — Frontend (React + Vite)

Frontend untuk **Sistem Pakar Konsultasi Perilaku Mahasiswa (ScholarSense)** — Tugas Mobile Programming.
Bagian ini mencakup scope yang ditugaskan: **Splash → Registrasi → Login → Beranda → Konsultasi (intro)**.

## Cara menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Tampilan otomatis dibungkus dalam frame mirip HP (390x844) agar mudah didemo di browser maupun laptop.

## Struktur folder

```
src/
  pages/
    Splash.jsx          -> halaman awal (Gambar_Awal.png)
    Register.jsx         -> Buat Akun (Registrasi.png) - F-02
    Login.jsx             -> Masuk (Login.png) - F-01
    Dashboard.jsx          -> Beranda (branda.png) - F-03, F-04
    Konsultasi.jsx          -> intro konsultasi (konsultasi.png) - awal F-05
    Placeholder.jsx          -> halaman di luar scope (Kuesioner, Riwayat, Profil) dikerjakan rekan tim
  components/
    BottomNav.jsx          -> navigasi bawah (Beranda/Konsultasi/Riwayat/Profil)
    StatusBar.jsx            -> status bar HP palsu (jam, sinyal, baterai)
  assets/
    StudentIllustration.jsx   -> ilustrasi karakter (SVG orisinal, terinspirasi gaya desain kamu)
  context/
    AuthContext.jsx            -> state login/registrasi sisi frontend (lihat catatan integrasi di bawah)
```

## Catatan integrasi ke backend (sesuai BRD)

Saat ini auth disimulasikan di `AuthContext.jsx` supaya alur bisa di-demo tanpa backend.
Tinggal ganti fungsi `login()` dan `register()` di file itu dengan pemanggilan REST API asli:

- `POST /api/auth/register` -> F-02 (Nama Lengkap, NIM, Email, Password)
- `POST /api/auth/login` -> F-01 (NIM/Email + Password, simpan JWT token)

Tempat lain yang butuh integrasi nanti (di luar scope kamu, tapi FYI):
- `/kuesioner` -> form 15 kriteria + submit ke mesin Forward Chaining (Modul 3, dipegang rekan tim)
- `/riwayat`, `/profil` -> Modul 5 & 6

## Catatan desain

- Warna utama hijau (`primary-600 #176236`) mengikuti seluruh desain (Splash, Beranda, Konsultasi).
- Halaman Konsultasi memakai **15 pertanyaan** (mengikuti dokumen Fitur ScholarSense F-05), bukan 16 seperti di mockup awal -- sesuaikan lagi kalau dokumen fitur direvisi.
- Ilustrasi karakter dibuat ulang sebagai SVG orisinal (bukan reproduksi gambar asli) supaya bebas dipakai/dimodifikasi.
