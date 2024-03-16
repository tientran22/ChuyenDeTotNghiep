import axios, { AxiosInstance } from 'axios'

import { clearLS, getAccessTokenFromLS, setAccessTokentoLS, setProfileToLS } from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'http://127.0.0.1:8000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/api/auth/logout') {
          console.log(url)
        }

        if (url === '/api/auth/login' || url === '/api/auth/register') {
          console.log(response)
          // Cập nhật giá trị accessToken và lưu vào localStorage
          this.accessToken = response.data.data.access_token
          setAccessTokentoLS(this.accessToken)
          setProfileToLS(response.data.data.user)
        } else if (url === '/api/auth/logout') {
          // Xóa giá trị accessToken và xóa khỏi localStorage
          this.accessToken = ''
          clearLS()
        }

        // Log the URL separately for debugging purposes
        // console.log('URL:', url)

        return response
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
