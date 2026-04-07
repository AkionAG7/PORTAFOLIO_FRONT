import { useAuth } from '../../../context/AuthContext'

export default function UserPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Perfil</h1>
        <p className="mt-1 text-zinc-400 text-sm">Información de tu cuenta.</p>
      </div>

      {/* Profile card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
          <span className="text-white text-2xl font-bold">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-white font-semibold text-lg">{user?.email}</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-600/20 text-violet-400 border border-violet-500/20 w-fit">
            {user?.rol}
          </span>
        </div>
      </div>

      {/* Info rows */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800">
        {[
          { label: 'ID de usuario', value: user?.id },
          { label: 'Correo electrónico', value: user?.email },
          { label: 'Rol', value: user?.rol },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-1">
            <span className="text-zinc-500 text-sm">{label}</span>
            <span className="text-zinc-200 text-sm font-medium break-all">{value ?? '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
