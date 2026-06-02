import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SplashScreen from '@/components/layout/SplashScreen'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Amina Luxe | Modest Luxury, Made for All',
  description: 'Curated modest fashion — abayas, kurtis, sarees, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Cinzel:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SplashScreen />
        <Toaster position="top-center" toastOptions={{
          style: { background: '#1A5C2A', color: '#E2C47A', border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'Jost', fontSize: '13px' },
        }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
