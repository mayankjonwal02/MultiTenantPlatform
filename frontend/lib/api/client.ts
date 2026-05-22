import axios from "axios"
import Cookies from "js-cookie"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

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

export default apiClient