import { Product } from './products.type'

export type PurchaseStatus = 0 | 1 | 2 | 3 | 4 | 5

export type PurchaseListStatus = PurchaseStatus | -1

export interface Purchase {
  id: string
  buy_count: number
  price: number
  price_before_discount: number
  status: PurchaseListStatus
  user: string
  product: Product
  createdAt: string
  updatedAt: string
}

// export interface ExtendedPurchase extends Purchase {
//   disabled: boolean
//   checked: boolean
// }
