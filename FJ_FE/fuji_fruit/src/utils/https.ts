import axios, { AxiosInstance } from 'axios'
import {
  clearLS,
  getAccessTokenFromLS,
  getUserRolesFromLS,
  setAccessTokentoLS,
  setProfileToLS,
  setUserRolestoLS
} from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private userRoles: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.userRoles = getUserRolesFromLS()

    this.instance = axios.create({
      baseURL: 'http://127.0.0.1:8000',
      timeout: 100000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { config, data } = response

        // Xác định URL được gọi
        const { url } = config

        // Xử lý logic đăng nhập cho admin
        if (url === '/api/auth/login' || url === '/api/auth/register') {
          // Nếu đăng nhập thành công và user là admin

          // Lưu accessToken và thông tin user vào localStorage
          this.accessToken = data.data.access_token
          this.userRoles = data.data.user.roles
          setUserRolestoLS(this.userRoles)
          setAccessTokentoLS(this.accessToken)
          setProfileToLS(data.data.user)
        }

        // Xử lý logic đăng xuất
        if (url === '/api/auth/logout') {
          // Xóa accessToken và thông tin user khỏi localStorage
          this.accessToken = ''
          clearLS()
        }

        return response
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
