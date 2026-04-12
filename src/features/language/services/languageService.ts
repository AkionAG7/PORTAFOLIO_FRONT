import api from '../../../lib/api'
import type { LanguageItem, UserLanguageResponse } from '../interfaces/language.interfaces'
import type { CreateLanguageDto } from '../dtos/create-language.dto'
import type { AssignLanguageDto } from '../dtos/assign-language.dto'
import type { MessageResponse } from '../../../features/auth/interfaces/auth.interfaces'

const PAGE = { page: 1, limit: 100 }

function extractArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  const nested = Object.values(data as Record<string, unknown>).find(Array.isArray)
  return (nested as T[]) ?? []
}

export async function getAllLanguages(name?: string): Promise<LanguageItem[]> {
  const params: Record<string, unknown> = { ...PAGE }
  if (name) params.name = name
  const { data } = await api.get('/language', { params })
  return extractArray<LanguageItem>(data)
}

export async function getUserLanguages(userId: string): Promise<UserLanguageResponse[]> {
  const { data } = await api.get(`/language/user/${userId}`, { params: PAGE })
  return extractArray<UserLanguageResponse>(data)
}

export async function getUserLanguage(userId: string, languageId: string): Promise<UserLanguageResponse> {
  const { data } = await api.get<UserLanguageResponse>(`/language/user/${userId}/${languageId}`)
  return data
}

export async function createLanguage(dto: CreateLanguageDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/language', dto)
  return data
}

export async function assignLanguage(dto: AssignLanguageDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/language/user', dto)
  return data
}

export async function updateLanguage(id: string, dto: { name: string }): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/language/${id}`, dto)
  return data
}

export async function toggleLanguageStatus(languageId: string): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/language/${languageId}/status`)
  return data
}

export async function updateUserLanguage(userId: string, languageId: string, dto: { level: string }): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/language/user/${userId}/${languageId}`, dto)
  return data
}

export async function toggleUserLanguageStatus(userId: string, languageId: string): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/language/user/${userId}/${languageId}/status`)
  return data
}
