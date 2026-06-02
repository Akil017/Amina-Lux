import { Suspense } from 'react'
import AuthContent from './AuthContent'

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><div className="text-gold font-display animate-pulse tracking-widest">LOADING...</div></div>}>
      <AuthContent />
    </Suspense>
  )
}
