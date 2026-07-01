/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
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
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 16px rgba(15, 61, 34, 0.08)",
        soft: "0 2px 10px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
