import { Product, ProductList, ProductListConfig } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>('/api/products', {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<Product>(`/api/products/${id}`)
  }
}

export default productApi
