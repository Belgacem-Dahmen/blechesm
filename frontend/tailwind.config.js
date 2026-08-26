/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          warm: 'var(--accent-warm)',
        },
        text: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          3: 'var(--text-3)',
        },
        success: {
          DEFAULT: 'var(--success)',
          soft: 'var(--success-soft)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          soft: 'var(--warning-soft)',
        },
      },
      fontFamily: {
        display: ['General Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '22px',
        pill: '999px',
      },
      letterSpacing: {
        tightest: '-0.025em',
        tighter: '-0.015em',
        widest: '0.16em',
      },
      keyframes: {
        'fade-up':    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-left':  { from: { opacity: '0', transform: 'translateX(20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        'fade-in':    { from: { opacity: '0' }, to: { opacity: '1' } },
        'live-pulse': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        'typing-dot': { '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' }, '30%': { transform: 'translateY(-5px)', opacity: '1' } },
        'cta-pulse':  { '0%, 100%': { opacity: '0.45', transform: 'scale(1)' }, '50%': { opacity: '0.75', transform: 'scale(1.1)' } },
        'border-spin': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-up':    'fade-up 0.45s ease both',
        'fade-left':  'fade-left 0.6s ease both',
        'fade-in':    'fade-in 0.3s ease both',
        'live-pulse': 'live-pulse 1.8s ease-in-out infinite',
        'typing-dot': 'typing-dot 1.2s ease-in-out infinite',
        'cta-pulse':  'cta-pulse 2.4s ease-in-out infinite',
        'border-spin': 'border-spin 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}
