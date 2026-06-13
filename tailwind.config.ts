import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka One', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'Inter', 'sans-serif'],
      },
      colors: {
        'world-coral': '#06b6d4',
        'world-jungle': '#22c55e',
        'world-space': '#8b5cf6',
        'world-temple': '#f59e0b',
        correct: '#51cf66',
        wrong: '#ff6b6b',
        crystal: '#74c0fc',
        gold: '#ffd43b',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-gold': '0 0 20px rgba(255, 212, 59, 0.4)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.35)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-blue': '0 0 20px rgba(116, 192, 252, 0.4)',
      },
      backdropBlur: {
        glass: '12px',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        float: 'float 3s ease-in-out infinite',
        'crystal-collect': 'crystalCollect 0.8s ease-out forwards',
        'particle-burst': 'particleBurst 0.6s ease-out forwards',
        twinkle: 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        crystalCollect: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-80px) scale(0.5)', opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
