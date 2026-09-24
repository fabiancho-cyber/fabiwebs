import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBackButton from '../components/AnimatedBackButton'

gsap.registerPlugin(ScrollTrigger)

// ─── 3D ISOMETRIC BUILDING ───────────────────────────────────────────────────
function IsometricBuilding() {
  return (
    <div style={{ position: 'absolute', right: '3%', top: '5%', width: 340, height: 420, pointerEvents: 'none', perspective: 800 }}>
      <style>{`@keyframes buildFloat { 0%,100%{transform:translateY(0) rotateX(20deg) rotateZ(-20deg);}50%{transform:translateY(-12px) rotateX(20deg) rotateZ(-20deg);} } @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.7);} }`}</style>
      <div style={{ transform: 'rotateX(20deg) rotateZ(-20deg)', transformStyle: 'preserve-3d', animation: 'buildFloat 8s ease-in-out infinite', position: 'relative' }}>
        {/* Building floors */}
        {[0, 1, 2, 3, 4].map(floor => (
          <div key={floor} style={{ position: 'absolute', bottom: `${floor * 60}px`, left: `${floor * 4}px`, width: `${200 - floor * 16}px`, height: '55px', background: `rgba(0,229,255,${0.03 + floor * 0.015})`, border: '1px solid rgba(0,229,255,0.15)', boxShadow: `0 0 20px rgba(0,229,255,${0.04 + floor * 0.01})` }}>
            {/* Windows */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '4px', padding: '8px' }}>
              {Array.from({ length: 8 }).map((_, w) => (
                <div key={w} style={{ height: 10, background: Math.random() > 0.3 ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          </div>
        ))}
        {/* Antenna */}
        <div style={{ position: 'absolute', bottom: '300px', left: '100px', width: 2, height: 60, background: 'linear-gradient(to top,rgba(0,229,255,0.6),transparent)' }} />
        <div style={{ position: 'absolute', bottom: '358px', left: '96px', width: 10, height: 10, borderRadius: '50%', background: '#00e5ff', animation: 'pulseDot 1.5s ease-in-out infinite' }} />
      </div>

      {/* Floating data points */}
      {[{ top: '20%', left: '10%' }, { top: '40%', right: '5%' }, { top: '65%', left: '30%' }].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', ...pos, width: 6, height: 6, borderRadius: '50%', background: '#00e5ff', animation: `pulseDot ${2 + i * 0.5}s ease-in-out ${i * 0.7}s infinite`, boxShadow: '0 0 10px rgba(0,229,255,0.5)' }} />
      ))}
    </div>
  )
}

// ─── ANIMATED STAT ────────────────────────────────────────────────────────────
function AnimatedStat({ value, suffix, label, color }: { value: number; suffix: string; label: string; color: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const step = value / 60
        const timer = setInterval(() => {
          start += step
          if (start >= value) { setCount(value); clearInterval(timer) } else { setCount(Math.floor(start)) }
        }, 16)
        observer.disconnect()
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '2rem 1rem', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', transition: 'all 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLElement).style.background = `${color}05` }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.01)' }}>
      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 700, color, lineHeight: 1 }}>{count}{suffix}</p>
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', marginTop: '0.75rem' }}>{label}</p>
    </div>
  )
}

const services = [
  { num: '01', title: 'CONSULTORÍA ESTRATÉGICA', desc: 'Analizamos tu modelo de negocio y diseñamos una hoja de ruta digital adaptada a tus objetivos.', icon: '◈' },
  { num: '02', title: 'TRANSFORMACIÓN DIGITAL', desc: 'Modernizamos tus procesos internos con tecnología de punta para mayor eficiencia operativa.', icon: '⬡' },
  { num: '03', title: 'DESARROLLO DE SOFTWARE', desc: 'Soluciones a medida que escalan con tu empresa, desde MVP hasta sistemas empresariales completos.', icon: '◇' },
  { num: '04', title: 'GESTIÓN DE DATOS', desc: 'Capturamos, procesamos y visualizamos tus datos para tomar decisiones basadas en información real.', icon: '○' },
]

const team = [
  { name: 'Laura Martínez', role: 'CEO & Estratega', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format' },
  { name: 'Carlos Rivera', role: 'CTO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format' },
  { name: 'Sofía Peña', role: 'Directora de Diseño', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&auto=format' },
]

export default function CorporateDemo() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    const tl = gsap.timeline()
    tl.fromTo('.corp-tag', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out' }, 0.3)
      .fromTo('.corp-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5)
      .fromTo('.corp-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.85)
      .fromTo('.corp-btns', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 1.1)

    services.forEach((_, i) => {
      gsap.fromTo(`.svc-c-${i}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: `.svc-c-${i}`, start: 'top 82%' } })
    })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <div style={{ background: '#04040c', minHeight: '100vh', color: '#e8eaf0' }}>
      {/* Back */}
      <AnimatedBackButton dark />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 70% 40%, rgba(0,229,255,0.05) 0%, transparent 55%), #04040c' }}>
        <IsometricBuilding />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.02) 1px,transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(6rem,12vh,8rem) clamp(1.25rem,5vw,2.5rem) 4rem', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {['SITIO CORPORATIVO', 'DEMO — FABIWEBS'].map(t => <span key={t} className="corp-tag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.75)', border: '1px solid rgba(0,229,255,0.2)', padding: '0.35rem 0.8rem', background: 'rgba(0,229,255,0.05)', opacity: 0 }}>{t}</span>)}
          </div>

          <p className="corp-tag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem', opacity: 0 }}>VERTEX SOLUTIONS — BOGOTÁ, COLOMBIA</p>

          <h1 className="corp-title" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.8rem,8vw,8rem)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: '#e8eaf0', marginBottom: '2rem', opacity: 0 }}>
            EL FUTURO<br />
            DE TU<br />
            <span style={{ color: '#00e5ff' }}>EMPRESA.</span>
          </h1>

          <p className="corp-sub" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 460, lineHeight: 1.85, marginBottom: '2.5rem', opacity: 0 }}>
            Consultora de transformación digital que acompaña a empresas colombianas en su camino hacia la innovación y el crecimiento sostenible.
          </p>

          <div className="corp-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: 0 }}>
            <button style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#04040c', background: '#00e5ff', padding: '1rem 2.2rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; e.currentTarget.style.background = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = '#00e5ff' }}>AGENDAR CONSULTA</button>
            <button style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', letterSpacing: '0.2em', fontWeight: 700, color: '#e8eaf0', background: 'transparent', padding: '1rem 2.2rem', border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#e8eaf0' }}>VER SERVICIOS</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: 'clamp(3rem,8vh,6rem) 0', background: '#06060f', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))', gap: '1px' }}>
            <AnimatedStat value={12} suffix="+" label="AÑOS DE EXPERIENCIA" color="#00e5ff" />
            <AnimatedStat value={280} suffix="+" label="EMPRESAS ATENDIDAS" color="#1a6bff" />
            <AnimatedStat value={95} suffix="%" label="CLIENTES SATISFECHOS" color="#00e5ff" />
            <AnimatedStat value={48} suffix="h" label="TIEMPO DE RESPUESTA" color="#7c3aed" />
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#04040c' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <div style={{ marginBottom: 'clamp(2.5rem,6vh,5rem)' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.4)', display: 'block', marginBottom: '0.75rem' }}>LO QUE HACEMOS</span>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,5rem)', fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.02em' }}>SERVICIOS</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: '1px' }}>
            {services.map((s, i) => (
              <div key={i} className={`svc-c-${i}`}
                style={{ padding: 'clamp(1.75rem,3vw,2.5rem)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s', cursor: 'pointer', opacity: 0 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,229,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,255,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                  <span style={{ fontSize: '1.5rem', color: '#00e5ff', lineHeight: 1.2 }}>{s.icon}</span>
                  <div>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(0,229,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>{s.num}</span>
                    <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(1.1rem,2vw,1.5rem)', fontWeight: 700, color: '#e8eaf0', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{s.title}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#06060f' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <div style={{ marginBottom: 'clamp(2.5rem,6vh,5rem)' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.4)', display: 'block', marginBottom: '0.75rem' }}>LAS PERSONAS DETRÁS</span>
            <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2rem,5vw,5rem)', fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.02em' }}>NUESTRO EQUIPO</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: '1.5rem' }}>
            {team.map((m, i) => (
              <div key={i} style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,255,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)' }} />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#e8eaf0' }}>{m.name}</h3>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'rgba(0,229,255,0.6)', marginTop: '0.35rem' }}>{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(4rem,10vh,8rem) 0', background: '#04040c', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 clamp(1.25rem,5vw,2.5rem)' }}>
          <h2 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.5rem,7vw,6rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#e8eaf0', lineHeight: 1, marginBottom: '1.5rem' }}>¿LISTO PARA<br /><span style={{ color: '#00e5ff' }}>CRECER?</span></h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', marginBottom: '2.5rem', lineHeight: 1.8 }}>Agenda una consulta gratuita y descubre cómo podemos transformar tu empresa.</p>
          <button onClick={() => navigate('/')} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', letterSpacing: '0.2em', fontWeight: 700, color: '#04040c', background: '#00e5ff', padding: '1.1rem 2.5rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; e.currentTarget.style.background = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = '#00e5ff' }}>QUIERO MI SITIO CORPORATIVO →</button>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}>
        DEMO CREADO POR FABIWEBS · fabiwebs.com
      </div>
    </div>
  )
}
