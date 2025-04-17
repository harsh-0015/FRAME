/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        light: {
          primary: '#3b82f6',
          background: '#f8fafc',
          text: '#1e293b',
        },
        dark: {
          primary: '#60a5fa',
          background: '#0f172a',
          text: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
}