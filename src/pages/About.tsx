import { Leaf, Heart, Shield, Users, Target, Sprout } from 'lucide-react'

const values = [
  { icon: Heart, title: 'Passion for Poultry', desc: 'We genuinely love what we do. Every bird on our farm receives individual care and attention.' },
  { icon: Shield, title: 'Quality First', desc: 'We never compromise on the health and quality of our products. Every egg and chick meets our high standards.' },
  { icon: Users, title: 'Farmer Empowerment', desc: 'We believe in sharing knowledge. When our customers succeed, we succeed.' },
  { icon: Target, title: 'Sustainability', desc: 'Our farming practices protect the environment while producing nutritious food for our community.' },
  { icon: Sprout, title: 'Community Growth', desc: 'We create jobs, train farmers, and contribute to the economic development of Mpigi district.' },
  { icon: Leaf, title: 'Natural Methods', desc: 'We prioritize organic feed and natural care methods for healthier, tastier products.' },
]

const stats = [
  { value: '6+', label: 'Years of Experience' },
  { value: '10K+', label: 'Chicks Raised' },
  { value: '500+', label: 'Happy Customers' },
  { value: '50+', label: 'Farmers Trained' },
]

export default function About() {
  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-[1200px] mx-auto">
          <span className="eyebrow mb-3 block">About Us</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Our Farm Story
          </h1>
          <p className="font-serif text-base lg:text-lg max-w-[700px]" style={{ color: 'var(--text-muted)' }}>
            From humble beginnings to becoming one of Mpigi's trusted poultry farms — a journey built on passion, hard work, and community.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="eyebrow mb-3 block">Our Story</span>
              <h2 className="font-serif text-3xl sm:text-4xl mb-5" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Raising Healthy Chickens, Empowering Farmers
              </h2>
              <div className="space-y-4">
                <p className="font-serif text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Unifiedfarm BLM began as a small family venture in Mpigi, Central Uganda. What started with just a few laying hens has grown into a full-service poultry farm supplying fresh organic eggs, healthy day-old chicks, and expert consultation to farmers across the region.
                </p>
                <p className="font-serif text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Our founder, with years of hands-on experience in poultry farming, established the farm with a vision: to provide quality poultry products while promoting sustainable farming practices that protect both the environment and the livelihoods of local farmers.
                </p>
                <p className="font-serif text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Today, Unifiedfarm BLM stands as a testament to what passion and dedication can achieve. We continue to expand our operations while staying true to our core values of quality, community, and sustainability.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl h-64 lg:h-80"
                style={{
                  backgroundImage: 'url(/images/about-farm.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 4px 24px rgba(40, 54, 24, 0.08)',
                }}
              />
              <div
                className="rounded-2xl h-64 lg:h-80 mt-8"
                style={{
                  backgroundImage: 'url(/images/about-produce.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 4px 24px rgba(40, 54, 24, 0.08)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl" style={{ background: 'var(--surface)' }}>
                <div className="font-sora text-3xl lg:text-4xl font-semibold mb-1" style={{ color: 'var(--accent)' }}>
                  {stat.value}
                </div>
                <div className="font-sora text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">What Drives Us</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 lg:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'var(--surface)', boxShadow: '0 2px 16px rgba(40,54,24,0.04)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-alt)' }}>
                  <v.icon className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
                </div>
                <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--text-main)' }}>{v.title}</h3>
                <p className="font-serif text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
