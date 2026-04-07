import api from '../../../lib/api'
import type { UserWithRole } from '../interfaces/user.interfaces'

export async function getUsers(): Promise<UserWithRole[]> {
  const { data } = await api.get<UserWithRole[]>('/users')
  if (Array.isArray(data)) return data
  const nested = Object.values(data as Record<string, unknown>).find(Array.isArray)
  return (nested as UserWithRole[]) ?? []
}
