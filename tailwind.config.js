export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { 50: '#FFFBF2', 100: '#FBF5E9', 200: '#F5EBD3' },
        burgundy: {
          DEFAULT: '#6B0F24',
          700: '#7A1229',
          800: '#52091B',
          900: '#3A0612',
        },
        gold: { DEFAULT: '#B8923A', light: '#E0C27A' },
        ink: '#1F1A17',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      opacity: {
        5: '0.05',
        15: '0.15',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        85: '0.85',
        95: '0.95',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(58, 6, 18, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.65)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};