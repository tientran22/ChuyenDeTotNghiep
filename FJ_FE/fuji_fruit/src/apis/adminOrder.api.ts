import { Order, OrderList } from 'src/types/order.type'
import { Product, ProductListConfig } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const AdminOrderApi = {
  getOrders(params: ProductListConfig) {
    return http.get<SuccessResponse<OrderList>>('/api/admin/orders', {
      params
    })
  },
  createOrders: (body: {
    name: string
    phone_number: string
    delivery_address: string
    total_amount: number | ''
    status: string
    user_id: string
    note?: string
  }) => http.post<SuccessResponse<Order>>('/api/admin/orders', body),

  editOrders: (
    orderId: string,
    body: {
      name?: string
      phone_number?: string
      delivery_address?: string
      total_amount?: number | ''
      status?: string
      user_id?: string
      note?: string
    }
  ) => http.put<SuccessResponse<Order>>(`/api/admin/orders/${orderId}`, body),
  getAdminProductDetail(productId: string) {
    return http.get<SuccessResponse<Product>>(`/api/admin/products/${productId}`)
  }
}

export default AdminOrderApi
