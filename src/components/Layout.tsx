import { Outlet } from 'react-router'
import Navigation from './Navigation'
import Footer from './Footer'
import ChatWidget from './ChatWidget'
import { Toaster } from '@/components/ui/sonner'

export default function Layout() {
  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--bg)' }}>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <Toaster position="top-right" />
    </div>
  )
}
