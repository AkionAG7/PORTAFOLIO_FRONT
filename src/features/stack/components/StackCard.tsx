import type { StackItem, UserStackResponse } from '../interfaces/stack.interfaces'

type CardData =
  | Pick<StackItem, 'id' | 'name' | 'status'>
  | Pick<UserStackResponse, 'stack_id' | 'stack_name' | 'status'>

function normalize(item: CardData): { id: string; name: string; status: boolean } {
  if ('stack_name' in item) return { id: item.stack_id, name: item.stack_name, status: item.status }
  return { id: item.id, name: item.name, status: item.status }
}

interface Props {
  item: CardData
  onEdit?: () => void
  onToggleStatus?: () => void
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
    </svg>
  )
}

function ActivateIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
    </svg>
  )
}

function DeactivateIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" />
    </svg>
  )
}

export default function StackCard({ item, onEdit, onToggleStatus }: Props) {
  const { name, status } = normalize(item)

  return (
    <div className={`bg-white dark:bg-zinc-900 border rounded-2xl p-4 flex items-center gap-4 transition-colors duration-200 ${status ? 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700' : 'border-gray-200/50 dark:border-zinc-800/50'}`}>
      {/* Icon + name dimmed when inactive */}
      <div className={`flex items-center gap-4 flex-1 min-w-0 transition-opacity duration-200 ${status ? '' : 'opacity-50'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/20 flex items-center justify-center shrink-0">
          <span className="text-violet-300 font-bold text-sm">
            {name.slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Name + status badge */}
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">{name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
            <span className={`text-xs ${status ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {status ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {(onEdit || onToggleStatus) && (
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={onEdit}
              disabled={!status}
              title={status ? 'Editar' : 'Activa el stack para editar'}
              className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 dark:disabled:hover:text-zinc-500 disabled:hover:bg-transparent"
            >
              <EditIcon />
            </button>
          )}
          {onToggleStatus && (
            <button
              onClick={onToggleStatus}
              title={status ? 'Desactivar' : 'Activar'}
              className={`p-1.5 rounded-lg transition-colors duration-150 ${
                status
                  ? 'text-gray-400 dark:text-zinc-500 hover:text-red-400 hover:bg-red-500/10'
                  : 'text-gray-400 dark:text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              {status ? <DeactivateIcon /> : <ActivateIcon />}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
