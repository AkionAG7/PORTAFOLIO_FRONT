import type { ContactItem } from '../interfaces/contact.interfaces'

interface Props {
  item: ContactItem
  onToggleStatus: () => void
  onEdit: () => void
  isTogglingStatus: boolean
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function EyeOnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default function ContactCard({ item, onToggleStatus, onEdit, isTogglingStatus }: Props) {
  const isActive = item.status !== false

  return (
    <div className={`group relative bg-zinc-900 border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 ${isActive ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-800/50 opacity-60 hover:opacity-80'}`}>
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 to-purple-500" />

      {/* Card body */}
      <div className="flex flex-col items-center gap-4 px-6 pt-6 pb-5 flex-1">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/20 flex items-center justify-center shadow-lg shadow-violet-900/20">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-violet-300 font-bold text-xl">
              {item.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col items-center gap-1.5 w-full min-w-0">
          <p className="text-white font-semibold text-base truncate w-full text-center">{item.name}</p>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-violet-400 hover:text-violet-300 text-xs truncate max-w-full transition-colors"
          >
            <LinkIcon />
            <span className="truncate">{item.link.replace(/^https?:\/\//, '')}</span>
          </a>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Action bar */}
      <div className="flex border-t border-zinc-800">
        <button
          onClick={onToggleStatus}
          disabled={isTogglingStatus}
          title={isActive ? 'Desactivar' : 'Activar'}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-zinc-400 hover:text-violet-300 hover:bg-violet-500/5 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium border-r border-zinc-800"
        >
          {isActive ? <EyeOffIcon /> : <EyeOnIcon />}
          {isActive ? 'Desactivar' : 'Activar'}
        </button>
        <button
          onClick={onEdit}
          title="Editar"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-zinc-400 hover:text-violet-300 hover:bg-violet-500/5 transition-colors duration-150 text-xs font-medium"
        >
          <EditIcon />
          Editar
        </button>
      </div>
    </div>
  )
}
