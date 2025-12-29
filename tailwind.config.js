/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",    // App router bo'lsa
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",  // Pages router bo'lsa
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",    // Agar src papkasi ichida bo'lsa
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}