import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function AnimatedBackButton({ dark = false, inline = false }: { dark?: boolean; inline?: boolean }) {
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)

  const goHome = () => {
    if (leaving) return
    setLeaving(true)
    navigate('/')
  }

  return (
    <>
      <button
        onClick={goHome}
        disabled={leaving}
        style={{
          position: inline ? 'relative' : 'fixed',
          top: inline ? undefined : '1.5rem',
          left: inline ? undefined : '1.5rem',
          zIndex: inline ? undefined : 100,
          background: inline ? '#00e5ff' : dark ? 'rgba(4,4,12,0.9)' : 'rgba(5,5,7,0.85)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: inline ? '1rem 2rem' : '0.6rem 1.2rem',
          fontFamily: 'Space Mono, monospace',
          fontSize: inline ? '0.82rem' : '0.6rem',
          letterSpacing: '0.2em',
          cursor: leaving ? 'wait' : 'pointer',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s, transform 0.3s',
          opacity: leaving ? 0.7 : 1,
          color: inline ? '#04040c' : 'rgba(255,255,255,0.7)',
          transform: leaving ? 'translateX(-14px)' : 'translateX(0)',
        }}
        onMouseEnter={e => {
          if (leaving) return
          e.currentTarget.style.color = inline ? '#04040c' : '#00e5ff'
          if (inline) e.currentTarget.style.background = '#fff'
          e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)'
          e.currentTarget.style.transform = 'translateX(4px)'
        }}
        onMouseLeave={e => {
          if (leaving) return
          e.currentTarget.style.color = inline ? '#04040c' : 'rgba(255,255,255,0.7)'
          if (inline) e.currentTarget.style.background = '#00e5ff'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.transform = 'translateX(0)'
        }}
      >
        {inline ? 'VOLVER A FABIWEBS →' : '← VOLVER'}
      </button>
    </>
  )
}
