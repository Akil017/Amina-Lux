'use client'
import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [phase, setPhase] = useState<'show' | 'exit' | 'done'>('show')

  useEffect(() => {
    if (sessionStorage.getItem('al_splash_done')) {
      setPhase('done')
      return
    }
    const t1 = setTimeout(() => setPhase('exit'), 1800)
    const t2 = setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('al_splash_done', '1')
    }, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'done') return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0D3318',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
      opacity: phase === 'exit' ? 0 : 1,
      transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
      transition: phase === 'exit' ? 'opacity 0.55s ease, transform 0.55s ease' : 'none',
      pointerEvents: 'none',
    }}>
      {/* Diagonal grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)',
        backgroundSize: '20px 20px', opacity: 0.04,
      }}/>

      {/* AL monogram */}
      <div style={{
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: 'clamp(4rem, 14vw, 7rem)',
        letterSpacing: '0.3em',
        lineHeight: 1,
        color: '#C9A84C',
        animation: 'alFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        opacity: 0,
        position: 'relative', zIndex: 1,
      }}>AL</div>

      {/* Gold line */}
      <div style={{
        width: 72, height: 1,
        background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
        margin: '20px 0 18px',
        animation: 'alLineIn 0.5s 0.4s ease forwards',
        opacity: 0, transform: 'scaleX(0)', transformOrigin: 'center',
        position: 'relative', zIndex: 1,
      }}/>

      {/* Brand name */}
      <div style={{
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: 'clamp(1rem, 3.5vw, 1.5rem)',
        letterSpacing: '0.5em',
        color: '#FAF6EE',
        animation: 'alFadeUp 0.5s 0.3s ease forwards',
        opacity: 0,
        position: 'relative', zIndex: 1,
      }}>AMINA LUXE</div>

      {/* Tagline */}
      <div style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
        letterSpacing: '0.15em',
        color: 'rgba(201,168,76,0.6)',
        fontStyle: 'italic',
        marginTop: 10,
        animation: 'alFadeUp 0.5s 0.55s ease forwards',
        opacity: 0,
        position: 'relative', zIndex: 1,
      }}>Where modesty meets magnificence</div>

      <style>{`
        @keyframes alFadeIn {
          from { opacity:0; transform:translateY(12px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes alFadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes alLineIn {
          from { opacity:0; transform:scaleX(0); }
          to   { opacity:1; transform:scaleX(1); }
        }
      `}</style>
    </div>
  )
}
