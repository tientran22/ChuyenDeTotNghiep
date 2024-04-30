import { Brand } from 'src/types/brand.type'
import { ProductListConfig } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const AdminBrandApi = {
  getBrands(params: ProductListConfig) {
    return http.get<SuccessResponse<Brand[]>>('/api/admin/brands', {
      params
    })
  },
  createbrands: (body: { name: string }) => http.post<SuccessResponse<Brand>>('/api/admin/brands', body),

  editbrands: (
    brandId: string,
    body: {
      name?: string
    }
  ) => http.put<SuccessResponse<Brand>>(`/api/admin/brands/${brandId}`, body)
}

export default AdminBrandApi
