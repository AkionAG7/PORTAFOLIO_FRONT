import { useState, useRef } from 'react'
import type { ContactItem } from '../interfaces/contact.interfaces'
import type { UpdateContactDto } from '../dtos/update-contact.dto'

interface Props {
  item: ContactItem
  onClose: () => void
  onSaved: (dto: UpdateContactDto) => Promise<void>
}

function Spinner() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}

export default function EditContactModal({ item, onClose, onSaved }: Props) {
  const [name, setName] = useState(item.name)
  const [link, setLink] = useState(item.link)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(item.image ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  function handleRemoveImage() {
    setImageFile(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const dto: UpdateContactDto = { name: name.trim(), link: link.trim() }
      if (imageFile) dto.image = imageFile
      await onSaved(dto)
      onClose()
    } catch {
      setError('Error al guardar los cambios. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Editar contacto</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-contact-name" className="text-sm font-medium text-gray-600 dark:text-zinc-300">Nombre</label>
            <input
              id="edit-contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="GitHub, LinkedIn, Twitter…"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="edit-contact-link" className="text-sm font-medium text-gray-600 dark:text-zinc-300">Enlace</label>
            <input
              id="edit-contact-link"
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/usuario"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-zinc-300">
              Imagen <span className="text-gray-400 dark:text-zinc-500 font-normal">(opcional)</span>
            </span>

            {preview ? (
              <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl">
                <img src={preview} alt="preview" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <span className="text-gray-600 dark:text-zinc-300 text-sm truncate flex-1">{imageFile?.name ?? 'Imagen actual'}</span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-gray-400 dark:text-zinc-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10 shrink-0"
                  aria-label="Quitar imagen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 w-full py-6 border border-dashed border-gray-300 dark:border-zinc-700 hover:border-violet-500/50 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-violet-400 transition-colors duration-200 bg-gray-100 dark:bg-zinc-800/50 hover:bg-violet-500/5"
              >
                <UploadIcon />
                <span className="text-xs">Haz clic para seleccionar una imagen</span>
              </button>
            )}

            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-zinc-600 text-sm font-medium rounded-xl transition-all duration-200">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading || !name.trim() || !link.trim()}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <><Spinner />Guardando…</> : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
