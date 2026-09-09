import apiClient from './client'
import type { User } from '../types/application'

export interface AuthResponse {
  access_token: string
  token_type: string
  user?: User
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  return response.data
}

export const signupUser = async (
  username: string,
  email: string,
  password: string
): Promise<User> => {
  const response = await apiClient.post<User>('/auth/signup', {
    username,
    email,
    password,
  })
  return response.data
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}
