import axios from "axios"
import type { ApiResponse, Comment, LoginPayload, OtpPayload, PaginatedData, SignupPayload, Take, User, VoteResult } from "./types"

const TOKEN_KEY = "auth_token"
const TOKEN_COOKIE = "auth_token"

let token: string | null = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null

function setTokenCookie(t: string) {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(t)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
}

function clearTokenCookie() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`
}

export function setAuthToken(t: string) {
  token = t
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, t)
    setTokenCookie(t)
  }
}

export function clearAuthToken() {
  token = null
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
    clearTokenCookie()
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

export function getFeedTakes(page: number = 0, limit: number = 10) {
  const offset = page * limit
  return unwrap<PaginatedData<Take>>(api.get<ApiResponse<PaginatedData<Take>>>(`/takes?limit=${limit}&offset=${offset}`))
}

export function getTakeById(id: string) {
  return unwrap<Take>(api.get<ApiResponse<Take>>(`/takes/${id}`))
}

export function getTakesByUsername(username: string, page: number = 0, limit: number = 10) {
  const offset = page * limit
  return unwrap<PaginatedData<Take>>(api.get<ApiResponse<PaginatedData<Take>>>(`/takes/user/${username}?limit=${limit}&offset=${offset}`))
}

export function createTake(data: { text: string; hashtags: string[] }) {
  return unwrap<Take>(api.post<ApiResponse<Take>>("/takes", data))
}

export function updateTake(id: string, data: { text?: string; hashtags?: string[] }) {
  return unwrap<Take>(api.patch<ApiResponse<Take>>(`/takes/${id}`, data))
}

export function deleteTake(id: string) {
  return unwrap(api.delete<ApiResponse>(`/takes/${id}`))
}

export function toggleVote(takeId: string) {
  return unwrap<VoteResult>(api.post<ApiResponse<VoteResult>>(`/takes/${takeId}/vote`))
}

export function getComments(takeId: string, page: number = 0, limit: number = 10) {
  const offset = page * limit
  return unwrap<PaginatedData<Comment>>(api.get<ApiResponse<PaginatedData<Comment>>>(`/takes/${takeId}/comments?limit=${limit}&offset=${offset}`))
}

export function createComment(takeId: string, text: string) {
  return unwrap<Comment>(api.post<ApiResponse<Comment>>(`/takes/${takeId}/comments`, { text }))
}

export function deleteComment(commentId: string) {
  return unwrap(api.delete<ApiResponse>(`/comments/${commentId}`))
}

export function updateProfile(data: { name?: string; username?: string }) {
  return unwrap<User>(api.patch<ApiResponse<User>>("/users/me", data))
}

export function deleteAccount() {
  return unwrap(api.delete<ApiResponse>("/users/me"))
}
