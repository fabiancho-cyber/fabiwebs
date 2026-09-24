import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBackButton from '../components/AnimatedBackButton'

gsap.registerPlugin(ScrollTrigger)

// ─── 3D CUBE ILLUSTRATION ────────────────────────────────────────────────────
function Cube3D({ size = 120, color = '#00e5ff', style = {} as React.CSSProperties }) {
  return (
    <div style={{ width: size, height: size, perspective: 600, ...style }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        animation: 'rotateCube 12s linear infinite',
      }}>
        {[
          { transform: `translateZ(${size / 2}px)`, bg: `${color}18` },
          { transform: `rotateY(180deg) translateZ(${size / 2}px)`, bg: `${color}10` },
          { transform: `rotateY(-90deg) translateZ(${size / 2}px)`, bg: `${color}14` },
          { transform: `rotateY(90deg) translateZ(${size / 2}px)`, bg: `${color}0c` },
          { transform: `rotateX(90deg) translateZ(${size / 2}px)`, bg: `${color}10` },
          { transform: `rotateX(-90deg) translateZ(${size / 2}px)`, bg: `${color}0a` },
        ].map((face, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            transform: face.transform,
            background: face.bg,
            border: `1px solid ${color}30`,
            backdropFilter: 'blur(2px)',
          }} />
        ))}
      </div>
    </div>
  )
}

function FloatingOrb({ size = 80, color = '#00e5ff', delay = 0, style = {} as React.CSSProperties }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${color}40, ${color}08)`,
      border: `1px solid ${color}30`,
      animation: `floatOrb 6s ease-in-out ${delay}s infinite`,
      boxShadow: `0 0 ${size * 0.4}px ${color}20`,
      ...style
    }} />
  )
}

// ─── HERO 3D SCENE ───────────────────────────────────────────────────────────
function PortfolioHero3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Grandes orbes de fondo */}
      <FloatingOrb size={400} color="#00e5ff" delay={0} style={{ position: 'absolute', top: '-10%', right: '-8%', opacity: 0.15 }} />
      <FloatingOrb size={250} color="#1a6bff" delay={2} style={{ position: 'absolute', bottom: '5%', right: '20%', opacity: 0.12 }} />
      <FloatingOrb size={120} color="#00e5ff" delay={1} style={{ position: 'absolute', top: '30%', right: '12%', opacity: 0.25 }} />

      {/* Cubos 3D flotantes */}
      <div style={{ position: 'absolute', top: '15%', right: '8%', animation: 'floatOrb 8s ease-in-out infinite' }}>
        <Cube3D size={100} color="#00e5ff" />
      </div>
      <div style={{ position: 'absolute', top: '55%', right: '22%', animation: 'floatOrb 10s ease-in-out 2s infinite' }}>
        <Cube3D size={60} color="#1a6bff" />
      </div>
      <div style={{ position: 'absolute', top: '25%', right: '32%', animation: 'floatOrb 7s ease-in-out 1s infinite' }}>
        <Cube3D size={40} color="#00e5ff" />
      </div>

      {/* Líneas de grid perspectiva */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(x => (
          <line key={x} x1={x} y1="0" x2="50" y2="100" stroke="#00e5ff" strokeWidth="0.3" />
        ))}
      </svg>
    </div>
  )
}

const works = [
  { year: '2026', cat: 'IDENTIDAD DIGITAL', title: 'Nexus Creative Studio', desc: 'Identidad visual y web para estudio de diseño.', color: '#00e5ff' },
  { year: '2025', cat: 'FOTOGRAFÍA', title: 'Lumière Photography', desc: 'Portfolio fotográfico con galerías inmersivas.', color: '#1a6bff' },
  { year: '2025', cat: 'MÚSICA', title: 'Sonder Records', desc: 'Plataforma para sello discográfico independiente.', color: '#7c3aed' },
  { year: '2024', cat: 'ARQUITECTURA', title: 'Forma Estudio', desc: 'Portafolio para despacho de arquitectura.', color: '#00e5ff' },
]

export default function PortfolioDemo() {
  const navigate = useNavigate()
  const heroRef = useRef<HTMLElement>(null)
  const [hoveredWork, setHoveredWork] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const tl = gsap.timeline()
    tl.fromTo('.pd-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 0.3)
      .fromTo('.pd-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5)
      .fromTo('.pd-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.9)
      .fromTo('.pd-btns', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 1.1)

    works.forEach((_, i) => {
      gsap.fromTo(`.work-${i}`, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: `.work-${i}`, start: 'top 82%' }
      })
    })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <div style={{ background: '#060609', minHeight: '100vh', color: '#e8eaf0' }}>
      <style>{`
        @keyframes rotateCube { from { transform: rotateX(-20deg) rotateY(0deg); } to { transform: rotateX(-20deg) rotateY(360deg); } }
        @keyframes floatOrb { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
      `}</style>

      {/* Back button */}
      <AnimatedBackButton />

      {/* HERO */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.06) 0%, transparent 60%), #060609' }}>
        <PortfolioHero3D />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(6rem,12vh,8rem) clamp(1.25rem,5vw,2.5rem) 4rem', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {['PORTAFOLIO DIGITAL', 'DEMO — FABIWEBS'].map(t => (
              <span key={t} className="pd-tag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.75)', border: '1px solid rgba(0,229,255,0.2)', padding: '0.35rem 0.8rem', background: 'rgba(0,229,255,0.05)', opacity: 0 }}>{t}</span>
            ))}
          </div>

          <p className="pd-tag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem', opacity: 0 }}>ALEX MORENO — CREATIVE DIRECTOR</p>

          <h1 className="pd-title" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(3rem,9vw,9rem)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.03em', color: '#e8eaf0', marginBottom: '2rem', opacity: 0 }}>
            DISEÑO<br />
            <span style={{ WebkitTextStroke: '1px rgba(0,229,255,0.6)', color: 'transparent' }}>QUE</span><br />
            INSPIRA.
          </h1>

          <p className="pd-sub" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 440, lineHeight: 1.85, marginBottom: '2.5rem', opacity: 0 }}>
            Director creativo y diseñador visual. Creo identidades digitales que dejan huella y experiencias que las personas recuerdan.
          </p>

          <div className="pd-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0 }}>
            <button style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#060609', background: '#00e5ff', padding: '1rem 2rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; e.currentTarget.style.background = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = '#00e5ff' }}>VER TRABAJOS</button>
            <button style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#e8eaf0', background: 'transparent', padding: '1rem 2rem', border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#e8eaf0' }}>CONTACTAR</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 1, height: 50, background: 'linear-gradient(to bottom,transparent,#00e5ff)', animation: 'floatOrb 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.52rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}>SCROLL</span>
        </div>
      </section>

      {/* TRABAJOS */}
      <section style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#060609' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <div style={{ marginBottom: 'clamp(3rem,6vh,5rem)' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.4)', display: 'block', marginBottom: '1rem' }}>PROYECTOS SELECCIONADOS</span>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,5rem)', fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.02em' }}>TRABAJOS</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {works.map((w, i) => (
              <div key={i} className={`work-${i}`}
                style={{ padding: 'clamp(1.5rem,3vw,2.5rem) 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.3s', opacity: 0, background: hoveredWork === i ? 'rgba(0,229,255,0.03)' : 'transparent' }}
                onMouseEnter={() => setHoveredWork(i)} onMouseLeave={() => setHoveredWork(null)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem,3vw,3rem)', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', minWidth: '3rem' }}>{w.year}</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: hoveredWork === i ? w.color : 'rgba(255,255,255,0.3)', transition: 'color 0.3s', flex: 1, minWidth: '100px' }}>{w.cat}</span>
                  <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.4rem,3.5vw,2.8rem)', fontWeight: 700, color: hoveredWork === i ? w.color : '#e8eaf0', transition: 'color 0.3s', flex: 2, minWidth: '200px' }}>{w.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', flex: 2, minWidth: '180px', display: hoveredWork === i ? 'block' : 'none' }}>{w.desc}</p>
                  <span style={{ color: hoveredWork === i ? w.color : 'rgba(255,255,255,0.2)', fontSize: '1.3rem', transition: 'all 0.3s', transform: hoveredWork === i ? 'translateX(8px)' : '' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#04040a' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'center' }}>
            {/* 3D visual */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <Cube3D size={140} color="#00e5ff" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <FloatingOrb size={70} color="#1a6bff" delay={0.5} />
                <FloatingOrb size={45} color="#00e5ff" delay={1.5} />
              </div>
            </div>
            <div>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '1.5rem' }}>SOBRE EL CREADOR</span>
              <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 700, color: '#e8eaf0', marginBottom: '1.25rem', lineHeight: 1.1 }}>ALEX<br /><span style={{ color: '#00e5ff' }}>MORENO</span></h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.9rem,1.5vw,1rem)', lineHeight: 1.9, color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Director creativo con 8 años de experiencia construyendo identidades digitales para marcas que quieren destacar. Especializado en UI/UX, motion design y desarrollo front-end.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {[['8+', 'AÑOS'], ['120+', 'PROYECTOS'], ['40+', 'CLIENTES']].map(([n, l]) => (
                  <div key={l} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#00e5ff' }}>{n}</p>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#060609', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.5rem,7vw,6rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8eaf0', lineHeight: 1, marginBottom: '1.5rem' }}>¿TIENES UN PROYECTO?</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', marginBottom: '2.5rem', lineHeight: 1.8 }}>Trabajemos juntos para crear algo que marque la diferencia.</p>
          <button onClick={() => navigate('/#contact')} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', letterSpacing: '0.2em', fontWeight: 700, color: '#060609', background: '#00e5ff', padding: '1.1rem 2.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; e.currentTarget.style.background = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = '#00e5ff' }}>HABLEMOS →</button>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}>
        DEMO CREADO POR FABIWEBS · fabiwebs.com
      </div>
    </div>
  )
}
