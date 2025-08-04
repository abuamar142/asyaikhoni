import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d', // Hijau tua utama
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047', // Kuning cerah utama
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        islamic: {
          emerald: '#059669',
          gold: '#f59e0b',
          sage: '#6b7280',
        },
        text: {
          primary: '#111827', // Gray 900 - Main text
          secondary: '#374151', // Gray 700 - Secondary text
          muted: '#6b7280', // Gray 500 - Muted text
          light: '#9ca3af', // Gray 400 - Light text
          white: '#ffffff', // White text
          brand: '#15803d', // Primary green
          accent: '#fde047', // Primary yellow
          success: '#059669', // Success green
          warning: '#f59e0b', // Warning orange
          error: '#dc2626', // Error red
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display sizes (for hero sections)
        'display-lg': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['2.875rem', { lineHeight: '1.25', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],

        // Heading sizes
        'heading-xl': ['1.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],

        // Body text sizes
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],

        // Special sizes
        caption: ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
        'arabic-lg': ['2rem', { lineHeight: '1.8', fontWeight: '400' }],
        'arabic-md': ['1.5rem', { lineHeight: '1.8', fontWeight: '400' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [typography, forms, aspectRatio],
}
