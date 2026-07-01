import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, IdCard, Mail, Lock, AlertCircle } from "lucide-react";
import StatusBar from "../components/StatusBar";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    namaLengkap: "",
    nim: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.namaLengkap || !form.nim || !form.email || !form.password) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (!agree) {
      setError("Kamu harus menyetujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    // TODO: integrasi -> POST /api/auth/register (lihat AuthContext.jsx)
    register(form);
    navigate("/beranda");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="screen-scroll px-6 pb-10">
        <div className="flex items-center gap-3 pt-2 pb-1">
          <button onClick={() => navigate(-1)} className="text-primary-700">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Buat Akun</h1>
            <p className="text-xs text-gray-400 -mt-0.5">Daftar mahasiswa baru</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4 fade-in">
          <Field
            label="Nama Lengkap"
            icon={User}
            placeholder="Nama Sesuai KTM"
            value={form.namaLengkap}
            onChange={onChange("namaLengkap")}
          />
          <Field
            label="NIM"
            icon={IdCard}
            placeholder="Nomor Induk Mahasiswa"
            value={form.nim}
            onChange={onChange("nim")}
          />
          <Field
            label="Email"
            icon={Mail}
            type="email"
            placeholder="email@kampus.ac.id"
            value={form.email}
            onChange={onChange("email")}
          />
          <Field
            label="Password"
            icon={Lock}
            type="password"
            placeholder="Min 8 karakter"
            value={form.password}
            onChange={onChange("password")}
          />
          <Field
            label="Konfirmasi Password"
            icon={Lock}
            type="password"
            placeholder="Ulangi password"
            value={form.confirmPassword}
            onChange={onChange("confirmPassword")}
          />

          {error && (
            <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 rounded-xl px-3 py-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <label className="flex items-start gap-2 text-xs text-gray-600 pt-1">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 accent-primary-600"
            />
            <span>
              Saya setuju dengan <span className="text-primary-600 font-medium">Syarat & Ketentuan</span> dan{" "}
              <span className="text-primary-600 font-medium">Kebijakan Privasi</span>
            </span>
          </label>

          <button type="submit" className="btn-primary w-full py-4 mt-2">
            Daftar Akun
          </button>

          <p className="text-center text-xs text-gray-500 pt-1">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary-600 font-semibold">
              Masuk Sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, type = "text", placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
        />
      </div>
    </div>
  );
}
