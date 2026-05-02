import { useState } from 'react'
import { useMyContacts } from '../hooks/useMyContacts'
import ContactCard from './ContactCard'
import CreateContactModal from './CreateContactModal'
import EditContactModal from './EditContactModal'
import type { CreateContactDto } from '../dtos/create-contact.dto'
import type { UpdateContactDto } from '../dtos/update-contact.dto'
import type { ContactItem } from '../interfaces/contact.interfaces'

export default function MyContactsTab() {
  const { items, isLoading, create, update, toggleStatus } = useMyContacts()
  const [showCreate, setShowCreate] = useState(false)
  const [editingItem, setEditingItem] = useState<ContactItem | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function handleCreated(dto: CreateContactDto) {
    await create.mutateAsync(dto)
  }

  async function handleSaved(dto: UpdateContactDto) {
    if (!editingItem) return
    setActionError(null)
    try {
      await update.mutateAsync({ id: editingItem.id, userId: editingItem.user_id, dto })
    } catch {
      setActionError('Error al actualizar el contacto. Intenta de nuevo.')
      throw new Error('update failed')
    }
  }

  async function handleToggleStatus(contactId: string) {
    setActionError(null)
    try {
      await toggleStatus.mutateAsync(contactId)
    } catch {
      setActionError('Error al cambiar el estado. Intenta de nuevo.')
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Add button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
            Agregar contacto
          </button>
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="shrink-0 hover:text-red-300 transition-colors">✕</button>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin text-violet-400" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-zinc-300 font-medium">Sin contactos aún</p>
              <p className="text-zinc-500 text-sm mt-1">Agrega tu información de contacto y redes sociales.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <ContactCard
                key={item.id}
                item={item}
                onToggleStatus={() => handleToggleStatus(item.id)}
                onEdit={() => setEditingItem(item)}
                isTogglingStatus={toggleStatus.isPending && toggleStatus.variables === item.id}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateContactModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {editingItem && (
        <EditContactModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
