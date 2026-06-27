import { useState } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { Leaf, LogIn, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

function getOAuthUrl() {
  const authUrl = new URL(import.meta.env.VITE_KIMI_AUTH_URL)
  authUrl.searchParams.set('client_id', import.meta.env.VITE_APP_ID)
  authUrl.searchParams.set('redirect_uri', `${window.location.origin}/api/oauth/callback`)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'profile')
  authUrl.searchParams.set('state', btoa(window.location.pathname))
  return authUrl.toString()
}

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    displayName: '',
    password: '',
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/')
    return null
  }

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token)
      toast.success('Welcome back!')
      window.location.href = '/'
    },
    onError: (err) => toast.error(err.message),
  })

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('local_auth_token', data.token)
      toast.success('Account created successfully!')
      window.location.href = '/'
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      loginMutation.mutate({
        username: form.username,
        password: form.password,
      })
    } else {
      registerMutation.mutate({
        username: form.username,
        email: form.email,
        displayName: form.displayName || undefined,
        password: form.password,
      })
    }
  }

  const isPending = loginMutation.isPending || registerMutation.isPending

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 font-sora text-xs uppercase tracking-wider transition-colors duration-200 hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
            <span className="font-serif text-2xl" style={{ color: 'var(--text-main)' }}>
              Unifiedfarm <span style={{ color: 'var(--accent)' }}>BLM</span>
            </span>
          </div>
          <p className="font-serif text-sm" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 lg:p-8"
          style={{
            background: 'var(--surface)',
            boxShadow: '0 4px 24px rgba(40, 54, 24, 0.06)',
          }}
        >
          {/* OAuth */}
          <a
            href={getOAuthUrl()}
            className="w-full flex items-center justify-center gap-2 font-sora text-sm py-3 rounded-xl transition-all duration-300 hover:opacity-90 mb-5"
            style={{
              background: 'var(--secondary)',
              color: '#FEFAE0',
            }}
          >
            <LogIn className="w-4 h-4" />
            Sign In with Kimi OAuth
          </a>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="font-sora text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Local Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Username</label>
              <input
                type="text"
                required
                minLength={3}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4A373]"
                style={{ background: 'var(--bg)', color: 'var(--text-main)' }}
                placeholder="Enter username"
              />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2"
                    style={{ background: 'var(--bg)', color: 'var(--text-main)' }}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Display Name (optional)</label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2"
                    style={{ background: 'var(--bg)', color: 'var(--text-main)' }}
                    placeholder="Your name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-10 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4A373]"
                  style={{ background: 'var(--bg)', color: 'var(--text-main)' }}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full gap-2"
            >
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isPending ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-5 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-sora text-xs transition-colors duration-200 hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
