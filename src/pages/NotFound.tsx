import { Link } from 'react-router'
import { Leaf, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="text-center max-w-md">
        <Leaf className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--secondary)' }} />
        <h1 className="font-serif text-6xl mb-2" style={{ color: 'var(--text-main)' }}>404</h1>
        <h2 className="font-serif text-2xl mb-3" style={{ color: 'var(--text-main)' }}>Page Not Found</h2>
        <p className="font-serif text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          The page you are looking for doesn't exist or has been moved. Let us help you find your way back.
        </p>
        <Link to="/" className="btn-primary gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
