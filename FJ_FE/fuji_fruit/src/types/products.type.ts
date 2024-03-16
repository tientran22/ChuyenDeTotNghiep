export interface Product {
  id: string
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  name: string
  description: string
  brand: string
  category: string
  image: string
  createdAt: string
  updatedAt: string
  product: Product
  similar_products: Product[]
}

export interface ProductList {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductListConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  max_price?: number | string
  min_price?: number | string
  name?: string
  category?: string
  brand?: string
}
