import axios from "axios"
import type { ApiResponse, LoginPayload, OtpPayload, SignupPayload, User } from "./types"

const TOKEN_KEY = "auth_token"

let token: string | null = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null

export function setAuthToken(t: string) {
  token = t
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, t)
  }
}

export function clearAuthToken() {
  token = null
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken()
    }
    const message = error.response?.data?.message || "Something went wrong"
    return Promise.reject(new Error(message))
  },
)

function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  return promise.then((res) => {
    if (!res.data.success) {
      throw new Error(res.data.message)
    }
    return res.data.data as T
  })
}

export function sendOtp(email: string) {
  return unwrap(api.post<ApiResponse>("/auth/send-otp", { email }))
}

export function verifyOtp(payload: OtpPayload) {
  return unwrap(api.post<ApiResponse>("/auth/verify-otp", payload))
}

export function signup(payload: SignupPayload) {
  return unwrap(api.post<ApiResponse<{ token: string }>>("/auth/signup", payload))
    .then((data) => {
      setAuthToken(data.token)
      return data
    })
}

export function login(payload: LoginPayload) {
  return unwrap(api.post<ApiResponse<{ token: string }>>("/auth/login", payload))
    .then((data) => {
      setAuthToken(data.token)
      return data
    })
}

export function logout() {
  clearAuthToken()
  return unwrap(api.post<ApiResponse>("/auth/logout"))
}

export function getMe() {
  return unwrap<User>(api.get<ApiResponse<User>>("/users/me"))
}

export function checkUsername(username: string) {
  return unwrap(api.get<ApiResponse>(`/users/check-if-username-available/${username}`))
}

export function getUserByUsername(username: string) {
  return unwrap<User>(api.get<ApiResponse<User>>(`/users/${username}`))
}
