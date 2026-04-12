import { useState, useEffect, useRef } from 'react'
import { getAllLanguages, assignLanguage } from '../services/languageService'
import { useAuth } from '../../../context/AuthContext'
import type { LanguageItem } from '../interfaces/language.interfaces'

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

export default function AssignSelfLanguageModal({ onClose, onAssigned }: Props) {
  const { user } = useAuth()

  const [allLanguages, setAllLanguages] = useState<LanguageItem[]>([])
  const [filtered, setFiltered] = useState<LanguageItem[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<LanguageItem | null>(null)
  const [level, setLevel] = useState('')
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getAllLanguages()
      .then((data) => { setAllLanguages(data); setFiltered(data) })
      .finally(() => setIsLoadingLanguages(false))
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const q = search.toLowerCase()
      setFiltered(allLanguages.filter((l) => l.name.toLowerCase().includes(q)))
    }, 200)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, allLanguages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !user) return
    setError(null)
    setIsSubmitting(true)
    try {
      await assignLanguage({ user_id: user.id, language_id: selected.id, level })
      onAssigned()
      onClose()
    } catch {
      setError('Error al agregar el idioma. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-white font-semibold text-lg">Agregar a mis Idiomas</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-800" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Buscar idioma…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-0.5">
            {isLoadingLanguages ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : filtered.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-6">Sin resultados.</p>
            ) : (
              filtered.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelected(l)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 w-full
                    ${selected?.id === l.id
                      ? 'bg-violet-600/15 border-violet-500/30 text-white'
                      : 'border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{l.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium truncate">{l.name}</span>
                  {selected?.id === l.id && (
                    <svg className="ml-auto text-violet-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lang-level" className="text-sm font-medium text-zinc-300">Nivel</label>
            <select
              id="lang-level"
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
            >
              <option value="" disabled>Selecciona un nivel…</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 text-sm font-medium rounded-xl transition-all duration-200">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || !selected || !level}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><Spinner small />Agregando…</> : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
