'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/shop/ProductCard'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlist.length === 0) { setLoading(false); return }
    supabase.from('products').select('*').in('id', wishlist)
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [wishlist])

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="bg-green-deep py-10 text-center">
        <h1 className="text-cream font-display text-3xl tracking-wide">WISHLIST</h1>
        <p className="text-gold/60 text-xs mt-2 tracking-widest">{wishlist.length} SAVED PIECE{wishlist.length !== 1 ? 'S' : ''}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-cream-dark animate-pulse" />)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-gold/30 mx-auto mb-4" />
            <h2 className="font-display text-xl text-green-deep mb-2">Your wishlist is empty</h2>
            <p className="text-text-muted text-sm mb-6">Save pieces you love and come back to them anytime</p>
            <Link href="/shop" className="btn-gold px-10 py-3 text-sm tracking-wider">EXPLORE COLLECTION</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
