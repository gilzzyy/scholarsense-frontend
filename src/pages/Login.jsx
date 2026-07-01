import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import StatusBar from "../components/StatusBar";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!identifier || !password) {
      setError("Email/NIM dan password wajib diisi.");
      return;
    }
    // TODO: integrasi -> POST /api/auth/login (lihat AuthContext.jsx)
    login({ identifier });
    navigate("/beranda");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="screen-scroll px-6">
        <div className="pt-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang</h1>
          <p className="text-sm text-gray-500 mt-1">
            Masuk Ke Akun <span className="text-primary-600 font-semibold">ScholarSense</span> Anda
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 space-y-4 fade-in">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email/NIM</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" />
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan email atau NIM"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 rounded-xl px-3 py-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-right">
            <button type="button" className="text-primary-600 text-xs font-semibold">
              lupa Password ?
            </button>
          </div>

          <button type="submit" className="btn-primary w-full py-4 mt-6">
            Masuk
          </button>

          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">atau</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full py-4 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm"
          >
            Masuk dengan Google
          </button>

          <p className="text-center text-xs text-gray-500 pt-4">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary-600 font-semibold">
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
