import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import AnimatedBackButton from '../components/AnimatedBackButton'

// ─── 3D DNA / HELIX ILLUSTRATION ─────────────────────────────────────────────
function HelixIllustration() {
  return (
    <div style={{ position: 'absolute', right: '5%', top: '8%', width: 280, height: 500, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes helixFloat { 0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);} }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.6);} }
        @keyframes lineGlow { 0%,100%{opacity:0.15;}50%{opacity:0.5;} }
      `}</style>
      <svg width="280" height="500" viewBox="0 0 280 500" style={{ animation: 'helixFloat 7s ease-in-out infinite' }}>
        {/* Helix strands */}
        {Array.from({ length: 20 }).map((_, i) => {
          const y = i * 24 + 10
          const x1 = 80 + Math.sin(i * 0.6) * 70
          const x2 = 200 + Math.cos(i * 0.6) * 70
          return (
            <g key={i}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={`rgba(0,229,255,${0.08 + Math.abs(Math.sin(i * 0.6)) * 0.2})`} strokeWidth="1" style={{ animation: `lineGlow ${2 + (i % 3) * 0.5}s ease-in-out ${i * 0.1}s infinite` }} />
              <circle cx={x1} cy={y} r={4 + Math.abs(Math.sin(i * 0.6)) * 4} fill={`rgba(0,229,255,${0.3 + Math.abs(Math.sin(i * 0.6)) * 0.4})`} style={{ animation: `dotPulse ${2 + (i % 4) * 0.3}s ease-in-out ${i * 0.12}s infinite` }} />
              <circle cx={x2} cy={y} r={4 + Math.abs(Math.cos(i * 0.6)) * 4} fill={`rgba(26,107,255,${0.25 + Math.abs(Math.cos(i * 0.6)) * 0.4})`} style={{ animation: `dotPulse ${2.5 + (i % 3) * 0.4}s ease-in-out ${i * 0.15}s infinite` }} />
            </g>
          )
        })}
        {/* Vertical lines */}
        <line x1="80" y1="10" x2="80" y2="490" stroke="rgba(0,229,255,0.08)" strokeWidth="1" strokeDasharray="4,6" />
        <line x1="200" y1="10" x2="200" y2="490" stroke="rgba(26,107,255,0.08)" strokeWidth="1" strokeDasharray="4,6" />
      </svg>
    </div>
  )
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '60px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${i < current ? '#00e5ff' : i === current ? '#00e5ff' : 'rgba(255,255,255,0.12)'}`,
              background: i < current ? '#00e5ff' : i === current ? 'rgba(0,229,255,0.12)' : 'transparent',
              transition: 'all 0.4s ease', flexShrink: 0
            }}>
              {i < current
                ? <span style={{ fontSize: '0.85rem', color: '#04040c' }}>✓</span>
                : <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: i === current ? '#00e5ff' : 'rgba(255,255,255,0.3)' }}>{String(i + 1).padStart(2, '0')}</span>
              }
            </div>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.52rem', letterSpacing: '0.12em', color: i === current ? '#00e5ff' : i < current ? 'rgba(0,229,255,0.5)' : 'rgba(255,255,255,0.2)', textAlign: 'center', whiteSpace: 'nowrap' }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1, background: i < current ? '#00e5ff' : 'rgba(255,255,255,0.08)', margin: '0 0.5rem', marginBottom: '1.5rem', transition: 'background 0.4s ease' }} />
          )}
        </div>
      ))}
    </div>
  )
}

const steps = ['INICIO', 'PROYECTO', 'DETALLES', 'CONFIRMAR']

type FormData = {
  name: string; email: string; phone: string
  projectType: string; budget: string; timeline: string
  description: string; features: string[]
  termsAccepted: boolean
}

const projectTypes = ['Sitio Web', 'E-Commerce', 'Portafolio', 'Aplicación Web', 'Rediseño']
const budgets = ['$500K - $1M COP', '$1M - $2M COP', '$2M - $5M COP', '+$5M COP']
const timelines = ['1 mes', '2-3 meses', '3-6 meses', 'Flexible']
const features = ['Diseño Responsive', 'Animaciones', 'Panel Admin', 'Blog', 'Chat en vivo', 'SEO Avanzado', 'E-commerce', 'Formularios']

export default function FormDemo() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '',
    projectType: '', budget: '', timeline: '',
    description: '', features: [],
    termsAccepted: false,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    const tl = gsap.timeline()
    tl.fromTo('.fm-tag', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out' }, 0.3)
      .fromTo('.fm-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5)
      .fromTo('.fm-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.85)
      .fromTo('.fm-card', { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, 1.0)
  }, [])

  const animateStep = (next: number) => {
    gsap.fromTo('.step-content', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' })
    setStep(next)
  }

  const toggleFeature = (f: string) => {
    setForm(p => ({ ...p, features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f] }))
  }

  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.9rem 1.1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#e8eaf0', outline: 'none', transition: 'border-color 0.3s', borderRadius: 0 }
  const lbl: React.CSSProperties = { fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '0.5rem' }

  const handleSubmit = () => {
    gsap.to('.fm-card', { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in', onComplete: () => { setDone(true); gsap.fromTo('.done-screen', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }) } })
  }

  return (
    <div style={{ background: '#04040c', minHeight: '100vh', color: '#e8eaf0' }}>
      <style>{`
        @keyframes helixFloat { 0%,100%{transform:translateY(0);}50%{transform:translateY(-18px);} }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.6);} }
        @keyframes lineGlow { 0%,100%{opacity:0.15;}50%{opacity:0.5;} }
      `}</style>

      {/* Back */}
      <AnimatedBackButton dark />

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 70% 40%, rgba(0,229,255,0.05) 0%, transparent 55%), #04040c' }}>
        <HelixIllustration />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.018) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(6rem,12vh,8rem) clamp(1.25rem,5vw,2.5rem) 4rem', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))', gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
            {/* Left: pitch */}
            <div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {['FORMULARIO DINÁMICO', 'DEMO — FABIWEBS'].map(t => <span key={t} className="fm-tag" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(0,229,255,0.75)', border: '1px solid rgba(0,229,255,0.2)', padding: '0.35rem 0.8rem', background: 'rgba(0,229,255,0.05)', opacity: 0 }}>{t}</span>)}
              </div>

              <h1 className="fm-title" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 'clamp(2.8rem,7vw,7rem)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', color: '#e8eaf0', marginBottom: '1.75rem', opacity: 0 }}>
                COTIZA<br />TU<br />
                <span style={{ color: '#00e5ff' }}>PROYECTO.</span>
              </h1>

              <p className="fm-sub" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 420, lineHeight: 1.85, marginBottom: '2rem', opacity: 0 }}>
                Completa el formulario paso a paso y recibe una propuesta personalizada para tu proyecto web en menos de 24 horas.
              </p>

              {/* Benefits */}
              <div className="fm-sub" style={{ opacity: 0 }}>
                {['Respuesta en menos de 24 horas', 'Sin compromisos, cotización gratuita', 'Propuesta personalizada para tu proyecto'].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5ff', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card */}
            <div className="fm-card" style={{ opacity: 0 }}>
              {!done ? (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: 'clamp(1.5rem,4vw,2.5rem)', backdropFilter: 'blur(12px)' }}>
                  <StepIndicator steps={steps} current={step} />

                  <div className="step-content">
                    {/* STEP 0: Info personal */}
                    {step === 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#e8eaf0', marginBottom: '0.5rem' }}>¿Con quién hablamos?</h3>
                        {[
                          { key: 'name', label: 'NOMBRE COMPLETO', type: 'text', ph: 'Tu nombre' },
                          { key: 'email', label: 'EMAIL', type: 'email', ph: 'tu@email.com' },
                          { key: 'phone', label: 'WHATSAPP (OPCIONAL)', type: 'tel', ph: '+57 300 000 0000' },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={lbl}>{f.label}</label>
                            <input type={f.type} placeholder={f.ph} value={form[f.key as 'name' | 'email' | 'phone']} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inp} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* STEP 1: Tipo de proyecto */}
                    {step === 1 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#e8eaf0' }}>¿Qué tipo de proyecto?</h3>
                        <div>
                          <label style={lbl}>TIPO DE PROYECTO</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '0.6rem' }}>
                            {projectTypes.map(t => (
                              <button key={t} onClick={() => setForm(p => ({ ...p, projectType: t }))} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', padding: '0.75rem', border: '1px solid', borderColor: form.projectType === t ? '#00e5ff' : 'rgba(255,255,255,0.1)', color: form.projectType === t ? '#00e5ff' : 'rgba(255,255,255,0.55)', background: form.projectType === t ? 'rgba(0,229,255,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center' }}>{t}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label style={lbl}>PRESUPUESTO ESTIMADO</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {budgets.map(b => (
                              <button key={b} onClick={() => setForm(p => ({ ...p, budget: b }))} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', padding: '0.75rem 1rem', border: '1px solid', borderColor: form.budget === b ? '#00e5ff' : 'rgba(255,255,255,0.1)', color: form.budget === b ? '#00e5ff' : 'rgba(255,255,255,0.55)', background: form.budget === b ? 'rgba(0,229,255,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.25s', textAlign: 'left' }}>{b}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Detalles */}
                    {step === 2 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#e8eaf0' }}>Cuéntame más</h3>
                        <div>
                          <label style={lbl}>PLAZO ESTIMADO</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem' }}>
                            {timelines.map(t => (
                              <button key={t} onClick={() => setForm(p => ({ ...p, timeline: t }))} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', padding: '0.75rem', border: '1px solid', borderColor: form.timeline === t ? '#00e5ff' : 'rgba(255,255,255,0.1)', color: form.timeline === t ? '#00e5ff' : 'rgba(255,255,255,0.55)', background: form.timeline === t ? 'rgba(0,229,255,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.25s' }}>{t}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label style={lbl}>FUNCIONALIDADES DESEADAS</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {features.map(f => (
                              <button key={f} onClick={() => toggleFeature(f)} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.08em', padding: '0.4rem 0.75rem', border: '1px solid', borderColor: form.features.includes(f) ? '#00e5ff' : 'rgba(255,255,255,0.1)', color: form.features.includes(f) ? '#00e5ff' : 'rgba(255,255,255,0.45)', background: form.features.includes(f) ? 'rgba(0,229,255,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>{f}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label style={lbl}>DESCRIPCIÓN DEL PROYECTO</label>
                          <textarea placeholder="Describe brevemente tu proyecto, público objetivo, referencias..." rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'none' }} onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Resumen */}
                    {step === 3 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#e8eaf0' }}>Confirma tu solicitud</h3>
                        <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.15)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {[
                            ['Nombre', form.name || '—'],
                            ['Email', form.email || '—'],
                            ['Tipo', form.projectType || '—'],
                            ['Presupuesto', form.budget || '—'],
                            ['Plazo', form.timeline || '—'],
                          ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>{k}</span>
                              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: '#e8eaf0', textAlign: 'right' }}>{v}</span>
                            </div>
                          ))}
                          {form.features.length > 0 && (
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '0.4rem' }}>Funcionalidades</span>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {form.features.map(f => <span key={f} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.25)', padding: '0.2rem 0.5rem' }}>{f}</span>)}
                              </div>
                            </div>
                          )}
                        </div>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={form.termsAccepted} onChange={e => setForm(p => ({ ...p, termsAccepted: e.target.checked }))} style={{ marginTop: '2px', accentColor: '#00e5ff' }} />
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Acepto que FABIWEBS me contacte con una propuesta basada en esta información.</span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
                    {step > 0 && (
                      <button onClick={() => animateStep(step - 1)} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700, color: 'rgba(255,255,255,0.55)', background: 'transparent', padding: '0.9rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)'; e.currentTarget.style.color = '#00e5ff' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}>← ATRÁS</button>
                    )}
                    {step < 0 && <div />}
                    {step < steps.length - 1 ? (
                      <button onClick={() => animateStep(step + 1)} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700, color: '#04040c', background: '#00e5ff', padding: '0.9rem 2rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s', marginLeft: 'auto' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; e.currentTarget.style.background = '#fff' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = '#00e5ff' }}>CONTINUAR →</button>
                    ) : (
                      <button onClick={handleSubmit} disabled={!form.termsAccepted} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: 700, color: '#04040c', background: form.termsAccepted ? '#00e5ff' : 'rgba(255,255,255,0.1)', padding: '0.9rem 2rem', border: 'none', cursor: form.termsAccepted ? 'pointer' : 'not-allowed', transition: 'all 0.3s', marginLeft: 'auto' }} onMouseEnter={e => { if (form.termsAccepted) { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; e.currentTarget.style.background = '#fff' } }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; e.currentTarget.style.background = form.termsAccepted ? '#00e5ff' : 'rgba(255,255,255,0.1)' }}>ENVIAR SOLICITUD ✓</button>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: '1.5rem', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
                    <div style={{ height: '100%', background: '#00e5ff', borderRadius: 1, width: `${((step + 1) / steps.length) * 100}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ) : (
                <div className="done-screen" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.25)', padding: '3rem 2rem', textAlign: 'center', opacity: 0 }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(0,229,255,0.15)', border: '2px solid #00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem' }}>✓</div>
                  <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#e8eaf0', marginBottom: '1rem' }}>¡SOLICITUD ENVIADA!</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '2rem' }}>Gracias, <strong style={{ color: '#00e5ff' }}>{form.name || 'amigo/a'}</strong>. Recibirás una propuesta personalizada en menos de 24 horas.</p>
                  <AnimatedBackButton inline dark />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}>
        DEMO CREADO POR FABIWEBS · fabiwebs.com
      </div>
    </div>
  )
}
