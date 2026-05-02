import { useState, useRef } from 'react'
import type { ProjectItem } from '../interfaces/project.interfaces'
import type { UpdateProjectDto } from '../dtos/update-project.dto'

interface Props {
  item: ProjectItem
  onClose: () => void
  onSaved: (dto: UpdateProjectDto) => Promise<void>
  onAddImages: (files: File[]) => Promise<void>
  onRemoveImage: (imageUrl: string) => Promise<void>
}

function Spinner() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  )
}

export default function EditProjectModal({ item, onClose, onSaved, onAddImages, onRemoveImage }: Props) {
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description)
  const [repositoryLink, setRepositoryLink] = useState(item.repository_link ?? '')
  const [deployLink, setDeployLink] = useState(item.deploy_link ?? '')
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [removingUrl, setRemovingUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    if (!selected.length) return
    setNewFiles((prev) => [...prev, ...selected])
    setNewPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
    setNewPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleRemoveExisting(url: string) {
    setRemovingUrl(url)
    try {
      await onRemoveImage(url)
    } finally {
      setRemovingUrl(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      await onSaved({
        name: name.trim(),
        description: description.trim(),
        repository_link: repositoryLink.trim() || undefined,
        deploy_link: deployLink.trim() || undefined,
      })

      if (newFiles.length) {
        setIsUploadingImages(true)
        await onAddImages(newFiles)
        setIsUploadingImages(false)
      }

      onClose()
    } catch {
      setError('Error al guardar los cambios. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
      setIsUploadingImages(false)
    }
  }

  const isBusy = isSaving || isUploadingImages

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 shrink-0">
          <h2 className="text-white font-semibold text-lg">Editar proyecto</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-800">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6 overflow-y-auto">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Nombre</label>
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Descripción</label>
            <textarea
              required value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm resize-none"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-300">Repositorio <span className="text-zinc-500 font-normal">(opcional)</span></label>
              <input
                type="url" value={repositoryLink} onChange={(e) => setRepositoryLink(e.target.value)}
                placeholder="https://github.com/…"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-300">Deploy <span className="text-zinc-500 font-normal">(opcional)</span></label>
              <input
                type="url" value={deployLink} onChange={(e) => setDeployLink(e.target.value)}
                placeholder="https://miapp.vercel.app"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Existing images */}
          {(item.image_link?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-300">Imágenes actuales</span>
              <div className="flex flex-wrap gap-2">
                {item.image_link!.map((url) => (
                  <div key={url} className="relative group/img w-20 h-20 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button" onClick={() => handleRemoveExisting(url)}
                      disabled={removingUrl === url}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity text-red-400 disabled:opacity-100"
                    >
                      {removingUrl === url
                        ? <Spinner />
                        : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        )
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New images */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">Agregar imágenes <span className="text-zinc-500 font-normal">(opcional)</span></span>

            {newPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative group/img w-20 h-20 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button" onClick={() => removeNewFile(i)}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 w-full py-4 border border-dashed border-zinc-700 hover:border-violet-500/50 rounded-xl text-zinc-500 hover:text-violet-400 transition-colors bg-zinc-800/50 hover:bg-violet-500/5 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              Seleccionar imágenes
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFilesChange} className="hidden" />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 text-sm font-medium rounded-xl transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isBusy || !name.trim() || !description.trim()}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isBusy ? <><Spinner />{isUploadingImages ? 'Subiendo imágenes…' : 'Guardando…'}</> : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
