import { useState, useEffect } from 'react'
import { getUserStacks } from '../services/stackService'
import { getUsers } from '../../user/services/userService'
import type { UserStackEntry } from '../interfaces/stack.interfaces'
import StackCard from './StackCard'

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export default function AllUserStacksTab() {
  const [entries, setEntries] = useState<UserStackEntry[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const users = await getUsers()
      const results = await Promise.all(
        users.map(async (user) => ({
          user,
          stacks: await getUserStacks(user.id),
        }))
      )
      setEntries(results)
    }
    load().finally(() => setIsLoading(false))
  }, [])

  const filtered = search
    ? entries.filter(({ user }) =>
        `${user.name} ${user.last_name1} ${user.last_name2}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : entries

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin text-violet-400" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por usuario…"
          className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <p className="text-zinc-300 font-medium">{search ? 'Sin resultados' : 'Ningún usuario registrado'}</p>
          {search && <p className="text-zinc-500 text-sm">No hay usuarios con "{search}".</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map(({ user, stacks }) => (
            <div key={user.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-semibold">{user.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{user.name} {user.last_name1} {user.last_name2}</p>
                  <p className="text-zinc-500 text-xs">{user.email}</p>
                </div>
                <span className="ml-auto text-xs text-zinc-500 shrink-0">
                  {stacks.length} tecnología{stacks.length !== 1 ? 's' : ''}
                </span>
              </div>

              {stacks.length === 0 ? (
                <p className="text-zinc-600 text-sm pl-11">Sin tecnologías asignadas.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pl-11">
                  {stacks.map((s) => <StackCard key={s.stack_id} item={s} />)}
                </div>
              )}

              <div className="border-b border-zinc-800/60" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
