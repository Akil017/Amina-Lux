'use client'
import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [phase, setPhase] = useState<'show' | 'shrink' | 'done'>('show')

  useEffect(() => {
    // Only show on first visit per session
    if (sessionStorage.getItem('al_splash_done')) {
      setPhase('done')
      return
    }
    // Phase 1: show logo for 1.6s, then start shrink animation
    const t1 = setTimeout(() => setPhase('shrink'), 1600)
    // Phase 2: after animation, hide completely
    const t2 = setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('al_splash_done', '1')
    }, 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0D3318',
        transition: phase === 'shrink' ? 'opacity 0.5s ease 0.35s, transform 0.65s cubic-bezier(0.4,0,0.2,1)' : 'none',
        opacity: phase === 'shrink' ? 0 : 1,
        transform: phase === 'shrink' ? 'scale(1.06)' : 'scale(1)',
        pointerEvents: phase === 'shrink' ? 'none' : 'all',
      }}
    >
      {/* Subtle diagonal grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)',
        backgroundSize: '20px 20px', opacity: 0.04,
      }} />

      {/* Logo card */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        animation: 'splashIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {/* Monogram */}
        <div style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontSize: 'clamp(3.5rem, 12vw, 6rem)',
          letterSpacing: '0.25em',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #C9A84C 0%, #E2C47A 40%, #FFF8E7 55%, #E2C47A 70%, #C9A84C 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'goldShimmer 2.5s linear infinite',
          marginBottom: '0.5rem',
        }}>AL</div>

        {/* Divider */}
        <div style={{
          width: 64, height: 1,
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          marginBottom: '1rem',
          animation: 'splashLineGrow 0.6s 0.3s ease forwards',
          transform: 'scaleX(0)',
          transformOrigin: 'center',
        }} />

        {/* Brand name */}
        <div style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontSize: 'clamp(1.1rem, 4vw, 1.75rem)',
          letterSpacing: '0.45em',
          color: '#FAF6EE',
          marginBottom: '0.5rem',
          animation: 'splashFadeUp 0.6s 0.2s ease forwards',
          opacity: 0,
        }}>AMINA LUXE</div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(0.75rem, 2.5vw, 0.95rem)',
          letterSpacing: '0.18em',
          color: 'rgba(201,168,76,0.65)',
          fontStyle: 'italic',
          animation: 'splashFadeUp 0.6s 0.4s ease forwards',
          opacity: 0,
        }}>Where modesty meets magnificence</div>

        {/* Loading dots */}
        <div style={{
          display: 'flex', gap: 6, marginTop: '2rem',
          animation: 'splashFadeUp 0.5s 0.7s ease forwards',
          opacity: 0,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#C9A84C',
              animation: `splashDot 1s ${0.8 + i * 0.18}s ease-in-out infinite alternate`,
              opacity: 0.4,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes splashIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashLineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes splashDot {
          from { opacity: 0.3; transform: translateY(0); }
          to   { opacity: 1;   transform: translateY(-4px); }
        }
        @keyframes goldShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>
    </div>
  )
}
