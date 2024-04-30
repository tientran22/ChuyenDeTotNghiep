import { Blog } from 'src/types/blog.type'
import { Product, ProductListConfig } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const AdminBlogApi = {
  getBlogs(params: ProductListConfig) {
    return http.get<SuccessResponse<Blog[]>>('/api/admin/blogs', {
      params
    })
  },
  createBlogs: (body: { title: string; content: string; description: string; image: string }) =>
    http.post<SuccessResponse<Blog>>('/api/admin/blogs', body),

  editBlogs: (
    blogId: string,
    body: {
      title?: string
      content?: string
      description?: string
      image?: string
    }
  ) => http.put<SuccessResponse<Blog>>(`/api/admin/blogs/${blogId}`, body),
  getAdminProductDetail(productId: string) {
    return http.get<SuccessResponse<Product>>(`/api/admin/products/${productId}`)
  }
}

export default AdminBlogApi
