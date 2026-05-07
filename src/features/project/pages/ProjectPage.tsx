import { useState } from 'react'
import { useMyProjects } from '../hooks/useMyProjects'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import EditProjectModal from '../components/EditProjectModal'
import type { CreateProjectDto } from '../dtos/create-project.dto'
import type { UpdateProjectDto } from '../dtos/update-project.dto'
import type { ProjectItem } from '../interfaces/project.interfaces'

export default function ProjectPage() {
  const { items, isLoading, create, update, toggleStatus, addImages, removeImage } = useMyProjects()
  const [showCreate, setShowCreate] = useState(false)
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleCreated(dto: CreateProjectDto) {
    await create.mutateAsync(dto)
  }

  async function handleSaved(dto: UpdateProjectDto) {
    if (!editingItem) return
    await update.mutateAsync({ id: editingItem.id, dto })
  }

  async function handleToggleStatus(projectId: string) {
    setActionError(null)
    try {
      await toggleStatus.mutateAsync(projectId)
    } catch {
      setActionError('Error al cambiar el estado. Intenta de nuevo.')
    }
  }

  async function handleAddImages(files: File[]) {
    if (!editingItem) return
    await addImages.mutateAsync({ id: editingItem.id, files })
  }

  async function handleRemoveImage(imageUrl: string) {
    if (!editingItem) return
    await removeImage.mutateAsync({ id: editingItem.id, imageUrl })
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Proyectos</h1>
            <p className="mt-1 text-gray-500 dark:text-zinc-400 text-sm">Gestiona tus proyectos de portafolio.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
            Nuevo proyecto
          </button>
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="shrink-0 hover:text-red-300 transition-colors">✕</button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin text-violet-400" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gray-700 dark:text-zinc-300 font-medium">Sin proyectos aún</p>
              <p className="text-gray-400 dark:text-zinc-500 text-sm mt-1">Crea tu primer proyecto para comenzar.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <ProjectCard
                key={item.id}
                item={item}
                onToggleStatus={() => handleToggleStatus(item.id)}
                onEdit={() => setEditingItem(item)}
                isTogglingStatus={toggleStatus.isPending && toggleStatus.variables === item.id}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {editingItem && (
        <EditProjectModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={handleSaved}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
        />
      )}
    </>
  )
}
