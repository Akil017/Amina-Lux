'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/shop/ProductCard'
import { Product, CATEGORIES, SIZES, COLORS_LIST } from '@/types'

export default function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  )
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState(20000)
  const [sortBy, setSortBy] = useState('newest')
  const [showNewOnly, setShowNewOnly] = useState(searchParams.get('new') === 'true')

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    let list = [...products]
    if (searchTerm) list = list.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedCategories.length) list = list.filter(p => selectedCategories.includes(p.category))
    if (selectedSizes.length) list = list.filter(p => p.sizes?.some(s => selectedSizes.includes(s)))
    if (selectedColors.length) list = list.filter(p => p.colors?.some(c => selectedColors.includes(c)))
    list = list.filter(p => p.price <= priceMax)
    if (showNewOnly) list = list.filter(p => p.new_arrival)
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price)
    return list
  }, [products, searchTerm, selectedCategories, selectedSizes, selectedColors, priceMax, sortBy, showNewOnly])

  const toggle = (val: string, set: React.Dispatch<React.SetStateAction<string[]>>, arr: string[]) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const clearAll = () => { setSelectedCategories([]); setSelectedSizes([]); setSelectedColors([]); setPriceMax(20000); setSearchTerm(''); setShowNewOnly(false) }
  const hasFilters = selectedCategories.length || selectedSizes.length || selectedColors.length || showNewOnly || searchTerm

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [open, setOpen] = useState(true)
    return (
      <div className="border-b border-cream-dark pb-4 mb-4">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-3">
          <span className="text-xs font-display tracking-[0.15em] text-green-deep uppercase">{title}</span>
          <ChevronDown size={14} className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && children}
      </div>
    )
  }

  const Filters = () => (
    <div>
      <FilterSection title="Category">
        <div className="space-y-2">
          {CATEGORIES.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => toggle(c, setSelectedCategories, selectedCategories)}
                className={`w-4 h-4 border flex items-center justify-center cursor-pointer ${selectedCategories.includes(c) ? 'bg-green-rich border-green-rich' : 'border-cream-dark'}`}>
                {selectedCategories.includes(c) && <div className="w-2 h-2 bg-gold" />}
              </div>
              <span className="text-sm" onClick={() => toggle(c, setSelectedCategories, selectedCategories)}>{c}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button key={s} onClick={() => toggle(s, setSelectedSizes, selectedSizes)}
              className={`px-2 py-1 text-xs border font-display tracking-wider ${selectedSizes.includes(s) ? 'bg-green-rich border-green-rich text-gold' : 'border-cream-dark text-charcoal'}`}>
              {s}
            </button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS_LIST.map(c => (
            <button key={c} onClick={() => toggle(c, setSelectedColors, selectedColors)}
              className={`px-2 py-1 text-xs border ${selectedColors.includes(c) ? 'bg-green-rich border-green-rich text-gold' : 'border-cream-dark text-charcoal'}`}>
              {c}
            </button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Price">
        <input type="range" min={0} max={20000} step={500} value={priceMax}
          onChange={e => setPriceMax(+e.target.value)} className="w-full accent-green-mid" />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>₹0</span><span>₹{priceMax.toLocaleString()}</span>
        </div>
      </FilterSection>
      <label className="flex items-center gap-2 cursor-pointer">
        <div onClick={() => setShowNewOnly(!showNewOnly)}
          className={`w-4 h-4 border flex items-center justify-center cursor-pointer ${showNewOnly ? 'bg-green-rich border-green-rich' : 'border-cream-dark'}`}>
          {showNewOnly && <div className="w-2 h-2 bg-gold" />}
        </div>
        <span className="text-sm" onClick={() => setShowNewOnly(!showNewOnly)}>New Arrivals Only</span>
      </label>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pt-24">
      <div className="bg-green-deep py-12 text-center">
        <p className="text-gold/60 text-[10px] tracking-[0.3em] font-display mb-2">AMINA LUXE</p>
        <h1 className="text-cream font-display text-4xl tracking-wide">
          {selectedCategories.length === 1 ? selectedCategories[0].toUpperCase() : 'ALL COLLECTIONS'}
        </h1>
        <div className="gold-divider w-24 mx-auto mt-4" />
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex-1 relative min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 border border-cream-dark bg-white text-sm focus:outline-none focus:border-green-mid text-charcoal" />
          </div>
          <button onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 border border-cream-dark px-4 py-2.5 text-xs font-display tracking-wider text-charcoal lg:hidden">
            <SlidersHorizontal size={14} /> FILTERS
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="border border-cream-dark bg-white px-4 py-2.5 text-xs font-display tracking-wider focus:outline-none">
            <option value="newest">SORT: NEWEST</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
          </select>
          <span className="text-text-muted text-sm">{filtered.length} products</span>
          {hasFilters && (
            <button onClick={clearAll} className="flex items-center gap-1 text-xs text-red-600 hover:underline">
              <X size={12} /> Clear all
            </button>
          )}
        </div>
        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-5">
                <span className="font-display text-xs tracking-[0.2em] text-green-deep">FILTERS</span>
                {hasFilters && <button onClick={clearAll} className="text-[10px] text-red-600 hover:underline">Clear all</button>}
              </div>
              <Filters />
            </div>
          </aside>
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-cream-dark animate-pulse aspect-[3/4]" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-xl text-green-deep mb-2">No products found</p>
                <button onClick={clearAll} className="btn-gold px-8 py-3 text-xs tracking-wider mt-4">CLEAR FILTERS</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-sm tracking-[0.2em]">FILTERS</span>
              <button onClick={() => setFiltersOpen(false)}><X size={18} /></button>
            </div>
            <Filters />
            <button onClick={() => setFiltersOpen(false)} className="btn-gold w-full py-3 mt-4 tracking-wider text-sm">APPLY FILTERS</button>
          </div>
        </div>
      )}
    </div>
  )
}
