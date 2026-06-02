'use client'
import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [phase, setPhase] = useState<'idle'|'logo'|'tagline'|'reveal'|'exit'|'done'>('idle')

  useEffect(() => {
    if (sessionStorage.getItem('al_splash')) { setPhase('done'); return }
    // Sequence: idle→logo (0.1s) → tagline (1.5s) → reveal (3.5s) → exit (5.5s) → done (6.5s)
    const t0 = setTimeout(() => setPhase('logo'),    100)
    const t1 = setTimeout(() => setPhase('tagline'), 1500)
    const t2 = setTimeout(() => setPhase('reveal'),  3500)
    const t3 = setTimeout(() => setPhase('exit'),    5500)
    const t4 = setTimeout(() => { setPhase('done'); sessionStorage.setItem('al_splash','1') }, 6500)
    return () => [t0,t1,t2,t3,t4].forEach(clearTimeout)
  }, [])

  if (phase === 'done') return null

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'#0D3318',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      overflow:'hidden',
      opacity: phase === 'exit' ? 0 : 1,
      transition: phase === 'exit' ? 'opacity 1s ease' : 'none',
      pointerEvents: phase === 'exit' ? 'none' : 'all',
    }}>

      {/* Animated background lines */}
      <div style={{position:'absolute', inset:0, overflow:'hidden'}}>
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{
            position:'absolute',
            left: `${10 + i*16}%`,
            top:0, bottom:0,
            width:1,
            background:'linear-gradient(to bottom, transparent, rgba(201,168,76,0.08), transparent)',
            animation:`lineSlide 3s ${i*0.3}s ease-in-out infinite alternate`,
          }}/>
        ))}
        {/* Radial glow */}
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:600, height:600, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          animation:'glowPulse 2s ease-in-out infinite alternate',
        }}/>
      </div>

      {/* Top ornamental line */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:2,
        background:'linear-gradient(90deg, transparent, #C9A84C, transparent)',
        opacity: phase === 'logo' || phase === 'tagline' || phase === 'reveal' ? 1 : 0,
        transition:'opacity 1s ease',
      }}/>
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:2,
        background:'linear-gradient(90deg, transparent, #C9A84C, transparent)',
        opacity: phase === 'logo' || phase === 'tagline' || phase === 'reveal' ? 1 : 0,
        transition:'opacity 1s ease',
      }}/>

      {/* Main content */}
      <div style={{position:'relative', zIndex:1, textAlign:'center', padding:'0 24px'}}>

        {/* Corner brackets */}
        {['tl','tr','bl','br'].map(pos => (
          <div key={pos} style={{
            position:'absolute',
            top: pos.startsWith('t') ? -40 : 'auto',
            bottom: pos.startsWith('b') ? -40 : 'auto',
            left: pos.endsWith('l') ? -40 : 'auto',
            right: pos.endsWith('r') ? -40 : 'auto',
            width:28, height:28,
            borderTop: pos.startsWith('t') ? '1px solid rgba(201,168,76,0.6)' : 'none',
            borderBottom: pos.startsWith('b') ? '1px solid rgba(201,168,76,0.6)' : 'none',
            borderLeft: pos.endsWith('l') ? '1px solid rgba(201,168,76,0.6)' : 'none',
            borderRight: pos.endsWith('r') ? '1px solid rgba(201,168,76,0.6)' : 'none',
            opacity: phase === 'logo' || phase === 'tagline' || phase === 'reveal' ? 1 : 0,
            transform: phase === 'logo' || phase === 'tagline' || phase === 'reveal' ? 'scale(1)' : 'scale(0.5)',
            transition:'opacity 0.8s ease, transform 0.8s ease',
          }}/>
        ))}

        {/* AL Monogram */}
        <div style={{
          fontFamily:'Cinzel, Georgia, serif',
          fontSize:'clamp(5rem,16vw,9rem)',
          letterSpacing:'0.2em',
          lineHeight:1,
          color:'transparent',
          WebkitTextStroke:'1px rgba(201,168,76,0.4)',
          opacity: phase === 'logo' || phase === 'tagline' || phase === 'reveal' ? 1 : 0,
          transform: phase === 'logo' || phase === 'tagline' || phase === 'reveal' ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
          transition:'opacity 0.9s ease, transform 0.9s ease',
          position:'relative',
        }}>
          {/* Filled version that animates in after outline */}
          <span style={{
            position:'absolute', inset:0,
            fontFamily:'Cinzel, Georgia, serif',
            fontSize:'inherit',
            letterSpacing:'inherit',
            background:'linear-gradient(135deg, #C9A84C 0%, #E2C47A 40%, #FFF8E7 55%, #E2C47A 70%, #C9A84C 100%)',
            backgroundSize:'200% auto',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent',
            backgroundClip:'text',
            animation:'goldShimmerSplash 2.5s linear infinite',
            opacity: phase === 'tagline' || phase === 'reveal' ? 1 : 0,
            transition:'opacity 1.2s ease 0.3s',
          }}>AL</span>
          AL
        </div>

        {/* Divider line */}
        <div style={{
          height:1,
          background:'linear-gradient(90deg, transparent, #C9A84C, transparent)',
          margin:'20px auto',
          width: phase === 'tagline' || phase === 'reveal' ? 120 : 0,
          opacity: phase === 'tagline' || phase === 'reveal' ? 1 : 0,
          transition:'width 0.8s ease 0.2s, opacity 0.8s ease 0.2s',
        }}/>

        {/* Brand name */}
        <div style={{
          fontFamily:'Cinzel, Georgia, serif',
          fontSize:'clamp(1.2rem,4vw,2rem)',
          letterSpacing:'0.5em',
          color:'#FAF6EE',
          opacity: phase === 'tagline' || phase === 'reveal' ? 1 : 0,
          transform: phase === 'tagline' || phase === 'reveal' ? 'translateY(0)' : 'translateY(16px)',
          transition:'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          marginBottom:10,
        }}>AMINA LUXE</div>

        {/* Tagline */}
        <div style={{
          fontFamily:'Cormorant Garamond, Georgia, serif',
          fontSize:'clamp(0.85rem,2.5vw,1.1rem)',
          letterSpacing:'0.18em',
          color:'rgba(201,168,76,0.65)',
          fontStyle:'italic',
          opacity: phase === 'tagline' || phase === 'reveal' ? 1 : 0,
          transform: phase === 'tagline' || phase === 'reveal' ? 'translateY(0)' : 'translateY(10px)',
          transition:'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
          marginBottom:40,
        }}>Where modesty meets magnificence</div>

        {/* Reveal phase: collection text */}
        <div style={{
          opacity: phase === 'reveal' ? 1 : 0,
          transform: phase === 'reveal' ? 'translateY(0)' : 'translateY(12px)',
          transition:'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:12,
            border:'1px solid rgba(201,168,76,0.3)',
            padding:'8px 24px',
          }}>
            <div style={{width:20,height:1,background:'rgba(201,168,76,0.5)'}}/>
            <span style={{
              color:'rgba(201,168,76,0.8)',
              fontSize:'9px', letterSpacing:'0.35em',
              fontFamily:'Cinzel,serif',
            }}>NEW COLLECTION 2025</span>
            <div style={{width:20,height:1,background:'rgba(201,168,76,0.5)'}}/>
          </div>
        </div>

        {/* Loading progress bar */}
        <div style={{
          marginTop:48, width:200, height:1,
          background:'rgba(201,168,76,0.15)',
          position:'relative', overflow:'hidden',
          opacity: phase === 'logo' || phase === 'tagline' ? 1 : 0,
          transition:'opacity 0.5s ease',
        }}>
          <div style={{
            position:'absolute', left:0, top:0, bottom:0,
            background:'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            animation:'progressBar 5s linear forwards',
          }}/>
        </div>
      </div>

      <style>{`
        @keyframes goldShimmerSplash {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes lineSlide {
          from { opacity: 0.3; transform: translateY(-20px); }
          to   { opacity: 1;   transform: translateY(20px); }
        }
        @keyframes glowPulse {
          from { transform: translate(-50%,-50%) scale(0.8); opacity:0.5; }
          to   { transform: translate(-50%,-50%) scale(1.2); opacity:1; }
        }
        @keyframes progressBar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
