import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Database, LayoutGrid, BarChart2, Minus } from "lucide-react";
import BottomNav from "../components/BottomNav";

const STEPS = [
  { icon: CheckCircle2, label: "Mengumpulkan data kriteria..." },
  { icon: LayoutGrid,   label: "Mencocokkan fakta dengan aturan pakar..." },
  { icon: BarChart2,    label: "Menghitung persentase peluang profil..." },
];

export default function Processing() {
  const navigate   = useNavigate();
  const { state }  = useLocation();
  const [step, setStep] = useState(0); // berapa step yang sudah "done"

  useEffect(() => {
    // Guard: kalau tidak ada state (langsung buka URL), kembalikan ke konsultasi
    if (!state?.hasil) {
      navigate("/konsultasi");
      return;
    }

    // Animasi step 1 → step 2 → step 3, lalu navigasi ke hasil
    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => setStep(3), 2300);
    const t4 = setTimeout(() => {
      navigate("/hasil", { state });
    }, 3000);

    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="bg-gray-100 px-5 pt-10 pb-2 flex items-center justify-between">
        <span className="font-extrabold text-gray-900 text-lg">ScholarSense</span>
        <button className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-gray-500">
          <span className="text-lg leading-none font-bold">⋮</span>
        </button>
      </div>

      <div className="screen-scroll flex flex-col items-center px-6 pt-10 pb-8">
        {/* Animated spinner ring + database icon */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-cyan-100 opacity-60" />

          {/* Spinning arc */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 192 192"
            style={{ animation: "spin 2s linear infinite" }}
          >
            <style>{`@keyframes spin { to { transform: rotate(360deg); transform-origin: center; } }`}</style>
            <circle
              cx="96" cy="96" r="82"
              fill="none"
              stroke="#0d9488"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="160 360"
            />
            {/* dot at tip */}
            <circle cx="96" cy="14" r="5" fill="#0d9488" />
          </svg>

          {/* Inner white circle */}
          <div className="w-36 h-36 rounded-full bg-white shadow-card flex items-center justify-center z-10">
            <Database size={52} className="text-teal-700" strokeWidth={1.5} />
          </div>

          {/* Bottom dot */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-500 z-10" />
        </div>

        <h1 className="text-xl font-extrabold text-gray-900 mb-6">Menganalisis Data...</h1>

        {/* Step card */}
        <div className="w-full bg-white rounded-2xl shadow-soft px-5 py-5 space-y-4">
          {STEPS.map(({ icon: Icon, label }, i) => {
            const done    = i < step;
            const active  = i === step;
            const pending = i > step;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                  ${done    ? "bg-teal-100 text-teal-600"  : ""}
                  ${active  ? "bg-teal-50  text-teal-400"  : ""}
                  ${pending ? "bg-gray-100 text-gray-400"  : ""}
                `}>
                  <Icon size={15} strokeWidth={2} />
                </div>
                <span className={`text-sm leading-snug transition-all duration-300
                  ${done    ? "text-gray-500 font-medium" : ""}
                  ${active  ? "text-gray-700 font-semibold animate-pulse" : ""}
                  ${pending ? "text-gray-400" : ""}
                `}>
                  {label}
                </span>
              </div>
            );
          })}

          {/* Loading bar */}
          <div className="pt-1">
            <div className="h-1 w-8 bg-teal-400 rounded-full"
              style={{ width: `${(step / STEPS.length) * 100}%`, transition: "width 0.6s ease" }}
            />
          </div>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 mt-8">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-teal-700 uppercase">
            Inference Engine Active
          </span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}