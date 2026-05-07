import { useState, useEffect } from 'react'
import { getUsers } from '../../user/services/userService'
import type { UserWithRole } from '../../user/interfaces/user.interfaces'

const roleBadge: Record<string, string> = {
  admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  user: 'bg-gray-200/60 dark:bg-zinc-700/60 text-gray-700 dark:text-zinc-300 border-gray-300/40 dark:border-zinc-600/40',
}

export default function UsersTab() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin text-violet-400" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl">
        <p className="text-gray-700 dark:text-zinc-300 font-medium">No hay usuarios registrados</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop table */}
      <div className="hidden sm:block bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800">
              <th className="text-left text-gray-400 dark:text-zinc-500 font-medium px-5 py-3">Usuario</th>
              <th className="text-left text-gray-400 dark:text-zinc-500 font-medium px-5 py-3">Correo</th>
              <th className="text-left text-gray-400 dark:text-zinc-500 font-medium px-5 py-3">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-100 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-semibold">{u.name[0].toUpperCase()}</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{u.name} {u.last_name1} {u.last_name2}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-zinc-400">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadge[u.rol] ?? roleBadge['user']}`}>
                    {u.rol}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {users.map((u) => (
          <div key={u.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-semibold">{u.name[0].toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-900 dark:text-white font-medium text-sm truncate">{u.name} {u.last_name1} {u.last_name2}</p>
              <p className="text-gray-400 dark:text-zinc-500 text-xs truncate">{u.email}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${roleBadge[u.rol] ?? roleBadge['user']}`}>
              {u.rol}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
