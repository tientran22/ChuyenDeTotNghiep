import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/https'

const AuthApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/api/auth/register', body),

  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/api/auth/login', body),

  logout: () => http.post('/api/auth/logout')
}

export default AuthApi
