import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllLanguages, updateLanguage, toggleLanguageStatus } from '../services/languageService'
import type { LanguageItem } from '../interfaces/language.interfaces'

export function useAllLanguages(search: string) {
  const qc = useQueryClient()
  const key = ['languages', 'catalog', search]

  const query = useQuery({
    queryKey: key,
    queryFn: () => getAllLanguages(search || undefined),
  })

  const toggleStatus = useMutation({
    mutationFn: (languageId: string) => toggleLanguageStatus(languageId),
    onSuccess: (_, languageId) => {
      qc.setQueryData<LanguageItem[]>(key, (prev) =>
        prev?.map((l) => l.id === languageId ? { ...l, status: !l.status } : l)
      )
    },
  })

  const rename = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateLanguage(id, { name }),
    onSuccess: (_, { id, name }) => {
      qc.setQueryData<LanguageItem[]>(key, (prev) =>
        prev?.map((l) => l.id === id ? { ...l, name } : l)
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
