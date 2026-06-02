'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, ShoppingBag, Share2, Truck, RefreshCw, Shield, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'
import ProductCard from '@/components/shop/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [expanded, setExpanded] = useState<string | null>('description')
  const { addItem, toggleWishlist, isInWishlist } = useCartStore()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) {
        setProduct(data)
        setSelectedSize(data.sizes?.[0] || '')
        setSelectedColor(data.colors?.[0] || '')
        const { data: rel } = await supabase.from('products').select('*').eq('category', data.category).neq('id', id).limit(4)
        setRelated(rel || [])
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
      <div className="text-gold font-display text-xl animate-pulse">Loading...</div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-cream pt-24 flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-2xl text-green-deep">Product not found</h1>
      <Link href="/shop" className="btn-gold px-8 py-3 text-xs tracking-wider">BACK TO SHOP</Link>
    </div>
  )

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Please select a size'); return }
    if (!selectedColor) { toast.error('Please select a color'); return }
    for (let i = 0; i < qty; i++) addItem(product, selectedSize, selectedColor)
    toast.success(`${product.name} added to bag`)
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  const AccordionItem = ({ key: k, title, children }: any) => (
    <div className="border-b border-cream-dark">
      <button onClick={() => setExpanded(expanded === k ? null : k)}
        className="w-full flex items-center justify-between py-4 text-sm font-display tracking-[0.1em] text-green-deep">
        {title}
        <ChevronDown size={16} className={`text-text-muted transition-transform ${expanded === k ? 'rotate-180' : ''}`} />
      </button>
      {expanded === k && <div className="pb-4 text-sm text-text-muted font-serif leading-relaxed">{children}</div>}
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-text-muted mb-6 font-display tracking-wider">
          <Link href="/" className="hover:text-gold">HOME</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold">SHOP</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-gold">{product.category.toUpperCase()}</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name.toUpperCase().substring(0, 30)}...</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px]">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-20 lg:w-20 lg:h-24 overflow-hidden border-2 transition-all ${activeImg === i ? 'border-gold' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <div className="flex-1 relative aspect-[3/4] bg-cream-dark overflow-hidden">
              {product.images?.[activeImg] ? (
                <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gold font-display text-2xl tracking-widest">AMINA LUXE</span>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.new_arrival && <span className="badge-gold text-[9px] px-2 py-1">NEW ARRIVAL</span>}
                {discount && <span className="bg-red-600 text-white text-[9px] px-2 py-1 font-display">-{discount}% OFF</span>}
              </div>
              {/* Wishlist */}
              <button onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center border transition-all ${isInWishlist(product.id) ? 'bg-gold border-gold text-green-deep' : 'bg-white/90 border-white text-charcoal hover:border-gold hover:text-gold'}`}>
                <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            <p className="text-text-muted text-[11px] tracking-[0.2em] font-display mb-2">{product.category.toUpperCase()}</p>
            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal leading-tight mb-4">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl text-green-rich font-semibold">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-text-muted line-through text-lg">₹{product.original_price.toLocaleString()}</span>
                  <span className="text-red-600 text-sm font-display">{discount}% OFF</span>
                </>
              )}
            </div>
            <div className="gold-divider mb-6" />

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-display tracking-[0.15em] text-green-deep mb-2">
                  COLOR: <span className="text-gold">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 text-xs border font-display tracking-wider transition-all ${selectedColor === c ? 'bg-green-rich border-green-rich text-gold' : 'border-cream-dark text-charcoal hover:border-green-mid'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-display tracking-[0.15em] text-green-deep">
                    SIZE: <span className="text-gold">{selectedSize}</span>
                  </p>
                  <Link href="/pages/size-guide" className="text-[10px] text-text-muted hover:text-gold underline">Size Guide</Link>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 text-xs border font-display tracking-wider transition-all ${selectedSize === s ? 'bg-green-rich border-green-rich text-gold' : 'border-cream-dark text-charcoal hover:border-green-mid'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-display tracking-[0.15em] text-green-deep mb-2">QUANTITY</p>
              <div className="flex items-center border border-cream-dark w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream-dark transition-colors">−</button>
                <span className="w-12 text-center text-sm font-display">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-cream-dark transition-colors">+</button>
              </div>
              <p className="text-text-muted text-xs mt-1">{product.stock} in stock</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 btn-gold py-4 flex items-center justify-center gap-2 tracking-[0.2em] text-sm disabled:opacity-50">
                <ShoppingBag size={16} />
                {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
              </button>
              <Link href="/checkout" onClick={handleAddToCart}
                className="flex-1 btn-green py-4 flex items-center justify-center gap-2 tracking-[0.2em] text-sm text-center">
                BUY NOW
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-cream-dark mb-6">
              {[
                { icon: Truck, text: 'Free Shipping\nAbove ₹999' },
                { icon: RefreshCw, text: '7-Day\nReturns' },
                { icon: Shield, text: 'Secure\nPayment' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <Icon size={16} className="text-gold" />
                  <span className="text-[10px] text-text-muted leading-tight whitespace-pre-line">{text}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <AccordionItem key="description" title="DESCRIPTION">
              {product.description || 'Premium quality modest wear crafted with care.'}
            </AccordionItem>
            <AccordionItem key="care" title="CARE INSTRUCTIONS">
              Dry clean or gentle hand wash. Do not wring. Dry in shade. Iron on low heat.
            </AccordionItem>
            <AccordionItem key="shipping" title="SHIPPING & RETURNS">
              Free shipping on orders above ₹999. Delivered within 5-7 business days. Easy 7-day return policy.
            </AccordionItem>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <p className="text-gold text-[10px] tracking-[0.3em] font-display mb-2">YOU MAY ALSO LIKE</p>
              <h2 className="font-display text-3xl text-green-deep tracking-wide">MORE FROM {product.category.toUpperCase()}</h2>
              <div className="gold-divider w-24 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
