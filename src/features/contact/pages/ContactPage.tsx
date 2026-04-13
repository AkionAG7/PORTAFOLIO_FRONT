import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import MyContactsTab from '../components/MyContactsTab'
import UsersRolesTab from '../components/UsersRolesTab'

type Tab = 'my-contacts' | 'users-roles'

interface TabDef {
  id: Tab
  label: string
  adminOnly: boolean
}

const tabs: TabDef[] = [
  { id: 'my-contacts',  label: 'Mis Contactos', adminOnly: false },
  { id: 'users-roles',  label: 'Usuarios',       adminOnly: true  },
]

export default function ContactPage() {
  const { user } = useAuth()
  const isAdmin = user?.rol === 'admin'

  const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin)
  const [active, setActive] = useState<Tab>('my-contacts')

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Contacto</h1>
        <p className="mt-1 text-zinc-400 text-sm">Gestiona tus datos de contacto y redes sociales.</p>
      </div>

      {/* Tab bar — only shown when admin (has more than one tab) */}
      {visibleTabs.length > 1 && (
        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit flex-wrap">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                active === tab.id
                  ? 'bg-violet-600 text-white shadow shadow-violet-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {active === 'my-contacts' && <MyContactsTab />}
      {active === 'users-roles' && isAdmin && <UsersRolesTab />}
    </div>
  )
}
