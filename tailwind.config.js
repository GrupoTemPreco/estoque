/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a9f6',
          500: '#0c8de7',
          600: '#016fc5',
          700: '#0158a0',
          800: '#064c84',
          900: '#0b406d',
          950: '#072849',
        },
      },
      borderRadius: {
        control: '8px',
        card: '12px',
      },
    },
  },
  plugins: [],
};
