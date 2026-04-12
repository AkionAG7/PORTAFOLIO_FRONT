import type { LanguageItem, UserLanguageResponse } from '../interfaces/language.interfaces'

type CardData =
  | Pick<LanguageItem, 'id' | 'name' | 'status'>
  | Pick<UserLanguageResponse, 'language_id' | 'language_name' | 'level' | 'status'>

function normalize(item: CardData): { id: string; name: string; level?: string; status: boolean } {
  if ('language_name' in item) return { id: item.language_id, name: item.language_name, level: item.level, status: item.status }
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

export default function LanguageCard({ item, onEdit, onToggleStatus }: Props) {
  const { name, level, status } = normalize(item)

  return (
    <div className={`bg-zinc-900 border rounded-2xl p-4 flex items-center gap-4 transition-colors duration-200 ${status ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-800/50'}`}>
      <div className={`flex items-center gap-4 flex-1 min-w-0 transition-opacity duration-200 ${status ? '' : 'opacity-50'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/20 flex items-center justify-center shrink-0">
          <span className="text-violet-300 font-bold text-sm">
            {name.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-white font-semibold text-sm truncate">{name}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
              <span className={`text-xs ${status ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {status ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {level && (
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/20 font-medium">
                {level}
              </span>
            )}
          </div>
        </div>
      </div>

      {(onEdit || onToggleStatus) && (
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={onEdit}
              disabled={!status}
              title={status ? 'Editar' : 'Activa el idioma para editar'}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-500 disabled:hover:bg-transparent"
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
                  ? 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10'
                  : 'text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10'
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
