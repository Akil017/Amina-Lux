'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthContent() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Welcome back!')
        router.push(redirect)
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, email, name, phone, role: 'customer' })
        }
        toast.success('Account created! Check your email to confirm.')
        setMode('login')
      }
    } catch (err: any) { toast.error(err.message) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/"><div className="text-green-deep font-display text-3xl tracking-[0.2em]">AMINA LUXE</div></Link>
          <div className="text-text-muted text-[10px] tracking-[0.25em] mt-1">MODEST LUXURY, MADE FOR ALL</div>
        </div>
        <div className="bg-white border border-cream-dark shadow-sm">
          <div className="flex border-b border-cream-dark">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-4 text-xs font-display tracking-[0.2em] transition-all ${mode === m ? 'bg-green-deep text-gold' : 'text-text-muted hover:text-charcoal'}`}>
                {m === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-xs font-display tracking-wider text-green-deep block mb-1.5">FULL NAME</label>
                  <input value={name} onChange={e => setName(e.target.value)} required className="w-full border border-cream-dark px-4 py-3 text-sm focus:outline-none focus:border-green-mid" />
                </div>
                <div>
                  <label className="text-xs font-display tracking-wider text-green-deep block mb-1.5">PHONE</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full border border-cream-dark px-4 py-3 text-sm focus:outline-none focus:border-green-mid" />
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-display tracking-wider text-green-deep block mb-1.5">EMAIL</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full border border-cream-dark px-4 py-3 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div>
              <label className="text-xs font-display tracking-wider text-green-deep block mb-1.5">PASSWORD</label>
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} required minLength={8}
                  className="w-full border border-cream-dark px-4 py-3 pr-10 text-sm focus:outline-none focus:border-green-mid" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-4 mt-2 tracking-[0.2em] text-sm disabled:opacity-60">
              {loading ? 'PLEASE WAIT...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
