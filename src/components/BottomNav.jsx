import { NavLink } from "react-router-dom";
import { Home, MessageSquare, FileText, User } from "lucide-react";

const navItems = [
  { to: "/beranda", icon: Home, label: "Beranda" },
  { to: "/konsultasi", icon: MessageSquare, label: "Konsultasi" },
  { to: "/riwayat", icon: FileText, label: "Riwayat" },
  { to: "/profil", icon: User, label: "Profil" },
];

export default function BottomNav() {
  return (
    <nav className="border-t border-gray-100 bg-white">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-colors ${
                isActive ? "text-primary-600" : "text-gray-400"
              }`
            }
          >
            <Icon size={22} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
