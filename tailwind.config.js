/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}', './src/renderer/index.html'],
  theme: {
    extend: {
      colors: {
        'go-blue': '#00ADD8',
        'go-cyan': '#5DC9E2',
        'go-dark': '#0a0e17',
        'go-darker': '#060a12',
        'go-surface': '#111827',
        'go-surface2': '#1a2332',
        'go-border': '#1e2d3d',
        'go-text': '#e2e8f0',
        'go-muted': '#94a3b8',
        'go-success': '#22c55e',
        'go-error': '#ef4444',
        'go-warning': '#f59e0b',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    }
  },
  plugins: []
}
