import type { ContactItem } from '../interfaces/contact.interfaces'

interface Props {
  item: ContactItem
  onDelete: () => void
  isDeleting: boolean
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default function ContactCard({ item, onDelete, isDeleting }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 flex items-center gap-4 transition-colors duration-200">
      {/* Avatar / image */}
      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/20 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-violet-300 font-bold text-sm">
            {item.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-white font-semibold text-sm truncate">{item.name}</p>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs truncate mt-0.5 transition-colors"
        >
          <LinkIcon />
          <span className="truncate">{item.link}</span>
        </a>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        disabled={isDeleting}
        title="Eliminar contacto"
        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
      >
        <TrashIcon />
      </button>
    </div>
  )
}
