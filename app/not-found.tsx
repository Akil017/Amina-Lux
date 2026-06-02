import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 px-4" style={{paddingTop: '6rem'}}>
      <div className="text-gold font-display text-6xl">404</div>
      <h1 className="font-display text-2xl text-green-deep tracking-wide">PAGE NOT FOUND</h1>
      <p className="text-text-muted font-serif text-center max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-gold px-10 py-3 text-sm tracking-wider">BACK TO HOME</Link>
    </div>
  )
}
