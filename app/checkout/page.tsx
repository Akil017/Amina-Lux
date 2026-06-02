'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/store/cart'
import { ShippingAddress } from '@/types'
import toast from 'react-hot-toast'
import { Lock, ArrowLeft } from 'lucide-react'

declare global { interface Window { Razorpay: any } }

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState<ShippingAddress>({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth?redirect=/checkout'); return }
      setUser(data.user)
      supabase.from('profiles').select('*').eq('id', data.user.id).single()
        .then(({ data: p }) => {
          setProfile(p)
          if (p) setAddress(a => ({ ...a, name: p.name || '', phone: p.phone || '' }))
        })
    })
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)
  }, [])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-2xl text-green-deep">Your bag is empty</h1>
        <Link href="/shop" className="btn-gold px-10 py-3 text-sm tracking-wider">SHOP NOW</Link>
      </div>
    )
  }

  const subtotal = totalPrice()
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in all required address fields')
      return
    }
    setLoading(true)

    try {
      // Create order in DB first
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        status: 'pending',
        total,
        shipping_address: address,
      }).select().single()

      if (orderError) throw orderError

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price,
      }))
      await supabase.from('order_items').insert(orderItems)

      // Update stock
      for (const item of items) {
        const { data: prod } = await supabase.from('products').select('stock').eq('id', item.product.id).single()
        if (prod) await supabase.from('products').update({ stock: Math.max(0, prod.stock - item.quantity) }).eq('id', item.product.id)
      }

      // Razorpay payment
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (razorpayKey) {
        const options = {
          key: razorpayKey,
          amount: total * 100, // in paise
          currency: 'INR',
          name: 'Amina Luxe',
          description: `Order #${order.id.slice(-8).toUpperCase()}`,
          order_id: undefined, // set from server in production
          handler: async (response: any) => {
            await supabase.from('orders').update({
              status: 'confirmed',
              payment_id: response.razorpay_payment_id
            }).eq('id', order.id)
            clearCart()
            toast.success('Order placed successfully! 🎉')
            router.push(`/account/orders?success=${order.id}`)
          },
          prefill: { name: address.name, contact: address.phone, email: user.email },
          theme: { color: '#1A5C2A' },
          modal: {
            ondismiss: async () => {
              // Mark as pending, don't delete
              toast('Payment cancelled. Your order is saved.')
              clearCart()
              router.push('/account/orders')
            }
          }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // No payment gateway configured — COD fallback
        await supabase.from('orders').update({ status: 'confirmed' }).eq('id', order.id)
        clearCart()
        toast.success('Order placed! (Cash on Delivery)')
        router.push('/account/orders')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const Field = ({ label, name, value, onChange, placeholder, required = false, type = 'text', half = false }: any) => (
    <div className={half ? '' : 'col-span-2 sm:col-span-2'}>
      <label className="text-xs font-display tracking-wider text-green-deep block mb-1.5">
        {label} {required && '*'}
      </label>
      <input type={type} value={value} onChange={(e: any) => onChange(name, e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full border border-cream-dark px-3 py-2.5 text-sm focus:outline-none focus:border-green-mid" />
    </div>
  )

  const setField = (key: string, val: string) => setAddress(a => ({ ...a, [key]: val }))

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="bg-green-deep py-10 text-center">
        <h1 className="text-cream font-display text-3xl tracking-wide">CHECKOUT</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-gold mb-6 font-display tracking-wider">
          <ArrowLeft size={14} /> BACK TO BAG
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Address form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-cream-dark p-6">
              <h2 className="font-display text-sm tracking-[0.2em] text-green-deep mb-5">SHIPPING ADDRESS</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name" name="name" value={address.name} onChange={setField} required half />
                <Field label="Phone Number" name="phone" value={address.phone} onChange={setField} required half type="tel" />
                <div className="col-span-2">
                  <Field label="Address Line 1" name="line1" value={address.line1} onChange={setField} required placeholder="House/Flat no, Street name" />
                </div>
                <div className="col-span-2">
                  <Field label="Address Line 2" name="line2" value={address.line2 || ''} onChange={setField} placeholder="Area, Landmark (optional)" />
                </div>
                <Field label="City" name="city" value={address.city} onChange={setField} required half />
                <Field label="State" name="state" value={address.state} onChange={setField} required half />
                <Field label="PIN Code" name="pincode" value={address.pincode} onChange={setField} required half />
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white border border-cream-dark p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={16} className="text-gold" />
                <h2 className="font-display text-sm tracking-[0.2em] text-green-deep">SECURE PAYMENT</h2>
              </div>
              <p className="text-text-muted text-sm font-serif">
                You'll be redirected to Razorpay's secure payment page to complete your purchase. We accept UPI, cards, net banking, and wallets.
              </p>
              {!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && (
                <p className="text-xs text-gold mt-2 bg-gold/10 px-3 py-2">Cash on Delivery mode — Razorpay not configured yet</p>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-cream-dark p-6 sticky top-28">
              <h2 className="font-display text-sm tracking-[0.2em] text-green-deep mb-5">ORDER SUMMARY</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <div className="w-12 h-14 bg-cream-dark shrink-0 overflow-hidden">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full flex items-center justify-center text-gold text-[10px]">AL</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-charcoal truncate">{item.product.name}</p>
                      <p className="text-[10px] text-text-muted">{item.size} · {item.color} · x{item.quantity}</p>
                      <p className="text-xs font-display text-green-rich mt-0.5">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="gold-divider mb-4" />
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-display">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Shipping</span>
                  <span className={`font-display ${shipping === 0 ? 'text-green-mid' : ''}`}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
              </div>
              <div className="gold-divider mb-4" />
              <div className="flex justify-between font-display text-lg mb-5">
                <span>TOTAL</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <button onClick={handlePlaceOrder} disabled={loading}
                className="btn-gold w-full py-4 flex items-center justify-center gap-2 tracking-[0.2em] text-sm disabled:opacity-60">
                <Lock size={14} />
                {loading ? 'PROCESSING...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
