import { Product, ProductListConfig } from 'src/types/products.type'
import { User, UserList } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const AdminUserApi = {
  getUsers(params: ProductListConfig) {
    return http.get<SuccessResponse<UserList>>('/api/admin/users', {
      params
    })
  },
  createUsers: (body: { name: string; phone: string; address: string; email: string; roles: string; avatar: string }) =>
    http.post<SuccessResponse<User>>('/api/admin/users', body),

  editUsers: (
    userId: string,
    body: {
      name?: string
      phone?: string
      address?: string
      roles?: string
      avatar?: string
    }
  ) => http.put<SuccessResponse<User>>(`/api/admin/users/${userId}`, body),
  getAdminProductDetail(productId: string) {
    return http.get<SuccessResponse<Product>>(`/api/admin/products/${productId}`)
  }
}

export default AdminUserApi
