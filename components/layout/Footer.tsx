"use client"
import Link from 'next/link'
import { Camera, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-green-deep text-cream/70">
      <div className="gold-divider" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-gold font-display text-2xl tracking-[0.2em] mb-2">AMINA LUXE</div>
            <div className="text-gold/60 text-[10px] tracking-[0.25em] mb-4">MODEST LUXURY, MADE FOR ALL</div>
            <p className="text-sm leading-relaxed text-cream/50 font-serif">
              Curated modest fashion for the modern woman — where elegance meets comfort and every piece tells a story.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/aminaluxe.in" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-gold/30 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                <Camera size={16} />
              </a>
              <a href="mailto:hello@aminaluxe.in"
                className="w-9 h-9 border border-gold/30 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-gold font-display text-xs tracking-[0.2em] mb-5 uppercase">Shop</h4>
            <ul className="space-y-3">
              {['Abayas', 'Kurtis', 'Sarees', 'Salwar Suits', 'Dupattas', 'Accessories'].map(c => (
                <li key={c}>
                  <Link href={`/shop?category=${c}`} className="text-sm hover:text-gold transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-gold font-display text-xs tracking-[0.2em] mb-5 uppercase">Help</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/pages/shipping" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
              <li><Link href="/pages/returns" className="hover:text-gold transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/pages/size-guide" className="hover:text-gold transition-colors">Size Guide</Link></li>
              <li><Link href="/pages/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link href="/pages/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-display text-xs tracking-[0.2em] mb-5 uppercase">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-gold shrink-0" />
                <a href="https://www.instagram.com/aminaluxe.in" target="_blank" rel="noopener noreferrer"
                  className="hover:text-gold transition-colors">@aminaluxe.in</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold shrink-0" />
                <a href="mailto:hello@aminaluxe.in" className="hover:text-gold transition-colors">hello@aminaluxe.in</a>
              </div>
            </div>
            <div className="mt-8 p-4 border border-gold/20 bg-green-rich/50">
              <p className="text-xs text-cream/50 mb-2 font-display tracking-wider">NEWSLETTER</p>
              <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Your email" className="flex-1 bg-green-deep border border-gold/20 text-cream placeholder-cream/30 px-3 py-1.5 text-xs focus:outline-none focus:border-gold" />
                <button type="submit" className="btn-gold px-3 py-1.5 text-[10px]">Join</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="gold-divider" />
      <div className="text-center py-4 text-xs text-cream/30 tracking-wider">
        © 2025 Amina Luxe. All rights reserved. Modest Luxury, Made for All.
      </div>
    </footer>
  )
}
