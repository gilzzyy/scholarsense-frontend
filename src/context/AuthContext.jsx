import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// NOTE (frontend-only scope):
// Tim backend akan menyediakan REST API (Node.js + Express, JWT, MySQL) sesuai BRD F-01/F-02.
// Context ini menyimulasikan state auth di sisi frontend supaya alur Splash -> Registrasi/Login -> Beranda
// bisa di-demo dan tinggal disambungkan (ganti fungsi login/register dengan fetch ke API asli).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ identifier }) => {
    // TODO: integrasi -> POST /api/auth/login { nim/email, password }
    setUser({ nama: "Asyifa", identifier });
    return { success: true };
  };

  const register = ({ namaLengkap, nim, email }) => {
    // TODO: integrasi -> POST /api/auth/register { namaLengkap, nim, email, password }
    setUser({ nama: namaLengkap || "Mahasiswa", nim, email });
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
