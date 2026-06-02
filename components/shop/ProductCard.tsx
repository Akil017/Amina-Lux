'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const { addItem, toggleWishlist, isInWishlist } = useCartStore()
  const wishlisted = isInWishlist(product.id)
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  return (
    <div className="product-card group relative bg-white" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Image */}
      <div className="relative overflow-hidden bg-cream-dark aspect-[3/4]">
        <Link href={`/shop/${product.id}`}>
          <div className="relative w-full h-full">
            {product.images?.[0] ? (
              <img
                src={product.images[hovered && product.images[1] ? 1 : 0]}
                alt={product.name}
                className="product-img w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-cream-dark flex items-center justify-center">
                <span className="text-text-muted font-display text-xs tracking-wider">AMINA LUXE</span>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.new_arrival && (
            <span className="badge-gold text-[9px] tracking-[0.1em] px-2 py-0.5">NEW</span>
          )}
          {discount && (
            <span className="bg-red-600 text-white text-[9px] tracking-[0.1em] px-2 py-0.5 font-display">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-charcoal text-cream text-[9px] tracking-[0.1em] px-2 py-0.5 font-display">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300 ${
            wishlisted ? 'bg-gold text-green-deep' : 'bg-white/90 text-charcoal hover:bg-gold hover:text-green-deep'
          }`}>
          <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick actions on hover */}
        <div className={`absolute bottom-0 left-0 right-0 flex gap-0 transition-all duration-300 ${
          hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <button
            onClick={() => {
              if (product.sizes?.[0] && product.colors?.[0]) {
                addItem(product, product.sizes[0], product.colors[0])
              }
            }}
            disabled={product.stock === 0}
            className="flex-1 btn-green py-2.5 flex items-center justify-center gap-2 text-[10px] tracking-wider font-display disabled:opacity-50">
            <ShoppingBag size={13} />
            {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
          </button>
          <Link href={`/shop/${product.id}`}
            className="w-11 bg-green-deep border-l border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-green-deep transition-colors">
            <Eye size={15} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <Link href={`/shop/${product.id}`}>
          <p className="text-text-muted text-[10px] tracking-[0.15em] uppercase mb-1">{product.category}</p>
          <h3 className="font-serif text-charcoal text-sm leading-tight mb-2 line-clamp-2 hover:text-green-mid transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-display text-green-rich text-sm font-semibold">₹{product.price.toLocaleString()}</span>
          {product.original_price && (
            <span className="text-text-muted text-xs line-through">₹{product.original_price.toLocaleString()}</span>
          )}
        </div>
        {/* Size dots */}
        {product.sizes?.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.slice(0, 5).map(s => (
              <span key={s} className="text-[9px] text-text-muted border border-cream-dark px-1.5 py-0.5">{s}</span>
            ))}
            {product.sizes.length > 5 && <span className="text-[9px] text-text-muted">+{product.sizes.length - 5}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
