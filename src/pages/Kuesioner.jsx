import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, CheckCircle2 } from "lucide-react";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";
import { PERTANYAAN, runInference } from "../utils/inferenceEngine";

export default function Kuesioner() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);        // pertanyaan yang sedang aktif (0-based)
  const [jawaban, setJawaban] = useState({});    // { "K1": true, "K2": true, ... }
  const [anim, setAnim] = useState("in");        // animasi transisi kartu

  const total = PERTANYAAN.length;
  const soal = PERTANYAAN[index];
  const progress = ((index) / total) * 100;

  const jawab = (nilai) => {
    // Simpan semua kriteria dari pertanyaan ini sekaligus
    const faktaBaru = { ...jawaban };
    soal.kriteria.forEach((k) => {
      faktaBaru[k] = nilai;
    });
    setJawaban(faktaBaru);

    if (index < total - 1) {
      // Animasi: slide out ke kiri → slide in dari kanan
      setAnim("out");
      setTimeout(() => {
        setIndex((i) => i + 1);
        setAnim("in");
      }, 220);
    } else {
      // Pertanyaan terakhir → jalankan inferensi → navigasi ke hasil
      // TODO (integrasi): ganti runInference() dengan POST ke /api/konsultasi
      // Lihat komentar di inferenceEngine.js untuk detail payload & response.
      const hasil = runInference(faktaBaru);
      navigate("/processing", { state: { hasil, jawaban: faktaBaru } });
    }
  };

  const kembali = () => {
    if (index === 0) {
      navigate("/konsultasi");
    } else {
      setAnim("out");
      setTimeout(() => {
        setIndex((i) => i - 1);
        setAnim("in");
      }, 180);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white">
        <StatusBar />
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
          <button onClick={kembali} className="text-primary-700">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-primary-700 flex-1">Konsultasi</h1>
        </div>
      </div>

      <div className="screen-scroll flex flex-col px-5 pt-6 pb-8">
        {/* Progress bar */}
        <div className="mb-1">
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress + (1 / total) * 100}%` }}
            />
          </div>
          <p className="text-center text-xs text-gray-400 mt-2 font-medium">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        {/* Kartu pertanyaan */}
        <div
          key={index}
          className={`mt-6 bg-white rounded-2xl shadow-card px-6 py-10 flex items-center justify-center min-h-[200px] transition-all duration-200
            ${anim === "in" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
          style={{
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          <p className="text-gray-900 text-[17px] font-semibold text-center leading-relaxed">
            {soal.teks}
          </p>
        </div>

        {/* Tombol jawaban */}
        <div className="flex gap-3 mt-10">
          <button
            onClick={() => jawab(false)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500 active:bg-red-600 text-white font-bold text-base shadow-sm active:scale-95 transition-all"
          >
            <X size={20} strokeWidth={2.5} />
            TIDAK
          </button>

          <button
            onClick={() => jawab(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary-700 active:bg-primary-800 text-white font-bold text-base shadow-sm active:scale-95 transition-all"
          >
            <CheckCircle2 size={20} strokeWidth={2.5} />
            YA
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
          Jawablah dengan jujur untuk hasil refleksi yang akurat
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
