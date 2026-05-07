import { useState } from 'react'

interface Props {
  initialName: string
  onClose: () => void
  onSaved: (name: string) => Promise<unknown>
}

function Spinner() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default function EditStackModal({ initialName, onClose, onSaved }: Props) {
  const [name, setName] = useState(initialName)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await onSaved(name.trim())
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
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Editar tecnología</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-name" className="text-sm font-medium text-gray-600 dark:text-zinc-300">Nombre</label>
            <input
              id="edit-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="React, Node.js, Docker…"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600 text-sm font-medium rounded-xl transition-all duration-200">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading || !name.trim() || name.trim() === initialName}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <><Spinner />Guardando…</> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
