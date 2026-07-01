import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import StatusBar from "../components/StatusBar";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-primary-700">
      <StatusBar dark />

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-white text-4xl font-extrabold tracking-tight">ScholarSense</h1>
        <p className="text-primary-100 text-sm mt-2">Konsultasi Perilaku Akademik Online</p>

        <div className="flex items-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="w-6 h-2 rounded-full bg-white" />
        </div>
      </div>

      <div className="relative bg-white rounded-t-[36px] px-8 pt-10 pb-12 text-center overflow-hidden">
        <svg
          className="absolute -bottom-2 -left-2 opacity-90"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
        >
          <path
            d="M0 120C20 90 10 60 30 40C50 20 80 30 90 10"
            stroke="#1F7A40"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.15"
          />
          <circle cx="18" cy="100" r="10" fill="#2F8F52" opacity="0.5" />
          <circle cx="40" cy="112" r="6" fill="#1F7A40" opacity="0.4" />
        </svg>

        <h2 className="text-lg font-bold text-gray-900 leading-snug relative z-10">
          Mulai Perjalanan
          <br />
          Akademik yang lebih baik
          <br />
          bersama <span className="text-primary-600">ScholarSense</span>
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="btn-primary w-full mt-8 py-4 flex items-center justify-center gap-2 relative z-10"
        >
          Mulai Sekarang
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
}
