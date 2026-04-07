import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../context/AuthContext'
import { getUserStacks, updateStack, toggleUserStackStatus } from '../services/stackService'
import type { UserStackResponse } from '../interfaces/stack.interfaces'

export function useMyStacks() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const key = ['stacks', 'user', user?.id]

  const query = useQuery({
    queryKey: key,
    queryFn: () => getUserStacks(user!.id),
    enabled: !!user,
  })

  const toggleStatus = useMutation({
    mutationFn: (stackId: string) => toggleUserStackStatus(user!.id, stackId),
    onSuccess: (_, stackId) => {
      qc.setQueryData<UserStackResponse[]>(key, (prev) =>
        prev?.map((s) => s.stack_id === stackId ? { ...s, status: !s.status } : s)
      )
    },
  })

  const rename = useMutation({
    mutationFn: ({ stackId, name }: { stackId: string; name: string }) =>
      updateStack(stackId, { name }),
    onSuccess: (_, { stackId, name }) => {
      qc.setQueryData<UserStackResponse[]>(key, (prev) =>
        prev?.map((s) => s.stack_id === stackId ? { ...s, stack_name: name } : s)
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
