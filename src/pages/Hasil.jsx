import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  AlertTriangle,
  AlertCircle,
  Info,
  Star,
  RotateCcw,
  Home,
} from "lucide-react";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";

// Konfigurasi tampilan per urgensi
const URGENSI_CFG = {
  apresiasi: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    badge: "bg-yellow-100 text-yellow-800",
    icon: Trophy,
    iconColor: "text-yellow-500",
    label: "Apresiasi Positif",
  },
  positif: {
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
    icon: Star,
    iconColor: "text-primary-600",
    label: "Positif",
  },
  sedang: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    icon: Info,
    iconColor: "text-orange-500",
    label: "Perlu Perhatian",
  },
  tinggi: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    label: "Urgensi Tinggi",
  },
  kritis: {
    bg: "bg-red-100",
    border: "border-red-400",
    badge: "bg-red-600 text-white",
    icon: AlertCircle,
    iconColor: "text-red-600",
    label: "⚠ KRITIS",
  },
};

// Hitung skor dari jawaban (berapa % yang Ya)
function hitungSkor(jawaban) {
  const entries = Object.values(jawaban);
  if (!entries.length) return 0;
  const ya = entries.filter(Boolean).length;
  return Math.round((ya / entries.length) * 100);
}

// Warna ring skor
function skorWarna(skor) {
  if (skor >= 80) return "#176236";
  if (skor >= 60) return "#f59e0b";
  return "#ef4444";
}

export default function Hasil() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Guard: kalau user langsung buka URL tanpa lewat kuesioner
  if (!state?.hasil) {
    navigate("/konsultasi");
    return null;
  }

  const { hasil, jawaban } = state;
  const skor = hitungSkor(jawaban);
  const profilUtama = hasil[0];
  const cfg = URGENSI_CFG[profilUtama.urgensi] || URGENSI_CFG.sedang;
  const IconUtama = cfg.icon;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white">
        <StatusBar />
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
          <button onClick={() => navigate("/konsultasi")} className="text-primary-700">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-primary-700 flex-1">Hasil Evaluasi</h1>
        </div>
      </div>

      <div className="screen-scroll px-5 pb-8">
        {/* Skor ringkas */}
        <div className="bg-primary-700 rounded-2xl mx-0 mt-5 px-6 py-6 flex items-center gap-5 shadow-card fade-in">
          <div className="relative w-20 h-20 shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke={skor >= 80 ? "#86efac" : skor >= 60 ? "#fcd34d" : "#fca5a5"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - skor / 100)}`}
                transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-lg">
              {skor}%
            </span>
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-xs">Skor Perilaku Akademik</p>
            <p className="text-white font-bold text-lg leading-tight mt-0.5">
              {skor >= 80 ? "Sangat Baik 🎉" : skor >= 60 ? "Cukup Baik 👍" : "Perlu Ditingkatkan 💪"}
            </p>
            <p className="text-primary-100 text-xs mt-1">
              Berdasarkan {Object.keys(jawaban).length} kriteria evaluasi
            </p>
          </div>
        </div>

        {/* Profil utama */}
        <h2 className="font-bold text-gray-700 text-sm mt-6 mb-3">Profil Kesimpulan</h2>

        {hasil.map((profil, i) => {
          const c = URGENSI_CFG[profil.urgensi] || URGENSI_CFG.sedang;
          const Icon = c.icon;
          return (
            <div
              key={profil.kode}
              className={`rounded-2xl border px-5 py-4 mb-3 ${c.bg} ${c.border} fade-in`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${c.iconColor}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900">{profil.nama}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                      {c.label}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-auto">{profil.kode}</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-2 leading-relaxed">{profil.rekomendasi}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Ringkasan jawaban */}
        <h2 className="font-bold text-gray-700 text-sm mt-5 mb-3">Ringkasan Jawaban</h2>
        <div className="bg-white rounded-2xl shadow-soft px-5 py-4">
          <div className="flex gap-6 justify-center mb-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-primary-600">
                {Object.values(jawaban).filter(Boolean).length}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Ya / Terpenuhi</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-red-500">
                {Object.values(jawaban).filter((v) => !v).length}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Tidak / Belum</p>
            </div>
          </div>

          {/* Grid kriteria */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(jawaban).map(([k, v]) => (
              <span
                key={k}
                className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${
                  v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Aksi */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/kuesioner")}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-primary-600 text-primary-600 font-semibold text-sm active:scale-95 transition-transform"
          >
            <RotateCcw size={16} />
            Ulangi
          </button>
          <button
            onClick={() => navigate("/beranda")}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold active:scale-95 transition-transform"
          >
            <Home size={16} />
            Beranda
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-5 leading-relaxed">
          Hasil ini dihasilkan oleh mesin inferensi Forward Chaining berbasis basis pengetahuan v2.
          Konsultasikan hasil ini dengan dosen PA atau konselor kampus untuk tindak lanjut.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
