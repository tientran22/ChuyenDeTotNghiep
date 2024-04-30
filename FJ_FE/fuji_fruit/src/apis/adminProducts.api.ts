import { Product, ProductList, ProductListConfig } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const AdminProductApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>('/api/admin/products', {
      params
    })
  },
  createProducts: (body: {
    name: string
    quantity: number
    price: number
    price_before_discount: number
    brand_id: number
    category_id: number
    description: string
    image: string
  }) => http.post<SuccessResponse<Product>>('/api/admin/products', body),

  editProducts: (
    productId: string,
    body: {
      name?: string
      quantity?: number
      price?: number
      price_before_discount?: number
      brand_id?: number
      category_id?: number
      description?: string
      image?: string
    }
  ) => http.put<SuccessResponse<Product>>(`/api/admin/products/${productId}`, body),
  getAdminProductDetail(productId: string) {
    return http.get<SuccessResponse<Product>>(`/api/admin/products/${productId}`)
  }
}

export default AdminProductApi
