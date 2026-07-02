import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Splash from "./pages/Splash";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Konsultasi from "./pages/Konsultasi";
import Kuesioner from "./pages/Kuesioner";
import Hasil from "./pages/Hasil";
import Placeholder from "./pages/Placeholder";
import Processing from "./pages/Processing";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <div className="phone-frame">
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/beranda" element={<Dashboard />} />
              <Route path="/konsultasi" element={<Konsultasi />} />
              <Route path="/kuesioner" element={<Kuesioner />} />
              <Route path="/processing" element={<Processing />} />
              <Route path="/hasil" element={<Hasil />} />

              {/* Di luar scope (dikerjakan rekan tim lain) */}
              <Route path="/riwayat" element={<Placeholder title="Riwayat Konsultasi" note="Modul 5 dikerjakan rekan tim." />} />
              <Route path="/profil" element={<Placeholder title="Profil" note="Modul 6 dikerjakan rekan tim." />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
