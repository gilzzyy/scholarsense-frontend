import { useNavigate } from "react-router-dom";
import { Bell, Heart, MessageCircle, BarChart3, ChevronRight } from "lucide-react";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

const services = [
  {
    icon: Heart,
    title: "Konsultasi Perilaku",
    desc: "Evaluasi diri & tindakan nyata.",
  },
  {
    icon: MessageCircle,
    title: "Chat dengan Asisten AI",
    desc: "Konsultasi langsung dengan AI.",
  },
  {
    icon: BarChart3,
    title: "Pengembangan Diri",
    desc: "Tips materi jadi pribadi baik.",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.nama?.split(" ")[0] || "Mahasiswa";

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <StatusBar dark />

      <div className="screen-scroll">
        <div className="bg-primary-700 px-6 pb-16 pt-2 rounded-b-[28px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary-400 flex items-center justify-center text-white font-bold text-sm">
                {firstName[0]}
              </div>
              <span className="text-white font-bold text-lg">ScholarSense</span>
            </div>
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Bell size={18} />
            </button>
          </div>

          <h1 className="text-white text-2xl font-extrabold mt-6">Halo, {firstName}</h1>
          <p className="text-primary-100 text-sm mt-0.5">Selamat Datang Di ScolarSense</p>

          <div className="bg-white rounded-2xl p-5 mt-5 shadow-card fade-in">
            <p className="font-bold text-gray-900 text-[15px] leading-snug">
              Bangun Karakter Akademik Unggul, Mulai dari Evaluasi Diri hingga Sukses Masa Depan.
            </p>
            <p className="text-gray-400 text-xs mt-2 leading-relaxed">
              Yuk, mulai konsultasi dan jadi versi terbaik dirimu bersama ScholarSense.
            </p>
          </div>
        </div>

        <div className="px-6 -mt-7">
          <div className="bg-white rounded-2xl shadow-soft px-5 py-4">
            <h2 className="font-bold text-gray-900">Mulai Konsultasi</h2>
            <p className="text-xs text-gray-400 mt-0.5">Terdapat layanan yang sesuai dengan kebutuhanmu.</p>

            <div className="flex gap-3 mt-4 overflow-x-auto pb-1 -mx-1 px-1 screen-scroll">
              {services.map(({ icon: Icon, title, desc }) => (
                <button
                  key={title}
                  onClick={() => navigate("/konsultasi")}
                  className="min-w-[140px] bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 active:scale-[0.98] transition-transform"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-3">
                    <Icon size={18} />
                  </div>
                  <p className="font-semibold text-sm text-gray-900 leading-tight">{title}</p>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/konsultasi")}
            className="btn-primary w-full py-4 mt-5 mb-6 flex items-center justify-center gap-2"
          >
            Mulai Konsultasi & Evaluasi Perilaku
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
