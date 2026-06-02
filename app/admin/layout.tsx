'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut, Menu, X, Settings
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAILS = ['your-email@gmail.com', 'sisters-email@gmail.com'] // Update these

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth?redirect=/admin'); return }
      supabase.from('profiles').select('role').eq('id', data.user.id).single().then(({ data: p }) => {
        if (p?.role !== 'admin') { router.push('/'); return }
        setUser(data.user)
        setLoading(false)
      })
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-green-deep flex items-center justify-center">
      <div className="text-gold font-display text-xl animate-pulse tracking-widest">LOADING...</div>
    </div>
  )

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ]

  return (
    <div className="flex min-h-screen bg-[#F4F1EB]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 bg-green-deep flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-40`}>
        <div className="flex items-center justify-between p-4 border-b border-green-rich">
          {sidebarOpen && (
            <div>
              <div className="text-gold font-display text-lg tracking-wider">AMINA LUXE</div>
              <div className="text-gold/40 text-[9px] tracking-widest">ADMIN PANEL</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-cream/60 hover:text-gold p-1">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all ${
                  active ? 'bg-gold text-green-deep font-semibold' : 'text-cream/70 hover:text-gold hover:bg-green-rich'
                }`}>
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="text-sm font-display tracking-wider">{label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-green-rich">
          {sidebarOpen && (
            <div className="px-3 py-2 mb-2">
              <div className="text-gold/60 text-[10px] truncate">{user?.email}</div>
            </div>
          )}
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-cream/60 hover:text-gold hover:bg-green-rich rounded transition-all">
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-display tracking-wider">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-60' : 'ml-16'} transition-all duration-300`}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
