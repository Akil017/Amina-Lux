'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Package, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'

const STATUS_COLOR: any = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}
const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

export default function OrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const successOrderId = searchParams.get('success')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(successOrderId)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth'); return }
      supabase.from('orders')
        .select('*, order_items(*, products(name, images, price))')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .then(({ data: o }) => { setOrders(o || []); setLoading(false) })
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
      <div className="text-gold font-display animate-pulse">Loading orders...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="bg-green-deep py-10 text-center">
        <h1 className="text-cream font-display text-3xl tracking-wide">MY ORDERS</h1>
      </div>
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
        {successOrderId && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-5 py-4 mb-6">
            <CheckCircle size={20} className="text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-display tracking-wider text-green-800">ORDER PLACED SUCCESSFULLY!</p>
              <p className="text-xs text-green-600 mt-0.5">Order #{successOrderId.slice(-8).toUpperCase()} confirmed.</p>
            </div>
          </div>
        )}
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-gold/30 mx-auto mb-4" />
            <h2 className="font-display text-xl text-green-deep mb-2">No orders yet</h2>
            <Link href="/shop" className="btn-gold px-10 py-3 text-sm tracking-wider">START SHOPPING</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const isOpen = expanded === order.id
              const stepIdx = STATUS_STEPS.indexOf(order.status)
              return (
                <div key={order.id} className="bg-white border border-cream-dark">
                  <button onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-cream/50 transition-colors">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="font-display text-sm text-green-rich">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className={`text-[10px] font-display tracking-wider px-2 py-0.5 border ${STATUS_COLOR[order.status]}`}>
                        {order.status?.toUpperCase()}
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm text-green-rich">₹{order.total?.toLocaleString()}</span>
                      {isOpen ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-cream-dark px-5 py-5 space-y-5">
                      {order.status !== 'cancelled' && (
                        <div className="flex items-center gap-0">
                          {STATUS_STEPS.map((step, i) => (
                            <div key={step} className="flex items-center flex-1 last:flex-none">
                              <div className="flex flex-col items-center gap-1">
                                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-display ${i <= stepIdx ? 'bg-green-rich border-green-rich text-gold' : 'border-cream-dark text-text-muted'}`}>
                                  {i < stepIdx ? '✓' : i + 1}
                                </div>
                                <span className="text-[9px] font-display tracking-wider text-text-muted capitalize hidden sm:block">{step}</span>
                              </div>
                              {i < STATUS_STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 ${i < stepIdx ? 'bg-green-rich' : 'bg-cream-dark'}`} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-3">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex gap-3 items-center">
                            <div className="w-14 h-16 bg-cream-dark shrink-0 overflow-hidden">
                              {item.products?.images?.[0]
                                ? <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-gold font-display text-xs">AL</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-charcoal truncate">{item.products?.name}</p>
                              <p className="text-xs text-text-muted">Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                            </div>
                            <span className="font-display text-sm text-green-rich shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      {order.shipping_address && (
                        <div className="bg-cream p-3 text-xs text-text-muted">
                          <span className="font-display tracking-wider text-green-deep text-[10px] block mb-1">DELIVERY TO</span>
                          {order.shipping_address.name} · {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
