import { useEffect } from 'react'
import { Compass } from 'lucide-react'
import { useApp } from './lib/store'
import { navigate, useRoute } from './lib/router'
import { TopNav } from './components/topnav'
import { Toast } from './components/overlays'
import { EmptyState } from './components/feedback'
import { ActionButton } from './components/ui'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import Calendar from './screens/Calendar'
import Guests from './screens/Guests'
import BookingFolio from './screens/Folio'
import NewBooking from './screens/NewBooking'
import FinanceLog from './screens/FinanceLog'
import Transfers from './screens/Transfers'
import Reports from './screens/Reports'
import Rates from './screens/Rates'
import FinanceEntry from './screens/FinanceEntry'
import Logs from './screens/Logs'
import StyleGuide from './screens/StyleGuide'
import Frames from './screens/Frames'

const ROUTES = {
  '/dashboard': Dashboard,
  '/calendar': Calendar,
  '/guests': Guests,
  '/booking': BookingFolio,
  '/folio': BookingFolio,
  '/new-booking': NewBooking,
  '/finance': FinanceLog,
  '/finance/transfers': Transfers,
  '/reports': Reports,
  '/rates': Rates,
  '/finance-entry': FinanceEntry,
  '/logs': Logs,
  '/styleguide': StyleGuide,
  '/frames': Frames,
}

export default function App() {
  const { pathname } = useRoute()
  const { user, toast, dismissToast } = useApp()

  useEffect(() => {
    if (!user && pathname !== '/login' && pathname !== '/frames') navigate('/login')
  }, [user, pathname])

  if (!user && pathname !== '/frames') {
    if (pathname !== '/login') navigate('/login')
  }

  if (pathname === '/frames') return <Frames />
  if (!user || pathname === '/login') return <Login />

  const routePath = pathname.startsWith('/folio/') ? '/folio' : pathname
  const Screen = ROUTES[routePath]

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <TopNav />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-6 pb-12">
        {Screen ? (
          <Screen />
        ) : (
          <EmptyState
            icon={Compass}
            title="This page does not exist"
            description="The prototype has twelve screens. Start from the dashboard or open the frame index."
            action={<ActionButton onClick={() => navigate('/dashboard')}>Go to dashboard</ActionButton>}
          />
        )}
      </main>
      <Toast toast={toast} onClose={dismissToast} />
    </div>
  )
}
