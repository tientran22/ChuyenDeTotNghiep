type Role = 'user' | 'admin'

export interface User {
  _id: string
  roles: Role[]
  email: string
  avatar: string
  google_id: number
  name: string
  createdAt: string
  updatedAt: string
}
