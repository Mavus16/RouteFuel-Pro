/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors
        primary: {
          DEFAULT: '#1D1D1F',
          hover: '#000000',
        },
        secondary: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
        },
        accent: {
          DEFAULT: '#4285F4',
          hover: '#3367D6',
        },
        border: {
          light: '#E5E7EB',
          medium: '#D1D5DB',
          focus: '#4285F4',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F8F9FA',
          dark: '#1A1A1A',
        },
        text: {
          primary: '#1D1D1F',
          secondary: '#6B7280',
          placeholder: '#9CA3AF',
          inverse: '#FFFFFF',
        }
      },
      fontFamily: {
        primary: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['24px', { lineHeight: '1.3' }],
        'body-lg': ['18px', { lineHeight: '1.5' }],
        'body': ['16px', { lineHeight: '1.5' }],
        'body-sm': ['14px', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'elevation1': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'elevation2': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'elevation3': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'focus': '0 0 0 3px rgba(66, 133, 244, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
