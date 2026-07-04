import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// NOTE (frontend-only scope):
// Tim backend akan menyediakan REST API (Node.js + Express, JWT, MySQL) sesuai BRD F-01/F-02.
// Context ini menyimulasikan state auth di sisi frontend supaya alur Splash -> Registrasi/Login -> Beranda
// bisa di-demo dan tinggal disambungkan (ganti fungsi login/register dengan fetch ke API asli).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([
    {
      id: '1',
      tanggal: '18 JUNI 2026',
      nama: 'Disiplin Waktu',
      kode: 'P1',
      jawaban: { K1: true, K2: true, K3: true, K4: true, K5: false } // 80%
    },
    {
      id: '2',
      tanggal: '12 JUNI 2026',
      nama: 'Manajemen Stress',
      kode: 'P8',
      jawaban: { K1: true, K2: true, K3: false, K4: false, K5: false } // 40%
    },
    {
      id: '3',
      tanggal: '05 JUNI 2026',
      nama: 'Motivasi Belajar',
      kode: 'P4',
      jawaban: { K1: true, K2: true, K3: true, K4: false } // 75%
    },
    {
      id: '4',
      tanggal: '28 MEI 2026',
      nama: 'Kesehatan Mental',
      kode: 'P8',
      jawaban: { K1: true, K2: false, K3: false } // 33%
    },
  ]);

  const login = ({ identifier }) => {
    // TODO: integrasi -> POST /api/auth/login { nim/email, password }
    setUser({ nama: 'Dimas', identifier }); // Set default to 'Dimas' as in screenshot design, or allow custom name
    return { success: true };
  };

  const register = ({ namaLengkap, nim, email }) => {
    // TODO: integrasi -> POST /api/auth/register { namaLengkap, nim, email, password }
    setUser({ nama: namaLengkap || 'Dimas', nim, email });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const addHistory = (namaProfil, kodeProfil, jawabanBaru) => {
    const tgl = new Date();
    const namaBulan = [
      'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
      'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
    ];
    const formatTanggal = `${tgl.getDate()} ${namaBulan[tgl.getMonth()]} ${tgl.getFullYear()}`;
    
    setHistory((prev) => [
      {
        id: String(Date.now()),
        tanggal: formatTanggal,
        nama: namaProfil,
        kode: kodeProfil,
        jawaban: jawabanBaru,
      },
      ...prev,
    ]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, history, addHistory, clearHistory }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
