'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { User, Package, Heart, LogOut, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth'); return }
      supabase.from('profiles').select('*').eq('id', data.user.id).single()
        .then(({ data: p }) => {
          setProfile(p)
          setName(p?.name || '')
          setPhone(p?.phone || '')
          setLoading(false)
        })
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ name, phone }).eq('id', profile.id)
    toast.success('Profile updated!')
    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
      <div className="text-gold font-display animate-pulse">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="bg-green-deep py-10 text-center">
        <h1 className="text-cream font-display text-3xl tracking-wide">MY ACCOUNT</h1>
        <p className="text-gold/60 text-xs mt-2 tracking-widest">{profile?.email}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-2">
            {[
              { href: '/account', icon: User, label: 'Profile' },
              { href: '/account/orders', icon: Package, label: 'My Orders' },
              { href: '/account/wishlist', icon: Heart, label: 'Wishlist' },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-4 py-3 bg-white border border-cream-dark hover:border-green-mid hover:text-gold transition-all text-sm font-display tracking-wider">
                <Icon size={16} className="text-gold" /> {label}
              </Link>
            ))}
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-cream-dark hover:border-red-300 hover:text-red-600 transition-all text-sm font-display tracking-wider text-text-muted">
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Profile form */}
          <div className="md:col-span-2 bg-white border border-cream-dark p-6">
            <h2 className="font-display text-sm tracking-[0.2em] text-green-deep mb-5">PROFILE DETAILS</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-display tracking-wider text-green-deep block mb-1.5">FULL NAME</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-cream-dark px-4 py-3 text-sm focus:outline-none focus:border-green-mid" />
              </div>
              <div>
                <label className="text-xs font-display tracking-wider text-green-deep block mb-1.5">EMAIL</label>
                <input value={profile?.email} disabled
                  className="w-full border border-cream-dark px-4 py-3 text-sm bg-cream text-text-muted cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-display tracking-wider text-green-deep block mb-1.5">PHONE NUMBER</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                  className="w-full border border-cream-dark px-4 py-3 text-sm focus:outline-none focus:border-green-mid" />
              </div>
              <button onClick={handleSave} disabled={saving}
                className="btn-gold px-8 py-3 flex items-center gap-2 text-xs tracking-wider disabled:opacity-60">
                <Save size={14} /> {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
