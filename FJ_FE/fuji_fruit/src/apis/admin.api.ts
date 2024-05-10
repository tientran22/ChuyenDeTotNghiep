import { Banner } from 'src/types/banner.type'
import { Product } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const AdminApi = {
  getRevenue() {
    return http.get('/api/admin/revenue')
  },
  getTotalCustomers() {
    return http.get('/api/admin/total-customers')
  },
  getTotalOrders() {
    return http.get('/api/admin/total-orders')
  },
  getRecentOrders() {
    return http.get('/api/admin/recent-orders')
  },
  getProductPopulars() {
    return http.get('/api/admin/popular-products')
  },
  createBanners: (body: { title: string; image: string }) =>
    http.post<SuccessResponse<Banner>>('/api/admin/banners', body),

  editBanners: (
    bannerId: string,
    body: {
      title?: string
      image?: string
    }
  ) => http.put<SuccessResponse<Banner>>(`/api/admin/banners/${bannerId}`, body),
  getAdminProductDetail(productId: string) {
    return http.get<SuccessResponse<Product>>(`/api/admin/products/${productId}`)
  }
}

export default AdminApi
