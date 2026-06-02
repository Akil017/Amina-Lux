'use client'
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search, X, Upload, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product, CATEGORIES, SIZES, COLORS_LIST } from '@/types'
import toast from 'react-hot-toast'

const EMPTY: Partial<Product> = {
  name: '', description: '', price: 0, original_price: undefined,
  category: CATEGORIES[0], sizes: [], colors: [], stock: 0,
  images: [], featured: false, new_arrival: false,
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<Product>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return (
      (filterCat === 'all' || p.category === filterCat) &&
      (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    )
  })

  const openNew = () => { setEditing({ ...EMPTY }); setModalOpen(true) }
  const openEdit = (p: Product) => { setEditing({ ...p }); setModalOpen(true) }

  const handleSave = async () => {
    if (!editing.name || !editing.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    try {
      if (editing.id) {
        const { id, created_at, updated_at, ...rest } = editing as any
        await supabase.from('products').update(rest).eq('id', id)
        toast.success('Product updated!')
      } else {
        await supabase.from('products').insert(editing as any)
        toast.success('Product added!')
      }
      setModalOpen(false)
      load()
    } catch (e: any) { toast.error(e.message) }
    setSaving(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product deleted')
    load()
  }

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  const addImage = () => {
    if (imageUrl.trim()) {
      setEditing(e => ({ ...e, images: [...(e.images || []), imageUrl.trim()] }))
      setImageUrl('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-green-deep tracking-wide">PRODUCTS</h1>
          <p className="text-text-muted text-sm mt-1">{products.length} total products</p>
        </div>
        <button onClick={openNew} className="btn-gold px-5 py-2.5 flex items-center gap-2 text-xs tracking-wider">
          <Plus size={16} /> ADD PRODUCT
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap bg-white p-4 border border-cream-dark">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-cream-dark text-sm focus:outline-none focus:border-green-mid" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="border border-cream-dark px-3 py-2 text-xs font-display tracking-wider focus:outline-none">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Products table */}
      <div className="bg-white border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-deep text-cream">
              <tr>
                {['Image', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-display tracking-[0.15em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-cream-dark animate-pulse rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-text-muted">No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-14 bg-cream-dark overflow-hidden">
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> :
                        <div className="w-full h-full flex items-center justify-center text-gold text-[10px] font-display">AL</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-charcoal line-clamp-1">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.colors?.slice(0,3).join(', ')}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted font-display tracking-wider">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="font-display text-sm text-green-rich">₹{p.price.toLocaleString()}</span>
                    {p.original_price && <span className="text-xs text-text-muted line-through block">₹{p.original_price}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-display font-semibold ${p.stock === 0 ? 'text-red-600' : p.stock <= 5 ? 'text-yellow-600' : 'text-green-mid'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {p.featured && <span className="badge-gold text-[8px] px-1.5 py-0.5 w-fit">FEATURED</span>}
                      {p.new_arrival && <span className="bg-green-mid text-cream text-[8px] font-display px-1.5 py-0.5 w-fit">NEW</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-green-mid hover:text-green-deep transition-colors p-1">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-text-muted hover:text-red-600 transition-colors p-1">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <div className="bg-white w-full max-w-2xl my-8 relative">
            <div className="bg-green-deep px-6 py-4 flex items-center justify-between">
              <h2 className="text-gold font-display tracking-wider">{editing.id ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-cream/60 hover:text-gold"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-display tracking-wider text-green-deep block mb-1">PRODUCT NAME *</label>
                  <input value={editing.name || ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-cream-dark px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
                </div>

                <div>
                  <label className="text-xs font-display tracking-wider text-green-deep block mb-1">PRICE (₹) *</label>
                  <input type="number" value={editing.price || ''} onChange={e => setEditing(p => ({ ...p, price: +e.target.value }))}
                    className="w-full border border-cream-dark px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
                </div>

                <div>
                  <label className="text-xs font-display tracking-wider text-green-deep block mb-1">ORIGINAL PRICE (₹)</label>
                  <input type="number" value={editing.original_price || ''} onChange={e => setEditing(p => ({ ...p, original_price: +e.target.value || undefined }))}
                    placeholder="Leave empty if no discount"
                    className="w-full border border-cream-dark px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
                </div>

                <div>
                  <label className="text-xs font-display tracking-wider text-green-deep block mb-1">CATEGORY</label>
                  <select value={editing.category} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-cream-dark px-3 py-2 text-sm focus:outline-none focus:border-green-mid">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-display tracking-wider text-green-deep block mb-1">STOCK</label>
                  <input type="number" value={editing.stock || 0} onChange={e => setEditing(p => ({ ...p, stock: +e.target.value }))}
                    className="w-full border border-cream-dark px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-display tracking-wider text-green-deep block mb-1">DESCRIPTION</label>
                  <textarea value={editing.description || ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                    rows={3} className="w-full border border-cream-dark px-3 py-2 text-sm focus:outline-none focus:border-green-mid resize-none" />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="text-xs font-display tracking-wider text-green-deep block mb-2">SIZES</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} type="button"
                      onClick={() => setEditing(p => ({ ...p, sizes: toggleArr(p.sizes || [], s) }))}
                      className={`px-3 py-1 text-xs border font-display transition-all ${(editing.sizes || []).includes(s) ? 'bg-green-rich border-green-rich text-gold' : 'border-cream-dark text-charcoal hover:border-green-mid'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="text-xs font-display tracking-wider text-green-deep block mb-2">COLORS</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS_LIST.map(c => (
                    <button key={c} type="button"
                      onClick={() => setEditing(p => ({ ...p, colors: toggleArr(p.colors || [], c) }))}
                      className={`px-3 py-1 text-xs border font-display transition-all ${(editing.colors || []).includes(c) ? 'bg-green-rich border-green-rich text-gold' : 'border-cream-dark text-charcoal hover:border-green-mid'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-xs font-display tracking-wider text-green-deep block mb-2">PRODUCT IMAGES (URLs)</label>
                <div className="flex gap-2 mb-2">
                  <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                    placeholder="Paste image URL and press Add"
                    className="flex-1 border border-cream-dark px-3 py-2 text-sm focus:outline-none focus:border-green-mid"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }} />
                  <button type="button" onClick={addImage} className="btn-outline-gold px-4 py-2 text-xs">ADD</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(editing.images || []).map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-16 h-20 object-cover border border-cream-dark" />
                      <button onClick={() => setEditing(p => ({ ...p, images: (p.images || []).filter((_, j) => j !== i) }))}
                        className="absolute -top-1 -right-1 bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.featured || false}
                    onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))}
                    className="accent-green-mid" />
                  <span className="text-sm font-display tracking-wider">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.new_arrival || false}
                    onChange={e => setEditing(p => ({ ...p, new_arrival: e.target.checked }))}
                    className="accent-green-mid" />
                  <span className="text-sm font-display tracking-wider">New Arrival</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="btn-gold flex-1 py-3 flex items-center justify-center gap-2 text-sm tracking-wider disabled:opacity-50">
                  <Save size={16} /> {saving ? 'SAVING...' : editing.id ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
                </button>
                <button onClick={() => setModalOpen(false)} className="btn-outline-gold px-6 py-3 text-sm">CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
