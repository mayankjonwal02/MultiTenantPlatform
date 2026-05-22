import axios from "axios"
import Cookies from "js-cookie"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

let isRefreshing = false
let failedQueue: { resolve: (value: string) => void; reject: (reason?: unknown) => void }[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token || "")
    }
  })
  failedQueue = []
}

apiClient.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access_token")
  const tenantId = Cookies.get("tenant_id")

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  if (tenantId) {
    config.headers["X-Tenant-ID"] = tenantId
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch(() => {
            // Clear cookies and redirect to login
            Cookies.remove("access_token")
            Cookies.remove("refresh_token")
            Cookies.remove("tenant_id")
            window.location.href = "/login"
            return Promise.reject(error)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = Cookies.get("refresh_token")
      if (!refreshToken) {
        Cookies.remove("access_token")
        Cookies.remove("refresh_token")
        Cookies.remove("tenant_id")
        window.location.href = "/login"
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh/`,
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        )

        const { access } = response.data
        Cookies.set("access_token", access)
        apiClient.defaults.headers.common.Authorization = `Bearer ${access}`
        originalRequest.headers.Authorization = `Bearer ${access}`
        processQueue(null, access)
        return apiClient(originalRequest)
      } catch (err) {
        processQueue(err, null)
        Cookies.remove("access_token")
        Cookies.remove("refresh_token")
        Cookies.remove("tenant_id")
        window.location.href = "/login"
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
