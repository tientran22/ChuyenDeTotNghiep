import { AuthResponse } from 'src/types/auth.type'
import { getAccessTokenFromLS } from 'src/utils/auth'
import http from 'src/utils/https'

const AuthApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/api/auth/register', body),

  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>('/api/auth/login', body),
  loginGoogleAccount: () =>
    http.get('/api/auth', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }),

  logout() {
    const token = getAccessTokenFromLS()
    console.log(token)
    const config = {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào header
      }
    }
    return http.post('/api/auth/logout', null, config)
  }
}

export default AuthApi
