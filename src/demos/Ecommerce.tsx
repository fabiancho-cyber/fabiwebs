import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBackButton from '../components/AnimatedBackButton'

gsap.registerPlugin(ScrollTrigger)

type Product = {
  id: number
  name: string
  price: number
  tag: string
  color: string
  img: string
  category: string
  description: string
  shipping: string
}

type CartItem = Product & { quantity: number }

const formatPrice = (price: number) => `$${price.toLocaleString('es-CO')}`

const products: Product[] = [
  { id: 1, name: 'Mochila Urbana Pro', price: 149900, tag: 'NUEVO', color: '#00e5ff', category: 'ACCESORIOS', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=550&fit=crop&auto=format', description: 'Diseño resistente y versátil para acompañarte en cada trayecto urbano.', shipping: 'Envío gratis en 24-48 horas' },
  { id: 2, name: 'Audífonos Wireless X1', price: 289000, tag: 'BESTSELLER', color: '#7c3aed', category: 'TECNOLOGÍA', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=550&fit=crop&auto=format', description: 'Audio inmersivo, cancelación de ruido y hasta 30 horas de batería.', shipping: 'Despacho express en 24 horas' },
  { id: 3, name: 'Smartwatch Ultra', price: 420000, tag: '-20%', color: '#10b981', category: 'TECNOLOGÍA', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=550&fit=crop&auto=format', description: 'Monitorea tu actividad y mantente conectado con una pantalla brillante y resistente.', shipping: 'Envío asegurado en 2-3 días' },
  { id: 4, name: 'Lentes de Sol Premium', price: 95000, tag: 'EXCLUSIVO', color: '#00e5ff', category: 'LIFESTYLE', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=550&fit=crop&auto=format', description: 'Protección UV400 y montura ligera con un acabado premium.', shipping: 'Envío nacional en 2-4 días' },
]

const categories = ['TODO', 'TECNOLOGÍA', 'ACCESORIOS', 'LIFESTYLE', 'NUEVA COLECCIÓN']

function Product3DCard({ product, onSelect, onAdd }: { product: Product; onSelect: () => void; onAdd: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { name, price, tag, color, img } = product
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`
  }
  const handleMouseLeave = () => { if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)' }

  return (
    <div ref={cardRef} onClick={onSelect} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.3s', transformStyle: 'preserve-3d' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 60px ${color}20, 0 0 0 1px ${color}30` }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0a0a14' }}>
        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }} />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: color, padding: '0.25rem 0.6rem' }}><span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: '#060609', fontWeight: 700 }}>{tag}</span></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,14,24,0.8) 0%, transparent 50%)' }} />
      </div>
      <div style={{ padding: '1.25rem' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem' }}>TIENDA NEXO</p>
        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#e8eaf0', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>{name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.3rem', fontWeight: 700, color }}>{formatPrice(price)}</span>
          <button onClick={e => { e.stopPropagation(); onAdd() }} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#060609', background: color, padding: '0.5rem 0.9rem', border: 'none', cursor: 'pointer' }}>+ AÑADIR</button>
        </div>
      </div>
    </div>
  )
}

function Modal({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(2,2,8,0.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
    <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: wide ? 760 : 560, maxHeight: '90vh', overflowY: 'auto', background: '#0e0e18', border: '1px solid rgba(0,229,255,0.3)', boxShadow: '0 20px 80px rgba(0,0,0,0.55)' }}>{children}</div>
  </div>
}

function ProductDetail({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: () => void }) {
  return <Modal onClose={onClose} wide>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,0.9fr) minmax(0,1.1fr)' }}>
      <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', minHeight: 360, objectFit: 'cover' }} />
      <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)' }}>
        <button onClick={onClose} aria-label="Cerrar detalle" style={{ float: 'right', background: 'none', border: 0, color: '#00e5ff', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: product.color, marginBottom: '1rem' }}>{product.tag} / {product.category}</p>
        <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1, color: '#e8eaf0', marginBottom: '1rem' }}>{product.name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{product.description}</p>
        <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 700, color: product.color }}>{formatPrice(product.price)}</p>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', margin: '1.5rem 0 2rem' }}>◈ {product.shipping}<br /><br />◈ Garantía de 12 meses incluida</p>
        <button onClick={onAdd} style={{ width: '100%', background: product.color, color: '#060609', border: 0, padding: '1rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.16em', cursor: 'pointer' }}>AÑADIR AL CARRITO</button>
      </div>
    </div>
  </Modal>
}

export default function EcommerceDemo() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [payment, setPayment] = useState('card')
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  const addToCart = (product: Product) => setCart(items => {
    const existing = items.find(item => item.id === product.id)
    return existing ? items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]
  })
  const updateQuantity = (id: number, delta: number) => setCart(items => items.flatMap(item => item.id === id ? [{ ...item, quantity: item.quantity + delta }].filter(i => i.quantity > 0) : [item]))
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 200000 || subtotal === 0 ? 0 : 12000
  const total = subtotal + shipping
  const visibleProducts = activeCat === 0 || activeCat === 4 ? products : products.filter(p => p.category === categories[activeCat])

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

  const scrollToProducts = () => document.getElementById('ec-products')?.scrollIntoView({ behavior: 'smooth' })
  const beginCheckout = () => { setCartOpen(false); setCheckoutOpen(true); setSubmitted(false); setFormError('') }
  const submitCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) { setFormError('Completa los campos obligatorios para continuar.'); return }
    setFormError(''); setSubmitted(true)
  }

  return (
    <div style={{ background: '#06060d', minHeight: '100vh', color: '#e8eaf0' }}>
      <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <AnimatedBackButton dark />
        <button onClick={() => setCartOpen(true)} style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', pointerEvents: 'all', background: 'rgba(6,6,13,0.9)', border: '1px solid rgba(0,229,255,0.3)', color: '#00e5ff', padding: '0.6rem 1.2rem', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>🛒 CARRITO {cartCount > 0 && `(${cartCount})`}</button>
      </div>

      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.05) 0%, transparent 55%), #06060d' }}>
        <div style={{ position: 'absolute', right: '5%', top: '10%', width: 300, height: 300, pointerEvents: 'none' }}>
          <style>{`@keyframes spinRing { from { transform: rotateX(70deg) rotateZ(0deg); } to { transform: rotateX(70deg) rotateZ(360deg); } }`}</style>
          {[1, 0.7, 0.45].map((scale, i) => <div key={i} style={{ position: 'absolute', inset: `${i * 30}px`, border: `1px solid rgba(0,229,255,${0.35 - i * 0.08})`, borderRadius: '50%', animation: `spinRing ${8 + i * 3}s linear ${i * 0.8}s infinite`, transformStyle: 'preserve-3d' }} />)}
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(6rem,12vh,8rem) clamp(1.25rem,5vw,2.5rem) 4rem', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>{['TIENDA EN LÍNEA', 'DEMO — FABIWEBS'].map(t => <span key={t} className="ec-tag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.75)', border: '1px solid rgba(0,229,255,0.2)', padding: '0.35rem 0.8rem', background: 'rgba(0,229,255,0.05)', opacity: 0 }}>{t}</span>)}</div>
          <h1 className="ec-title" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(3rem,9vw,9rem)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.03em', color: '#e8eaf0', marginBottom: '1.5rem', opacity: 0 }}>TIENDA<br /><span style={{ color: '#00e5ff' }}>NEXO</span></h1>
          <p className="ec-sub" style={{ fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 460, lineHeight: 1.85, marginBottom: '2.5rem', opacity: 0 }}>Productos premium seleccionados. Calidad garantizada con envíos a todo Colombia.</p>
          <div className="ec-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0, marginBottom: '2rem' }}>
            <button onClick={scrollToProducts} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#06060d', background: '#00e5ff', padding: '1rem 2.2rem', border: 'none', cursor: 'pointer' }}>VER CATÁLOGO</button>
            <button onClick={scrollToProducts} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#e8eaf0', background: 'transparent', padding: '1rem 2.2rem', border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer' }}>OFERTAS DEL DÍA</button>
          </div>
          <div className="ec-btns" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', opacity: 0 }}>{[['500+', 'PRODUCTOS'], ['24H', 'ENVÍO'], ['4.9★', 'VALORACIÓN']].map(([n, l]) => <div key={l}><p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: '#00e5ff' }}>{n}</p><p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>{l}</p></div>)}</div>
        </div>
      </section>

      <section id="ec-products" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#06060d' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: 'clamp(2rem,5vh,4rem)' }}>
            <div><span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.4)', display: 'block', marginBottom: '0.75rem' }}>CATÁLOGO</span><h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,4.5rem)', fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.02em' }}>PRODUCTOS</h2></div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{categories.map((c, i) => <button key={c} onClick={() => setActiveCat(i)} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', padding: '0.5rem 0.9rem', border: '1px solid', borderColor: activeCat === i ? '#00e5ff' : 'rgba(255,255,255,0.1)', color: activeCat === i ? '#00e5ff' : 'rgba(255,255,255,0.4)', background: activeCat === i ? 'rgba(0,229,255,0.08)' : 'transparent', cursor: 'pointer' }}>{c}</button>)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,240px),1fr))', gap: '1.5rem' }}>{visibleProducts.map(p => <div key={p.id} className="ec-card" style={{ opacity: 0 }}><Product3DCard product={p} onSelect={() => setSelectedProduct(p)} onAdd={() => addToCart(p)} /></div>)}</div>
          <div style={{ marginTop: 'clamp(4rem,8vh,7rem)', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(0,229,255,0.5)', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TAMBIÉN TE PUEDE GUSTAR</p>
            <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '1.5rem' }}>SELECCIÓN DE LA SEMANA</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>{products.slice(0, 3).map(p => <button key={p.id} onClick={() => setSelectedProduct(p)} style={{ textAlign: 'left', flex: '1 1 180px', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#e8eaf0', cursor: 'pointer' }}><span style={{ color: p.color, fontFamily: 'Space Mono, monospace', fontSize: '0.6rem' }}>{p.tag}</span><br /><strong style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.05rem' }}>{p.name}</strong><br /><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{formatPrice(p.price)}</span></button>)}</div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(3rem,8vh,6rem) 0', background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(26,107,255,0.05), rgba(124,58,237,0.08))', borderTop: '1px solid rgba(0,229,255,0.1)', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}><div><h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 700, lineHeight: 1.1 }}>ENVÍO GRATIS<br /><span style={{ color: '#00e5ff' }}>EN COMPRAS GRANDES</span></h2><p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem' }}>Válido para todo Colombia. Sin código necesario.</p></div><button onClick={() => navigate('/')} style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#06060d', background: '#00e5ff', padding: '1.1rem 2.5rem', border: 'none', cursor: 'pointer' }}>QUIERO MI TIENDA →</button></div>
      </section>
      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}>DEMO CREADO POR FABIWEBS · fabiwebs.com</div>

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={() => { addToCart(selectedProduct); setSelectedProduct(null); setCartOpen(true) }} />}
      {cartOpen && <Modal onClose={() => setCartOpen(false)}><div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)' }}><button onClick={() => setCartOpen(false)} style={{ float: 'right', background: 'none', border: 0, color: '#00e5ff', fontSize: '1.4rem', cursor: 'pointer' }}>×</button><p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: '#00e5ff', letterSpacing: '0.2em' }}>TIENDA NEXO</p><h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>TU CARRITO</h2>{cart.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.5)', padding: '2rem 0' }}>Tu carrito está vacío. Explora el catálogo para añadir productos.</p> : <>{cart.map(item => <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}><img src={item.img} alt="" style={{ width: 58, height: 68, objectFit: 'cover' }} /><div style={{ flex: 1 }}><strong style={{ fontFamily: 'Rajdhani, sans-serif' }}>{item.name}</strong><p style={{ color: item.color, fontSize: '0.85rem' }}>{formatPrice(item.price)}</p><div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: '1px solid #555', color: '#fff', width: 24, cursor: 'pointer' }}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: '1px solid #555', color: '#fff', width: 24, cursor: 'pointer' }}>+</button><button onClick={() => setCart(items => items.filter(i => i.id !== item.id))} style={{ marginLeft: '0.5rem', background: 'none', border: 0, color: '#f87171', cursor: 'pointer', fontSize: '0.7rem' }}>ELIMINAR</button></div></div></div>)}<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', color: 'rgba(255,255,255,0.55)' }}><span>Envío</span><span>{shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span></div><div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0 1.5rem', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.5rem' }}><span>TOTAL</span><span style={{ color: '#00e5ff' }}>{formatPrice(total)}</span></div><button onClick={beginCheckout} style={{ width: '100%', background: '#00e5ff', color: '#06060d', border: 0, padding: '1rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer' }}>CONTINUAR AL PAGO</button></>}</div></Modal>}
      {checkoutOpen && <Modal onClose={() => setCheckoutOpen(false)} wide><div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)' }}>{submitted ? <div style={{ textAlign: 'center', padding: '2rem 0' }}><p style={{ fontSize: '3rem', color: '#10b981' }}>✓</p><h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem' }}>¡PEDIDO CONFIRMADO!</h2><p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>Esta es una demostración: no se realizó ningún cobro real.<br />Recibirías la confirmación en tu correo.</p><button onClick={() => { setCheckoutOpen(false); setCart([]) }} style={{ marginTop: '1.5rem', background: '#00e5ff', border: 0, padding: '0.9rem 1.8rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, cursor: 'pointer' }}>VOLVER A LA TIENDA</button></div> : <><button onClick={() => setCheckoutOpen(false)} style={{ float: 'right', background: 'none', border: 0, color: '#00e5ff', fontSize: '1.4rem', cursor: 'pointer' }}>×</button><p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: '#00e5ff', letterSpacing: '0.2em' }}>CHECKOUT DEMO</p><h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>DATOS DE ENVÍO Y PAGO</h2><form onSubmit={submitCheckout}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>{['Nombre completo', 'Correo electrónico', 'Dirección de envío', 'Ciudad'].map(label => <label key={label} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>{label}<input required type={label === 'Correo electrónico' ? 'email' : 'text'} style={{ display: 'block', width: '100%', marginTop: '0.4rem', padding: '0.8rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} /></label>)}</div><p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', margin: '1.5rem 0 0.75rem' }}>MÉTODO DE PAGO (SIMULADO)</p><div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>{[['card', 'Tarjeta'], ['pse', 'PSE'], ['cash', 'Contraentrega']].map(([value, label]) => <button type="button" key={value} onClick={() => setPayment(value)} style={{ flex: '1 1 130px', padding: '0.8rem', background: payment === value ? 'rgba(0,229,255,0.12)' : 'transparent', color: payment === value ? '#00e5ff' : '#fff', border: `1px solid ${payment === value ? '#00e5ff' : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer' }}>{label}</button>)}</div><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: '1rem 0' }}>Pago seguro de demostración · Total: <strong style={{ color: '#00e5ff' }}>{formatPrice(total)}</strong></p>{formError && <p role="alert" style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem' }}>{formError}</p>}<button type="submit" style={{ width: '100%', background: '#00e5ff', color: '#06060d', border: 0, padding: '1rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer' }}>CONFIRMAR PEDIDO</button></form></>}</div></Modal>}
    </div>
  )
}
