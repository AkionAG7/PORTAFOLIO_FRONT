import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../context/AuthContext'
import {
  getUserProjects,
  createProject,
  updateProject,
  toggleProjectStatus,
  uploadProjectImages,
  deleteProjectImage,
} from '../services/projectService'
import type { ProjectItem } from '../interfaces/project.interfaces'
import type { CreateProjectDto } from '../dtos/create-project.dto'
import type { UpdateProjectDto } from '../dtos/update-project.dto'

export function useMyProjects() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const key = ['projects', 'user', user?.id]

  const query = useQuery({
    queryKey: key,
    queryFn: () => getUserProjects(user!.id),
    enabled: !!user,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const create = useMutation({
    mutationFn: (dto: CreateProjectDto) => createProject(user!.id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProjectDto }) => updateProject(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const toggleStatus = useMutation({
    mutationFn: (projectId: string) => toggleProjectStatus(projectId),
    onSuccess: (_, projectId) => {
      qc.setQueryData<ProjectItem[]>(key, (prev) =>
        prev?.map((p) => p.id === projectId ? { ...p, status: !(p.status !== false) } : p)
      )
    },
  })

  const addImages = useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) => uploadProjectImages(id, user!.id, files),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const removeImage = useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl: string }) => deleteProjectImage(id, user!.id, imageUrl),
    onSuccess: (_, { id, imageUrl }) => {
      qc.setQueryData<ProjectItem[]>(key, (prev) =>
        prev?.map((p) => p.id === id ? { ...p, image_link: p.image_link?.filter((img) => img !== imageUrl) } : p)
      )
    },
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    create,
    update,
    toggleStatus,
    addImages,
    removeImage,
  }
}
