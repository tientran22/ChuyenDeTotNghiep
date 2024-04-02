/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product, ProductList } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const productHomeApi = {
  getProductsGift() {
    return http.get<SuccessResponse<Product>>('/api/home/getProductsGift')
  },
  getProductsImport() {
    return http.get<SuccessResponse<Product>>('/api/home/getProductsImport')
  },
  getProductsBestSeller() {
    return http.get<SuccessResponse<Product>>('/api/home/getProductsBestSeller')
  }
}
export default productHomeApi
