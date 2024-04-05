import { Blog } from 'src/types/blog.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const blogApi = {
  getBlog() {
    return http.get<SuccessResponse<Blog[]>>('/api/blog')
  },
  getBlogDetail(blogId: string) {
    return http.get<SuccessResponse<Blog>>(`/api/blog/${blogId}`)
  }
}

export default blogApi
