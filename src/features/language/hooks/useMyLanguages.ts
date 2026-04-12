import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../context/AuthContext'
import { getUserLanguages, updateUserLanguage, toggleUserLanguageStatus } from '../services/languageService'
import type { UserLanguageResponse } from '../interfaces/language.interfaces'

export function useMyLanguages() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const key = ['languages', 'user', user?.id]

  const query = useQuery({
    queryKey: key,
    queryFn: () => getUserLanguages(user!.id),
    enabled: !!user,
  })

  const toggleStatus = useMutation({
    mutationFn: (languageId: string) => toggleUserLanguageStatus(user!.id, languageId),
    onSuccess: (_, languageId) => {
      qc.setQueryData<UserLanguageResponse[]>(key, (prev) =>
        prev?.map((l) => l.language_id === languageId ? { ...l, status: !l.status } : l)
      )
    },
  })

  const updateLevel = useMutation({
    mutationFn: ({ languageId, level }: { languageId: string; level: string }) =>
      updateUserLanguage(user!.id, languageId, { level }),
    onSuccess: (_, { languageId, level }) => {
      qc.setQueryData<UserLanguageResponse[]>(key, (prev) =>
        prev?.map((l) => l.language_id === languageId ? { ...l, level } : l)
      )
    },
  })

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    toggleStatus,
    updateLevel,
  }
}
