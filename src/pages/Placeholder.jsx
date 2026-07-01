import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";

export default function Placeholder({ title, backTo = "/beranda", note }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
        <button onClick={() => navigate(backTo)} className="text-primary-700">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-primary-700">{title}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <Construction size={26} />
        </div>
        <p className="font-semibold text-gray-800">Halaman ini dikerjakan rekan tim lain</p>
        <p className="text-xs text-gray-400">
          {note || "Bagian frontend ini berada di luar scope yang ditugaskan ke kamu."}
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
