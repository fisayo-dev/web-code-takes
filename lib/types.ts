export interface User {
  id: string
  name: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = void> {
  success: boolean
  message: string
  data?: T
}

export interface SignupPayload {
  first_name: string
  last_name: string
  email: string
  password: string
  username: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface OtpPayload {
  email: string
  otp: string
}
