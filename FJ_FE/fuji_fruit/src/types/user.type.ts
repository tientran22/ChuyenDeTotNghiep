type Role = 'user' | 'admin'

export interface User {
  id: string
  roles: Role[]
  email: string
  avatar: string
  google_id: number
  name: string
  createdAt: string
  updatedAt: string
  phone: number
  address: string
}

export interface UserList {
  users: User[]
  pagination: {
    page: number
    limit: number
    page_size: number
    total_items: number
  }
}
