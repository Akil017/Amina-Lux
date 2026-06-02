'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, Users, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { supabase } from '@/lib/supabase'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: products },
        { data: orders },
        { count: customers },
        { data: lowStockItems }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*, profiles(name, email)').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('products').select('id, name, stock, category').lte('stock', 5).order('stock'),
      ])

      // Revenue stats
      const { data: allOrders } = await supabase.from('orders').select('total, created_at').neq('status', 'cancelled')
      const revenue = allOrders?.reduce((sum, o) => sum + o.total, 0) || 0

      // Monthly sales for last 6 months
      const monthlyData = []
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i)
        const start = startOfMonth(date).toISOString()
        const end = endOfMonth(date).toISOString()
        const monthOrders = allOrders?.filter(o => o.created_at >= start && o.created_at <= end) || []
        monthlyData.push({
          month: format(date, 'MMM'),
          revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
          orders: monthOrders.length,
        })
      }

      setStats({ products: products || 0, orders: allOrders?.length || 0, revenue, customers: customers || 0 })
      setRecentOrders(orders || [])
      setSalesData(monthlyData)
      setLowStock(lowStockItems || [])
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-green-mid', href: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-gold', href: '/admin/orders' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-light', href: '/admin/analytics' },
    { label: 'Customers', value: stats.customers, icon: Users, color: 'text-gold-light', href: '/admin/analytics' },
  ]

  const statusColor: any = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gold font-display animate-pulse">Loading Dashboard...</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-green-deep tracking-wide">DASHBOARD</h1>
        <p className="text-text-muted text-sm mt-1">Welcome back, Admin. Here's what's happening at Amina Luxe.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}
            className="bg-white p-5 stat-card hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-text-muted font-display tracking-wider uppercase">{label}</span>
              <Icon size={20} className={`${color} group-hover:scale-110 transition-transform`} />
            </div>
            <div className="font-display text-2xl font-semibold text-green-deep">{value}</div>
          </Link>
        ))}
      </div>

      {/* Sales chart */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg tracking-wide text-green-deep">MONTHLY REVENUE</h2>
          <Link href="/admin/analytics" className="text-xs text-gold hover:underline flex items-center gap-1">
            Full Analytics <ArrowRight size={12} />
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D45" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2E7D45" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D5" />
            <XAxis dataKey="month" tick={{ fontFamily: 'Cinzel', fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, 'Revenue']}
              contentStyle={{ background: '#1A5C2A', border: 'none', color: '#E2C47A', fontFamily: 'Jost' }} />
            <Area type="monotone" dataKey="revenue" stroke="#2E7D45" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg tracking-wide text-green-deep">RECENT ORDERS</h2>
            <Link href="/admin/orders" className="text-xs text-gold hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-cream-dark last:border-0">
                  <div>
                    <p className="text-sm font-display text-charcoal">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-text-muted">{order.profiles?.name || order.profiles?.email || 'Customer'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display text-green-rich">₹{order.total?.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-display ${statusColor[order.status] || 'bg-gray-100'}`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alert */}
        <div className="bg-white p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle size={18} className="text-gold" />
            <h2 className="font-display text-lg tracking-wide text-green-deep">LOW STOCK ALERT</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">All products well stocked ✓</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-cream-dark last:border-0">
                  <div>
                    <p className="text-sm text-charcoal line-clamp-1">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-display font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {p.stock === 0 ? 'OUT' : p.stock} left
                    </span>
                    <Link href={`/admin/products?edit=${p.id}`} className="text-[10px] btn-outline-gold px-2 py-1">UPDATE</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
