import api from '../../../lib/api'
import type { TokenResponse, MessageResponse } from '../interfaces/auth.interfaces'
import type { LoginDto } from '../dtos/login.dto'
import type { RegisterDto } from '../dtos/register.dto'

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
