import api from '../../../lib/api'
import type { ProjectItem } from '../interfaces/project.interfaces'
import type { CreateProjectDto } from '../dtos/create-project.dto'
import type { UpdateProjectDto } from '../dtos/update-project.dto'
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

export async function getUserProjects(userId: string): Promise<ProjectItem[]> {
  try {
    const { data } = await api.get(`/project/${userId}/user`)
    return extractArray<ProjectItem>(data)
  } catch (err) {
    if (isNotFound(err)) return []
    throw err
  }
}

export async function createProject(userId: string, dto: CreateProjectDto): Promise<MessageResponse> {
  const formData = new FormData()
  formData.append('name', dto.name)
  formData.append('description', dto.description)
  if (dto.repository_link) formData.append('repository_link', dto.repository_link)
  if (dto.deploy_link) formData.append('deploy_link', dto.deploy_link)
  dto.files?.forEach((f) => formData.append('files', f))
  const { data } = await api.post<MessageResponse>(`/project/${userId}`, formData)
  return data
}

export async function updateProject(projectId: string, dto: UpdateProjectDto): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/project/${projectId}`, dto)
  return data
}

export async function toggleProjectStatus(projectId: string): Promise<MessageResponse> {
  const { data } = await api.patch<MessageResponse>(`/project/${projectId}/status`)
  return data
}

export async function uploadProjectImages(projectId: string, userId: string, files: File[]): Promise<MessageResponse> {
  const formData = new FormData()
  files.forEach((f) => formData.append('files', f))
  const { data } = await api.post<MessageResponse>(`/project/${projectId}/${userId}/images`, formData)
  return data
}

export async function deleteProjectImage(projectId: string, userId: string, imageUrl: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/project/${projectId}/${userId}/images`, {
    data: { image_url: imageUrl },
  })
  return data
}
