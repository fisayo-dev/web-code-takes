import axios from "axios"
import type { ApiResponse, LoginPayload, OtpPayload, SignupPayload, User } from "./types"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
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
  return unwrap(api.post<ApiResponse>("/auth/signup", payload))
}

export function login(payload: LoginPayload) {
  return unwrap(api.post<ApiResponse>("/auth/login", payload))
}

export function logout() {
  return unwrap(api.post<ApiResponse>("/auth/logout"))
}

export function getMe() {
  return unwrap<User>(api.get<ApiResponse<User>>("/users/me"))
}

export function checkUsername(username: string) {
  return unwrap(api.get<ApiResponse>(`/users/check-if-username-available/${username}`))
}
