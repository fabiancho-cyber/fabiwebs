import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBackButton from '../components/AnimatedBackButton'

gsap.registerPlugin(ScrollTrigger)

// ─── 3D PRODUCT CARD ─────────────────────────────────────────────────────────
function Product3DCard({ name, price, tag, color, img }: { name: string; price: string; tag: string; color: string; img: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.3s', transformStyle: 'preserve-3d' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${color}20, 0 0 0 1px ${color}30` }}
      onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0a0a14' }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: color, padding: '0.25rem 0.6rem' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: '#060609', fontWeight: 700 }}>{tag}</span>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,14,24,0.8) 0%, transparent 50%)' }} />
      </div>
      <div style={{ padding: '1.25rem' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem' }}>NEXO STORE</p>
        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#e8eaf0', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>{name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: color }}>{price}</span>
          <button style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#060609', background: color, padding: '0.5rem 0.9rem', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>+ AÑADIR</button>
        </div>
      </div>
    </div>
  )
}

// ─── FLOATING RINGS 3D ───────────────────────────────────────────────────────
function FloatingRings() {
  return (
    <div style={{ position: 'absolute', right: '5%', top: '10%', width: 300, height: 300, pointerEvents: 'none' }}>
      <style>{`@keyframes spinRing { from { transform: rotateX(70deg) rotateZ(0deg); } to { transform: rotateX(70deg) rotateZ(360deg); } } @keyframes floatUp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }`}</style>
      {[1, 0.7, 0.45].map((scale, i) => (
        <div key={i} style={{
          position: 'absolute', inset: `${i * 30}px`,
          border: `1px solid rgba(0,229,255,${0.35 - i * 0.08})`,
          borderRadius: '50%',
          animation: `spinRing ${8 + i * 3}s linear ${i * 0.8}s infinite`,
          transformStyle: 'preserve-3d',
        }} />
      ))}
      <div style={{ position: 'absolute', inset: '90px', background: 'radial-gradient(circle, rgba(0,229,255,0.15), transparent)', borderRadius: '50%', animation: 'floatUp 4s ease-in-out infinite' }} />
    </div>
  )
}

const products = [
  { name: 'Mochila Urbana Pro', price: '$149.900', tag: 'NUEVO', color: '#00e5ff', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=550&fit=crop&auto=format' },
  { name: 'Audífonos Wireless X1', price: '$289.000', tag: 'BESTSELLER', color: '#7c3aed', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=550&fit=crop&auto=format' },
  { name: 'Smartwatch Ultra', price: '$420.000', tag: '-20%', color: '#10b981', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=550&fit=crop&auto=format' },
  { name: 'Lentes de Sol Premium', price: '$95.000', tag: 'EXCLUSIVO', color: '#00e5ff', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=550&fit=crop&auto=format' },
]

const categories = ['TODO', 'TECNOLOGÍA', 'ACCESORIOS', 'LIFESTYLE', 'NUEVA COLECCIÓN']

export default function EcommerceDemo() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState(0)
  const [cart, setCart] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    const tl = gsap.timeline()
    tl.fromTo('.ec-tag', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out' }, 0.3)
      .fromTo('.ec-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5)
      .fromTo('.ec-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.85)
      .fromTo('.ec-btns', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 1.1)

    gsap.fromTo('.ec-card', { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '#ec-products', start: 'top 80%' } })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <div style={{ background: '#06060d', minHeight: '100vh', color: '#e8eaf0' }}>
      {/* Back + Cart */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <AnimatedBackButton dark />
        <button onClick={() => setCart(c => c + 1)} style={{ pointerEvents: 'all', background: 'rgba(6,6,13,0.9)', border: '1px solid rgba(0,229,255,0.3)', color: '#00e5ff', padding: '0.6rem 1.2rem', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>
          🛒 CARRITO {cart > 0 && `(${cart})`}
        </button>
      </div>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.05) 0%, transparent 55%), #06060d' }}>
        <FloatingRings />

        {/* Grid decorativo */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(6rem,12vh,8rem) clamp(1.25rem,5vw,2.5rem) 4rem', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {['TIENDA EN LÍNEA', 'DEMO — FABIWEBS'].map(t => <span key={t} className="ec-tag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.75)', border: '1px solid rgba(0,229,255,0.2)', padding: '0.35rem 0.8rem', background: 'rgba(0,229,255,0.05)', opacity: 0 }}>{t}</span>)}
          </div>

          <h1 className="ec-title" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(3rem,9vw,9rem)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.03em', color: '#e8eaf0', marginBottom: '1.5rem', opacity: 0 }}>
            NEXO<br />
            <span style={{ color: '#00e5ff' }}>STORE</span>
          </h1>

          <p className="ec-sub" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 460, lineHeight: 1.85, marginBottom: '2.5rem', opacity: 0 }}>
            Productos premium seleccionados. Calidad garantizada con envíos a todo Colombia.
          </p>

          <div className="ec-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0, marginBottom: '2rem' }}>
            <button style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#06060d', background: '#00e5ff', padding: '1rem 2.2rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; e.currentTarget.style.background = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = '#00e5ff' }}>VER CATÁLOGO</button>
            <button style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#e8eaf0', background: 'transparent', padding: '1rem 2.2rem', border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#e8eaf0' }}>OFERTAS DEL DÍA</button>
          </div>

          {/* Stats */}
          <div className="ec-btns" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', opacity: 0 }}>
            {[['500+', 'PRODUCTOS'], ['24H', 'ENVÍO'], ['4.9★', 'VALORACIÓN']].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#00e5ff' }}>{n}</p>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section id="ec-products" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#06060d' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: 'clamp(2rem,5vh,4rem)' }}>
            <div>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.4)', display: 'block', marginBottom: '0.75rem' }}>CATÁLOGO</span>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,4.5rem)', fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.02em' }}>PRODUCTOS</h2>
            </div>
            {/* Categorías */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((c, i) => (
                <button key={c} onClick={() => setActiveCat(i)} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', padding: '0.5rem 0.9rem', border: '1px solid', borderColor: activeCat === i ? '#00e5ff' : 'rgba(255,255,255,0.1)', color: activeCat === i ? '#00e5ff' : 'rgba(255,255,255,0.4)', background: activeCat === i ? 'rgba(0,229,255,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.25s' }}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,240px),1fr))', gap: '1.5rem' }}>
            {products.map((p, i) => <div key={i} className="ec-card" style={{ opacity: 0 }}><Product3DCard {...p} /></div>)}
          </div>
        </div>
      </section>

      {/* BANNER PROMO */}
      <section style={{ padding: 'clamp(3rem,8vh,6rem) 0', background: 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(26,107,255,0.05) 50%, rgba(124,58,237,0.08) 100%)', borderTop: '1px solid rgba(0,229,255,0.1)', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 700, color: '#e8eaf0', lineHeight: 1.1 }}>ENVÍO GRATIS<br /><span style={{ color: '#00e5ff' }}>EN COMPRAS +$200K</span></h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem' }}>Válido para todo Colombia. Sin código necesario.</p>
          </div>
          <button onClick={() => navigate('/')} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', letterSpacing: '0.2em', fontWeight: 700, color: '#06060d', background: '#00e5ff', padding: '1.1rem 2.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; e.currentTarget.style.background = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = '#00e5ff' }}>QUIERO MI TIENDA →</button>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}>
        DEMO CREADO POR FABIWEBS · fabiwebs.com
      </div>
    </div>
  )
}
