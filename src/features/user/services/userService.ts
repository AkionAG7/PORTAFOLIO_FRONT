import api from '../../../lib/api'
import type { UserWithRole, UpdateProfileDto, UpdateEmailDto } from '../interfaces/user.interfaces'

export async function getUsers(): Promise<UserWithRole[]> {
  const { data } = await api.get<UserWithRole[]>('/users')
  if (Array.isArray(data)) return data
  const nested = Object.values(data as Record<string, unknown>).find(Array.isArray)
  return (nested as UserWithRole[]) ?? []
}

export async function getUser(id: string): Promise<UserWithRole> {
  const { data } = await api.get<UserWithRole>(`/users/${id}`)
  return data
}

export async function updateProfile(id: string, dto: UpdateProfileDto): Promise<void> {
  await api.patch(`/users/${id}`, dto)
}

export async function updateEmail(id: string, dto: UpdateEmailDto): Promise<void> {
  await api.patch(`/users/${id}/email`, dto)
}

export async function updateUserImage(id: string, file: File): Promise<void> {
  const form = new FormData()
  form.append('file', file)
  await api.patch(`/users/${id}/image`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function toggleUserStatus(id: string): Promise<void> {
  await api.patch(`/users/${id}/status`)
}

export async function updateUserRole(id: string, rol: string): Promise<void> {
  await api.patch(`/users/${id}/rol`, null, { params: { rol } })
}
