import type { UserWithRole } from '../interfaces/user.interfaces'
import { useAuth } from '../../auth/hooks/useAuth'

const ROLES = ['admin', 'user'] as const

const roleActiveStyle: Record<string, string> = {
  admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  user:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
}

interface Props {
  user: UserWithRole
  onClose: () => void
  onToggleStatus: (user: UserWithRole) => void
  onRoleChange: (user: UserWithRole, newRole: string) => void
  isToggling: boolean
  isChangingRole: boolean
}

export default function UserDetailModal({ user, onClose, onToggleStatus, onRoleChange, isToggling, isChangingRole }: Props) {
  const { user: currentUser } = useAuth()
  const isActive = user.status ?? true
  const isOwnAccount = currentUser?.id === user.id

  const rows = [
    { label: 'ID', value: user.id },
    { label: 'Título', value: user.title ?? '—' },
    { label: 'Correo', value: user.email },
    { label: 'Teléfono', value: user.phone_number ?? '—' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 flex flex-col gap-5 shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              {user.user_image ? (
                <img src={user.user_image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xl font-semibold">{user.name[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white font-semibold text-lg leading-tight">
                {user.name} {user.last_name1}{user.last_name2 ? ` ${user.last_name2}` : ''}
              </h2>
              <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                isActive
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-gray-200/60 dark:bg-zinc-700/60 text-gray-400 dark:text-zinc-500 border-gray-300/40 dark:border-zinc-600/40'
              }`}>
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info rows */}
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-zinc-800 bg-gray-50 dark:bg-zinc-800/30 rounded-xl overflow-hidden">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-gray-400 dark:text-zinc-500 text-xs uppercase tracking-wide font-medium shrink-0">{label}</span>
              <span className="text-gray-700 dark:text-zinc-200 text-sm text-right truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* Role change */}
        <div className="flex flex-col gap-2">
          <span className="text-gray-400 dark:text-zinc-500 text-xs uppercase tracking-wide font-medium">Cambiar rol</span>
          <div className="flex items-center gap-2">
            {ROLES.map(role => {
              const isCurrentRole = user.rol === role
              return (
                <button
                  key={role}
                  onClick={() => !isCurrentRole && onRoleChange(user, role)}
                  disabled={isChangingRole || isCurrentRole}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-colors disabled:cursor-not-allowed ${
                    isCurrentRole
                      ? roleActiveStyle[role] ?? roleActiveStyle['user']
                      : 'text-gray-500 dark:text-zinc-400 bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-700 dark:hover:text-zinc-200'
                  }`}
                >
                  {isChangingRole && !isCurrentRole ? '...' : role}
                </button>
              )
            })}
          </div>
        </div>

        {/* Toggle status */}
        <button
          onClick={() => onToggleStatus(user)}
          disabled={isToggling || isOwnAccount}
          title={isOwnAccount ? 'No puedes deshabilitar tu propia cuenta' : undefined}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${
            isOwnAccount
              ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 border-gray-300 dark:border-zinc-700'
              : isActive
                ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
          }`}
        >
          {isOwnAccount
            ? 'No puedes deshabilitar tu propia cuenta'
            : isToggling
              ? 'Procesando...'
              : isActive
                ? 'Deshabilitar usuario'
                : 'Habilitar usuario'}
        </button>

      </div>
    </div>
  )
}
