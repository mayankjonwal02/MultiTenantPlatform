import { isAxiosError } from "axios"

type ApiErrorData = {
  detail?: unknown
  error?: unknown
  message?: unknown
  [key: string]: unknown
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<ApiErrorData>(error)) {
    return fallback
  }

  const data = error.response?.data

  if (typeof data === "string") {
    return data
  }

  const directMessage = data?.detail ?? data?.error ?? data?.message

  if (typeof directMessage === "string") {
    return directMessage
  }

  for (const value of Object.values(data ?? {})) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0]
    }
  }

  return fallback
}
