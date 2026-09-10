/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rf-base': '#F5F0EB',
        'rf-lavender': '#ECECF7',
        'rf-ice': '#EEF3F7',
        'rf-orange': '#F15A24',
        'rf-orange-light': '#FFCD9F',
        'rf-peach': '#FBD7B6',
        'rf-violet': '#DEC8F8',
        'rf-blue': '#BCE3FB',
        'rf-banner': '#C7E5F9',
        'rf-dark': '#1E1E1E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'rf': '24px',
      },
    },
  },
  plugins: [],
};
