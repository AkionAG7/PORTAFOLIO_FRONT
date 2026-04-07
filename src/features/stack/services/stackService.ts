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

export async function getAllStacks(name?: string): Promise<StackItem[]> {
  const params: Record<string, unknown> = { ...PAGE }
  if (name) params.name = name
  const { data } = await api.get('/stack', { params })
  return extractArray<StackItem>(data)
}

export async function getUserStacks(userId: string): Promise<UserStackResponse[]> {
  const { data } = await api.get(`/stack/user/${userId}`, { params: PAGE })
  return extractArray<UserStackResponse>(data)
}

export async function getUserStack(userId: string, stackId: string): Promise<UserStackResponse> {
  const { data } = await api.get<UserStackResponse>(`/stack/user/${userId}/${stackId}`)
  return data
}

export async function createStack(dto: CreateStackDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/stack', dto)
  return data
}


export async function assignStack(dto: AssignStackDto): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>('/stack/user', dto)
  return data
}

export async function updateStack(id: string, dto: { name: string }): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/stack/${id}`, dto)
  return data
}


export async function toggleStackStatus(stackId: string): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/stack/${stackId}/status`)
  return data
}


export async function toggleUserStackStatus(userId: string, stackId: string): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/stack/user/${userId}/${stackId}/status`)
  return data
}
