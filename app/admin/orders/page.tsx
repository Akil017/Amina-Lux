'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const STATUS_COLOR: any = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<any | null>(null)

  const load = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(name, email, phone), order_items(*, products(name, images))')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = o.id.toLowerCase().includes(q) || o.profiles?.email?.toLowerCase().includes(q) || o.profiles?.name?.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    toast.success(`Order marked as ${status}`)
    load()
    if (selected?.id === id) setSelected({ ...selected, status })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-green-deep tracking-wide">ORDERS</h1>
        <p className="text-text-muted text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap bg-white p-4 border border-cream-dark">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full pl-9 pr-4 py-2 border border-cream-dark text-sm focus:outline-none focus:border-green-mid" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-cream-dark px-3 py-2 text-xs font-display tracking-wider focus:outline-none">
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-deep text-cream">
              <tr>
                {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-display tracking-[0.15em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-cream-dark animate-pulse rounded" /></td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-text-muted">No orders found</td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3 font-display text-xs text-green-rich">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{order.profiles?.name || 'Customer'}</p>
                    <p className="text-xs text-text-muted">{order.profiles?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal">{order.order_items?.length || 0} items</td>
                  <td className="px-4 py-3 font-display text-sm text-green-rich">₹{order.total?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className={`text-[10px] font-display tracking-wider px-2 py-1 border rounded-full cursor-pointer focus:outline-none ${STATUS_COLOR[order.status] || ''}`}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(order)} className="text-green-mid hover:text-green-deep p-1 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="bg-green-deep px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-gold font-display tracking-wider">ORDER #{selected.id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setSelected(null)} className="text-cream/60 hover:text-gold"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-display tracking-wider px-3 py-1 border rounded-full ${STATUS_COLOR[selected.status]}`}>
                  {selected.status?.toUpperCase()}
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(selected.created_at).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Customer */}
              <div className="bg-cream p-4">
                <h3 className="text-xs font-display tracking-wider text-green-deep mb-2">CUSTOMER</h3>
                <p className="text-sm font-medium">{selected.profiles?.name || 'N/A'}</p>
                <p className="text-xs text-text-muted">{selected.profiles?.email}</p>
                <p className="text-xs text-text-muted">{selected.profiles?.phone}</p>
              </div>

              {/* Shipping address */}
              {selected.shipping_address && (
                <div className="bg-cream p-4">
                  <h3 className="text-xs font-display tracking-wider text-green-deep mb-2">SHIPPING ADDRESS</h3>
                  <p className="text-sm">{selected.shipping_address.name}</p>
                  <p className="text-xs text-text-muted">{selected.shipping_address.line1}</p>
                  {selected.shipping_address.line2 && <p className="text-xs text-text-muted">{selected.shipping_address.line2}</p>}
                  <p className="text-xs text-text-muted">{selected.shipping_address.city}, {selected.shipping_address.state} - {selected.shipping_address.pincode}</p>
                  <p className="text-xs text-text-muted">{selected.shipping_address.phone}</p>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="text-xs font-display tracking-wider text-green-deep mb-3">ORDER ITEMS</h3>
                <div className="space-y-3">
                  {selected.order_items?.map((item: any) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-12 h-14 bg-cream-dark shrink-0 overflow-hidden">
                        {item.products?.images?.[0] ? (
                          <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : <div className="w-full h-full flex items-center justify-center text-gold text-[10px] font-display">AL</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-charcoal truncate">{item.products?.name}</p>
                        <p className="text-xs text-text-muted">Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                      </div>
                      <span className="font-display text-sm text-green-rich shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-green-deep p-4 flex justify-between items-center">
                <span className="text-gold font-display tracking-wider">TOTAL</span>
                <span className="text-gold font-display text-lg">₹{selected.total?.toLocaleString()}</span>
              </div>

              {/* Update status */}
              <div>
                <h3 className="text-xs font-display tracking-wider text-green-deep mb-2">UPDATE STATUS</h3>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 text-[10px] font-display tracking-wider border transition-all ${selected.status === s ? 'bg-green-rich border-green-rich text-gold' : 'border-cream-dark text-charcoal hover:border-green-mid'}`}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
