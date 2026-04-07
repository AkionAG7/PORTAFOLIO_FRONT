import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserStacks, toggleUserStackStatus } from '../services/stackService'
import { getUsers } from '../../user/services/userService'
import type { UserStackEntry } from '../interfaces/stack.interfaces'

const KEY = ['stacks', 'all-users']

export function useAllUserStacks() {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const users = await getUsers()
      return Promise.all(
        users.map(async (user) => ({
          user,
          stacks: await getUserStacks(user.id),
        }))
      )
    },
  })

  const toggleStatus = useMutation({
    mutationFn: ({ userId, stackId }: { userId: string; stackId: string }) =>
      toggleUserStackStatus(userId, stackId),
    onSuccess: (_, { userId, stackId }) => {
      qc.setQueryData<UserStackEntry[]>(KEY, (prev) =>
        prev?.map((entry) =>
          entry.user.id === userId
            ? {
                ...entry,
                stacks: entry.stacks.map((s) =>
                  s.stack_id === stackId ? { ...s, status: !s.status } : s
                ),
              }
            : entry
        )
      )
    },
  })

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    toggleStatus,
  }
}
