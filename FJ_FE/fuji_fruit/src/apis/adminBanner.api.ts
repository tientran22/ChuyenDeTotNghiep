import { Banner } from 'src/types/banner.type'
import { Product, ProductListConfig } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const AdminBannerApi = {
  getBanners(params: ProductListConfig) {
    return http.get<SuccessResponse<Banner[]>>('/api/admin/banners', {
      params
    })
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

export default AdminBannerApi
