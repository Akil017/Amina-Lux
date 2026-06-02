import { Suspense } from 'react'
import ShopContent from './ShopContent'

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <div className="text-gold font-display animate-pulse tracking-widest">LOADING...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
