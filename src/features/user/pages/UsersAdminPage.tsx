import { useState, useEffect } from 'react'
import { getUsers, toggleUserStatus, updateUserRole } from '../services/userService'
import type { UserWithRole } from '../interfaces/user.interfaces'
import UserDetailModal from '../components/UserDetailModal'

const roleBadge: Record<string, string> = {
  admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  user:  'bg-zinc-700/60 text-zinc-300 border-zinc-600/40',
}

function UserAvatar({ user, size }: { user: UserWithRole; size: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
  const text = size === 'sm' ? 'text-xs' : 'text-sm'
  return (
    <div className={`${dim} rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0`}>
      {user.user_image ? (
        <img src={user.user_image} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <span className={`text-white ${text} font-semibold`}>{user.name[0].toUpperCase()}</span>
      )}
    </div>
  )
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null)
  const [togglingId, setTogglingId]         = useState<string | null>(null)
  const [roleChangingId, setRoleChangingId] = useState<string | null>(null)
  const [actionError, setActionError]       = useState<string | null>(null)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setIsLoading(false))
  }, [])

  const q = query.toLowerCase().trim()
  const filtered = q
    ? users.filter(u => {
        const fullName = `${u.name} ${u.last_name1} ${u.last_name2}`.toLowerCase()
        return fullName.includes(q) || u.email.toLowerCase().includes(q)
      })
    : users

  async function handleToggle(user: UserWithRole) {
    setTogglingId(user.id)
    setActionError(null)
    try {
      await toggleUserStatus(user.id)
      const updated = { ...user, status: !(user.status ?? true) }
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u))
      if (selectedUser?.id === user.id) setSelectedUser(updated)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setActionError(`Error al cambiar estado: ${msg}`)
      console.error('[toggleStatus]', err)
    } finally {
      setTogglingId(null)
    }
  }

  async function handleRoleChange(user: UserWithRole, newRole: string) {
    setRoleChangingId(user.id)
    setActionError(null)
    try {
      await updateUserRole(user.id, newRole)
      const updated = { ...user, rol: newRole }
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u))
      if (selectedUser?.id === user.id) setSelectedUser(updated)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setActionError(`Error al cambiar rol: ${msg}`)
      console.error('[updateRole]', err)
    } finally {
      setRoleChangingId(null)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Usuarios</h1>
          <p className="mt-1 text-zinc-400 text-sm">Todos los usuarios registrados en el sistema.</p>
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="shrink-0 hover:text-red-300 transition-colors">✕</button>
          </div>
        )}

        {/* Search */}
        {!isLoading && users.length > 0 && (
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin text-violet-400" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-300 font-medium">No hay usuarios registrados</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-300 font-medium">Sin resultados para &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 font-medium px-5 py-3">Usuario</th>
                    <th className="text-left text-zinc-500 font-medium px-5 py-3">Correo</th>
                    <th className="text-left text-zinc-500 font-medium px-5 py-3">Rol</th>
                    <th className="text-left text-zinc-500 font-medium px-5 py-3">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filtered.map((u) => {
                    const isActive = u.status ?? true
                    return (
                      <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={u} size="sm" />
                            <span className="text-white font-medium">{u.name} {u.last_name1} {u.last_name2}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-400">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadge[u.rol] ?? roleBadge['user']}`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            isActive
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-zinc-700/60 text-zinc-500 border-zinc-600/40'
                          }`}>
                            {isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
                            >
                              Ver
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 sm:hidden">
              {filtered.map((u) => {
                return (
                  <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <UserAvatar user={u} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm truncate">{u.name} {u.last_name1} {u.last_name2}</p>
                        <p className="text-zinc-500 text-xs truncate">{u.email}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${roleBadge[u.rol] ?? roleBadge['user']}`}>
                        {u.rol}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="flex-1 py-2 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {selectedUser !== null && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggleStatus={handleToggle}
          onRoleChange={handleRoleChange}
          isToggling={togglingId === selectedUser.id}
          isChangingRole={roleChangingId === selectedUser.id}
        />
      )}
    </>
  )
}
