'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { supabase } from '@/lib/supabase'

const G = '#1A5C2A'   // logo green
const GD = '#0D3318'  // deep green
const GO = '#C9A84C'  // gold
const GL = '#E2C47A'  // gold light
const CR = '#FAF6EE'  // cream

export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profile, setProfile]     = useState<any>(null)
  const pathname = usePathname()
  const totalItems = useCartStore(s => s.totalItems())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase.from('profiles').select('*').eq('id', data.user.id).single()
          .then(({ data: p }) => setProfile(p))
      } else {
        setProfile(null)
      }
    })
  }, [pathname])

  const isHome  = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  const navLinks = [
    { href: '/shop',                        label: 'Shop All' },
    { href: '/shop?category=Abayas',        label: 'Abayas' },
    { href: '/shop?category=Kurtis',        label: 'Kurtis' },
    { href: '/shop?category=Sarees',        label: 'Sarees' },
    { href: '/shop?category=Salwar+Suits',  label: 'Salwar Suits' },
    { href: '/shop?new=true',               label: 'New Arrivals' },
  ]

  const headerBg = scrolled || !isHome ? GD : 'transparent'

  return (
    <>
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:50,
        transition:'all .4s ease',
        background: headerBg,
        boxShadow: scrolled || !isHome ? '0 2px 24px rgba(0,0,0,.35)' : 'none',
      }}>
        {/* Announcement bar */}
        <div style={{background:GD, color:GL, textAlign:'center', padding:'7px 16px',
          fontSize:'11px', letterSpacing:'0.22em', fontFamily:'Cinzel,serif'}}>
          FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;✦&nbsp; EXCLUSIVELY FOR WOMEN
        </div>

        <div style={{maxWidth:1400, margin:'0 auto', padding:'0 32px'}}>
          <div style={{display:'flex', alignItems:'center', height:64, gap:32}}>

            {/* LEFT: Logo */}
            <Link href="/" style={{textDecoration:'none', flexShrink:0}}>
              <div style={{color:GO, fontFamily:'Cinzel,serif', fontSize:'1.35rem',
                letterSpacing:'0.18em', lineHeight:1}}>AMINA LUXE</div>
              <div style={{color:'rgba(201,168,76,0.45)', fontSize:'7px', letterSpacing:'0.25em', marginTop:2}}
                className="hidden lg:block">MODEST LUXURY, MADE FOR ALL</div>
            </Link>

            {/* CENTRE: Desktop nav */}
            <nav className="hidden lg:flex" style={{gap:32, flex:1, justifyContent:'center'}}>
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} style={{
                  color: pathname === l.href ? GO : 'rgba(250,246,238,0.8)',
                  fontSize:'11px', letterSpacing:'0.16em',
                  fontFamily:'Cinzel,serif', textDecoration:'none',
                  transition:'color .25s', whiteSpace:'nowrap',
                }}
                onMouseEnter={e=>(e.currentTarget.style.color=GO)}
                onMouseLeave={e=>(e.currentTarget.style.color=pathname===l.href?GO:'rgba(250,246,238,0.8)')}>
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Mobile spacer */}
            <div className="lg:hidden" style={{flex:1}}/>

            {/* Mobile menu btn */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{color:CR, background:'none', border:'none', cursor:'pointer', display:'flex'}}
              className="lg:hidden">
              {menuOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>

            {/* Right icons */}
            <div style={{display:'flex', alignItems:'center', gap:20}}>
              <button onClick={() => setSearchOpen(!searchOpen)}
                style={{color:'rgba(250,246,238,0.8)', background:'none', border:'none', cursor:'pointer', transition:'color .25s'}}
                className="hidden lg:flex"
                onMouseEnter={e=>(e.currentTarget.style.color=GO)}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(250,246,238,0.8)')}>
                <Search size={18}/>
              </button>

              <Link href="/account/wishlist"
                style={{color:'rgba(250,246,238,0.8)', transition:'color .25s'}}
                className="hidden lg:flex"
                onMouseEnter={e=>(e.currentTarget.style.color=GO)}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(250,246,238,0.8)')}>
                <Heart size={18}/>
              </Link>

              {/* User dropdown */}
              <div className="relative group hidden lg:block">
                <button style={{color:'rgba(250,246,238,0.8)', background:'none', border:'none', cursor:'pointer'}}
                  onMouseEnter={e=>(e.currentTarget.style.color=GO)}
                  onMouseLeave={e=>(e.currentTarget.style.color='rgba(250,246,238,0.8)')}>
                  <User size={18}/>
                </button>
                <div className="absolute right-0 invisible opacity-0 group-hover:visible group-hover:opacity-100"
                  style={{top:'100%', marginTop:8, width:200,
                    background:GD, border:'1px solid rgba(201,168,76,.2)',
                    boxShadow:'0 8px 32px rgba(0,0,0,.4)', transition:'all .2s', zIndex:100}}>
                  {profile ? (
                    <>
                      <div style={{padding:'10px 16px', borderBottom:'1px solid rgba(201,168,76,.1)',
                        color:'rgba(250,246,238,.5)', fontSize:'11px', fontFamily:'Cinzel,serif', letterSpacing:'0.1em'}}>
                        {profile.name || profile.email?.split('@')[0]}
                      </div>
                      <Link href="/account" style={{display:'block', padding:'10px 16px',
                        color:'rgba(250,246,238,.8)', fontSize:'12px', letterSpacing:'0.12em',
                        fontFamily:'Cinzel,serif', textDecoration:'none'}}
                        onMouseEnter={e=>(e.currentTarget.style.color=GO)}
                        onMouseLeave={e=>(e.currentTarget.style.color='rgba(250,246,238,.8)')}>
                        My Account
                      </Link>
                      <Link href="/account/orders" style={{display:'block', padding:'10px 16px',
                        color:'rgba(250,246,238,.8)', fontSize:'12px', letterSpacing:'0.12em',
                        fontFamily:'Cinzel,serif', textDecoration:'none'}}
                        onMouseEnter={e=>(e.currentTarget.style.color=GO)}
                        onMouseLeave={e=>(e.currentTarget.style.color='rgba(250,246,238,.8)')}>
                        My Orders
                      </Link>
                      {profile.role === 'admin' && (
                        <Link href="/admin" style={{display:'block', padding:'10px 16px',
                          color:GO, fontSize:'12px', letterSpacing:'0.12em',
                          fontFamily:'Cinzel,serif', textDecoration:'none', fontWeight:600}}>
                          ⚙ Admin Panel
                        </Link>
                      )}
                      <button onClick={async()=>{await supabase.auth.signOut();window.location.href='/'}}
                        style={{width:'100%', textAlign:'left', padding:'10px 16px', background:'none', border:'none',
                          borderTop:'1px solid rgba(201,168,76,.1)', color:'rgba(250,246,238,.5)',
                          fontSize:'12px', letterSpacing:'0.12em', fontFamily:'Cinzel,serif', cursor:'pointer',
                          display:'flex', alignItems:'center', gap:6}}
                        onMouseEnter={e=>(e.currentTarget.style.color='#ef4444')}
                        onMouseLeave={e=>(e.currentTarget.style.color='rgba(250,246,238,.5)')}>
                        <LogOut size={12}/> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link href="/auth" style={{display:'block', padding:'12px 16px',
                      color:GO, fontSize:'12px', letterSpacing:'0.15em',
                      fontFamily:'Cinzel,serif', textDecoration:'none', textAlign:'center'}}>
                      SIGN IN / REGISTER
                    </Link>
                  )}
                </div>
              </div>

              {/* Cart */}
              <Link href="/cart" style={{color:'rgba(250,246,238,0.8)', position:'relative',
                transition:'color .25s'}}
                onMouseEnter={e=>(e.currentTarget.style.color=GO)}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(250,246,238,0.8)')}>
                <ShoppingBag size={18}/>
                {totalItems > 0 && (
                  <span style={{
                    position:'absolute', top:-8, right:-8,
                    background:GO, color:GD, fontSize:'9px',
                    fontFamily:'Cinzel,serif', fontWeight:700,
                    width:17, height:17, borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>{totalItems}</span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{background:GD, borderTop:'1px solid rgba(201,168,76,.15)', padding:'12px 24px'}}>
            <form onSubmit={e=>{e.preventDefault();const q=(e.target as any).q.value;window.location.href=`/shop?search=${q}`}}
              style={{maxWidth:560, margin:'0 auto', display:'flex', gap:8}}>
              <input name="q" placeholder="Search abayas, kurtis, sarees…" autoFocus
                style={{flex:1, background:'rgba(255,255,255,.08)', border:'1px solid rgba(201,168,76,.3)',
                  color:CR, padding:'10px 16px', fontSize:'13px', outline:'none'}}/>
              <button type="submit" className="btn-gold" style={{padding:'10px 20px', fontSize:'11px'}}>SEARCH</button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{position:'fixed', inset:0, zIndex:40}}>
          <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,.6)'}} onClick={()=>setMenuOpen(false)}/>
          <div style={{position:'absolute', left:0, top:0, bottom:0, width:280,
            background:GD, display:'flex', flexDirection:'column', paddingTop:72, padding:'72px 0 0'}}>
            <div style={{padding:'16px 24px 24px', borderBottom:'1px solid rgba(201,168,76,.1)'}}>
              <div style={{color:GO, fontFamily:'Cinzel,serif', fontSize:'1.4rem', letterSpacing:'0.2em'}}>AMINA LUXE</div>
              <div style={{color:'rgba(201,168,76,.4)', fontSize:'9px', letterSpacing:'0.25em', marginTop:4}}>MODEST LUXURY, MADE FOR ALL</div>
            </div>
            {navLinks.map(l=>(
              <Link key={l.href} href={l.href}
                onClick={()=>setMenuOpen(false)}
                style={{padding:'14px 24px', color:'rgba(250,246,238,.8)', textDecoration:'none',
                  fontSize:'12px', letterSpacing:'0.16em', fontFamily:'Cinzel,serif',
                  borderBottom:'1px solid rgba(255,255,255,.05)', transition:'color .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.color=GO)}
                onMouseLeave={e=>(e.currentTarget.style.color='rgba(250,246,238,.8)')}>
                {l.label}
              </Link>
            ))}
            <div style={{marginTop:'auto', padding:24, borderTop:'1px solid rgba(201,168,76,.1)'}}>
              {profile ? (
                <button onClick={async()=>{await supabase.auth.signOut();window.location.href='/'}}
                  className="btn-outline-gold" style={{padding:'10px 20px', fontSize:'11px', width:'100%'}}>
                  SIGN OUT
                </button>
              ) : (
                <Link href="/auth" className="btn-gold" style={{padding:'12px 24px', fontSize:'11px', width:'100%'}}
                  onClick={()=>setMenuOpen(false)}>
                  SIGN IN
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
