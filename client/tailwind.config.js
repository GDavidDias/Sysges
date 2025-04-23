/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      'movil': '360px',
      'tablet': '640px',
      'desktop': '800px'
    },
    extend: {
      animation: {
        'gradient-bg': 'gradient-bg 30s ease infinite',
      },
      keyframes: {
        'gradient-bg': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        '200%': '200%',
        '400%': '400%',
        '600%': '600%',
      },
      backgroundImage: {
        // 'animated-gradient': 'linear-gradient(270deg, #ff7e5f, #feb47b, #86a8e7, #91eae4)',
        //colores indigo-300, slate-50, emerald-200, orange-200, stone-50
        // 'animated-gradient': 'linear-gradient(270deg, #a5b4fc, #f8fafc, #a7f3d0, #fed7aa, #fafaf9)',

        //colores stone-300, neutral-50, slate-300, neutral-50, orange-200
        'animated-gradient': 'linear-gradient(270deg, #d6d3d1, #fafafa, #cbd5e1, #fafafa, #fed7aa)',
      },
    },
  },
  plugins: [],
}