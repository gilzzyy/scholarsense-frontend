import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Bot } from "lucide-react";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";
import { TIPS } from "../utils/inferenceEngine";

function hitungSkor(jawaban) {
  const entries = Object.values(jawaban);
  if (!entries.length) return 0;
  return Math.round((entries.filter(Boolean).length / entries.length) * 100);
}

function skorLabel(skor) {
  if (skor >= 85) return "SANGAT BAIK";
  if (skor >= 70) return "BAIK";
  if (skor >= 55) return "CUKUP";
  return "PERLU PERHATIAN";
}

function skorWarna(skor) {
  if (skor >= 70) return "#176236";
  if (skor >= 55) return "#f59e0b";
  return "#ef4444";
}

// Deskripsi singkat per profil untuk ditampilkan di bawah nama profil
const DESKRIPSI = {
  P1:  "Kemampuan Anda dalam mengelola prioritas akademik berada di atas rata-rata kelompok studi.",
  P2:  "Anda menunjukkan integritas tinggi dalam seluruh aspek kehidupan akademik di kampus.",
  P3:  "Kemampuan berkomunikasi dan bekerja sama Anda menjadi aset berharga dalam tim.",
  P4:  "Anda berhasil menyeimbangkan kemandirian belajar dengan keaktifan berorganisasi.",
  P5:  "Terdapat beberapa aspek perilaku akademik yang perlu mendapat perhatian segera.",
  P6:  "Keaktifan organisasi Anda berpotensi mengganggu performa akademik jika tidak dikelola.",
  P7:  "Tercatat adanya riwayat pelanggaran yang perlu diselesaikan bersama pihak kampus.",
  P8:  "Anda sedang mengalami kendala penyesuaian yang memerlukan dukungan dari lingkungan kampus.",
  P9:  "Kondisi studi Anda saat ini memerlukan intervensi segera dari pihak akademik.",
  P10: "Anda adalah representasi mahasiswa berkarakter unggul yang dibanggakan kampus.",
};

export default function Hasil() {
  const navigate  = useNavigate();
  const { state } = useLocation();

  if (!state?.hasil) {
    navigate("/konsultasi");
    return null;
  }

  const { hasil, jawaban } = state;
  const skor        = hitungSkor(jawaban);
  const profilUtama = hasil[0];
  const warna       = skorWarna(skor);
  const tips        = TIPS[profilUtama.kode] || TIPS.P8;

  // SVG ring
  const R          = 72;
  const keliling   = 2 * Math.PI * R;
  const dashOffset = keliling * (1 - skor / 100);

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <button onClick={() => navigate("/konsultasi")} className="text-primary-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-primary-700">Hasil Analisis</h1>
      </div>

      <div className="screen-scroll px-5 pb-6">
        {/* Lingkaran skor */}
        <div className="flex justify-center mt-7 mb-5">
          <div className="relative w-44 h-44">
            <svg width="176" height="176" viewBox="0 0 176 176">
              {/* Track */}
              <circle cx="88" cy="88" r={R} fill="none" stroke="#e5e7eb" strokeWidth="14" />
              {/* Progress */}
              <circle
                cx="88" cy="88" r={R}
                fill="none"
                stroke={warna}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={keliling}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 88 88)"
                style={{ transition: "stroke-dashoffset 1.2s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold" style={{ color: warna }}>{skor}%</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 mt-0.5">
                {skorLabel(skor)}
              </span>
            </div>
          </div>
        </div>

        {/* Profil utama */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {profilUtama.kode.replace("P", "P0").replace("P010", "P10")} – {profilUtama.nama}
          </h2>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed px-4">
            {DESKRIPSI[profilUtama.kode]}
          </p>
        </div>

        {/* Kartu rekomendasi */}
        <div className="border border-primary-200 rounded-2xl px-5 py-5 mb-5 bg-white shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
              <Bot size={17} />
            </div>
            <span className="font-bold text-primary-700 text-base">Rekomendasi Tindakan</span>
          </div>

          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2
                  size={18}
                  className="shrink-0 mt-0.5"
                  style={{ color: warna }}
                />
                <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profil tambahan (jika ada lebih dari 1) */}
        {hasil.length > 1 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Profil Lain yang Terdeteksi
            </p>
            <div className="flex flex-wrap gap-2">
              {hasil.slice(1).map((p) => (
                <span
                  key={p.kode}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200"
                >
                  {p.kode} · {p.nama}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA bottom */}
      <div className="px-5 pb-3">
        <button
          onClick={() => navigate("/beranda")}
          className="btn-primary w-full py-4 flex items-center justify-between px-6 rounded-2xl"
        >
          <div className="text-left">
            <p className="font-bold text-sm">Mulai Konsultasi Interaktif</p>
            <p className="text-white/70 text-xs">bersama Sentinel-Bot AI</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot size={18} />
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}