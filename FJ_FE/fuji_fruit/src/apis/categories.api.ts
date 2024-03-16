import { Category } from 'src/types/categories.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category>>('/api/category')
  }
}

export default categoryApi
