import { ArrowRight, Phone } from 'lucide-react'
import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'

const products = [
  { name: 'Fresh Organic Eggs', desc: 'Farm-fresh brown eggs collected daily from free-range layers. Rich in nutrients and flavor. Perfect for households, restaurants, and retail shops.', price: 'UGX 15,000', unit: 'per tray', image: '/images/product-eggs.jpg' },
  { name: 'Day-Old Chicks', desc: 'Vaccinated and healthy broiler and layer chicks ready for your farm. Raised under strict biosecurity protocols to ensure maximum survival rates.', price: 'UGX 3,500', unit: 'each', image: '/images/product-chicks.jpg' },
  { name: 'Brooded Chicks (1 Month)', desc: 'One-month-old chicks raised under optimal conditions in our brooder houses. Strong, healthy, and ready to grow into productive layers or broilers.', price: 'UGX 8,000', unit: 'each', image: '/images/product-brooded.jpg' },
  { name: 'Mature Layers', desc: 'Healthy point-of-lay hens vaccinated and prepared for immediate egg production. Ideal for farmers looking to start egg production quickly.', price: 'UGX 35,000', unit: 'each', image: '/images/product-layers.jpg' },
  { name: 'Organic Chicken Manure', desc: 'Natural fertilizer for your crops. Rich in nitrogen, phosphorus, and potassium. Composted and ready for immediate use in gardens and farms.', price: 'UGX 50,000', unit: 'per ton', image: '/images/product-manure.jpg' },
  { name: 'Farm Consultation', desc: 'Expert advice on poultry housing design, feeding programs, disease prevention, and business planning. Available for farms of all sizes.', price: 'Custom', unit: 'quote', image: '/images/product-consultation.jpg' },
]

export default function Products() {
  const [orderProduct, setOrderProduct] = useState<string | null>(null)
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    quantity: 1,
    notes: '',
  })

  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      toast.success('Order submitted successfully! We will contact you soon.')
      setOrderProduct(null)
      setOrderForm({ customerName: '', customerEmail: '', customerPhone: '', quantity: 1, notes: '' })
    },
    onError: (err) => toast.error(err.message),
  })

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderProduct) return
    createOrder.mutate({
      ...orderForm,
      product: orderProduct,
    })
  }

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-[1200px] mx-auto">
          <span className="eyebrow mb-3 block">Our Farm Store</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Premium Poultry Products
          </h1>
          <p className="font-serif text-base lg:text-lg max-w-[600px]" style={{ color: 'var(--text-muted)' }}>
            Everything you need for your poultry farm, from fresh eggs to healthy chicks and expert consultation services.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <div
                key={product.name}
                className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--surface)',
                  boxShadow: '0 2px 16px rgba(40, 54, 24, 0.04)',
                }}
              >
                <div
                  className="w-full sm:w-48 h-48 sm:h-auto rounded-xl shrink-0"
                  style={{
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="flex flex-col flex-1 py-1">
                  <h3 className="font-serif text-xl lg:text-2xl mb-1" style={{ color: 'var(--text-main)' }}>
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-sora text-lg font-medium" style={{ color: 'var(--accent)' }}>
                      {product.price}
                    </span>
                    <span className="font-sora text-xs" style={{ color: 'var(--text-muted)' }}>
                      {product.unit}
                    </span>
                  </div>
                  <p className="font-serif text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
                    {product.desc}
                  </p>
                  <button
                    onClick={() => setOrderProduct(product.name)}
                    className="btn-primary gap-2 text-xs py-2.5 px-5 w-fit"
                  >
                    Order Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Modal */}
      {orderProduct && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(40, 54, 24, 0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOrderProduct(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-xl" style={{ color: 'var(--text-main)' }}>Place Order</h3>
                <p className="font-sora text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{orderProduct}</p>
              </div>
              <button onClick={() => setOrderProduct(null)} className="p-1 rounded-full hover:bg-black/5">
                {/* X icon */}
                <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                <input type="text" required value={orderForm.customerName} onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--surface)', color: 'var(--text-main)' }} placeholder="John Doe" />
              </div>
              <div>
                <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                <input type="email" required value={orderForm.customerEmail} onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--surface)', color: 'var(--text-main)' }} placeholder="john@example.com" />
              </div>
              <div>
                <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Phone (optional)</label>
                <input type="tel" value={orderForm.customerPhone} onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--surface)', color: 'var(--text-main)' }} placeholder="+256 7XX XXX XXX" />
              </div>
              <div>
                <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Quantity</label>
                <input type="number" min={1} required value={orderForm.quantity} onChange={(e) => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none" style={{ background: 'var(--surface)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Notes (optional)</label>
                <textarea rows={3} value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} className="w-full px-4 py-3 rounded-xl font-serif text-sm outline-none resize-none" style={{ background: 'var(--surface)', color: 'var(--text-main)' }} placeholder="Any special requests..." />
              </div>
              <button type="submit" disabled={createOrder.isPending} className="btn-primary w-full">
                {createOrder.isPending ? 'Submitting...' : 'Submit Order'}
              </button>
              <a href="https://wa.me/256708813419" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full gap-2 flex items-center justify-center">
                <Phone className="w-4 h-4" />
                Order via WhatsApp
              </a>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
