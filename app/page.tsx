import Link from 'next/link'
import { ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/shop/ProductCard'

async function getFeaturedProducts() {
  const { data } = await supabase.from('products').select('*').eq('featured', true)
    .order('created_at', { ascending: false }).limit(8)
  return data || []
}
async function getNewArrivals() {
  const { data } = await supabase.from('products').select('*').eq('new_arrival', true)
    .order('created_at', { ascending: false }).limit(4)
  return data || []
}

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([getFeaturedProducts(), getNewArrivals()])

  const categories = [
    { name: 'Abayas',       href: '/shop?category=Abayas',        desc: 'Draped in Grace',      letter: 'A' },
    { name: 'Kurtis',       href: '/shop?category=Kurtis',        desc: 'Everyday Elegance',    letter: 'K' },
    { name: 'Sarees',       href: '/shop?category=Sarees',        desc: 'Timeless Tradition',   letter: 'S' },
    { name: 'Salwar Suits', href: '/shop?category=Salwar+Suits',  desc: 'Refined Comfort',      letter: 'S' },
    { name: 'Co-ord Sets',  href: '/shop?category=Co-ord+Sets',   desc: 'Effortlessly Chic',    letter: 'C' },
    { name: 'Dupattas & Hijabs', href: '/shop?category=Dupattas+%26+Hijabs', desc: 'The Finishing Touch', letter: 'D' },
  ]

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{background:'#0D3318'}}>
        <div className="absolute inset-0" style={{
          backgroundImage:`repeating-linear-gradient(45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)`,
          backgroundSize:'20px 20px', opacity:0.04
        }}/>
        <div className="absolute bottom-0 left-0 w-full h-px" style={{background:'linear-gradient(90deg,transparent,#C9A84C,transparent)'}}/>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-36 pb-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-6 fade-up fade-up-delay-1"
              style={{border:'1px solid rgba(201,168,76,0.3)',padding:'6px 16px'}}>
              <div style={{width:16,height:1,background:'rgba(201,168,76,0.6)'}}/>
              <span style={{color:'rgba(201,168,76,0.8)',fontSize:'10px',letterSpacing:'0.3em',fontFamily:'Cinzel,serif'}}>NEW COLLECTION 2025</span>
              <div style={{width:16,height:1,background:'rgba(201,168,76,0.6)'}}/>
            </div>

            <h1 className="fade-up fade-up-delay-2" style={{
              fontFamily:'Cinzel,serif', fontSize:'clamp(2.5rem,7vw,5rem)',
              lineHeight:1, letterSpacing:'0.05em', color:'#FAF6EE', marginBottom:'1.5rem'
            }}>
              MODEST<br/>
              <span className="gold-shimmer">LUXURY</span><br/>
              MADE FOR ALL
            </h1>

            <p className="fade-up fade-up-delay-3" style={{
              fontFamily:'Cormorant Garamond,Georgia,serif', fontSize:'1.15rem',
              lineHeight:1.7, color:'rgba(250,246,238,0.6)', maxWidth:420,
              margin:'0 auto 2rem', letterSpacing:'0.02em'
            }}>
              Curated modest fashion for the modern woman — where elegance meets your values, and every piece tells your story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fade-up fade-up-delay-4">
              <Link href="/shop" className="btn-gold" style={{padding:'16px 40px',fontSize:'0.75rem',letterSpacing:'0.2em'}}>
                EXPLORE COLLECTION <ArrowRight size={16} style={{marginLeft:8}}/>
              </Link>
              <Link href="/shop?new=true" className="btn-outline-gold" style={{padding:'16px 40px',fontSize:'0.75rem',letterSpacing:'0.2em'}}>
                NEW ARRIVALS
              </Link>
            </div>

            <div className="flex gap-8 mt-12 justify-center lg:justify-start fade-up fade-up-delay-4">
              {[['500+','Styles'],['100%','Women\'s Wear'],['Modest','Luxury']].map(([n,l])=>(
                <div key={l} className="text-center">
                  <div style={{color:'#C9A84C',fontFamily:'Cinzel,serif',fontSize:'1.25rem',fontWeight:600}}>{n}</div>
                  <div style={{color:'rgba(250,246,238,0.4)',fontSize:'10px',letterSpacing:'0.15em',marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative box */}
          <div className="flex-1 flex justify-center">
            <div className="relative" style={{width:320,height:480}}>
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{background:'linear-gradient(135deg,#1A5C2A,#2E7D45)',border:'1px solid rgba(201,168,76,0.2)'}}>
                <div style={{color:'rgba(201,168,76,0.12)',fontFamily:'Cinzel,serif',fontSize:'5rem',letterSpacing:'0.2em',lineHeight:1}}>AL</div>
                <div style={{color:'#C9A84C',fontFamily:'Cinzel,serif',fontSize:'1.5rem',letterSpacing:'0.25em'}}>AMINA LUXE</div>
                <div style={{height:1,background:'linear-gradient(90deg,transparent,#C9A84C,transparent)',width:80,margin:'16px 0'}}/>
                <div style={{color:'rgba(250,246,238,0.4)',fontFamily:'Cormorant Garamond,serif',fontSize:'0.9rem',fontStyle:'italic',textAlign:'center',padding:'0 24px'}}>
                  "Where modesty meets magnificence"
                </div>
              </div>
              <div style={{position:'absolute',top:12,left:12,width:32,height:32,borderTop:'1px solid rgba(201,168,76,0.6)',borderLeft:'1px solid rgba(201,168,76,0.6)'}}/>
              <div style={{position:'absolute',top:12,right:12,width:32,height:32,borderTop:'1px solid rgba(201,168,76,0.6)',borderRight:'1px solid rgba(201,168,76,0.6)'}}/>
              <div style={{position:'absolute',bottom:12,left:12,width:32,height:32,borderBottom:'1px solid rgba(201,168,76,0.6)',borderLeft:'1px solid rgba(201,168,76,0.6)'}}/>
              <div style={{position:'absolute',bottom:12,right:12,width:32,height:32,borderBottom:'1px solid rgba(201,168,76,0.6)',borderRight:'1px solid rgba(201,168,76,0.6)'}}/>
            </div>
          </div>
        </div>

        <div style={{position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <div style={{color:'rgba(250,246,238,0.3)',fontSize:'9px',letterSpacing:'0.3em',fontFamily:'Cinzel,serif'}}>SCROLL</div>
          <div style={{width:1,height:40,background:'linear-gradient(to bottom,rgba(201,168,76,0.4),transparent)'}}/>
        </div>
      </section>

      {/* ── TAGLINE ── */}
      <section style={{background:'#FAF6EE',padding:'24px 0',textAlign:'center'}}>
        <p style={{fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'1.1rem',color:'#6B7B6E',letterSpacing:'0.1em',fontStyle:'italic'}}>
          Modest fashion for every occasion — designed exclusively for women ✦
        </p>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{background:'#FAF6EE',padding:'80px 0'}}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div style={{textAlign:'center',marginBottom:48}}>
            <p style={{color:'#C9A84C',fontSize:'10px',letterSpacing:'0.3em',fontFamily:'Cinzel,serif',marginBottom:8}}>SHOP BY CATEGORY</p>
            <h2 style={{fontFamily:'Cinzel,serif',fontSize:'2.5rem',color:'#0D3318',letterSpacing:'0.05em'}}>COLLECTIONS</h2>
            <div className="gold-divider" style={{width:96,margin:'16px auto 0'}}/>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <Link key={cat.name} href={cat.href}
                className="group relative overflow-hidden flex flex-col items-center justify-end"
                style={{aspectRatio:'3/4',background:'#1A5C2A',padding:24,cursor:'pointer',textDecoration:'none'}}>
                <div className="absolute inset-0 transition-opacity duration-500"
                  style={{background:'linear-gradient(to bottom,#1A5C2A,#0D3318)',opacity:0.85}}/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div style={{color:'rgba(201,168,76,0.08)',fontFamily:'Cinzel,serif',fontSize:'6rem',letterSpacing:'0.2em'}}>{cat.letter}</div>
                </div>
                <div className="relative z-10 text-center">
                  <p style={{color:'rgba(201,168,76,0.7)',fontSize:'10px',letterSpacing:'0.2em',fontFamily:'Cinzel,serif',marginBottom:4}}>{cat.desc}</p>
                  <h3 style={{color:'#FAF6EE',fontFamily:'Cinzel,serif',fontSize:'1.1rem',letterSpacing:'0.15em'}}>{cat.name.toUpperCase()}</h3>
                  <div style={{width:32,height:1,background:'rgba(201,168,76,0.4)',margin:'8px auto 0',transition:'width 0.4s'}}/>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      {featured.length > 0 && (
        <section style={{background:'#F0E8D5',padding:'80px 0'}}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between" style={{marginBottom:48}}>
              <div>
                <p style={{color:'#C9A84C',fontSize:'10px',letterSpacing:'0.3em',fontFamily:'Cinzel,serif',marginBottom:8}}>HANDPICKED FOR YOU</p>
                <h2 style={{fontFamily:'Cinzel,serif',fontSize:'2.25rem',color:'#0D3318',letterSpacing:'0.05em'}}>FEATURED PIECES</h2>
              </div>
              <Link href="/shop" className="btn-outline-gold" style={{padding:'10px 24px',fontSize:'11px'}}>
                VIEW ALL <ArrowRight size={12} style={{marginLeft:6}}/>
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND PROMISE ── */}
      <section className="relative overflow-hidden" style={{background:'#0D3318',padding:'80px 0'}}>
        <div className="absolute inset-0" style={{
          backgroundImage:`repeating-linear-gradient(-45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)`,
          backgroundSize:'15px 15px',opacity:0.03
        }}/>
        <div className="relative max-w-3xl mx-auto px-4" style={{textAlign:'center'}}>
          <div style={{color:'rgba(201,168,76,0.5)',fontSize:'10px',letterSpacing:'0.4em',fontFamily:'Cinzel,serif',marginBottom:12}}>OUR PROMISE TO YOU</div>
          <h2 style={{color:'#FAF6EE',fontFamily:'Cinzel,serif',fontSize:'clamp(1.5rem,4vw,2.75rem)',letterSpacing:'0.05em',lineHeight:1.3,marginBottom:16}}>
            EVERY STITCH, A STORY.<br/>
            <span style={{color:'#C9A84C'}}>EVERY GARMENT, A GRACE.</span>
          </h2>
          <p style={{color:'rgba(250,246,238,0.5)',fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:'1.1rem',lineHeight:1.8}}>
            We believe modesty is not a restriction — it is an art form. Amina Luxe brings you fashion crafted exclusively for women who carry grace in every step.
          </p>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section style={{background:'#FAF6EE',padding:'80px 0'}}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div style={{textAlign:'center',marginBottom:48}}>
              <p style={{color:'#C9A84C',fontSize:'10px',letterSpacing:'0.3em',fontFamily:'Cinzel,serif',marginBottom:8}}>JUST IN</p>
              <h2 style={{fontFamily:'Cinzel,serif',fontSize:'2.25rem',color:'#0D3318',letterSpacing:'0.05em'}}>NEW ARRIVALS</h2>
              <div className="gold-divider" style={{width:96,margin:'16px auto 0'}}/>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
            <div style={{textAlign:'center',marginTop:40}}>
              <Link href="/shop?new=true" className="btn-gold" style={{padding:'16px 48px',fontSize:'0.75rem',letterSpacing:'0.2em'}}>
                SHOP NEW ARRIVALS <ArrowRight size={16} style={{marginLeft:8}}/>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ── */}
      <section style={{background:'#F0E8D5',padding:'80px 0'}}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              {icon:Truck,   title:'Free Shipping', desc:'On orders above ₹999'},
              {icon:RefreshCw,title:'Easy Returns',  desc:'7-day return policy'},
              {icon:Shield,  title:'Secure Payment', desc:'100% safe checkout'},
              {icon:Star,    title:'Women First',    desc:'Exclusively for women'},
            ].map(({icon:Icon,title,desc})=>(
              <div key={title} className="group">
                <div style={{width:48,height:48,border:'1px solid rgba(201,168,76,0.4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',transition:'all 0.3s'}}>
                  <Icon size={20} style={{color:'#C9A84C'}}/>
                </div>
                <h4 style={{fontFamily:'Cinzel,serif',color:'#0D3318',fontSize:'0.8rem',letterSpacing:'0.1em',marginBottom:4}}>{title}</h4>
                <p style={{color:'#6B7B6E',fontSize:'0.75rem'}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM CTA ── */}
      <section style={{background:'#0D3318',padding:'64px 0',textAlign:'center'}}>
        <div className="max-w-xl mx-auto px-4">
          <p style={{color:'rgba(201,168,76,0.6)',fontSize:'10px',letterSpacing:'0.4em',fontFamily:'Cinzel,serif',marginBottom:12}}>JOIN OUR COMMUNITY</p>
          <h2 style={{color:'#FAF6EE',fontFamily:'Cinzel,serif',fontSize:'1.75rem',letterSpacing:'0.1em',marginBottom:8}}>FOLLOW US ON INSTAGRAM</h2>
          <p style={{color:'rgba(250,246,238,0.5)',fontSize:'0.875rem',marginBottom:24,fontFamily:'Cormorant Garamond,serif'}}>
            Styling inspiration, new arrivals & exclusive offers
          </p>
          <a href="https://www.instagram.com/aminaluxe.in" target="_blank" rel="noopener noreferrer"
            className="btn-gold" style={{padding:'14px 40px',fontSize:'0.75rem',letterSpacing:'0.2em'}}>
            @AMINALUXE.IN
          </a>
        </div>
      </section>
    </div>
  )
}
