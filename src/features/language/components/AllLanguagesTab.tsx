import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useAllLanguages } from '../hooks/useAllLanguages'
import type { LanguageItem } from '../interfaces/language.interfaces'
import LanguageCard from './LanguageCard'
import EditLanguageModal from './EditLanguageModal'

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export default function AllLanguagesTab() {
  const { user } = useAuth()
  const isAdmin = user?.rol === 'admin'

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [editTarget, setEditTarget] = useState<LanguageItem | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { items, isLoading, toggleStatus, rename } = useAllLanguages(debouncedSearch)

  function handleSearch(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300)
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="relative max-w-sm">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nombre…"
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin text-violet-400" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-zinc-300 font-medium">{search ? 'Sin resultados' : 'Sin idiomas'}</p>
              <p className="text-zinc-500 text-sm mt-1">
                {search ? `No hay idiomas con "${search}".` : 'Un administrador debe crear idiomas primero.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <LanguageCard
                key={item.id}
                item={item}
                onEdit={isAdmin ? () => setEditTarget(item) : undefined}
                onToggleStatus={isAdmin ? () => toggleStatus.mutate(item.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {editTarget && (
        <EditLanguageModal
          initialName={editTarget.name}
          onClose={() => setEditTarget(null)}
          onSaved={(newName) => rename.mutateAsync({ id: editTarget.id, name: newName })}
        />
      )}
    </>
  )
}
