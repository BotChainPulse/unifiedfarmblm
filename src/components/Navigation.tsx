import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import {
  Leaf,
  Menu,
  X,
  ShoppingCart,
  LogOut,
  User,
  LayoutDashboard,
} from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'About', path: '/about' },
  { label: 'Guides', path: '/guides' },
  { label: 'Tools', path: '/tools' },
  { label: 'Contact', path: '/contact' },
  { label: 'Visitor Comments', path: '/comments' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isHero = location.pathname === '/' && !scrolled

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isHero
            ? 'transparent'
            : 'rgba(254, 250, 224, 0.92)',
          backdropFilter: isHero ? 'none' : 'blur(12px)',
          borderBottom: isHero
            ? '1px solid transparent'
            : '1px solid var(--border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Leaf
                className="w-5 h-5"
                style={{ color: 'var(--secondary)' }}
              />
              <span
                className="font-serif text-lg md:text-xl"
                style={{ color: isHero ? '#FEFAE0' : 'var(--text-main)' }}
              >
                Unifiedfarm <span style={{ color: 'var(--accent)' }}>BLM</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-sora text-xs uppercase tracking-[0.05em] transition-colors duration-300 hover:opacity-100"
                  style={{
                    color:
                      location.pathname === link.path
                        ? 'var(--primary)'
                        : isHero
                          ? 'rgba(254,250,224,0.75)'
                          : 'var(--text-muted)',
                    fontWeight: location.pathname === link.path ? 500 : 400,
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="font-sora text-xs uppercase tracking-[0.05em] flex items-center gap-1 transition-colors duration-300"
                  style={{
                    color:
                      location.pathname === '/admin'
                        ? 'var(--primary)'
                        : isHero
                          ? 'rgba(254,250,224,0.75)'
                          : 'var(--text-muted)',
                  }}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span
                    className="font-sora text-xs flex items-center gap-1.5"
                    style={{
                      color: isHero ? '#FEFAE0' : 'var(--text-main)',
                    }}
                  >
                    <User className="w-3.5 h-3.5" />
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="font-sora text-xs uppercase tracking-wider flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-300"
                    style={{
                      color: isHero ? '#FEFAE0' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: isHero
                        ? 'rgba(254,250,224,0.3)'
                        : 'var(--border)',
                    }}
                  >
                    <LogOut className="w-3 h-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="font-sora text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300"
                  style={{
                    color: isHero ? '#FEFAE0' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: isHero
                      ? 'rgba(254,250,224,0.3)'
                      : 'var(--border)',
                  }}
                >
                  Sign In
                </Link>
              )}
              <a
                href="https://wa.me/256708813419"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2 text-xs py-2.5 px-5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Order Now
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2"
              style={{ color: isHero ? '#FEFAE0' : 'var(--text-main)' }}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden absolute top-full left-0 right-0 py-6 px-4"
            style={{
              background: 'rgba(254, 250, 224, 0.98)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-sora text-sm uppercase tracking-wider py-2"
                  style={{
                    color:
                      location.pathname === link.path
                        ? 'var(--primary)'
                        : 'var(--text-main)',
                    fontWeight: location.pathname === link.path ? 500 : 400,
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="font-sora text-sm uppercase tracking-wider py-2 flex items-center gap-2"
                  style={{
                    color:
                      location.pathname === '/admin'
                        ? 'var(--primary)'
                        : 'var(--text-main)',
                  }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <span className="font-sora text-sm flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                      <User className="w-4 h-4" />
                      {user?.name}
                    </span>
                    <button onClick={logout} className="btn-secondary text-xs py-2.5 w-full">
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="btn-primary text-xs py-2.5 w-full text-center block">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
