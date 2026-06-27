import { Link } from 'react-router'
import { Leaf, MapPin, Phone, Mail, ExternalLink } from 'lucide-react'

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Our Products', path: '/products' },
  { label: 'Farming Guides', path: '/guides' },
  { label: 'Tools', path: '/tools' },
  { label: 'Contact', path: '/contact' },
]

const products = [
  'Fresh Organic Eggs',
  'Day-Old Chicks',
  'Brooded Chicks (1 Month)',
  'Mature Layers',
  'Organic Chicken Manure',
  'Farm Consultation',
]

const ecosystem = [
  { label: 'ShambaNi Marketplace', url: 'https://shambani-market.africa' },
  { label: 'PrintDrop', url: 'https://shambani-market.africa/#/print' },
  { label: 'Fiverr', url: 'https://www.fiverr.com' },
  { label: 'Farm Blog', url: 'https://unifiedfarmblm.blogspot.com' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--secondary)' }} className="pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5" style={{ color: '#FEFAE0' }} />
              <span className="font-serif text-lg" style={{ color: '#FEFAE0' }}>
                Unifiedfarm <span style={{ color: 'var(--primary)' }}>BLM</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(254, 250, 224, 0.7)' }}>
              Family-run poultry farm in Mpigi, Uganda. Fresh eggs, healthy chicks, and expert guidance for farmers.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(254, 250, 224, 0.7)' }}>
                <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--primary)' }} />
                <span className="font-sora text-xs">Mpigi, Uganda</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(254, 250, 224, 0.7)' }}>
                <Phone className="w-4 h-4 shrink-0" style={{ color: 'var(--primary)' }} />
                <span className="font-sora text-xs">+256 708 813 419</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(254, 250, 224, 0.7)' }}>
                <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--primary)' }} />
                <span className="font-sora text-xs">ryglutwa0@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sora text-xs uppercase tracking-[0.1em] mb-5" style={{ color: 'rgba(254, 250, 224, 0.5)' }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-sora text-sm transition-all duration-300 hover:underline"
                    style={{ color: '#FEFAE0' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-sora text-xs uppercase tracking-[0.1em] mb-5" style={{ color: 'rgba(254, 250, 224, 0.5)' }}>
              Products
            </h4>
            <ul className="space-y-2.5">
              {products.map((product) => (
                <li key={product}>
                  <Link
                    to="/products"
                    className="font-sora text-sm transition-all duration-300 hover:underline"
                    style={{ color: '#FEFAE0' }}
                  >
                    {product}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="font-sora text-xs uppercase tracking-[0.1em] mb-5" style={{ color: 'rgba(254, 250, 224, 0.5)' }}>
              Our Ecosystem
            </h4>
            <ul className="space-y-2.5">
              {ecosystem.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sora text-sm flex items-center gap-1.5 transition-all duration-300 hover:underline"
                    style={{ color: '#FEFAE0' }}
                  >
                    {item.label}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(254, 250, 224, 0.15)' }}>
          <p className="font-sora text-xs" style={{ color: 'rgba(254, 250, 224, 0.5)' }}>
            © 2026 Unifiedfarm BLM. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="font-sora text-xs transition-colors duration-300 hover:underline" style={{ color: 'rgba(254, 250, 224, 0.5)' }}>
              Privacy Policy
            </Link>
            <Link to="/terms" className="font-sora text-xs transition-colors duration-300 hover:underline" style={{ color: 'rgba(254, 250, 224, 0.5)' }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
