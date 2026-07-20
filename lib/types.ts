export interface User {
  id: string
  name: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface TakeAuthor {
  id: string
  name: string
  username: string
}

export interface Take {
  id: string
  text: string
  hashtags: string[]
  authorId: string
  author: TakeAuthor
  votesCount: number
  commentsCount: number
  hasVoted: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  text: string
  authorId: string
  author: TakeAuthor
  takeId: string
  createdAt: string
  updatedAt: string
}

export interface VoteResult {
  hasVoted: boolean
  votesCount: number
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
