import type { StackItem, UserStackResponse } from '../interfaces/stack.interfaces'

type CardData = Pick<StackItem, 'id' | 'name'> | Pick<UserStackResponse, 'stack_id' | 'stack_name'>

function normalize(item: CardData): { id: string; name: string } {
  if ('stack_name' in item) return { id: item.stack_id, name: item.stack_name }
  return { id: item.id, name: item.name }
}

interface Props {
  item: CardData
}

export default function StackCard({ item }: Props) {
  const { name } = normalize(item)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 hover:border-zinc-700 transition-colors duration-200">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/20 flex items-center justify-center shrink-0">
        <span className="text-violet-300 font-bold text-sm">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <p className="text-white font-semibold text-sm truncate">{name}</p>
    </div>
  )
}
