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
        notech: {
          steel: '#6D6E71',
          'steel-light': '#8D8E92',
          'steel-dark': '#4D4E51',
          green: '#A4A77E',
          'green-light': '#BFC399',
          'green-dark': '#868962',
          tan: '#C2B59B',
          'tan-light': '#D6CCB5',
          'tan-dark': '#9F9277',
          dark: '#121417',
          surface: '#1A1D21',
          'surface-card': '#22262C',
          'surface-elevated': '#2B3037',
          border: '#383E47',
        },
        palette: {
          battleship: '#848B91',
          nato: '#465B43',
          olive: '#555D50',
          darkcamo: '#4A3B32',
          sand: '#C8B89A',
          rafblue: '#5D6D7E',
          stone: '#D5D1C8',
        }
      },
      fontFamily: {
        sans: ['"Geist"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Geist"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 15px -2px rgba(164, 167, 126, 0.45)',
        'glow-green-lg': '0 0 25px -2px rgba(164, 167, 126, 0.6)',
        'glow-tan': '0 0 15px -2px rgba(194, 181, 155, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'clean': '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        'water': '0 8px 30px -4px rgba(18, 20, 23, 0.06), 0 2px 8px -1px rgba(18, 20, 23, 0.03)',
        'water-lg': '0 14px 40px -6px rgba(18, 20, 23, 0.08), 0 4px 12px -2px rgba(18, 20, 23, 0.04)',
        'water-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.03)',
        'drawer': '-12px 0 40px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 2s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
