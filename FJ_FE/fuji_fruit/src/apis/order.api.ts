import { Order, OrderItem, OrderListStatus } from 'src/types/order.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const orderApi = {
  orderProducts: (body: {
    name: string
    phone_number: string
    delivery_address: string
    total_amount: number
    note?: string
    items: OrderItem[]
  }) => http.post<SuccessResponse<Order>>('/api/orders', body),
  getOrders(params?: { status: OrderListStatus }) {
    return http.get<SuccessResponse<Order[]>>('/api/orders', {
      params
    })
  }
}

export default orderApi
