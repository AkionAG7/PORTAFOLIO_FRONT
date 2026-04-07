import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import MyStackTab from '../components/MyStackTab'
import AllStacksTab from '../components/AllStacksTab'
import AllUserStacksTab from '../components/AllUserStacksTab'
import CreateStackModal from '../components/CreateStackModal'
import AssignSelfModal from '../components/AssignSelfModal'
import type { CreateStackDto } from '../dtos/create-stack.dto'
import { createStack } from '../services/stackService'

type Tab = 'my-stack' | 'all-stacks' | 'all-user-stacks'

interface TabDef {
  id: Tab
  label: string
  adminOnly: boolean
}

const tabs: TabDef[] = [
  { id: 'my-stack',        label: 'Mi Stack',       adminOnly: false },
  { id: 'all-stacks',      label: 'Stacks',         adminOnly: false },
  { id: 'all-user-stacks', label: 'Stack Usuarios', adminOnly: true  },
]

export default function StackPage() {
  const { user } = useAuth()
  const isAdmin = user?.rol === 'admin'

  const [active, setActive] = useState<Tab>('my-stack')
  const [showCreate, setShowCreate] = useState(false)
  const [showAssignSelf, setShowAssignSelf] = useState(false)
  const [myStackKey, setMyStackKey] = useState(0)

  const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin)

  async function handleCreated(dto: CreateStackDto) {
    await createStack(dto)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Stack tecnológico</h1>
            <p className="mt-1 text-zinc-400 text-sm">Administra las tecnologías de tu portafolio.</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {isAdmin && (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="M12 5v14" />
                </svg>
                Crear Stack
              </button>
            )}
            <button
              onClick={() => setShowAssignSelf(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-200 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5v14" />
              </svg>
              Agregar a mi Stack
            </button>
          </div>
        </div>

        {/* Tab bar — only when admin (has more than one tab) */}
        {visibleTabs.length > 1 && (
          <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit flex-wrap">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer
                  ${active === tab.id
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
        {active === 'my-stack'        && <MyStackTab key={myStackKey} />}
        {active === 'all-stacks'      && <AllStacksTab />}
        {active === 'all-user-stacks' && isAdmin && <AllUserStacksTab />}
      </div>

      {showCreate && (
        <CreateStackModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {showAssignSelf && (
        <AssignSelfModal
          onClose={() => setShowAssignSelf(false)}
          onAssigned={() => setMyStackKey((k) => k + 1)}
        />
      )}
    </>
  )
}
