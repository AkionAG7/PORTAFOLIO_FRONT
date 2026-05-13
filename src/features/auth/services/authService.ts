import api from '../../../lib/api'
import type { TokenResponse, MessageResponse } from '../interfaces/auth.interfaces'
import type { LoginDto } from '../dtos/login.dto'
import type { RegisterDto } from '../dtos/register.dto'
import type { ForgotPasswordDto } from '../dtos/forgot-password.dto'
import type { ResetPasswordDto } from '../dtos/reset-password.dto'

export async function login({ email, password }: LoginDto): Promise<TokenResponse> {
  const body = new URLSearchParams()
  body.append('username', email)
  body.append('password', password)

  const { data } = await api.post<TokenResponse>('/auth/login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  return data
}

export async function register(dto: RegisterDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/auth/register', dto)
  return data
}

export async function forgotPassword(dto: ForgotPasswordDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/auth/forgot-password', dto)
  return data
}

export async function resetPassword(dto: ResetPasswordDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/auth/reset-password', dto)
  return data
}
