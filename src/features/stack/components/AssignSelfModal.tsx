import { useState, useEffect, useRef } from 'react'
import { getAllStacks, assignStack } from '../services/stackService'
import { useAuth } from '../../../context/AuthContext'
import type { StackItem } from '../interfaces/stack.interfaces'

interface Props {
  onClose: () => void
  onAssigned: () => void
}

function Spinner({ small }: { small?: boolean }) {
  const s = small ? 16 : 24
  return (
    <svg className="animate-spin text-violet-400" xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default function AssignSelfModal({ onClose, onAssigned }: Props) {
  const { user } = useAuth()

  const [allStacks, setAllStacks] = useState<StackItem[]>([])
  const [filtered, setFiltered] = useState<StackItem[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<StackItem | null>(null)
  const [isLoadingStacks, setIsLoadingStacks] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initial load
  useEffect(() => {
    getAllStacks()
      .then((data) => { setAllStacks(data); setFiltered(data) })
      .finally(() => setIsLoadingStacks(false))
  }, [])

  // Filter by name client-side (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const q = search.toLowerCase()
      setFiltered(allStacks.filter((s) => s.name.toLowerCase().includes(q)))
    }, 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, allStacks])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !user) return
    setError(null)
    setIsSubmitting(true)
    try {
      await assignStack({ user_id: user.id, stack_id: selected.id })

      onAssigned()
      onClose()
    } catch {
      setError('Error al agregar la tecnología. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Agregar a mi Stack</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          {/* Search input */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Buscar tecnología…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
            />
          </div>

          {/* List */}
          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-0.5">
            {isLoadingStacks ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : filtered.length === 0 ? (
              <p className="text-gray-400 dark:text-zinc-500 text-sm text-center py-6">Sin resultados.</p>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelected(s)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 w-full
                    ${selected?.id === s.id
                      ? 'bg-violet-600/15 border-violet-500/30 text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                    }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{s.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium truncate">{s.name}</span>
                  {selected?.id === s.id && (
                    <svg className="ml-auto text-violet-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600 text-sm font-medium rounded-xl transition-all duration-200">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || !selected}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><Spinner small />Agregando…</> : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
