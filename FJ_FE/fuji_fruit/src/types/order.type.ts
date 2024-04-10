export interface Order {
  name: string
  phone_number: string
  total_amount: number
  delivery_address: string
  note?: string
  items: OrderItem[]
}

export interface OrderItem {
  product_id: number
  quantity: number
  price: number
}
