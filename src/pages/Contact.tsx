import { useState } from 'react'
import { trpc } from '@/providers/trpc'
import { toast } from 'sonner'
import { MapPin, Phone, Mail, Clock, Send, Leaf } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success('Message sent successfully! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitContact.mutate(form)
  }

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-[1200px] mx-auto">
          <span className="eyebrow mb-3 block">Get In Touch</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Contact Us
          </h1>
          <p className="font-serif text-base lg:text-lg max-w-[600px]" style={{ color: 'var(--text-muted)' }}>
            Have questions about our products or need expert poultry advice? We are here to help. Reach out through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="font-serif text-2xl lg:text-3xl mb-6" style={{ color: 'var(--text-main)' }}>
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2"
                      style={{ background: 'var(--surface)', color: 'var(--text-main)' }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2"
                      style={{ background: 'var(--surface)', color: 'var(--text-main)' }}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4A373]"
                    style={{ background: 'var(--surface)', color: 'var(--text-main)' }}
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Message</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl font-serif text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4A373] resize-none"
                    style={{ background: 'var(--surface)', color: 'var(--text-main)' }}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitContact.isPending}
                  className="btn-primary gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitContact.isPending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-serif text-2xl lg:text-3xl mb-2" style={{ color: 'var(--text-main)' }}>
                Contact Information
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg-alt)' }}>
                    <MapPin className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                  </div>
                  <div>
                    <h4 className="font-sora text-sm font-medium mb-1" style={{ color: 'var(--text-main)' }}>Visit Us</h4>
                    <p className="font-serif text-sm" style={{ color: 'var(--text-muted)' }}>Mpigi District, Central Region, Uganda</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg-alt)' }}>
                    <Phone className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                  </div>
                  <div>
                    <h4 className="font-sora text-sm font-medium mb-1" style={{ color: 'var(--text-main)' }}>Phone / WhatsApp</h4>
                    <a href="https://wa.me/256708813419" target="_blank" rel="noopener noreferrer" className="font-serif text-sm hover:underline" style={{ color: 'var(--accent)' }}>+256 708 813 419</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg-alt)' }}>
                    <Mail className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                  </div>
                  <div>
                    <h4 className="font-sora text-sm font-medium mb-1" style={{ color: 'var(--text-main)' }}>Email</h4>
                    <a href="mailto:ryglutwa0@gmail.com" className="font-serif text-sm hover:underline" style={{ color: 'var(--accent)' }}>ryglutwa0@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg-alt)' }}>
                    <Clock className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                  </div>
                  <div>
                    <h4 className="font-sora text-sm font-medium mb-1" style={{ color: 'var(--text-main)' }}>Business Hours</h4>
                    <p className="font-serif text-sm" style={{ color: 'var(--text-muted)' }}>Monday - Saturday: 7:00 AM - 6:00 PM</p>
                    <p className="font-serif text-sm" style={{ color: 'var(--text-muted)' }}>Sunday: 8:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Quick order */}
              <div className="p-5 rounded-2xl" style={{ background: 'var(--secondary)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span className="font-sora text-xs uppercase tracking-wider" style={{ color: 'rgba(254,250,224,0.7)' }}>Quick Order</span>
                </div>
                <p className="font-serif text-sm mb-3" style={{ color: '#FEFAE0' }}>
                  Ready to order? Chat with us on WhatsApp for the fastest response.
                </p>
                <a
                  href="https://wa.me/256708813419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sora text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300"
                  style={{ background: 'var(--primary)', color: '#FEFAE0' }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Order via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
