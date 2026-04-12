import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserLanguages, toggleUserLanguageStatus } from '../services/languageService'
import { getUsers } from '../../user/services/userService'
import type { UserLanguageEntry } from '../interfaces/language.interfaces'

const KEY = ['languages', 'all-users']

export function useAllUserLanguages() {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const users = await getUsers()
      return Promise.all(
        users.map(async (user) => ({
          user,
          languages: await getUserLanguages(user.id),
        }))
      )
    },
  })

  const toggleStatus = useMutation({
    mutationFn: ({ userId, languageId }: { userId: string; languageId: string }) =>
      toggleUserLanguageStatus(userId, languageId),
    onSuccess: (_, { userId, languageId }) => {
      qc.setQueryData<UserLanguageEntry[]>(KEY, (prev) =>
        prev?.map((entry) =>
          entry.user.id === userId
            ? {
                ...entry,
                languages: entry.languages.map((l) =>
                  l.language_id === languageId ? { ...l, status: !l.status } : l
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
