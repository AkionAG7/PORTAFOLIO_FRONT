import { useState, useEffect, useRef } from 'react'
import { getAllStacks } from '../services/stackService'
import type { StackItem } from '../interfaces/stack.interfaces'
import StackCard from './StackCard'

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export default function AllStacksTab() {
  const [items, setItems] = useState<StackItem[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function fetchStacks(name?: string) {
    setIsLoading(true)
    getAllStacks(name || undefined)
      .then(setItems)
      .finally(() => setIsLoading(false))
  }

  // Initial load
  useEffect(() => { fetchStacks() }, [])

  // Debounced server-side filter
  function handleSearch(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchStacks(value), 300)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
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
              <path d="m12 2 10 6.5v7L12 22 2 15.5v-7z" /><path d="M12 22v-6.5" /><path d="m22 8.5-10 7-10-7" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-zinc-300 font-medium">{search ? 'Sin resultados' : 'Sin tecnologías'}</p>
            <p className="text-zinc-500 text-sm mt-1">
              {search ? `No hay stacks con "${search}".` : 'Un administrador debe crear tecnologías primero.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <StackCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
