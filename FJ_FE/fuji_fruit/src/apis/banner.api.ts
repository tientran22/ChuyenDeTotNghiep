import { Banner } from 'src/types/banner.type'

import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const bannerApi = {
  getBanner() {
    return http.get<SuccessResponse<Banner[]>>('/api/banner')
  }
}

export default bannerApi
