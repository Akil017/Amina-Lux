'use client'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()

  if (items.length === 0) return (
    <div className="min-h-screen bg-cream pt-28 flex flex-col items-center justify-center gap-6 px-4">
      <ShoppingBag size={48} className="text-gold/40" />
      <h1 className="font-display text-3xl text-green-deep tracking-wide">YOUR BAG IS EMPTY</h1>
      <p className="text-text-muted font-serif text-lg text-center">Discover our latest collection of modest luxury</p>
      <Link href="/shop" className="btn-gold px-12 py-4 tracking-[0.2em] text-sm flex items-center gap-2">
        EXPLORE COLLECTION <ArrowRight size={16} />
      </Link>
    </div>
  )

  const shipping = totalPrice() >= 999 ? 0 : 99
  const total = totalPrice() + shipping

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="bg-green-deep py-10 text-center">
        <h1 className="text-cream font-display text-3xl tracking-wide">YOUR BAG</h1>
        <p className="text-gold/60 text-xs mt-2 tracking-widest">{items.length} ITEM{items.length > 1 ? 'S' : ''}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4 bg-white p-4 border border-cream-dark">
                <div className="w-24 h-32 bg-cream-dark shrink-0 overflow-hidden">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold font-display text-xs">AL</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-text-muted font-display tracking-wider mb-0.5">{item.product.category}</p>
                      <Link href={`/shop/${item.product.id}`}
                        className="font-serif text-sm text-charcoal hover:text-green-mid line-clamp-2">{item.product.name}</Link>
                    </div>
                    <button onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="text-text-muted hover:text-red-600 transition-colors shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-text-muted">
                    <span className="border border-cream-dark px-2 py-0.5">{item.size}</span>
                    <span className="border border-cream-dark px-2 py-0.5">{item.color}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-cream-dark">
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-cream-dark">−</button>
                      <span className="w-8 text-center text-xs font-display">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-cream-dark">+</button>
                    </div>
                    <span className="font-display text-green-rich font-semibold">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-cream-dark p-6 sticky top-28">
              <h2 className="font-display text-sm tracking-[0.2em] text-green-deep mb-5">ORDER SUMMARY</h2>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-display">₹{totalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Shipping</span>
                  <span className={`font-display ${shipping === 0 ? 'text-green-mid' : ''}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gold">Add ₹{(999 - totalPrice()).toLocaleString()} more for free shipping</p>
                )}
              </div>
              <div className="gold-divider mb-4" />
              <div className="flex justify-between font-display text-lg font-semibold mb-6">
                <span>TOTAL</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <Link href="/checkout" className="btn-gold w-full py-4 text-center flex items-center justify-center gap-2 tracking-[0.2em] text-sm">
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="block text-center text-text-muted text-xs mt-4 hover:text-gold transition-colors underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
