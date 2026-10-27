/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-hover': '#1D4ED8',
        tint: '#EFF6FF',
        page: '#F8FAFC',
        card: '#FFFFFF',
        line: '#E5E7EB',
        ink: '#111827',
        muted: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#DC2626',
        blocked: '#9CA3AF',
        status: {
          reserved: '#38BDF8',
          checkedin: '#34D399',
          checkedout: '#9CA3AF',
          unpaid: '#F59E0B',
          cancelled: '#9CA3AF',
        },
        source: {
          direct: '#10B981',
          walkin: '#6B7280',
          phone: '#F59E0B',
          whatsapp: '#2563EB',
          booking: '#003580',
          hostelworld: '#F15A29',
          expedia: '#FFC72C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        label: ['11px', { lineHeight: '14px', letterSpacing: '0.08em', fontWeight: '500' }],
        body: ['14px', { lineHeight: '20px' }],
        title: ['24px', { lineHeight: '30px', fontWeight: '600' }],
        stat: ['36px', { lineHeight: '40px', fontWeight: '700' }],
      },
      borderRadius: {
        control: '8px',
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(17 24 39 / 0.04)',
        raised: '0 8px 24px -6px rgb(17 24 39 / 0.16), 0 2px 6px -1px rgb(17 24 39 / 0.08)',
        drawer: '-16px 0 40px -12px rgb(17 24 39 / 0.18)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'drawer-in': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.995)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'drawer-in': 'drawer-in 200ms ease-out',
        'modal-in': 'modal-in 150ms ease-out',
        'toast-in': 'toast-in 150ms ease-out',
      },
    },
  },
  plugins: [],
}
