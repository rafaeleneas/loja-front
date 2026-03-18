/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f8f5f0",
        ink: "#222222",
        accent: "#0f766e",
        soft: "#f1ece2",
      },
      boxShadow: {
        soft: "0 14px 28px -14px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};
