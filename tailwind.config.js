/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}', './src/renderer/index.html'],
  theme: {
    extend: {
      colors: {
        'go-blue':    'rgb(var(--color-go-blue) / <alpha-value>)',
        'go-cyan':    'rgb(var(--color-go-cyan) / <alpha-value>)',
        'go-dark':    'rgb(var(--color-go-dark) / <alpha-value>)',
        'go-darker':  'rgb(var(--color-go-darker) / <alpha-value>)',
        'go-surface': 'rgb(var(--color-go-surface) / <alpha-value>)',
        'go-surface2':'rgb(var(--color-go-surface2) / <alpha-value>)',
        'go-border':  'rgb(var(--color-go-border) / <alpha-value>)',
        'go-text':    'rgb(var(--color-go-text) / <alpha-value>)',
        'go-muted':   'rgb(var(--color-go-muted) / <alpha-value>)',
        'go-success': 'rgb(var(--color-go-success) / <alpha-value>)',
        'go-error':   'rgb(var(--color-go-error) / <alpha-value>)',
        'go-warning': 'rgb(var(--color-go-warning) / <alpha-value>)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    }
  },
  plugins: []
}
