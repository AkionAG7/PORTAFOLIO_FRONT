import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../../features/user/services/userService'
import type { UserWithRole } from '../../../features/user/interfaces/user.interfaces'

const roleBadge: Record<string, string> = {
  admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  user:  'bg-gray-200/60 dark:bg-zinc-700/60 text-gray-700 dark:text-zinc-300 border-gray-300/40 dark:border-zinc-600/40',
}

function UserAvatar({ user }: { user: UserWithRole }) {
  return (
    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
      {user.user_image ? (
        <img src={user.user_image} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white text-xs font-semibold">{user.name[0].toUpperCase()}</span>
      )}
    </div>
  )
}

export default function UsersRolesTab() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', 'roles'],
    queryFn: getUsers,
  })

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
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      {/* Desktop table */}
      <table className="hidden sm:table w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-zinc-800">
            <th className="text-left text-gray-400 dark:text-zinc-500 font-medium px-5 py-3">Usuario</th>
            <th className="text-left text-gray-400 dark:text-zinc-500 font-medium px-5 py-3">Correo</th>
            <th className="text-left text-gray-400 dark:text-zinc-500 font-medium px-5 py-3">Rol</th>
            <th className="text-left text-gray-400 dark:text-zinc-500 font-medium px-5 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
          {users.map((u) => {
            const isActive = u.status ?? true
            return (
              <tr key={u.id} className="hover:bg-gray-100 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={u} />
                    <span className="text-gray-900 dark:text-white font-medium">{u.name} {u.last_name1} {u.last_name2}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-zinc-400">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadge[u.rol] ?? roleBadge['user']}`}>
                    {u.rol}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    isActive
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-gray-200/60 dark:bg-zinc-700/60 text-gray-400 dark:text-zinc-500 border-gray-300/40 dark:border-zinc-600/40'
                  }`}>
                    {isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-zinc-800 sm:hidden">
        {users.map((u) => {
          const isActive = u.status ?? true
          return (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <UserAvatar user={u} />
              <div className="min-w-0 flex-1">
                <p className="text-gray-900 dark:text-white text-sm font-medium truncate">{u.name} {u.last_name1} {u.last_name2}</p>
                <p className="text-gray-400 dark:text-zinc-500 text-xs truncate">{u.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${roleBadge[u.rol] ?? roleBadge['user']}`}>
                  {u.rol}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                  isActive
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-gray-200/60 dark:bg-zinc-700/60 text-gray-400 dark:text-zinc-500 border-gray-300/40 dark:border-zinc-600/40'
                }`}>
                  {isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
