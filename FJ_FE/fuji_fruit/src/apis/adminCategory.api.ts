import { Category } from 'src/types/categories.type'
import { ProductListConfig } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const AdminCategoryApi = {
  getCategories(params: ProductListConfig) {
    return http.get<SuccessResponse<Category[]>>('/api/admin/categories', {
      params
    })
  },
  createCategories: (body: { name: string }) => http.post<SuccessResponse<Category>>('/api/admin/categories', body),

  editCategories: (
    categoryId: string,
    body: {
      name?: string
    }
  ) => http.put<SuccessResponse<Category>>(`/api/admin/categories/${categoryId}`, body)
}

export default AdminCategoryApi
