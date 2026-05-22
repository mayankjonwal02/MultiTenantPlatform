import { create } from "zustand"
import Cookies from "js-cookie"

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (
    access: string,
    refresh: string
  ) => void
  logout: () => void
  initializeFromCookies: () => void
}

export const useAuthStore = create<AuthState>((set) => ({

  accessToken: null,
  refreshToken: null,

  setTokens: (access, refresh) => {

    Cookies.set("access_token", access)
    Cookies.set("refresh_token", refresh)

    set({
      accessToken: access,
      refreshToken: refresh,
    })
  },

  logout: () => {

    Cookies.remove("access_token")
    Cookies.remove("refresh_token")
    Cookies.remove("tenant_id")

    set({
      accessToken: null,
      refreshToken: null,
    })
  },

  initializeFromCookies: () => {
    const accessToken = Cookies.get("access_token")
    const refreshToken = Cookies.get("refresh_token")
    set({ accessToken: accessToken || null, refreshToken: refreshToken || null })
  },
}))
