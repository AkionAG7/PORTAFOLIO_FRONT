import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllStacks, updateStack, toggleStackStatus } from '../services/stackService'
import type { StackItem } from '../interfaces/stack.interfaces'

export function useAllStacks(search: string) {
  const qc = useQueryClient()
  const key = ['stacks', 'catalog', search]

  const query = useQuery({
    queryKey: key,
    queryFn: () => getAllStacks(search || undefined),
  })

  const toggleStatus = useMutation({
    mutationFn: (stackId: string) => toggleStackStatus(stackId),
    onSuccess: (_, stackId) => {
      qc.setQueryData<StackItem[]>(key, (prev) =>
        prev?.map((s) => s.id === stackId ? { ...s, status: !s.status } : s)
      )
    },
  })

  const rename = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateStack(id, { name }),
    onSuccess: (_, { id, name }) => {
      qc.setQueryData<StackItem[]>(key, (prev) =>
        prev?.map((s) => s.id === id ? { ...s, name } : s)
      )
    },
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    toggleStatus,
    rename,
  }
}
