import { Suspense } from 'react'
import OrdersContent from './OrdersContent'

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <div className="text-gold font-display animate-pulse">Loading orders...</div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  )
}
