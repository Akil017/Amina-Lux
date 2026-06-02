export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  category: string
  subcategory?: string
  sizes: string[]
  colors: string[]
  stock: number
  images: string[]
  featured: boolean
  new_arrival: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  shipping_address: ShippingAddress
  payment_id?: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  size: string
  color: string
  price: number
}

export interface ShippingAddress {
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export interface Profile {
  id: string
  email: string
  name?: string
  phone?: string
  role: 'admin' | 'customer'
  created_at: string
}

// Women's modest fashion categories only
export const CATEGORIES = [
  'Abayas',
  'Kurtis',
  'Sarees',
  'Salwar Suits',
  'Dupattas & Hijabs',
  'Tops & Tunics',
  'Co-ord Sets',
  'Accessories',
]

// Women's sizes
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size']

export const COLORS_LIST = [
  'Black', 'White', 'Ivory', 'Cream',
  'Forest Green', 'Sage Green', 'Olive',
  'Gold', 'Beige', 'Camel',
  'Navy', 'Maroon', 'Dusty Rose',
  'Lavender', 'Sky Blue', 'Charcoal',
]
