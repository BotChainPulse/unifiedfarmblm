import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import {
  Heart,
  Shield,
  Users,
  Leaf,
  ArrowRight,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Plus,
  X,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'

/* ──────────────────────── HERO SECTION ──────────────────────── */
function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, hovering: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    let animId = 0
    let startTime = Date.now()

    // Vertex shader
    const vertSrc = `
      attribute vec2 a_pos;
      void main(){gl_Position=vec4(a_pos,0.0,1.0);}
    `

    // Fragment shader - soil topographical plane
    const fragSrc = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_res;
      uniform vec2 u_mouse;
      uniform float u_hover;

      float hash(vec2 p){
        return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
      }
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);
        float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
        vec2 u=f*f*(3.0-2.0*f);
        return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
      }
      float fbm(vec2 p){
        float v=0.0,a=0.5;
        for(int i=0;i<5;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
        return v;
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/u_res;
        float t=u_time*0.15;

        float elev=fbm(uv*5.0+t)*4.0+fbm(uv*10.0-t*0.5)*1.5;
        float slope=noise(uv*15.0+t*0.2);

        vec3 col=mix(vec3(0.937,0.929,0.878),vec3(0.831,0.639,0.451),smoothstep(0.0,1.0,elev));
        col=mix(col,vec3(0.910,0.925,0.788),smoothstep(1.0,3.0,elev));
        col=mix(col,vec3(0.737,0.424,0.145),smoothstep(3.0,5.5,elev));
        col+=vec3(0.961,0.976,0.878)*slope*0.5;
        col+=vec3(1.0,0.878,0.627)*smoothstep(0.4,0.6,elev)*0.3;
        col-=vec3(0.157,0.212,0.094)*smoothstep(0.3,0.8,slope)*0.2;

        float md=length(u_mouse-uv*u_res);
        float mg=u_hover*smoothstep(300.0,0.0,md)*0.3;
        col+=vec3(1.0,0.878,0.627)*mg;

        gl_FragColor=vec4(col,1.0);
      }
    `

    function compileShader(src: string, type: number) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compileShader(vertSrc, gl.VERTEX_SHADER))
    gl.attachShader(prog, compileShader(fragSrc, gl.FRAGMENT_SHADER))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uHover = gl.getUniformLocation(prog, 'u_hover')

    let hoverVal = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas!.width = canvas!.offsetWidth * dpr
      canvas!.height = canvas!.offsetHeight * dpr
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
    }
    resize()
    window.addEventListener('resize', resize)

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000
      gl!.uniform1f(uTime, elapsed)
      gl!.uniform2f(uRes, canvas!.width, canvas!.height)

      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      const mx = mouseRef.current.hovering ? (mouseRef.current.x - rect.left) * dpr : -1000
      const my = mouseRef.current.hovering ? (rect.height - (mouseRef.current.y - rect.top)) * dpr : -1000
      gl!.uniform2f(uMouse, mx, my)

      const targetHover = mouseRef.current.hovering ? 1.0 : 0.0
      hoverVal += (targetHover - hoverVal) * 0.1
      gl!.uniform1f(uHover, hoverVal)

      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      animId = requestAnimationFrame(animate)
    }
    animate()

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.hovering = true
    }
    const onLeave = () => { mouseRef.current.hovering = false }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '100vh', background: '#FEFAE0' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 25% 50%, rgba(254, 250, 224, 0.85) 0%, rgba(254, 250, 224, 0) 100%)',
          zIndex: 1,
        }}
      />
      {/* Hero image overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/hero-farm.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 lg:px-20"
        style={{ maxWidth: 620 }}
      >
        <span className="eyebrow mb-4" style={{ color: 'var(--secondary)' }}>
          Family-Run Poultry Farm in Mpigi, Uganda
        </span>
        <h1
          className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5"
          style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}
        >
          Fresh From Our Farm to Your Table
        </h1>
        <p className="font-serif text-base lg:text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: 440 }}>
          Premium poultry products from Mpigi, Uganda. We raise healthy chickens, produce fresh organic eggs, and supply quality day-old chicks to farmers across the region.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products" className="btn-primary gap-2">
            View Products
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/256708813419"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary gap-2"
          >
            <Phone className="w-4 h-4" />
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
      </div>
    </section>
  )
}

/* ──────────────────────── WELCOME SECTION ──────────────────────── */
function WelcomeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section-pad flex items-center justify-center px-4 sm:px-6"
      style={{ background: 'var(--bg-alt)' }}
    >
      <div className="max-w-[720px] text-center">
        <span className="eyebrow mb-4 block">Welcome</span>
        <h2
          className={`font-serif text-3xl sm:text-4xl lg:text-5xl mb-6 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          Raising Healthy Chickens, Empowering Farmers
        </h2>
        <p
          className={`font-serif text-base lg:text-lg leading-relaxed transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ color: 'var(--text-muted)' }}
        >
          Unifiedfarm BLM is a family-run poultry farm located in Mpigi, Uganda. We specialize in producing fresh organic eggs, breeding healthy day-old chicks, and providing expert guidance to both new and experienced poultry farmers. Our mission is to deliver quality poultry products while promoting sustainable farming practices in our community.
        </p>
      </div>
    </section>
  )
}

/* ──────────────────────── PRODUCTS SECTION ──────────────────────── */
const products = [
  { name: 'Fresh Organic Eggs', desc: 'Farm-fresh brown eggs collected daily from free-range layers. Rich in nutrients and flavor.', price: 'UGX 15,000 / tray', image: '/images/product-eggs.jpg' },
  { name: 'Day-Old Chicks', desc: 'Vaccinated and healthy broiler and layer chicks ready for your farm.', price: 'UGX 3,500 each', image: '/images/product-chicks.jpg' },
  { name: 'Brooded Chicks (1 Month)', desc: 'One-month-old chicks raised under optimal conditions. Strong and ready to grow.', price: 'UGX 8,000 each', image: '/images/product-brooded.jpg' },
  { name: 'Mature Layers', desc: 'Healthy point-of-lay hens vaccinated and prepared for immediate egg production.', price: 'UGX 35,000 each', image: '/images/product-layers.jpg' },
  { name: 'Organic Chicken Manure', desc: 'Natural fertilizer for your crops. Rich in nitrogen, phosphorus, and potassium.', price: 'UGX 50,000 / ton', image: '/images/product-manure.jpg' },
  { name: 'Farm Consultation', desc: 'Expert advice on poultry housing, feeding, disease prevention, and business planning.', price: 'Contact for rates', image: '/images/product-consultation.jpg' },
]

function ProductsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Our Products
          </h2>
          <p className="font-sora text-sm" style={{ color: 'var(--text-muted)' }}>
            What we offer fresh from the farm
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-9">
          {products.map((product, i) => (
            <div
              key={product.name}
              className="tilt-card cursor-pointer"
              style={{
                animationDelay: `${i * 0.08}s`,
                transform:
                  hoveredIndex === i
                    ? 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
                    : 'perspective(1000px) rotateY(-8deg) rotateX(5deg)',
                transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="tilt-card__inner">
                <div
                  className="tilt-card__image"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <h3 className="tilt-card__title">{product.name}</h3>
                <p className="tilt-card__description">{product.desc}</p>
                <span className="tilt-card__price">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── WHY CHOOSE US ──────────────────────── */
const features = [
  { icon: Heart, title: 'Family-Run Quality', desc: 'Every bird is raised with care on our Mpigi farm. We treat our chickens like family, ensuring healthy, happy animals.' },
  { icon: Shield, title: 'Vaccinated & Healthy', desc: 'All chicks and layers receive proper vaccinations and health checks before leaving our farm.' },
  { icon: Users, title: 'Expert Guidance', desc: "We don't just sell products — we walk with you. Get free advice when you buy from us." },
  { icon: Leaf, title: 'Community Focused', desc: 'We train local farmers and create jobs in Mpigi district. Your purchase supports Ugandan agriculture.' },
]

function WhyChooseUsSection() {
  return (
    <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-center mb-12" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          The Unifiedfarm Difference
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-9">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="p-8 lg:p-10 rounded-2xl transition-all duration-400 hover:-translate-y-1"
              style={{
                background: 'var(--surface)',
                boxShadow: '0 2px 16px rgba(40, 54, 24, 0.04)',
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'var(--bg-alt)' }}
              >
                <f.icon className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
              </div>
              <h3 className="font-serif text-xl lg:text-2xl mb-3" style={{ color: 'var(--text-main)' }}>
                {f.title}
              </h3>
              <p className="font-serif text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── MAP SECTION ──────────────────────── */
function MapSection() {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let map: any = null
    let L: any = null

    async function initMap() {
      const leaflet = await import('leaflet')
      L = leaflet.default || leaflet
      await import('leaflet/dist/leaflet.css')

      if (!mapContainerRef.current) return

      map = L.map(mapContainerRef.current).setView([0.225, 32.32], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:36px;height:36px;background:var(--secondary, #606C38);border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #FEFAE0;box-shadow:0 2px 8px rgba(0,0,0,0.3);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FEFAE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      })

      L.marker([0.225, 32.32], { icon: customIcon })
        .addTo(map)
        .bindPopup('<b>Unifiedfarm BLM</b><br>Mpigi, Uganda')
    }

    initMap()

    return () => {
      if (map) map.remove()
    }
  }, [])

  return (
    <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div
            ref={mapContainerRef}
            className="w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(40, 54, 24, 0.08)' }}
          />
          <div>
            <span className="eyebrow mb-3 block">Our Location</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-5" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Visit Us in Mpigi, Uganda
            </h2>
            <p className="font-serif text-base mb-6" style={{ color: 'var(--text-muted)' }}>
              Mpigi District, Central Region, Uganda. We welcome visitors who want to see our farm operations and learn about poultry farming firsthand.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 shrink-0" style={{ color: 'var(--secondary)' }} />
                <span className="font-sora text-sm" style={{ color: 'var(--text-main)' }}>Mpigi District, Central Region, Uganda</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" style={{ color: 'var(--secondary)' }} />
                <span className="font-sora text-sm" style={{ color: 'var(--text-main)' }}>+256 708 813 419</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0" style={{ color: 'var(--secondary)' }} />
                <span className="font-sora text-sm" style={{ color: 'var(--text-main)' }}>ryglutwa0@gmail.com</span>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/dir//Mpigi,+Uganda"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary gap-2 text-xs"
            >
              Get Directions
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── VISITOR COMMENTS SECTION ──────────────────────── */
function VisitorCommentsSection() {
  const { data: comments } = trpc.comment.list.useQuery()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' })
  const createComment = trpc.comment.create.useMutation({
    onSuccess: () => {
      toast.success('Comment submitted! It will appear after approval.')
      setShowModal(false)
      setFormData({ name: '', email: '', comment: '' })
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createComment.mutate(formData)
  }

  return (
    <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Visitor Comments
          </h2>
          <p className="font-sora text-sm" style={{ color: 'var(--text-muted)' }}>
            See what farmers and customers say about us
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {comments && comments.length > 0 ? (
            comments.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="p-6 lg:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-sora text-sm font-medium"
                    style={{ background: 'var(--primary)', color: '#FEFAE0' }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-serif text-base" style={{ color: 'var(--text-main)' }}>{c.name}</h4>
                    <span className="font-sora text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <Calendar className="w-3 h-3" />
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
                <p className="font-serif text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {c.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: 'var(--secondary)' }} />
              <p className="font-serif text-base" style={{ color: 'var(--text-muted)' }}>
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Add a Comment
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(40, 54, 24, 0.4)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl p-6 lg:p-8"
              style={{ background: 'var(--bg)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-2xl" style={{ color: 'var(--text-main)' }}>Leave a Comment</h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-black/5">
                  <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4A373]"
                    style={{ background: 'var(--surface)', color: 'var(--text-main)' }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl font-sora text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4A373]"
                    style={{ background: 'var(--surface)', color: 'var(--text-main)' }}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="font-sora text-xs uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Comment</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl font-serif text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#D4A373] resize-none"
                    style={{ background: 'var(--surface)', color: 'var(--text-main)' }}
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={createComment.isPending}
                  className="btn-primary w-full"
                >
                  {createComment.isPending ? 'Submitting...' : 'Submit Comment'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ──────────────────────── CTA SECTION ──────────────────────── */
function CTASection() {
  return (
    <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Ready to Stock Your Farm?
        </h2>
        <p className="font-serif text-base lg:text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
          Whether you need fresh eggs for your shop or chicks for your new poultry project, we are here to supply. Reach out today and let us grow together.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn-primary gap-2">
            Contact Us Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://shambani-market.africa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary gap-2"
          >
            Visit ShambaNi Marketplace
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────── HOME PAGE ──────────────────────── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <ProductsSection />
      <WhyChooseUsSection />
      <MapSection />
      <VisitorCommentsSection />
      <CTASection />
    </>
  )
}
