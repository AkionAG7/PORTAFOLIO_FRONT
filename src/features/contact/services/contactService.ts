import api from '../../../lib/api'
import type { ContactItem } from '../interfaces/contact.interfaces'
import type { CreateContactDto } from '../dtos/create-contact.dto'
import type { MessageResponse } from '../../auth/interfaces/auth.interfaces'

function extractArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  const nested = Object.values(data as Record<string, unknown>).find(Array.isArray)
  return (nested as T[]) ?? []
}

function isNotFound(err: unknown): boolean {
  return (
    err !== null &&
    typeof err === 'object' &&
    'response' in err &&
    typeof (err as { response?: { status?: number } }).response === 'object' &&
    (err as { response: { status: number } }).response.status === 404
  )
}

export async function getUserContacts(userId: string): Promise<ContactItem[]> {
  try {
    const { data } = await api.get(`/Contact/user/${userId}`)
    return extractArray<ContactItem>(data)
  } catch (err) {
    if (isNotFound(err)) return []
    throw err
  }
}

export async function createContact(userId: string, dto: CreateContactDto): Promise<MessageResponse> {
  const formData = new FormData()
  formData.append('name', dto.name)
  formData.append('link', dto.link)
  if (dto.image) formData.append('file', dto.image)
  const { data } = await api.post<MessageResponse>(`/Contact/${userId}`, formData)
  return data
}

export async function deleteContact(contactId: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/Contact/${contactId}`)
  return data
}
