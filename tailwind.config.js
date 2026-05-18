/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Royal premium palette
        ink: {
          50: '#f5f4f0',
          100: '#e8e5dc',
          900: '#1a1625',
          950: '#0d0b14',
        },
        royal: {
          50: '#f0eef9',
          100: '#dcd6f0',
          200: '#b8aee0',
          300: '#9485d0',
          400: '#705cc0',
          500: '#4c33b0',
          600: '#3d298d',
          700: '#2e1f6a',
          800: '#1f1547',
          900: '#100b24',
        },
        gold: {
          50: '#fdf9ed',
          100: '#faf0ce',
          200: '#f4dd96',
          300: '#eec85e',
          400: '#e8b631',
          500: '#d4a017',
          600: '#a87d0f',
          700: '#7c5b0a',
          800: '#503a05',
          900: '#241900',
        },
        burgundy: {
          400: '#a13e4a',
          500: '#871f2d',
          600: '#6b1923',
          700: '#4f131a',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf6ec',
          200: '#f4ecd6',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Crimson Pro"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #1f1547 0%, #2e1f6a 50%, #4c33b0 100%)',
        'gold-shimmer': 'linear-gradient(135deg, #d4a017 0%, #eec85e 50%, #d4a017 100%)',
        'cream-mesh': 'radial-gradient(at 20% 20%, #faf0ce 0px, transparent 50%), radial-gradient(at 80% 80%, #dcd6f0 0px, transparent 50%), #fdfcf8',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'royal': '0 20px 60px -15px rgba(31, 21, 71, 0.4)',
        'gold-glow': '0 0 40px rgba(212, 160, 23, 0.3)',
        'inset-gold': 'inset 0 1px 0 rgba(238, 200, 94, 0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
