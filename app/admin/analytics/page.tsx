'use client'
import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { supabase } from '@/lib/supabase'
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react'

const GOLD_PALETTE = ['#C9A84C', '#2E7D45', '#E2C47A', '#4FAD6A', '#F5E6C0', '#1A5C2A', '#8BC4A0']

export default function AdminAnalytics() {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [sizeData, setSizeData] = useState<any[]>([])
  const [colorData, setColorData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [totals, setTotals] = useState({ revenue: 0, orders: 0, avgOrder: 0, customers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { data: orders },
        { data: orderItems },
        { count: customers }
      ] = await Promise.all([
        supabase.from('orders').select('total, created_at, status').neq('status', 'cancelled'),
        supabase.from('order_items').select('*, products(name, category)'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      ])

      // Monthly data — last 12 months
      const monthly: any[] = []
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(new Date(), i)
        const start = startOfMonth(date).toISOString()
        const end = endOfMonth(date).toISOString()
        const mo = orders?.filter(o => o.created_at >= start && o.created_at <= end) || []
        monthly.push({
          month: format(date, 'MMM yy'),
          revenue: mo.reduce((s, o) => s + o.total, 0),
          orders: mo.length,
        })
      }

      // Category preference (from order items)
      const catMap: Record<string, { orders: number; revenue: number }> = {}
      orderItems?.forEach(item => {
        const cat = (item as any).products?.category || 'Other'
        if (!catMap[cat]) catMap[cat] = { orders: 0, revenue: 0 }
        catMap[cat].orders += item.quantity || 0
        catMap[cat].revenue += (item.price || 0) * (item.quantity || 1)
      })
      const catArr = Object.entries(catMap).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.orders - a.orders)

      // Size preference
      const sizeMap: Record<string, number> = {}
      orderItems?.forEach(item => {
        const s = item.size || 'Unknown'
        sizeMap[s] = (sizeMap[s] || 0) + (item.quantity || 1)
      })
      const sizeArr = Object.entries(sizeMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)

      // Color preference
      const colorMap: Record<string, number> = {}
      orderItems?.forEach(item => {
        const c = item.color || 'Unknown'
        colorMap[c] = (colorMap[c] || 0) + (item.quantity || 1)
      })
      const colorArr = Object.entries(colorMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8)

      // Top products
      const productMap: Record<string, { name: string; count: number; revenue: number }> = {}
      orderItems?.forEach((item: any) => {
        const pid = item.product_id
        if (!productMap[pid]) productMap[pid] = { name: item.products?.name || pid, count: 0, revenue: 0 }
        productMap[pid].count += item.quantity || 1
        productMap[pid].revenue += (item.price || 0) * (item.quantity || 1)
      })
      const topArr = Object.values(productMap).sort((a, b) => b.count - a.count).slice(0, 8)

      // Totals
      const revenue = orders?.reduce((s, o) => s + o.total, 0) || 0
      const orderCount = orders?.length || 0

      setMonthlyData(monthly)
      setCategoryData(catArr)
      setSizeData(sizeArr)
      setColorData(colorArr)
      setTopProducts(topArr)
      setTotals({ revenue, orders: orderCount, avgOrder: orderCount ? Math.round(revenue / orderCount) : 0, customers: customers || 0 })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64 text-gold font-display animate-pulse">Loading Analytics...</div>

  const SummaryCard = ({ icon: Icon, label, value, sub }: any) => (
    <div className="bg-white p-5 stat-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted font-display tracking-wider">{label}</span>
        <Icon size={18} className="text-gold" />
      </div>
      <div className="font-display text-2xl font-semibold text-green-deep">{value}</div>
      {sub && <div className="text-xs text-text-muted mt-1">{sub}</div>}
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-green-deep tracking-wide">ANALYTICS</h1>
        <p className="text-text-muted text-sm mt-1">Sales performance & customer preferences</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={TrendingUp} label="Total Revenue" value={`₹${totals.revenue.toLocaleString()}`} />
        <SummaryCard icon={ShoppingCart} label="Total Orders" value={totals.orders} />
        <SummaryCard icon={TrendingUp} label="Avg. Order Value" value={`₹${totals.avgOrder.toLocaleString()}`} />
        <SummaryCard icon={Users} label="Total Customers" value={totals.customers} />
      </div>

      {/* Monthly Revenue + Orders */}
      <div className="bg-white p-6">
        <h2 className="font-display text-lg tracking-wide text-green-deep mb-6">MONTHLY SALES — LAST 12 MONTHS</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D45" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2E7D45" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D5" />
            <XAxis dataKey="month" tick={{ fontFamily: 'Cinzel', fontSize: 10 }} />
            <YAxis yAxisId="rev" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#1A5C2A', border: 'none', color: '#E2C47A', fontFamily: 'Jost', fontSize: 12 }}
              formatter={(v: any, name: any) => [name === 'revenue' ? `₹${v.toLocaleString()}` : v, name === 'revenue' ? 'Revenue' : 'Orders']} />
            <Legend formatter={v => v === 'revenue' ? 'Revenue' : 'Orders'} />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#revG)" />
            <Area yAxisId="ord" type="monotone" dataKey="orders" stroke="#2E7D45" strokeWidth={2} fill="url(#ordG)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Preference */}
        <div className="bg-white p-6">
          <h2 className="font-display text-lg tracking-wide text-green-deep mb-6">CATEGORY PREFERENCES</h2>
          {categoryData.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-12">No order data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontFamily: 'Cinzel', fontSize: 10 }} width={80} />
                <Tooltip contentStyle={{ background: '#1A5C2A', border: 'none', color: '#E2C47A', fontFamily: 'Jost', fontSize: 12 }} />
                <Bar dataKey="orders" fill="#C9A84C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Size Preference */}
        <div className="bg-white p-6">
          <h2 className="font-display text-lg tracking-wide text-green-deep mb-6">SIZE PREFERENCES</h2>
          {sizeData.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-12">No order data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D5" />
                <XAxis dataKey="name" tick={{ fontFamily: 'Cinzel', fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1A5C2A', border: 'none', color: '#E2C47A', fontFamily: 'Jost', fontSize: 12 }} />
                <Bar dataKey="count" fill="#2E7D45" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Color Preference */}
        <div className="bg-white p-6">
          <h2 className="font-display text-lg tracking-wide text-green-deep mb-6">COLOR PREFERENCES</h2>
          {colorData.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-12">No order data yet</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={colorData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                    {colorData.map((_, i) => <Cell key={i} fill={GOLD_PALETTE[i % GOLD_PALETTE.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1A5C2A', border: 'none', color: '#E2C47A', fontFamily: 'Jost', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {colorData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: GOLD_PALETTE[i % GOLD_PALETTE.length] }} />
                    <span className="text-xs text-charcoal flex-1">{d.name}</span>
                    <span className="text-xs font-display text-text-muted">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white p-6">
          <h2 className="font-display text-lg tracking-wide text-green-deep mb-6">TOP SELLING PRODUCTS</h2>
          {topProducts.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-12">No order data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-display text-text-muted">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-charcoal truncate">{p.name}</p>
                    <div className="h-1.5 bg-cream-dark mt-1 rounded overflow-hidden">
                      <div className="h-full bg-gold rounded" style={{ width: `${(p.count / topProducts[0].count) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-display text-green-rich shrink-0">{p.count} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
