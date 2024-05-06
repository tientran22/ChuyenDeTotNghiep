import { Product } from './products.type'

export type Orderstatus = 'pending' | 'success' | 'canceled'
export type OrderListStatus = Orderstatus | ''
export interface Order {
  id: string
  name: string
  user_id: string
  phone_number: string
  total_amount: number
  status: OrderListStatus

  delivery_address: string
  note: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  product: Product
  product_id: number
  quantity: number
  price: number
}

export interface OrderList {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    page_size: number
    total_items: number
  }
}
