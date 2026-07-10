import { create } from "twrnc";

// Buat instance twrnc dengan konfigurasi custom warna & border radius
// yang persis sama dengan tailwind.config.js web.
const tw = create({
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eaf5ee",
          100: "#cfe9d6",
          400: "#2f8f52",
          500: "#1f7a40",
          600: "#176236",
          700: "#155c33",
          800: "#0f3d22",
          900: "#0c3a20",
        },
      },
      borderRadius: {
        xl2: "20px", // 1.25rem
      },
    },
  },
});

export default tw;
