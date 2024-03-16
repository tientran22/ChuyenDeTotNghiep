// type Role = 'User' | 'Admin'

export interface User {
  _id: string
  // roles: Role[]
  email: string
  name: string
  createdAt: string
  updatedAt: string
}
