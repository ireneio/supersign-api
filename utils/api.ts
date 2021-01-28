import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

axios.options

const config: AxiosRequestConfig = {
  baseURL: process.env.NODE_APP_API_URL || '',
  timeout: Number(process.env.NODE_APP_TIMEOUT_LIMIT) || 15000,
  headers: {
    authorization: '',
    'content-type': 'application/json'
  }
}

const axiosInstance: AxiosInstance = axios.create({
  ...config
})

export function addJwtToRequestHeaders(jwt: string): void {
  axiosInstance.interceptors.request.use(function (config): AxiosRequestConfig {
    config.headers.Authorization = jwt
    return config
  })
}

export default axiosInstance
