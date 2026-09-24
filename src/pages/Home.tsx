import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// En recarga real borramos el flag; en back/forward lo conservamos
const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type
if (navType === 'reload') sessionStorage.removeItem('fw-intro')

let introShown = sessionStorage.getItem('fw-intro') === '1'

const IMG = {
  code: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1800&h=1000&fit=crop&auto=format',
  proj1: 'https://images.unsplash.com/photo-1669236392019-6e8e0cbef4c1?w=1400&h=900&fit=crop&auto=format',
  proj2: 'https://images.unsplash.com/photo-1608687087182-4c55e18a65d0?w=1400&h=900&fit=crop&auto=format',
  proj3: 'https://images.unsplash.com/photo-1776278806688-64ef6a7e2cc5?w=1400&h=900&fit=crop&auto=format',
  proj4: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1400&h=900&fit=crop&auto=format',
  before: 'https://images.unsplash.com/photo-1785245560368-f6d715956e5d?w=900&h=600&fit=crop&auto=format',
  after: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=900&h=600&fit=crop&auto=format',
  creator: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=700&h=900&fit=crop&auto=format',
}

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1800&h=1000&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1753715613457-63127ec40824?w=1800&h=1000&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1800&h=1000&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1692106979244-a2ac98253f6b?w=1800&h=1000&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1800&h=1000&fit=crop&auto=format',
]

function FabiwebsLogo({ size = 40 }: { size?: number }) {
  const scale = size / 40
  return (
    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: `${size * 0.9}px`, fontWeight: 700, letterSpacing: '0.18em', color: '#e8eaf0', lineHeight: 1, display: 'inline-flex', alignItems: 'center', gap: `${4 * scale}px`, userSelect: 'none' }}>
      <span style={{ color: '#00e5ff' }}>FABI</span>
      <span style={{ width: `${2 * scale}px`, height: `${size * 0.7}px`, background: 'rgba(0,229,255,0.35)', display: 'inline-block', flexShrink: 0 }} />
      <span>WEBS</span>
      <span style={{ width: `${6 * scale}px`, height: `${6 * scale}px`, borderRadius: '50%', background: '#00e5ff', display: 'inline-block', flexShrink: 0, marginLeft: `${2 * scale}px` }} />
    </span>
  )
}

function Cursor() {
  useEffect(() => {
    const dot = document.getElementById('cursor')
    const ring = document.getElementById('cursor-ring')
    if (!dot || !ring) return
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px' }
    const animate = () => { rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animate) }
    window.addEventListener('mousemove', onMove)
    animate()
    const els = document.querySelectorAll('a, button, input, textarea, [data-hover]')
    els.forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(2.2)'; ring.style.borderColor = 'rgba(0,229,255,0.9)' })
      el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(0,229,255,0.5)' })
    })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return null
}

function ProgressBar() {
  useEffect(() => {
    const bar = document.getElementById('progress-bar')
    if (!bar) return
    const fn = () => { const max = document.documentElement.scrollHeight - window.innerHeight; bar.style.transform = `scaleX(${window.scrollY / max})` }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return <div id="progress-bar" />
}

function Intro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [counter, setCounter] = useState(0)

  const finish = () => { document.body.classList.remove('intro-active'); document.body.style.overflow = ''; onDone() }

  useEffect(() => {
    document.body.classList.add('intro-active')
    const fallback = setTimeout(finish, 5000)
    let c = 0
    const interval = setInterval(() => { c += Math.ceil(Math.random() * 7); if (c >= 100) { c = 100; clearInterval(interval) } setCounter(c) }, 30)

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallback); clearInterval(interval)
        gsap.to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut', onComplete: finish })
      }
    })
    tl.fromTo('.intro-corner', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, stagger: 0.06, duration: 0.35, ease: 'back.out(2)' }, 0.3)
    tl.fromTo('#intro-logo', { opacity: 0, y: 30, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }, 0.5)
    tl.fromTo('#intro-line-h', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.inOut' }, 1.1)
    tl.fromTo('#intro-t1', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 1.5)
    tl.fromTo('#intro-t2', { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 1.65)
    tl.fromTo('.intro-vline', { scaleY: 0 }, { scaleY: 1, stagger: 0.08, duration: 0.5, ease: 'power3.inOut' }, 1.8)
    tl.to('#intro-logo', { x: 3, duration: 0.05 }, 2.0)
    tl.to('#intro-logo', { x: -3, duration: 0.05 }, 2.05)
    tl.to('#intro-logo', { x: 0, duration: 0.05 }, 2.1)
    tl.to({}, { duration: 0.9 })

    return () => { clearInterval(interval); clearTimeout(fallback) }
  }, [])

  return (
    <div id="intro" ref={ref} style={{ position: 'fixed', inset: 0, background: '#050507', zIndex: 8000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', clipPath: 'inset(0 0 0% 0)' }}>
      {[{ top: '15%', left: '10%', borderTop: '2px solid #00e5ff', borderLeft: '2px solid #00e5ff' }, { top: '15%', right: '10%', borderTop: '2px solid #00e5ff', borderRight: '2px solid #00e5ff' }, { bottom: '15%', left: '10%', borderBottom: '2px solid #00e5ff', borderLeft: '2px solid #00e5ff' }, { bottom: '15%', right: '10%', borderBottom: '2px solid #00e5ff', borderRight: '2px solid #00e5ff' }].map((s, i) => (
        <div key={i} className="intro-corner" style={{ position: 'absolute', width: 28, height: 28, opacity: 0, ...s }} />
      ))}
      <div className="intro-vline" style={{ position: 'absolute', left: '10%', top: '18%', bottom: '18%', width: 1, background: 'linear-gradient(to bottom, transparent, rgba(0,229,255,0.2), transparent)', transformOrigin: 'top', transform: 'scaleY(0)' }} />
      <div className="intro-vline" style={{ position: 'absolute', right: '10%', top: '18%', bottom: '18%', width: 1, background: 'linear-gradient(to bottom, transparent, rgba(0,229,255,0.2), transparent)', transformOrigin: 'top', transform: 'scaleY(0)' }} />
      <div id="intro-logo" style={{ opacity: 0, marginBottom: '2.5rem' }}><FabiwebsLogo size={44} /></div>
      <div id="intro-line-h" style={{ width: 'min(320px,70vw)', height: 1, background: 'linear-gradient(90deg,transparent,#00e5ff 30%,#00e5ff 70%,transparent)', transformOrigin: 'center', transform: 'scaleX(0)', marginBottom: '1.75rem' }} />
      <p id="intro-t1" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(0.75rem,2.5vw,1rem)', letterSpacing: '0.55em', color: 'rgba(0,229,255,0.9)', opacity: 0, marginBottom: '0.5rem', textAlign: 'center' }}>EXPERIENCIAS DIGITALES</p>
      <p id="intro-t2" style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(0.55rem,1.5vw,0.68rem)', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.32)', opacity: 0, textAlign: 'center' }}>DISEÑO · CÓDIGO · RESULTADO</p>
      <div style={{ position: 'absolute', bottom: '12%', right: '12%', fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.4)' }}>{String(counter).padStart(3, '0')}%</div>
      <div style={{ position: 'absolute', bottom: '12%', left: '12%', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}>FABIWEBS © 2026</div>
    </div>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn) }, [])
  const links: [string, string][] = [['Proyectos', '#showcase'], ['Servicios', '#services'], ['Planes', '#plans'], ['Contacto', '#contact']]
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 7000, padding: scrolled ? '12px 0' : '24px 0', background: scrolled ? 'rgba(5,5,7,0.94)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all 0.4s ease' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', cursor: 'none', textDecoration: 'none' }}><FabiwebsLogo size={22} /></a>
        <ul className="hidden md:flex" style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {links.map(([label, href]) => (
            <li key={label}><a href={href} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.18em', fontWeight: 600, color: 'rgba(255,255,255,0.55)', cursor: 'none', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => (e.currentTarget.style.color = '#00e5ff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>{label.toUpperCase()}</a></li>
          ))}
        </ul>
        <a href="#contact" className="hidden md:flex" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.78rem', letterSpacing: '0.15em', fontWeight: 700, color: '#050507', background: '#00e5ff', padding: '0.6rem 1.4rem', textDecoration: 'none', cursor: 'none', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.background = '#fff'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)' }} onMouseLeave={e => { e.currentTarget.style.background = '#00e5ff'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>INICIAR PROYECTO</a>
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú" className="mobile-menu-btn" style={{ display: 'none', flexDirection: 'column', gap: '6px', background: 'none', border: 'none', cursor: 'none', padding: '4px' }}>
          {[0, 1, 2].map(i => <span key={i} style={{ display: 'block', height: 1, background: menuOpen ? '#00e5ff' : '#e8eaf0', width: i === 1 ? 18 : 24, transform: menuOpen && i === 0 ? 'rotate(45deg) translate(5px,5px)' : menuOpen && i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : '', opacity: menuOpen && i === 1 ? 0 : 1, transition: 'all 0.3s' }} />)}
        </button>
      </div>
      <div style={{ maxHeight: menuOpen ? '320px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease', background: 'rgba(5,5,7,0.98)', borderTop: menuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
        <ul style={{ listStyle: 'none', padding: '1.5rem clamp(1.25rem,5vw,2.5rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {links.map(([label, href]) => <li key={label}><a href={href} onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.6rem', letterSpacing: '0.15em', fontWeight: 700, color: 'rgba(255,255,255,0.75)', cursor: 'none', textDecoration: 'none' }}>{label.toUpperCase()}</a></li>)}
          <li><a href="#contact" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.15em', fontWeight: 700, color: '#050507', background: '#00e5ff', padding: '0.8rem 1.5rem', textDecoration: 'none', display: 'inline-block', cursor: 'none' }}>INICIAR PROYECTO</a></li>
        </ul>
      </div>
    </nav>
  )
}

function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const mobile = isMobile()
  useEffect(() => { timerRef.current = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 4500); return () => clearInterval(timerRef.current) }, [])
  const sized = (src: string) => mobile ? src.replace('w=1800&h=1000', 'w=900&h=600') : src
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {HERO_SLIDES.map((src, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === current ? 1 : 0, transform: i === current && !mobile ? 'scale(1.04)' : 'scale(1)', transition: 'opacity 1.6s cubic-bezier(0.4,0,0.2,1), transform 8s linear', willChange: i === current ? 'opacity' : 'auto' }}>
          <img src={sized(src)} alt="Programación y desarrollo web" loading={i === 0 ? 'eager' : 'lazy'} decoding={i === 0 ? 'sync' : 'async'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(5,5,7,0.92) 0%,rgba(5,5,7,0.75) 45%,rgba(5,5,7,0.3) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#050507 0%,transparent 40%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,7,0.35)' }} />
      <div style={{ position: 'absolute', bottom: '2.5rem', right: 'clamp(1.25rem,5vw,2.5rem)', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
        {HERO_SLIDES.map((_, i) => <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 20 : 6, height: 2, background: i === current ? '#00e5ff' : 'rgba(255,255,255,0.25)', border: 'none', padding: 0, cursor: 'none', transition: 'all 0.4s ease' }} />)}
      </div>
    </div>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const waLink = `https://wa.me/573164598263?text=${encodeURIComponent('Hola FABIWEBS, quiero hablar sobre un proyecto web.')}`
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 })
    tl.fromTo('.hero-tag', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' })
      .fromTo('.hero-h1', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.2')
      .fromTo('.hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-btns', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
    if (!isMobile()) gsap.to('.hero-content', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
  }, [])
  return (
    <section ref={ref} id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#050507' }}>
      <HeroBanner />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, backgroundImage: 'linear-gradient(rgba(0,229,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.018) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
      <div className="hero-content" style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', padding: 'clamp(7rem,16vh,10rem) clamp(1.25rem,5vw,2.5rem) 5rem', width: '100%' }}>
        <div className="hero-mockups" aria-hidden="true">
          <div className="hero-browser hero-browser-back"><div className="hero-browser-bar"><i /><i /><i /></div><div className="hero-browser-body"><span>TU MARCA</span><b>HAZLA<br />MEMORABLE.</b><em /></div></div>
          <div className="hero-browser hero-browser-front"><div className="hero-browser-bar"><i /><i /><i /><small>fabiwebs.studio</small></div><div className="hero-browser-body hero-browser-accent"><span>FABIWEBS / 2026</span><b>Experiencias<br />digitales.</b><em /></div></div>
          <div className="hero-phone"><div className="hero-phone-notch" /><div className="hero-phone-screen"><span>01 — 04</span><b>CREA<br />EN GRANDE.</b><em /></div></div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
          {['HTML', 'CSS', 'JAVASCRIPT', 'DISEÑO UX/UI', 'ADAPTABLE'].map(t => (
            <span key={t} className="hero-tag" style={{ padding: '0.35rem 0.75rem', fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(0,229,255,0.75)', opacity: 0, border: '1px solid rgba(0,229,255,0.18)', background: 'rgba(0,229,255,0.05)', backdropFilter: 'blur(6px)' }}>{t}</span>
          ))}
        </div>
        <h1 className="hero-h1" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(3.4rem,9.5vw,9.5rem)', fontWeight: 700, lineHeight: 0.88, letterSpacing: '-0.04em', color: '#e8eaf0', maxWidth: '900px', marginBottom: '1.75rem', opacity: 0 }}>
          CREAMOS<br /><span style={{ color: '#00e5ff' }}>MUNDOS</span><br />DIGITALES.
        </h1>
        <p className="hero-sub" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.55)', maxWidth: '480px', lineHeight: 1.85, marginBottom: '2.5rem', opacity: 0 }}>
          Diseñamos y desarrollamos sitios web con claridad, carácter y propósito para marcas que quieren avanzar.
        </p>
        <div className="hero-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', opacity: 0 }}>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', letterSpacing: '0.2em', fontWeight: 700, color: '#050507', background: '#00e5ff', padding: '1rem 2.2rem', textDecoration: 'none', cursor: 'none', transition: 'all 0.3s', display: 'inline-block' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; e.currentTarget.style.background = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = '#00e5ff' }}>HABLEMOS POR WHATSAPP ↗</a>
          <a href="#contact" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', letterSpacing: '0.2em', fontWeight: 700, color: '#e8eaf0', border: '1px solid rgba(255,255,255,0.28)', padding: '1rem 2.2rem', textDecoration: 'none', cursor: 'none', transition: 'all 0.3s', display: 'inline-block', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(6px)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = '#e8eaf0' }}>HABLEMOS</a>
        </div>
        <div style={{ marginTop: 'clamp(3rem,8vh,5rem)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom,transparent,#00e5ff)' }} />
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.52rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', writingMode: 'vertical-rl' }}>DESPLAZAR</span>
        </div>
      </div>
    </section>
  )
}

const projects = [
  { num: '01', cat: 'PORTAFOLIO DIGITAL', title: 'Portafolio Digital', sub: 'Presencia personal única y memorable.', tech: 'HTML · CSS · JavaScript', img: IMG.proj1, route: '/demo/portfolio' },
  { num: '02', cat: 'TIENDA EN LÍNEA', title: 'Tienda online', sub: 'Tienda online diseñada para vender.', tech: 'React · Node.js · Stripe', img: IMG.proj2, route: '/demo/ecommerce' },
  { num: '03', cat: 'EMPRESARIAL', title: 'Sitio Corporativo', sub: 'Presencia digital profesional.', tech: 'HTML · CSS · JavaScript', img: IMG.proj3, route: '/demo/corporativo' },
  { num: '04', cat: 'HERRAMIENTA WEB', title: 'Formulario Dinámico', sub: 'Formularios inteligentes y modernos.', tech: 'React · Tailwind CSS', img: IMG.proj4, route: '/demo/formulario' },
]

function Showcase() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  useEffect(() => {
    const mobile = isMobile()
    projects.forEach((_, i) => {
      gsap.fromTo(`.proj-${i}`, { opacity: 0, x: mobile ? 0 : -40 }, { opacity: 1, x: 0, duration: mobile ? 0.45 : 0.7, ease: 'power3.out', delay: i * 0.08, scrollTrigger: { trigger: `.proj-${i}`, start: 'top 88%', toggleActions: 'play none none none' } })
    })
  }, [])
  return (
    <section id="showcase" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#050507' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div className="reveal" style={{ marginBottom: 'clamp(2.5rem,6vh,5rem)' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '1rem' }}>// 01</span>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.2rem,6vw,5.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8eaf0', lineHeight: 1.05 }}>VITRINA<br /><span style={{ color: '#00e5ff' }}>DIGITAL</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,500px),1fr))', gap: 0 }}>
          <div>
            {projects.map((p, i) => (
              <div key={i} className={`proj-${i}`} data-hover="true"
                onClick={() => { sessionStorage.setItem('fw-intro', '1'); navigate(p.route) }}
                style={{ padding: 'clamp(1.25rem,3vw,2rem)', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'none', transition: 'background 0.3s,padding-left 0.3s', background: active === i ? 'rgba(0,229,255,0.04)' : 'transparent', paddingLeft: active === i ? 'clamp(1.5rem,3vw,2.5rem)' : 'clamp(1.25rem,3vw,2rem)' }}
                onMouseEnter={() => setActive(i)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'rgba(0,229,255,0.5)', marginTop: '0.3rem', minWidth: '2rem' }}>{p.num}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>{p.cat}</span>
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.72rem', letterSpacing: '0.15em', fontWeight: 700, color: '#00e5ff', opacity: active === i ? 1 : 0, transition: 'opacity 0.3s' }}>VER DEMO →</span>
                    </div>
                    <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 700, color: active === i ? '#00e5ff' : '#e8eaf0', transition: 'color 0.3s', letterSpacing: '0.03em' }}>{p.title}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.42)', marginTop: '0.35rem', lineHeight: 1.6 }}>{p.sub}</p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(0,229,255,0.5)', marginTop: '0.6rem' }}>{p.tech}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="project-preview" style={{ position: 'relative', minHeight: 'clamp(320px,42vw,560px)', overflow: 'hidden' }}>
            {projects.map((p, i) => (
              <div key={i} style={{ position: 'absolute', inset: 0, transition: 'opacity 0.6s ease', opacity: active === i ? 1 : 0 }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 50%,rgba(5,5,7,0.85) 100%)' }} />
                <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem' }}>
                  <button onClick={() => { sessionStorage.setItem('fw-intro', '1'); navigate(p.route) }} className="glass" style={{ display: 'inline-block', padding: '0.5rem 1rem', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', background: 'rgba(0,229,255,0.05)', cursor: 'none', backdropFilter: 'blur(8px)' }}>
                    VER DEMO →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const codeLines = [
  [{ t: '<!DOCTYPE html>', c: 'code-token-tag' }],
  [{ t: '<html ', c: 'code-token-tag' }, { t: 'lang', c: 'code-token-attr' }, { t: '="es">', c: 'code-token-string' }],
  [{ t: '  <!-- ', c: 'code-token-comment' }, { t: 'Experiencia FABIWEBS', c: 'code-token-comment' }, { t: ' -->', c: 'code-token-comment' }],
  [{ t: '  ', c: '' }, { t: 'const', c: 'code-token-keyword' }, { t: ' experiencia = ', c: '' }, { t: '"premium"', c: 'code-token-string' }, { t: ';', c: '' }],
  [{ t: '  ', c: '' }, { t: 'function', c: 'code-token-keyword' }, { t: ' ', c: '' }, { t: 'construirFuturo', c: 'code-token-fn' }, { t: '() {', c: '' }],
  [{ t: '    ', c: '' }, { t: 'return', c: 'code-token-keyword' }, { t: ' ', c: '' }, { t: '"FABIWEBS"', c: 'code-token-string' }, { t: ';', c: '' }],
  [{ t: '  }', c: '' }],
]

function CraftedSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    gsap.fromTo('.craft-word', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } })
    gsap.fromTo('.code-line', { opacity: 0, x: -15 }, { opacity: 1, x: 0, stagger: 0.06, duration: 0.35, scrollTrigger: { trigger: '.code-window', start: 'top 72%' } })
    gsap.fromTo('.craft-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: '.craft-reveal', start: 'top 80%' } })
  }, [])
  return (
    <section ref={sectionRef} id="crafted" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#08080d' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div style={{ marginBottom: 'clamp(2rem,5vh,4rem)' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '1rem' }}>// 02</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {['DISEÑO', 'CÓDIGO', 'DETALLE', 'RENDIMIENTO'].map(w => <span key={w} className="craft-word" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.4rem,4vw,3.5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.12)', opacity: 0 }}>{w}</span>)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'center' }}>
          <div className="code-window glass" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block' }} />)}
              <span style={{ marginLeft: '0.75rem', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)' }}>index.html — FABIWEBS</span>
            </div>
            <div style={{ padding: 'clamp(1rem,3vw,1.5rem)' }}>
              {codeLines.map((line, i) => (
                <div key={i} className="code-line" style={{ display: 'flex', gap: '1.25rem', fontFamily: 'Space Mono, monospace', fontSize: 'clamp(0.58rem,1.2vw,0.72rem)', lineHeight: 1.9, opacity: 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.15)', minWidth: '1.2rem', textAlign: 'right', userSelect: 'none' }}>{i + 1}</span>
                  <span>{line.map((tk, j) => <span key={j} className={tk.c} style={{ color: !tk.c ? 'rgba(255,255,255,0.6)' : undefined }}>{tk.t}</span>)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="craft-reveal" style={{ opacity: 0 }}>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,4.5rem)', fontWeight: 700, lineHeight: 1.1, color: '#e8eaf0', marginBottom: '1.25rem' }}>Cada línea<br /><span style={{ color: '#00e5ff' }}>importa.</span></h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.9rem,1.5vw,1rem)', lineHeight: 1.85, color: 'rgba(255,255,255,0.48)', marginBottom: '1.5rem' }}>No usamos plantillas. Cada proyecto nace desde cero — diseñado a medida, codificado con precisión y optimizado para el rendimiento real.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 40, height: 1, background: '#00e5ff' }} />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(0,229,255,0.6)' }}>CONSTRUIDO DESDE CERO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const services = [
  { num: '01', name: 'EXPERIENCIA WEB', desc: 'Diseño y desarrollo de páginas web únicas y personalizadas.', img: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=300&fit=crop' },
  { num: '02', name: 'TIENDA ONLINE', desc: 'Tiendas online diseñadas para vender más.', img: IMG.proj2 },
  { num: '03', name: 'MARCA DIGITAL', desc: 'Presencia digital completa para marcas y profesionales.', img: IMG.proj1 },
  { num: '04', name: 'REDISEÑO', desc: 'Transformación moderna de páginas existentes.', img: IMG.proj3 },
  { num: '05', name: 'RENDIMIENTO', desc: 'Optimización, responsive y experiencia de usuario.', img: IMG.code },
]

function Services() {
  const [hovered, setHovered] = useState<number | null>(null)
  useEffect(() => { gsap.fromTo('.svc-item', { opacity: 0, y: 25 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '#services', start: 'top 72%' } }) }, [])
  return (
    <section id="services" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#050507' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div className="reveal" style={{ marginBottom: 'clamp(2.5rem,6vh,5rem)' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '1rem' }}>// 03</span>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.2rem,6vw,5.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8eaf0' }}>SERVICIOS</h2>
        </div>
        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
          <div>
            {services.map((s, i) => (
              <div key={i} className="svc-item service-card" data-hover="true" style={{ padding: 'clamp(1.25rem,3vw,2rem)', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'none', transition: 'padding-left 0.3s', paddingLeft: hovered === i ? '1.5rem' : '1.25rem', background: '#08080d' }} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(0,229,255,0.5)', minWidth: '2rem' }}>{s.num}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.3rem,3vw,2rem)', fontWeight: 700, color: hovered === i ? '#00e5ff' : '#e8eaf0', transition: 'color 0.3s', letterSpacing: '0.05em' }}>{s.name}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.35rem', maxHeight: hovered === i ? '60px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                  <span style={{ color: hovered === i ? '#00e5ff' : 'rgba(255,255,255,0.2)', transition: 'color 0.3s', fontSize: '1.1rem' }}>→</span>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:flex service-preview" style={{ alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#08080d' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 400, aspectRatio: '4/3', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {services.map((s, i) => <div key={i} style={{ position: 'absolute', inset: 0, transition: 'opacity 0.5s ease', opacity: hovered === i ? 1 : 0 }}><img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,7,0.35)' }} /></div>)}
              {hovered === null && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)', textAlign: 'center' }}>PASA EL CURSOR<br />PARA EXPLORAR</span></div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BeforeAfter() {
  const [pct, setPct] = useState(50)
  const sliderRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const handleMove = (x: number) => { if (!sliderRef.current) return; const rect = sliderRef.current.getBoundingClientRect(); setPct(Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100))) }
  return (
    <section id="before-after" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#08080d' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div className="reveal" style={{ marginBottom: 'clamp(2.5rem,6vh,4rem)' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '1rem' }}>// 04</span>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,6vw,5.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8eaf0', lineHeight: 1.05 }}>TU PÁGINA PUEDE<br /><span style={{ color: '#00e5ff' }}>SER MUCHO MÁS.</span></h2>
        </div>
        <div ref={sliderRef} style={{ position: 'relative', width: '100%', maxWidth: 900, margin: '0 auto', height: 'clamp(260px,45vw,520px)', userSelect: 'none', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', cursor: 'ew-resize' }} onMouseDown={() => { dragging.current = true }} onMouseUp={() => { dragging.current = false }} onMouseLeave={() => { dragging.current = false }} onMouseMove={e => { if (dragging.current) handleMove(e.clientX) }} onTouchMove={e => handleMove(e.touches[0].clientX)}>
          <img src={IMG.after} alt="Después" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="glass" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem 0.75rem' }}><span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: '#00e5ff' }}>DESPUÉS</span></div>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
            <img src={IMG.before} alt="Antes" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(80%) brightness(0.65)' }} />
            <div className="glass" style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 0.75rem' }}><span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.45)' }}>ANTES</span></div>
          </div>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct}%`, width: 2, background: '#00e5ff', transform: 'translateX(-50%)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 40, height: 40, borderRadius: '50%', border: '2px solid #00e5ff', background: 'rgba(5,5,7,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#00e5ff' }}>⟺</div>
          </div>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '1.25rem' }}>Arrastra para comparar</p>
      </div>
    </section>
  )
}

function About() {
  useEffect(() => {
    const mobile = isMobile()
    gsap.fromTo('.about-img', { opacity: 0, x: mobile ? 0 : -40 }, { opacity: 1, x: 0, duration: mobile ? 0.5 : 0.9, ease: 'power3.out', scrollTrigger: { trigger: '#about', start: 'top 80%' } })
    gsap.fromTo('.about-text', { opacity: 0, x: mobile ? 0 : 40 }, { opacity: 1, x: 0, duration: mobile ? 0.5 : 0.9, ease: 'power3.out', delay: 0.1, scrollTrigger: { trigger: '#about', start: 'top 80%' } })
  }, [])
  return (
    <section id="about" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#050507' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,400px),1fr))', gap: 'clamp(2.5rem,6vw,6rem)', alignItems: 'center' }}>
          <div className="about-img" style={{ opacity: 0, position: 'relative' }}>
            <div style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <img src={IMG.creator} alt="Cristian Fabian Jimenez Sandoval" style={{ width: '100%', objectFit: 'cover', height: 'clamp(320px,55vw,600px)', filter: 'brightness(0.85) contrast(1.1)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,#050507 0%,transparent 45%)' }} />
            </div>
            <div className="glass" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', padding: '0.75rem 1rem', border: '1px solid rgba(255,255,255,0.06)' }}><p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.7)' }}>COLOMBIA / 2026</p></div>
          </div>
          <div className="about-text" style={{ opacity: 0 }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '2rem' }}>// 05</span>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.8rem,4.5vw,4rem)', fontWeight: 700, lineHeight: 1.05, color: '#e8eaf0', marginBottom: '1.5rem' }}>CRISTIAN FABIAN<br /><span style={{ color: '#00e5ff' }}>JIMENEZ SANDOVAL</span></h2>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)', marginBottom: '1.5rem' }}>FUNDADOR / CREADOR WEB</p>
            <div style={{ width: 50, height: 1, background: '#00e5ff', marginBottom: '1.75rem' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.9rem,1.5vw,1rem)', lineHeight: 1.9, color: 'rgba(255,255,255,0.52)', marginBottom: '2.5rem' }}>Creo experiencias digitales modernas para negocios, marcas y profesionales que buscan presentar su trabajo de una manera diferente. Cada proyecto es una oportunidad de construir algo que realmente destaque.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem' }}>
              {[['Proyectos', '12+'], ['Clientes', '10+'], ['Experiencia', '3 años'], ['País', 'Colombia']].map(([label, val]) => (
                <div key={label} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, color: '#00e5ff' }}>{val}</p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.32)', marginTop: '0.2rem' }}>{label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  const steps = [
    ['01', 'DESCUBRIR', 'Entendemos tu negocio, tu audiencia y lo que debe lograr el sitio.'],
    ['02', 'DISEÑAR', 'Convertimos la estrategia en una dirección visual clara y memorable.'],
    ['03', 'DESARROLLAR', 'Construimos una experiencia rápida, responsive y lista para crecer.'],
    ['04', 'PUBLICAR', 'Publicamos, medimos y te acompañamos después del lanzamiento.'],
  ]
  return (
    <section id="process" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#08080d' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', alignItems: 'end', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <div><span className="section-num">// 06</span><h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.2rem,6vw,5.5rem)', fontWeight: 700, color: '#e8eaf0', marginTop: '1rem' }}>DE LA IDEA<br /><span style={{ color: '#00e5ff' }}>AL IMPACTO.</span></h2></div>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.45)', maxWidth: 320, lineHeight: 1.8 }}>Un proceso simple, colaborativo y enfocado en hacer que tu presencia digital trabaje para ti.</p>
        </div>
        <div className="process-grid">{steps.map(([num, title, desc], i) => <article key={title} className="process-card reveal"><span>{num}</span><h3>{title}</h3><p>{desc}</p>{i < steps.length - 1 && <b>→</b>}</article>)}</div>
      </div>
    </section>
  )
}

function TechStack() {
  const stack = ['Visual Studio Code', 'HTML5', 'CSS3', 'JavaScript', 'GitHub', 'Diseño adaptable', 'Diseño UX/UI', 'React']
  return (
    <section id="tech" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#08080d' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div className="reveal" style={{ marginBottom: 'clamp(2.5rem,6vh,5rem)' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '1rem' }}>// 06</span>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.2rem,6vw,5.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8eaf0' }}>TECNOLOGÍA</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: 'clamp(2rem,4vh,3.5rem)' }}>
          {stack.map((item, i) => <div key={i} className="glass reveal-scale" data-hover="true" style={{ padding: 'clamp(0.75rem,2vw,1rem) clamp(1rem,3vw,1.75rem)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s', cursor: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,255,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,229,255,0.05)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}><p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(0.9rem,2vw,1.1rem)', fontWeight: 700, letterSpacing: '0.08em', color: '#e8eaf0' }}>{item}</p></div>)}
        </div>
        <div className="glass" style={{ padding: 'clamp(1.25rem,3vw,2rem)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5ff', display: 'block' }} />
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.6)' }}>CÓDIGO EN VIVO</span>
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(0.65rem,1.5vw,0.82rem)', lineHeight: 2, color: 'rgba(255,255,255,0.5)', overflowX: 'auto' }}>
            <span className="code-token-keyword">const</span>{' '}<span className="code-token-fn">FABIWEBS</span> = {'{'}<br />
            &nbsp;&nbsp;<span className="code-token-attr">pasión</span>: <span className="code-token-string">"diseño"</span>,<br />
            &nbsp;&nbsp;<span className="code-token-attr">oficio</span>: <span className="code-token-string">"código"</span>,<br />
            &nbsp;&nbsp;<span className="code-token-attr">misión</span>: <span className="code-token-string">"experiencias digitales únicas"</span>,<br />
            &nbsp;&nbsp;<span className="code-token-attr">ubicación</span>: <span className="code-token-string">"Colombia 🇨🇴"</span><br />
            {'}'};
          </div>
        </div>
      </div>
    </section>
  )
}

function PlansAndFaq() {
  const plans = [
    ['PÁGINA DE INICIO', 'Hablemos de tu proyecto', 'Una página enfocada en presentar tu negocio y convertir visitas en contactos.', ['Diseño adaptable', 'Formulario de contacto', 'Botón de WhatsApp', 'SEO básico']],
    ['SITIO PROFESIONAL', 'Propuesta personalizada', 'Sitio completo para empresas, profesionales y marcas que necesitan crecer.', ['Hasta 6 secciones', 'Diseño personalizado', 'Integraciones y analítica', 'Publicación y soporte inicial']],
    ['TIENDA EN LÍNEA', 'Cotización según alcance', 'Tienda online preparada para mostrar productos y recibir pedidos.', ['Catálogo y carrito', 'Proceso de compra configurable', 'Panel ampliable', 'Acompañamiento de lanzamiento']],
  ]
  const questions = [
    ['¿Cuánto tarda un sitio web?', 'Un proyecto estándar tarda entre 2 y 6 semanas, según el alcance y la rapidez con la que recibamos el contenido.'],
    ['¿Incluye dominio y hosting?', 'Puedo ayudarte a configurarlos y dejar todo publicado. El costo de esos servicios se cotiza por separado según el proveedor.'],
    ['¿La página funciona en celular?', 'Sí. Todos los proyectos se diseñan para funcionar correctamente en celulares, tabletas y computadores.'],
    ['¿Puedo pedir cambios?', 'Sí. Definimos revisiones durante el proceso para que el resultado final responda a tus objetivos.'],
  ]
  return (
    <section id="plans" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#04040a' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)' }}>// 07</span>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.2rem,6vw,5.5rem)', fontWeight: 700, color: '#e8eaf0', marginTop: '1rem' }}>SOLUCIONES PARA<br /><span style={{ color: '#00e5ff' }}>CADA ETAPA.</span></h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)', maxWidth: 620, lineHeight: 1.8, marginTop: '1.25rem' }}>Estas soluciones sirven como punto de partida. Cuéntame qué necesitas y prepararé una propuesta personalizada para tu proyecto.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '1rem', marginBottom: 'clamp(4rem,8vh,7rem)' }}>
          {plans.map(([name, price, desc, items]) => (
            <article key={name} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.16em', color: '#00e5ff' }}>{name}</p>
              <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', color: '#e8eaf0', margin: '1rem 0 0.75rem' }}>{price}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.48)', minHeight: '5rem' }}>{desc}</p>
              <ul style={{ padding: 0, margin: '1.25rem 0 0', listStyle: 'none' }}>{(items as string[]).map(item => <li key={item} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', padding: '0.45rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>✓ {item}</li>)}</ul>
            </article>
          ))}
        </div>
        <div style={{ maxWidth: 900 }}>
          <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#e8eaf0', marginBottom: '1.5rem' }}>PREGUNTAS FRECUENTES</h3>
          {questions.map(([question, answer]) => <details key={question} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1.1rem 0' }}><summary style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', color: '#e8eaf0', cursor: 'pointer' }}>{question}</summary><p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', paddingTop: '0.75rem', maxWidth: 700 }}>{answer}</p></details>)}
        </div>
      </div>
    </section>
  )
}

function ClientExperience() {
  return (
    <section id="testimonials" style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#050507' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div className="reveal" style={{ marginBottom: 'clamp(2.5rem,6vh,5rem)' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '1rem' }}>// 07</span>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.2rem,6vw,5.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8eaf0', lineHeight: 1.05 }}>EXPERIENCIA<br /><span style={{ color: '#00e5ff' }}>DEL CLIENTE</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="reveal" style={{ padding: 'clamp(1.75rem,4vw,3rem)', background: 'rgba(255,255,255,0.01)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.1rem,2.5vw,1.6rem)', fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: '2rem' }}>"Cada cliente recibe atención personalizada desde la primera conversación hasta el lanzamiento."</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ width: 32, height: 1, background: '#00e5ff' }} /><span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.6)' }}>PROCESO FABIWEBS</span></div>
          </div>
          <div className="reveal" style={{ padding: 'clamp(1.75rem,4vw,3rem)' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.9rem,1.5vw,1rem)', lineHeight: 1.9, color: 'rgba(255,255,255,0.45)', marginBottom: '2rem' }}>FABIWEBS nació de la convicción de que una página web bien construida puede transformar un negocio. Cada proyecto es tratado como si fuera el nuestro propio.</p>
            <a href="#contact" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#00e5ff', textDecoration: 'none', cursor: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'gap 0.3s' }} onMouseEnter={e => (e.currentTarget.style.gap = '0.9rem')} onMouseLeave={e => (e.currentTarget.style.gap = '0.5rem')}>INICIAR CONVERSACIÓN →</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const EMAIL = 'fabitechft@hotmail.com'
  const waMsg = encodeURIComponent('Hola FABIWEBS, estoy interesado en desarrollar un proyecto web y quisiera conocer más sobre el proceso y los servicios disponibles.')
  const waLink = `https://wa.me/573164598263?text=${waMsg}`
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setError('')

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nombre: formData.name,
          'Email del cliente': formData.email,
          'Teléfono del cliente': formData.phone,
          Mensaje: formData.message,
          _subject: `FABIWEBS | Nueva solicitud de proyecto de ${formData.name}`,
          _replyto: formData.email,
          _template: 'table',
          _captcha: true,
        }),
      })

      if (!response.ok) throw new Error('No se pudo enviar el formulario')
      setSent(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      window.setTimeout(() => setSent(false), 4000)
    } catch {
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme por WhatsApp.')
    } finally {
      setSending(false)
    }
  }
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.25rem', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#e8eaf0', outline: 'none', transition: 'border-color 0.3s', cursor: 'none' }
  return (
    <section id="contact" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(4rem,10vh,8rem) 0', background: '#050507', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,229,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.018) 1px,transparent 1px)', backgroundSize: '120px 120px' }} />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)', width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ marginBottom: 'clamp(3rem,8vh,6rem)', textAlign: 'center' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '1.5rem' }}>// 08</span>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.2rem,8vw,8rem)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.03em', color: '#e8eaf0' }}>¿TIENES UN<br /><span style={{ color: '#00e5ff' }}>PROYECTO EN MENTE?</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 'clamp(2.5rem,6vw,5rem)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[{ label: 'WhatsApp', val: '+57 316 459 8263', link: waLink }, { label: 'Email', val: EMAIL, link: null }, { label: 'Ubicación', val: 'Colombia 🇨🇴', link: null }].map(({ label, val, link }) => (
              <div key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', marginBottom: '0.5rem' }}>{label.toUpperCase()}</p>
                {link ? <a href={link} target={link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 600, color: '#e8eaf0', textDecoration: 'none', cursor: 'none', transition: 'color 0.3s', wordBreak: 'break-all' }} onMouseEnter={e => (e.currentTarget.style.color = '#00e5ff')} onMouseLeave={e => (e.currentTarget.style.color = '#e8eaf0')}>{val}</a> : <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 600, color: '#e8eaf0' }}>{val}</p>}
              </div>
            ))}
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.88rem', letterSpacing: '0.2em', fontWeight: 700, color: '#050507', background: '#00e5ff', padding: '1.1rem 2rem', textDecoration: 'none', cursor: 'none', transition: 'all 0.3s', textAlign: 'center', display: 'block' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#00e5ff'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>INICIAR PROYECTO POR WHATSAPP →</a>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { name: 'name', label: 'Nombre', type: 'text', ph: 'Tu nombre completo' },
              { name: 'email', label: 'Email', type: 'email', ph: 'tu@email.com' },
              { name: 'phone', label: 'Teléfono', type: 'tel', ph: '+57 300 000 0000' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: '0.5rem' }}>{f.label.toUpperCase()}</label>
                <input type={f.type} placeholder={f.ph} required value={formData[f.name as 'name' | 'email' | 'phone']} onChange={e => setFormData(p => ({ ...p, [f.name]: e.target.value }))} style={inp} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
              </div>
            ))}
            <div>
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: '0.5rem' }}>MENSAJE</label>
              <textarea placeholder="Cuéntame sobre tu proyecto..." rows={5} required value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} style={{ ...inp, resize: 'none' }} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
            </div>
            <button type="submit" disabled={sending} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.88rem', letterSpacing: '0.2em', fontWeight: 700, color: '#050507', background: sent ? '#28c840' : 'rgba(0,229,255,0.9)', padding: '1.1rem', border: 'none', cursor: sending ? 'wait' : 'none', transition: 'all 0.3s', opacity: sending ? 0.65 : 1 }} onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>{sending ? 'ENVIANDO...' : sent ? '✓ MENSAJE ENVIADO' : 'ENVIAR POR EMAIL'}</button>
            {error && <p role="alert" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', lineHeight: 1.5, color: '#ff8a8a' }}>{error}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const waLink = `https://wa.me/573164598263?text=${encodeURIComponent('Hola FABIWEBS, estoy interesado en desarrollar un proyecto web.')}`
  return (
    <footer style={{ background: '#030305', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(3rem,6vh,5rem) 0 clamp(1.5rem,3vh,2.5rem)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 'clamp(2rem,5vw,4rem)', marginBottom: 'clamp(2rem,5vh,4rem)' }}>
          <div><div style={{ marginBottom: '1rem' }}><FabiwebsLogo size={20} /></div><p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.22)', lineHeight: 1.8 }}>EXPERIENCIAS DIGITALES<br />DESARROLLO WEB</p></div>
          <div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)', marginBottom: '1.25rem' }}>NAVEGACIÓN</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['Proyectos', '#showcase'], ['Servicios', '#services'], ['Sobre mí', '#about'], ['Contacto', '#contact']].map(([l, h]) => <a key={l} href={h} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)', cursor: 'none', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#00e5ff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>{l}</a>)}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)', marginBottom: '1.25rem' }}>CONTACTO</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)', cursor: 'none', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#00e5ff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>WhatsApp</a>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)' }}>Email</span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)' }}>GitHub</span>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,229,255,0.2),transparent)', marginBottom: '1.5rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)' }}>© 2026 FABIWEBS — Cristian Fabian Jimenez Sandoval</p>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.12)' }}>COLOMBIA · EXPERIENCIAS DIGITALES</p>
        </div>
      </div>
    </footer>
  )
}

const isMobile = () => window.innerWidth < 768

function useScrollReveal() {
  useEffect(() => {
    const mobile = isMobile()
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale')
    els.forEach(el => {
      const isLeft = !mobile && el.classList.contains('reveal-left')
      const isRight = !mobile && el.classList.contains('reveal-right')
      const isScale = el.classList.contains('reveal-scale')
      gsap.fromTo(el,
        { opacity: 0, x: isLeft ? -40 : isRight ? 40 : 0, y: (!isLeft && !isRight && !isScale) ? 25 : 0, scale: isScale ? 0.94 : 1 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: mobile ? 0.5 : 0.75, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }
      )
    })
  }, [])
}

export default function Home() {
  const wasAlreadyDone = useRef(introShown)
  const [introDone, setIntroDone] = useState(introShown)

  useScrollReveal()
  useEffect(() => { if (introDone) ScrollTrigger.refresh() }, [introDone])

  const handleIntroDone = () => {
    introShown = true
    sessionStorage.setItem('fw-intro', '1')
    setIntroDone(true)
  }

  return (
    <div style={{ background: '#050507' }}>
      <ProgressBar />
      {!introDone && <Intro onDone={handleIntroDone} />}
      <div style={{ opacity: introDone ? 1 : 0, transition: wasAlreadyDone.current ? 'none' : 'opacity 0.7s ease' }}>
        <Nav /><Hero /><Showcase /><CraftedSection /><Services /><BeforeAfter /><About /><Process /><TechStack /><PlansAndFaq /><ClientExperience /><Contact /><Footer />
      </div>
    </div>
  )
}
