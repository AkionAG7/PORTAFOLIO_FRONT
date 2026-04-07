import api from '../../../lib/api'
import type { StackItem, UserStackResponse } from '../interfaces/stack.interfaces'
import type { CreateStackDto } from '../dtos/create-stack.dto'
import type { AssignStackDto } from '../dtos/assign-stack.dto'
import type { MessageResponse } from '../../../features/auth/interfaces/auth.interfaces'

const PAGE = { page: 1, limit: 100 }

function extractArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  const nested = Object.values(data as Record<string, unknown>).find(Array.isArray)
  return (nested as T[]) ?? []
}

/** GET /stack — all catalog stacks, optional name filter */
export async function getAllStacks(name?: string): Promise<StackItem[]> {
  const params: Record<string, unknown> = { ...PAGE }
  if (name) params.name = name
  const { data } = await api.get('/stack', { params })
  return extractArray<StackItem>(data)
}

/** GET /stack/user/{user_id} — stacks assigned to a specific user */
export async function getUserStacks(userId: string): Promise<UserStackResponse[]> {
  const { data } = await api.get(`/stack/user/${userId}`, { params: PAGE })
  return extractArray<UserStackResponse>(data)
}

/** POST /stack — create catalog stack (admin) */
export async function createStack(dto: CreateStackDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/stack', dto)
  return data
}

/** POST /stack/user — assign a stack to a user */
export async function assignStack(dto: AssignStackDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/stack/user', dto)
  return data
}
