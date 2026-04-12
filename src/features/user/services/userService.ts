import api from '../../../lib/api'
import type { UserWithRole } from '../interfaces/user.interfaces'

export async function getUsers(): Promise<UserWithRole[]> {
  const { data } = await api.get<UserWithRole[]>('/users')
  if (Array.isArray(data)) return data
  const nested = Object.values(data as Record<string, unknown>).find(Array.isArray)
  return (nested as UserWithRole[]) ?? []
}

export async function toggleUserStatus(id: string): Promise<void> {
  await api.patch(`/users/${id}/status`)
  console.log(id)
}

export async function updateUserRole(id: string, rol: string): Promise<void> {
  await api.patch(`/users/${id}/rol`, null, { params: { rol } })
}
