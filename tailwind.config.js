/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C3A',
          light: '#1a6b52',
          dark: '#0a3328',
        },
        accent: {
          DEFAULT: '#C9A961',
          light: '#d4bb7e',
          dark: '#b8943d',
        },
        cream: '#F5F0E6',
        dark: '#1A1A1A',
        muted: '#6B7280',
        success: '#10B981',
        error: '#EF4444',
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
      },
      boxShadow: {
        'property': '0 4px 24px -4px rgba(15, 76, 58, 0.12)',
      },
    },
  },
  plugins: [],
}
