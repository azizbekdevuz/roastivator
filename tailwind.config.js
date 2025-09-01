/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'typewriter': 'typewriter 2s steps(40) 1s forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        typewriter: {
          '0%': { width: '0ch' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}