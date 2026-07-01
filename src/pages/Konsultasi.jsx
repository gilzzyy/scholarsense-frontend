import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Timer, Play } from "lucide-react";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";
import StudentIllustration from "../assets/StudentIllustration";

export default function Konsultasi() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />

      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <button onClick={() => navigate("/beranda")} className="text-primary-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-primary-700">Konsultasi</h1>
      </div>

      <div className="screen-scroll px-7 pb-8 flex flex-col items-center text-center">
        <div className="mt-6">
          <StudentIllustration size={210} />
        </div>

        <h2 className="font-extrabold text-gray-900 text-xl mt-2">ScholarSense</h2>

        <p className="text-primary-600 font-semibold mt-6">Pahami Potensimu</p>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Langkah awal untuk pertumbuhan akademik yang bermakna dimulai dari kejujuran pada diri sendiri
        </p>

        <div className="flex gap-3 w-full mt-7">
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-5 flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
              <HelpCircle size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-900">15 Pertanyaan</span>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-5 flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
              <Timer size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-900">3 Menit</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/kuesioner")}
          className="btn-primary w-full py-4 mt-7 flex items-center justify-center gap-2"
        >
          Mulai Evaluasi
          <Play size={14} fill="white" />
        </button>

        <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
          Jawablah setiap pertanyaan sejujur mungkin. Hasil evaluasi akan diproses menggunakan mesin
          inferensi Forward Chaining.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
