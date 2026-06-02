'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  wishlist: string[]
  addItem: (product: Product, size: string, color: string) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],

      addItem: (product, size, color) => {
        const items = get().items
        const existing = items.find(
          i => i.product.id === product.id && i.size === size && i.color === color
        )
        if (existing) {
          set({ items: items.map(i =>
            i.product.id === product.id && i.size === size && i.color === color
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )})
        } else {
          set({ items: [...items, { product, size, color, quantity: 1 }] })
        }
      },

      removeItem: (productId, size, color) => {
        set({ items: get().items.filter(
          i => !(i.product.id === productId && i.size === size && i.color === color)
        )})
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color)
          return
        }
        set({ items: get().items.map(i =>
          i.product.id === productId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        )})
      },

      clearCart: () => set({ items: [] }),

      toggleWishlist: (productId) => {
        const wishlist = get().wishlist
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter(id => id !== productId) })
        } else {
          set({ wishlist: [...wishlist, productId] })
        }
      },

      isInWishlist: (productId) => get().wishlist.includes(productId),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'amina-luxe-cart' }
  )
)
