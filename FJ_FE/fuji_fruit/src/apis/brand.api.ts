import { Brand } from 'src/types/brand.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const brandApi = {
  getBrand() {
    return http.get<SuccessResponse<Brand>>('/api/brand')
  }
}

export default brandApi
