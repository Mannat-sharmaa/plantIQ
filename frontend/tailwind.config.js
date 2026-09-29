/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0f0d',
        surface: {
          DEFAULT: '#111a15',
          light: '#16221c',
          lighter: '#1d2c24',
          card: '#111a15',
          glass: 'rgba(17, 26, 21, 0.75)',
        },
        primary: {
          DEFAULT: '#00ff88',
          hover: '#10b981',
          glow: 'rgba(0, 255, 136, 0.3)',
          subtle: 'rgba(0, 255, 136, 0.1)',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
          glow: 'rgba(139, 92, 246, 0.3)',
          subtle: 'rgba(139, 92, 246, 0.1)',
        },
        text: {
          primary: '#e8f5ee',
          muted: '#94a3b8',
          dark: '#64748b'
        },
        border: {
          DEFAULT: 'rgba(0, 255, 136, 0.15)',
          subtle: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(0, 255, 136, 0.4)',
        },
        status: {
          error: '#ff4d6d',
          warning: '#ffb020',
          success: '#00ff88',
          info: '#38bdf8'
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 25px -5px rgba(0, 255, 136, 0.3)',
        'neon-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' }
        }
      }
    },
  },
  plugins: [],
}
